import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient";
import { canAccessMediaItem } from "../utils/access";

import lockedPreview from "../assets/locked-preview.jpg";
import AgeVerificationModal from "../components/AgeVerificationModal";

const SIGNED_URL_TTL_SECONDS = 60 * 10;

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeItem(item) {
  return {
    ...item,
    access_level: norm(item?.access_level),
    status: norm(item?.status),
    hidden: Boolean(item?.hidden),
  };
}

export default function FavoritesPage() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [items, setItems] = useState([]);
  const [signedUrlsById, setSignedUrlsById] = useState({});

  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [removingIds, setRemovingIds] = useState(() => new Set());

  const [ageModalOpen, setAgeModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;
        setSession(currentSession ?? null);
      } catch (error) {
        console.error("FavoritesPage session load error:", error);
        if (!mounted) return;
        setSession(null);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoadingSession(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      if (!session?.user?.id) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, is_age_verified, display_name")
        .eq("id", session.user.id)
        .single();

      if (!alive) return;

      if (error) {
        console.error("FavoritesPage profile fetch error:", error);
        setProfile(null);
        return;
      }

      setProfile(data ?? null);
    }

    loadProfile();

    return () => {
      alive = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    let alive = true;

    async function loadFavorites() {
      if (loadingSession) return;

      if (!session?.user?.id) {
        setItems([]);
        setSignedUrlsById({});
        setLoadingFavorites(false);
        return;
      }

      setLoadingFavorites(true);

      try {
        const { data: favoriteRows, error: favoritesError } = await supabase
          .from("favorites")
          .select("media_item_id, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (!alive) return;

        if (favoritesError) {
          console.error("FavoritesPage favorites fetch error:", favoritesError);
          setItems([]);
          setSignedUrlsById({});
          setLoadingFavorites(false);
          return;
        }

        const mediaIds = (favoriteRows ?? [])
          .map((row) => row.media_item_id)
          .filter(Boolean);

        if (mediaIds.length === 0) {
          setItems([]);
          setSignedUrlsById({});
          setLoadingFavorites(false);
          return;
        }

        const { data: mediaRows, error: mediaError } = await supabase
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
          .in("id", mediaIds);

        if (!alive) return;

        if (mediaError) {
          console.error("FavoritesPage media fetch error:", mediaError);
          setItems([]);
          setSignedUrlsById({});
          setLoadingFavorites(false);
          return;
        }

        const cleanedRows = (mediaRows ?? []).filter((row) => {
          const status = norm(row?.status);
          const hidden = Boolean(row?.hidden);
          return (status === "approved" || status === "published") && hidden === false;
        });

        const mediaById = new Map(cleanedRows.map((row) => [row.id, row]));
        const orderedItems = mediaIds
          .map((id) => mediaById.get(id))
          .filter(Boolean);

        setItems(orderedItems);
        setSignedUrlsById({});
      } catch (error) {
        console.error("FavoritesPage load error:", error);
        if (!alive) return;
        setItems([]);
        setSignedUrlsById({});
      } finally {
        if (alive) setLoadingFavorites(false);
      }
    }

    loadFavorites();

    return () => {
      alive = false;
    };
  }, [session?.user?.id, loadingSession]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSignedUrls() {
      if (!items.length) {
        setSignedUrlsById({});
        return;
      }

      const updates = {};

      for (const raw of items) {
        const item = normalizeItem(raw);
        const decision = getDecision(item);

        if (!decision?.allowed) continue;
        if (signedUrlsById[item.id]) continue;

        const path = getDisplayPathForItem(item);
        if (!path) continue;

        const { data, error } = await supabase.storage
          .from("media")
          .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

        if (error) {
          console.error("FavoritesPage createSignedUrl error:", error);
          continue;
        }

        if (data?.signedUrl) {
          updates[item.id] = data.signedUrl;
        }
      }

      if (!cancelled && Object.keys(updates).length > 0) {
        setSignedUrlsById((prev) => ({ ...prev, ...updates }));
      }
    }

    hydrateSignedUrls();

    return () => {
      cancelled = true;
    };
  }, [items, profile?.role, profile?.is_age_verified, session?.user?.id, signedUrlsById]);

  function openAgeModal() {
    setAgeModalOpen(true);
  }

  function closeAgeModal() {
    setAgeModalOpen(false);
  }

  async function confirmAgeVerification() {
    try {
      localStorage.setItem("is_age_verified", "true");

      if (!session?.user?.id) {
        setAgeModalOpen(false);
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ is_age_verified: true })
        .eq("id", session.user.id);

      if (error) {
        console.error("FavoritesPage age verification update error:", error);
        return;
      }

      setProfile((prev) => ({
        ...(prev || { id: session.user.id }),
        is_age_verified: true,
      }));

      setAgeModalOpen(false);
    } catch (error) {
      console.error("FavoritesPage confirmAgeVerification error:", error);
    }
  }

  function getDecision(item) {
    const normalized = normalizeItem(item);

    if (normalized.access_level === "public") {
      return { allowed: true, gate: "public" };
    }

    return canAccessMediaItem({
      item: normalized,
      profile,
      session,
    });
  }

  function getDisplayPathForItem(item) {
    const role = norm(profile?.role);
    const isSupremeUser = role === "supreme" || role === "admin";

    if (isSupremeUser && item.file_path) return item.file_path;
    if (item.watermarked_path) return item.watermarked_path;
    return item.file_path;
  }

  async function removeFavorite(mediaId) {
    if (!session?.user?.id || !mediaId) return;

    setRemovingIds((prev) => {
      const next = new Set(prev);
      next.add(mediaId);
      return next;
    });

    const previousItems = items;
    const previousSignedUrls = signedUrlsById;

    setItems((prev) => prev.filter((item) => item.id !== mediaId));
    setSignedUrlsById((prev) => {
      const next = { ...prev };
      delete next[mediaId];
      return next;
    });

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("media_item_id", mediaId);

      if (error) throw error;
    } catch (error) {
      console.error("FavoritesPage remove favorite error:", error);
      setItems(previousItems);
      setSignedUrlsById(previousSignedUrls);
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(mediaId);
        return next;
      });
    }
  }

  const hasItems = useMemo(() => items.length > 0, [items]);
  const favoritesCount = useMemo(() => items.length, [items]);

  if (loadingSession || loadingFavorites) {
    return (
      <div className="gallery-page">
        <div className="gallery-header">
          <h1 className="gallery-title">Favorites</h1>
          <div style={{ opacity: 0.75, marginTop: 6 }}>Loading your saved pieces…</div>
        </div>

        <div className="gallery-loading">Loading favorites…</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="gallery-page">
        <div className="gallery-header">
          <h1 className="gallery-title">Favorites</h1>
          <div style={{ opacity: 0.75, marginTop: 6 }}>
            Sign in to view everything you have saved.
          </div>
        </div>

        <div className="gallery-loading" style={{ opacity: 0.9 }}>
          You must be signed in to view your favorites.
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button
            type="button"
            className="locked-btn"
            onClick={() => navigate("/auth")}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1 className="gallery-title">Favorites</h1>
        <div style={{ opacity: 0.75, marginTop: 6 }}>
          Saved pieces from your gallery activity.
        </div>
        <div style={{ opacity: 0.9, marginTop: 10, fontSize: 14 }}>
          {favoritesCount} {favoritesCount === 1 ? "item saved" : "items saved"}
        </div>
      </div>

      {!hasItems ? (
        <div className="gallery-loading" style={{ opacity: 0.85 }}>
          You do not have any favorites yet.
        </div>
      ) : (
        <div className="gallery-grid">
          {items.map((raw) => {
            const item = normalizeItem(raw);
            const decision = getDecision(item);

            const isLocked = !decision?.allowed;
            const signedUrl = signedUrlsById[item.id] || null;
            const isRemoving = removingIds.has(item.id);

            if (isLocked) {
              const isBoudoir = item.access_level === "boudoir";
              const badgeText = isBoudoir ? "AGE VERIFIED" : "SUPREME ACCESS";
              const subtitle = isBoudoir
                ? "Verify your age to view boudoir content."
                : "Unlock this content with Supreme Access.";

              const buttonText = isBoudoir ? "Verify Age" : "Unlock with Supreme";
              const buttonAction = isBoudoir
                ? () => openAgeModal()
                : () => navigate("/supreme-access");

              return (
                <div key={item.id} className="gallery-card locked">
                  <div className="locked-media">
                    <img
                      src={lockedPreview}
                      alt="Locked content preview"
                      className="locked-img"
                      loading="lazy"
                    />

                    <div className="locked-overlay">
                      <div className="locked-badge">{badgeText}</div>

                      <div className="locked-center">
                        <div className="locked-icon">🔒</div>
                        <div className="locked-title">Locked</div>
                        <div className="locked-subtitle">{subtitle}</div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            justifyContent: "center",
                            flexWrap: "wrap",
                            marginTop: 12,
                          }}
                        >
                          <button className="locked-btn" onClick={buttonAction}>
                            {buttonText}
                          </button>

                          <button
                            type="button"
                            className="locked-btn"
                            onClick={() => removeFavorite(item.id)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? "Removing…" : "Remove Favorite"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="gallery-card">
                <div
                  className="gallery-thumb"
                  onClick={() => navigate(`/media/${item.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/media/${item.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {signedUrl ? (
                    <img
                      src={signedUrl}
                      alt={item.title ?? "Media"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="gallery-thumb-skeleton" />
                  )}
                </div>

                <div className="gallery-meta">
                  <div className="gallery-meta-text">
                    <div className="gallery-item-title">{item.title ?? ""}</div>
                    <div className="gallery-item-tagline">{item.tagline ?? ""}</div>
                    <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                      {item.category || "Gallery"}
                    </div>
                  </div>

                  <button
                    className="fav-btn is-fav"
                    onClick={() => removeFavorite(item.id)}
                    title="Remove favorite"
                    disabled={isRemoving}
                    type="button"
                  >
                    {isRemoving ? "…" : "♥"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AgeVerificationModal
        open={ageModalOpen}
        onCancel={closeAgeModal}
        onConfirm={confirmAgeVerification}
      />
    </div>
  );
}