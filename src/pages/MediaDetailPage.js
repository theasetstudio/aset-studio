// src/pages/MediaDetailPage.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
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

const SIGNED_URL_TTL_SECONDS = 60 * 10;

function norm(v) {
  return (v || "").trim().toLowerCase();
}

function isAbortError(e) {
  return (
    e?.name === "AbortError" ||
    String(e?.message || "").toLowerCase().includes("aborted") ||
    String(e || "").toLowerCase().includes("aborterror")
  );
}

function normalizeStoragePath(input) {
  if (!input) return "";

  let p = String(input).trim();
  p = p.replace(/^\/+/, "");
  p = p.replace(/^media\//i, "");
  p = p.replace(/^public\//i, "");
  p = p.replace(/\/{2,}/g, "/");

  const isValidRoot =
    /^uploads\//i.test(p) ||
    /^admin-uploads\//i.test(p) ||
    /^watermarked\//i.test(p) ||
    /^voice_notes\//i.test(p) ||
    /^stones\//i.test(p) ||
    /^prompt-previews\//i.test(p);

  if (!isValidRoot) {
    const parts = p.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    const looksLikeFile = /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(last);

    if (looksLikeFile) {
      p = `uploads/${last}`;
    }
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
  const t = (item?.title || "").trim();
  if (t) return t;

  const tg = (item?.tagline || "").trim();
  if (tg) return tg;

  const q = (item?.quote || "").trim();
  if (q) return q;

  return "Media Item";
}

export default function MediaDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, id } = useParams();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageVerified, setAgeVerified] = useState(getAgeVerified());

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [item, setItem] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState("");

  const [showAgeModal, setShowAgeModal] = useState(false);
  const [gate, setGate] = useState(null);
  const [uploaderName, setUploaderName] = useState("The Aset Studio");
  const [reloadTick, setReloadTick] = useState(0);

  const userId = session?.user?.id || null;

  const getSignedUrl = useCallback(
    async (path, expiresInSeconds = SIGNED_URL_TTL_SECONDS) => {
      const p = normalizeStoragePath(path);
      if (!p) return null;

      try {
        const { data, error } = await supabase.storage
          .from("media")
          .createSignedUrl(p, expiresInSeconds);

        if (error) {
          if (!isAbortError(error)) {
            console.error("createSignedUrl failed:", error, "path:", p);
          }
          return null;
        }

        return data?.signedUrl || null;
      } catch (e) {
        if (!isAbortError(e)) console.error("createSignedUrl threw:", e);
        return null;
      }
    },
    []
  );

  const loadProfile = useCallback(async (nextUserId) => {
    setProfile(null);
    setIsAdmin(false);
    setAgeVerified(getAgeVerified());

    if (!nextUserId) return null;

    try {
      const { data: p, error } = await supabase
        .from("profiles")
        .select("id, role, is_age_verified, display_name")
        .eq("id", nextUserId)
        .single();

      if (error) {
        if (!isAbortError(error)) {
          console.error("Failed to load profile:", error);
        }
        return null;
      }

      setProfile(p);

      const dbAgeVerified = !!p?.is_age_verified;
      setAgeVerified(dbAgeVerified);
      if (dbAgeVerified) setAgeVerifiedLocal(true);

      setIsAdmin(norm(p?.role) === "admin");
      return p;
    } catch (e) {
      if (!isAbortError(e)) console.error("Failed to load profile:", e);
      setProfile(null);
      setIsAdmin(false);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function boot() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;

        const currentSession = data?.session || null;
        setSession(currentSession);

        const nextUserId = currentSession?.user?.id || null;
        await loadProfile(nextUserId);

        if (!active) return;

        if (nextUserId) {
          setLoadingFavorites(true);
          try {
            const favSet = await fetchMyFavoriteIds(nextUserId);
            if (active) setFavoriteIds(favSet);
          } catch (e) {
            if (!isAbortError(e)) {
              console.error("Failed to load favorites:", e);
            }
          } finally {
            if (active) setLoadingFavorites(false);
          }
        } else {
          setFavoriteIds(new Set());
        }
      } catch (e) {
        if (!isAbortError(e)) console.error("Boot error:", e);
      }
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!active) return;

        setSession(newSession || null);

        const nextUserId = newSession?.user?.id || null;
        await loadProfile(nextUserId);

        if (!active) return;

        if (nextUserId) {
          setLoadingFavorites(true);
          try {
            const favSet = await fetchMyFavoriteIds(nextUserId);
            if (active) setFavoriteIds(favSet);
          } catch (e) {
            if (!isAbortError(e)) {
              console.error("Failed to refresh favorites:", e);
            }
          } finally {
            if (active) setLoadingFavorites(false);
          }
        } else {
          setFavoriteIds(new Set());
        }

        if (active) {
          setReloadTick((v) => v + 1);
        }
      }
    );

    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [loadProfile]);

  const loadItem = useCallback(async () => {
    setLoading(true);
    setItem(null);
    setImageUrl(null);
    setImgError("");
    setShowAgeModal(false);
    setGate(null);
    setUploaderName("The Aset Studio");

    try {
      if (!id) throw new Error("Missing id in route");

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

      if (error) throw error;

      const normalized = normalizeItem(data);

      if (normalized.hidden === true && !isAdmin) {
        setItem(null);
        setImgError("This content is unavailable.");
        return;
      }

      if (normalized.status !== "published" && !isAdmin) {
        setItem(null);
        setImgError("This content is unavailable.");
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

      setGate(accessDecision);

      if (!accessDecision?.allowed) {
        const isBoudoirLocal = normalized.access_level === "boudoir";

        if (isBoudoirLocal && userId && !ageVerified) {
          setShowAgeModal(true);
          setImgError("Age verification required to view this content.");
        } else if (accessDecision?.needsLogin) {
          setImgError("Please sign in to view this item.");
        } else if (accessDecision?.needsSupreme) {
          setImgError("Supreme Access required to view this item.");
        } else if (accessDecision?.needsAgeVerification) {
          setImgError("Age verification required to view this content.");
        } else {
          setImgError("Locked content.");
        }
        return;
      }

      const isSupremeUser =
        norm(profile?.role) === "supreme" || isAdmin === true;

      const rawPath = isSupremeUser
        ? normalized.file_path || normalized.watermarked_path || ""
        : normalized.watermarked_path || normalized.file_path || "";

      if (!rawPath) {
        setImgError("Missing image path on this item.");
        return;
      }

      const signedUrl = await getSignedUrl(rawPath);
      if (!signedUrl) {
        setImgError("Could not load image. Please try again.");
        return;
      }

      // cache-bust the rendered image on revisit/return
      const bustedUrl = `${signedUrl}${signedUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setImageUrl(bustedUrl);
    } catch (e) {
      if (!isAbortError(e)) console.error("Failed to load media detail:", e);
      setImgError("Failed to load item.");
    } finally {
      setLoading(false);
    }
  }, [id, session, profile, ageVerified, isAdmin, userId, getSignedUrl]);

  useEffect(() => {
    loadItem();
  }, [loadItem, location.key, reloadTick]);

  useEffect(() => {
    function handleFocus() {
      setReloadTick((v) => v + 1);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setReloadTick((v) => v + 1);
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function confirmAgeVerification() {
    setAgeVerifiedLocal(true);
    setAgeVerified(true);

    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({ is_age_verified: true })
      .eq("id", userId);

    if (error) {
      console.error("Failed to persist age verification to DB:", error);
    } else {
      setProfile((prev) => ({ ...(prev || {}), is_age_verified: true }));
      setReloadTick((v) => v + 1);
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
      if (!isAbortError(e)) console.error("Stripe checkout failed:", e);
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

    if (isFavLocal) next.delete(mediaItemId);
    else next.add(mediaItemId);

    setFavoriteIds(next);

    try {
      if (isFavLocal) {
        await removeFavorite({ userId, mediaItemId });
      } else {
        await addFavorite({ userId, mediaItemId });
      }
    } catch (e) {
      if (!isAbortError(e)) console.error("Favorite toggle failed:", e);
      setFavoriteIds(previous);
      alert("Something went wrong. Please try again.");
    }
  }

  const titleText = useMemo(() => displayTitle(item), [item]);

  const signedIn = !!userId;
  const isFav = item ? favoriteIds.has(item.id) : false;

  const gNow = useMemo(() => {
    if (!item) return null;
    if (item.access_level === "public") {
      return { allowed: true, gate: "public" };
    }
    return (
      gate ||
      getAccessGate({ user: session?.user, profile, mediaItem: item }) ||
      canAccessMediaItem({
        item,
        profile,
        session,
      })
    );
  }, [gate, item, session, profile]);

  const isLocked = !!gNow && !gNow.allowed;
  const isBoudoir = item?.access_level === "boudoir";

  const commentsDisabled =
    isLocked || item?.hidden === true || norm(item?.status) !== "published";

  const showSupremeCTA = !!gNow?.needsSupreme && !isAdmin;

  if (loading) {
    return (
      <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
        <p>Loading…</p>
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
                setImageUrl(null);
                setImgError(
                  "Image failed to load. Click retry to regenerate the signed URL."
                );
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
                    : "Loading image…")}
              </div>

              {!isLocked ? (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setReloadTick((v) => v + 1)}
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
                    Retry image load
                  </button>
                </div>
              ) : null}

              {isLocked && isBoudoir && signedIn && !ageVerified ? (
                <div style={{ marginTop: 12, opacity: 0.85 }}>
                  Age verification required. Use the prompt to verify.
                </div>
              ) : null}

              {isLocked && gNow?.needsSupreme ? (
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

              {isLocked && gNow?.needsLogin ? (
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