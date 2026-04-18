import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  fetchMyFavoriteIds,
  addFavorite,
  removeFavorite,
} from "../utils/favorites";
import { canAccessMediaItem, getAccessGate } from "../utils/access";
import AgeVerificationModal from "../components/AgeVerificationModal";
import {
  getAgeVerified,
  setAgeVerified as setAgeVerifiedLocal,
} from "../utils/ageGate";
import CommentsPanel from "../components/CommentsPanel";
import { startSupremeCheckout } from "../utils/checkout";

const SIGNED_URL_TTL_SECONDS = 600;

function norm(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeStoragePath(input) {
  if (!input) return "";
  return String(input).trim();
}

function normalizeItem(item) {
  return {
    ...item,
    access_level: norm(item?.access_level),
    status: norm(item?.status),
    hidden: Boolean(item?.hidden),
    type: norm(item?.type) || "image",
    owner_id: item?.owner_id || null,
  };
}

function displayTitle(item) {
  const t = String(item?.title || "").trim();
  if (t) return t;

  const tg = String(item?.tagline || "").trim();
  if (tg) return tg;

  const q = String(item?.quote || "").trim();
  if (q) return q;

  return "Media Item";
}

export default function MediaDetailPage() {
  const navigate = useNavigate();
  const { id, category } = useParams();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageVerified, setAgeVerified] = useState(getAgeVerified());

  const [item, setItem] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [showAgeModal, setShowAgeModal] = useState(false);
  const [uploaderName, setUploaderName] = useState("The Aset Studio");

  const [relatedTagItems, setRelatedTagItems] = useState([]);
  const [moreLikeThisItems, setMoreLikeThisItems] = useState([]);

  const userId = session?.user?.id || null;

  useEffect(() => {
    async function boot() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession || null);

        if (currentSession?.user?.id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, role, is_age_verified, display_name")
            .eq("id", currentSession.user.id)
            .single();

          const nextProfile = profileData || null;
          setProfile(nextProfile);
          setIsAdmin(norm(nextProfile?.role) === "admin");

          const dbAgeVerified = nextProfile?.is_age_verified === true;
          const localAgeVerified = getAgeVerified() === true;
          const nextAgeVerified = dbAgeVerified || localAgeVerified;

          setAgeVerified(nextAgeVerified);

          if (dbAgeVerified) {
            setAgeVerifiedLocal(true);
          }

          setLoadingFavorites(true);
          try {
            const favSet = await fetchMyFavoriteIds(currentSession.user.id);
            setFavoriteIds(favSet);
          } catch (e) {
            console.error("Failed to load favorites:", e);
          } finally {
            setLoadingFavorites(false);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
          setAgeVerified(getAgeVerified());
          setFavoriteIds(new Set());
        }
      } catch (e) {
        console.error("Boot error:", e);
      }
    }

    boot();
  }, []);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      setItem(null);
      setMediaUrl("");
      setMediaError("");
      setShowAgeModal(false);
      setUploaderName("The Aset Studio");
      setRelatedTagItems([]);
      setMoreLikeThisItems([]);

      try {
        if (!id) {
          setMediaError("Missing media id.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("media_items")
          .select(`
            id,
            title,
            tagline,
            quote,
            description,
            category,
            tags,
            type,
            access_level,
            status,
            hidden,
            file_path,
            watermarked_path,
            created_at,
            owner_id
          `)
          .eq("id", id)
          .single();

        if (error || !data) {
          console.error("Failed to load media item:", error);
          setMediaError("Failed to load item.");
          setLoading(false);
          return;
        }

        const normalized = normalizeItem(data);

        if (normalized.hidden === true && !isAdmin) {
          setItem(null);
          setMediaError("This content is unavailable.");
          setLoading(false);
          return;
        }

        if (normalized.status !== "published" && !isAdmin) {
          setItem(null);
          setMediaError("This content is unavailable.");
          setLoading(false);
          return;
        }

        setItem(normalized);

        if (normalized.owner_id) {
          const { data: uploaderProfile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", normalized.owner_id)
            .maybeSingle();

          if (uploaderProfile?.display_name) {
            setUploaderName(uploaderProfile.display_name);
          }
        }

        let accessDecision;

        if (normalized.access_level === "public") {
          accessDecision = { allowed: true, gate: "public" };
        } else {
          accessDecision =
            getAccessGate({
              user: session?.user,
              profile,
              mediaItem: normalized,
            }) ||
            canAccessMediaItem({
              item: normalized,
              profile,
              session,
            });
        }

        if (!accessDecision?.allowed) {
          if (normalized.access_level === "boudoir") {
            setMediaError("Age verification required to view this content.");
            if (userId && !ageVerified) {
              setShowAgeModal(true);
            }
          } else if (accessDecision?.needsLogin) {
            setMediaError("Please sign in to view this item.");
          } else if (accessDecision?.needsSupreme) {
            setMediaError("Supreme Access required to view this item.");
          } else {
            setMediaError("Locked content.");
          }

          setLoading(false);
          return;
        }

        const isSupremeUser =
          norm(profile?.role) === "supreme" || isAdmin === true;

        const rawPath = isSupremeUser
          ? normalized.file_path || normalized.watermarked_path || ""
          : normalized.watermarked_path || normalized.file_path || "";

        const cleanPath = normalizeStoragePath(rawPath);

        if (!cleanPath) {
          setMediaError(
            normalized.type === "video"
              ? "Missing video path on this item."
              : "Missing image path on this item."
          );
          setLoading(false);
          return;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

        if (signedError || !signedData?.signedUrl) {
          console.error("Signed URL error:", signedError);
          setMediaError(
            normalized.type === "video"
              ? "Could not load video. Please try again."
              : "Could not load image. Please try again."
          );
          setLoading(false);
          return;
        }

        setMediaUrl(signedData.signedUrl);

        const normalizedTags = Array.isArray(normalized.tags)
          ? normalized.tags
              .map((tag) => String(tag || "").trim().toLowerCase())
              .filter(Boolean)
          : [];

        const { data: relatedCandidates, error: relatedError } = await supabase
          .from("media_items")
          .select("id, title, tags, category, type, status, hidden")
          .eq("type", "video")
          .eq("status", "published")
          .eq("hidden", false)
          .neq("id", normalized.id)
          .order("created_at", { ascending: false })
          .limit(24);

        if (!relatedError && Array.isArray(relatedCandidates)) {
          const relatedByTags = relatedCandidates.filter((candidate) => {
            const candidateTags = Array.isArray(candidate.tags)
              ? candidate.tags
                  .map((tag) => String(tag || "").trim().toLowerCase())
                  .filter(Boolean)
              : [];

            if (normalizedTags.length === 0 || candidateTags.length === 0) {
              return false;
            }

            return candidateTags.some((tag) => normalizedTags.includes(tag));
          });

          setRelatedTagItems(relatedByTags.slice(0, 6));

          const moreByCategory = relatedCandidates.filter(
            (candidate) =>
              norm(candidate.category) === norm(normalized.category)
          );

          setMoreLikeThisItems(moreByCategory.slice(0, 6));
        }

        setLoading(false);
      } catch (e) {
        console.error("Failed to load media detail:", e);
        setMediaError("Failed to load item.");
        setLoading(false);
      }
    }

    loadItem();
  }, [id, session, profile, isAdmin, userId, ageVerified]);

  async function confirmAgeVerification() {
    setAgeVerifiedLocal(true);
    setAgeVerified(true);

    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({ is_age_verified: true })
      .eq("id", userId);

    if (error) {
      console.error("Failed to persist age verification:", error);
    } else {
      setProfile((prev) => ({
        ...(prev || {}),
        is_age_verified: true,
      }));
    }
  }

  async function handleSupremeCheckout() {
    if (!userId) {
      alert("Please sign in to continue.");
      navigate("/auth");
      return;
    }

    try {
      await startSupremeCheckout();
    } catch (e) {
      console.error("Stripe checkout failed:", e);
      alert("Could not start checkout. Please try again.");
    }
  }

  async function toggleFavorite(mediaItemId) {
    if (!userId) {
      alert("Please sign in to favorite items.");
      navigate("/auth");
      return;
    }

    if (item?.hidden === true) {
      alert("This content is unavailable.");
      return;
    }

    const decision =
      item?.access_level === "public"
        ? { allowed: true }
        : canAccessMediaItem({
            item,
            profile,
            session,
          });

    if (!decision?.allowed) {
      alert("Locked content cannot be favorited.");
      return;
    }

    const isFavLocal = favoriteIds.has(mediaItemId);
    const previous = new Set(favoriteIds);
    const next = new Set(favoriteIds);

    if (isFavLocal) {
      next.delete(mediaItemId);
    } else {
      next.add(mediaItemId);
    }

    setFavoriteIds(next);

    try {
      if (isFavLocal) {
        await removeFavorite({ userId, mediaItemId });
      } else {
        await addFavorite({ userId, mediaItemId });
      }
    } catch (e) {
      console.error("Favorite toggle failed:", e);
      setFavoriteIds(previous);
      alert("Something went wrong. Please try again.");
    }
  }

  const titleText = useMemo(() => displayTitle(item), [item]);

  const signedIn = !!userId;
  const isFav = item ? favoriteIds.has(item.id) : false;

  const gateNow = useMemo(() => {
    if (!item) return null;

    if (item.access_level === "public") {
      return { allowed: true, gate: "public" };
    }

    return (
      getAccessGate({
        user: session?.user,
        profile,
        mediaItem: item,
      }) ||
      canAccessMediaItem({
        item,
        profile,
        session,
      })
    );
  }, [item, session, profile]);

  const isLocked = !!gateNow && !gateNow.allowed;
  const isBoudoir = item?.access_level === "boudoir";
  const commentsDisabled =
    isLocked || item?.hidden === true || norm(item?.status) !== "published";
  const showSupremeCTA = !!gateNow?.needsSupreme && !isAdmin;
  const isVideo = norm(item?.type) === "video";
  const isPortraitVideo =
    isVideo &&
    (norm(item?.category) === "cinematic" ||
      norm(item?.category) === "interview" ||
      norm(item?.category) === "hot_take");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "32px 16px 56px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {loading ? (
          <p>Loading...</p>
        ) : !item ? (
          <div>
            <p style={{ opacity: 0.9 }}>{mediaError || "Not found."}</p>
            <Link to="/gallery" style={{ color: "#fff" }}>
              Back to Gallery
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <Link to="/gallery" style={{ color: "#b78cff" }}>
                ← Back
              </Link>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {signedIn ? (
                  <span style={{ fontSize: 14, opacity: 0.8 }}>
                    Signed in
                    {ageVerified ? " • Age Verified" : ""}
                    {isAdmin ? " • Admin" : ""}
                    {norm(profile?.role) === "supreme" ? " • Supreme" : ""}
                  </span>
                ) : (
                  <Link to="/auth" style={{ fontSize: 14, color: "#fff" }}>
                    Sign in
                  </Link>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: isPortraitVideo ? "380px" : "720px",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFavorite(item.id)}
                  disabled={loadingFavorites || isLocked || item.hidden === true}
                  aria-label={isFav ? "Unfavorite" : "Favorite"}
                  title={
                    item.hidden === true
                      ? "Unavailable"
                      : isLocked
                        ? "Locked content"
                        : isFav
                          ? "Unfavorite"
                          : "Favorite"
                  }
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(0,0,0,0.45)",
                    padding: "8px 10px",
                    cursor:
                      isLocked || item.hidden === true ? "not-allowed" : "pointer",
                    opacity:
                      loadingFavorites || isLocked || item.hidden === true ? 0.55 : 1,
                    color: "inherit",
                  }}
                >
                  {isFav ? "❤️" : "🤍"}
                </button>

                <div
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#000",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
                  }}
                >
                  {mediaUrl && !isLocked ? (
                    isVideo ? (
                      <video
                        src={mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={() => {
                          setMediaUrl("");
                          setMediaError("Video failed to load.");
                        }}
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={titleText}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        onError={() => {
                          setMediaUrl("");
                          setMediaError("Image failed to load.");
                        }}
                      />
                    )
                  ) : (
                    <div style={{ padding: 16, fontSize: 13, opacity: 0.9 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {isLocked
                          ? "Locked content"
                          : isVideo
                            ? "Video unavailable"
                            : "Image unavailable"}
                      </div>

                      <div style={{ opacity: 0.85 }}>
                        {mediaError ||
                          (isLocked
                            ? "Please sign in / verify access to view this item."
                            : isVideo
                              ? "Video unavailable."
                              : "Image unavailable.")}
                      </div>

                      {isLocked && isBoudoir && signedIn && !ageVerified ? (
                        <div style={{ marginTop: 12, opacity: 0.85 }}>
                          Age verification required. Use the prompt to verify.
                        </div>
                      ) : null}

                      {isLocked && gateNow?.needsSupreme ? (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ opacity: 0.85, marginBottom: 8 }}>
                            This is Supreme content. Supreme Access required to unlock.
                          </div>

                          {showSupremeCTA ? (
                            <button
                              type="button"
                              onClick={handleSupremeCheckout}
                              style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.2)",
                                background: "rgba(255,255,255,0.10)",
                                color: "inherit",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Unlock with Supreme
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      {isLocked && gateNow?.needsLogin ? (
                        <div style={{ marginTop: 12 }}>
                          <Link to="/auth" style={{ color: "#fff" }}>
                            Sign in
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                maxWidth: isPortraitVideo ? "760px" : "900px",
                margin: "28px auto 0",
              }}
            >
              <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>
                {titleText}
              </h1>

              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
                Uploaded by <strong>{uploaderName}</strong>
              </div>

              {item.tagline ? (
                <div style={{ marginTop: 10, fontSize: 13, opacity: 0.88 }}>
                  {item.tagline}
                </div>
              ) : null}

              {item.quote ? (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    opacity: 0.85,
                    fontStyle: "italic",
                  }}
                >
                  “{item.quote}”
                </div>
              ) : null}

              {item.description ? (
                <p
                  style={{
                    marginTop: 18,
                    marginBottom: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    opacity: 0.9,
                  }}
                >
                  {item.description}
                </p>
              ) : null}

              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 14 }}>
                Category: {item.category || category || "uncategorized"}
              </div>

              {relatedTagItems.length > 0 ? (
                <section style={{ marginTop: 42 }}>
                  <h2 style={{ fontSize: 18, marginBottom: 14 }}>Related Interviews</h2>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      paddingBottom: 4,
                    }}
                  >
                    {relatedTagItems.map((relatedItem) => (
                      <Link
                        key={relatedItem.id}
                        to={`/media/${relatedItem.id}`}
                        style={{
                          flex: "0 0 auto",
                          minWidth: 180,
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600 }}>
                          {relatedItem.title || "Untitled Video"}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                          {relatedItem.category || "uncategorized"}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {moreLikeThisItems.length > 0 ? (
                <section style={{ marginTop: 38 }}>
                  <h2 style={{ fontSize: 18, marginBottom: 14 }}>More Like This</h2>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      paddingBottom: 4,
                    }}
                  >
                    {moreLikeThisItems.map((moreItem) => (
                      <Link
                        key={moreItem.id}
                        to={`/media/${moreItem.id}`}
                        style={{
                          flex: "0 0 auto",
                          minWidth: 180,
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600 }}>
                          {moreItem.title || "Untitled Video"}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                          {moreItem.category || "uncategorized"}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <div style={{ marginTop: 34 }}>
                <CommentsPanel
                  mediaId={item?.id || id}
                  disabled={commentsDisabled}
                />
              </div>
            </div>

            <AgeVerificationModal
              open={showAgeModal}
              onCancel={() => setShowAgeModal(false)}
              onConfirm={async () => {
                await confirmAgeVerification();
                setShowAgeModal(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
