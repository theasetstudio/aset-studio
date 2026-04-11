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

  let p = String(input).trim();

  while (p.startsWith("/")) {
    p = p.slice(1);
  }

  if (p.toLowerCase().startsWith("media/")) {
    p = p.slice(6);
  }

  if (p.toLowerCase().startsWith("public/")) {
    p = p.slice(7);
  }

  while (p.includes("//")) {
    p = p.replace("//", "/");
  }

  return p;
}

function normalizeItem(item) {
  return {
    ...item,
    access_level: norm(item?.access_level),
    status: norm(item?.status),
    hidden: Boolean(item?.hidden),
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
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState("");
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [showAgeModal, setShowAgeModal] = useState(false);
  const [uploaderName, setUploaderName] = useState("The Aset Studio");

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
      setImageUrl("");
      setImgError("");
      setShowAgeModal(false);
      setUploaderName("The Aset Studio");

      try {
        if (!id) {
          setImgError("Missing media id.");
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
            category,
            tags,
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
          setImgError("Failed to load item.");
          setLoading(false);
          return;
        }

        const normalized = normalizeItem(data);

        if (normalized.hidden === true && !isAdmin) {
          setItem(null);
          setImgError("This content is unavailable.");
          setLoading(false);
          return;
        }

        if (normalized.status !== "published" && !isAdmin) {
          setItem(null);
          setImgError("This content is unavailable.");
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
            setImgError("Age verification required to view this content.");
            if (userId && !ageVerified) {
              setShowAgeModal(true);
            }
          } else if (accessDecision?.needsLogin) {
            setImgError("Please sign in to view this item.");
          } else if (accessDecision?.needsSupreme) {
            setImgError("Supreme Access required to view this item.");
          } else {
            setImgError("Locked content.");
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
          setImgError("Missing image path on this item.");
          setLoading(false);
          return;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

        if (signedError || !signedData?.signedUrl) {
          console.error("Signed URL error:", signedError);
          setImgError("Could not load image. Please try again.");
          setLoading(false);
          return;
        }

        setImageUrl(signedData.signedUrl);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load media detail:", e);
        setImgError("Failed to load item.");
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

  if (loading) {
    return (
      <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ opacity: 0.9 }}>{imgError || "Not found."}</p>
        <Link to="/gallery">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Link to="/gallery">← Back</Link>

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
            <Link to="/auth" style={{ fontSize: 14 }}>
              Sign in
            </Link>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: 12 }}>{titleText}</h2>

      <div style={{ marginTop: 6, fontSize: 13, opacity: 0.75 }}>
        Uploaded by <strong>{uploaderName}</strong>
      </div>

      {item.tagline ? (
        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
          {item.tagline}
        </div>
      ) : null}

      {item.quote ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            opacity: 0.85,
            fontStyle: "italic",
          }}
        >
          “{item.quote}”
        </div>
      ) : null}

      <div style={{ fontSize: 13, opacity: 0.8, marginTop: 10 }}>
        Category: {item.category || category || "uncategorized"}
      </div>

      <div style={{ marginTop: 14, position: "relative" }}>
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
            background: "rgba(0,0,0,0.35)",
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
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {imageUrl && !isLocked ? (
            <img
              src={imageUrl}
              alt={titleText}
              style={{ width: "100%", height: "auto", display: "block" }}
              onError={() => {
                setImageUrl("");
                setImgError("Image failed to load.");
              }}
            />
          ) : (
            <div style={{ padding: 16, fontSize: 13, opacity: 0.9 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                {isLocked ? "Locked content" : "Image unavailable"}
              </div>

              <div style={{ opacity: 0.85 }}>
                {imgError ||
                  (isLocked
                    ? "Please sign in / verify access to view this item."
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
                  <Link to="/auth">Sign in</Link>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <CommentsPanel mediaId={item?.id || id} disabled={commentsDisabled} />

      <AgeVerificationModal
        open={showAgeModal}
        onCancel={() => setShowAgeModal(false)}
        onConfirm={async () => {
          await confirmAgeVerification();
          setShowAgeModal(false);
        }}
      />
    </div>
  );
}