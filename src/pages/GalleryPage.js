import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient";
import { canAccessMediaItem } from "../utils/access";

import lockedPreview from "../assets/locked-preview.jpg";
import AgeVerificationModal from "../components/AgeVerificationModal";

const PAGE_SIZE = 24;
const SIGNED_URL_TTL_SECONDS = 60 * 10;
const HEART_FLASH_DURATION = 450;
const DOUBLE_TAP_DELAY = 240;

export default function GalleryPage() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [items, setItems] = useState([]);
  const [signedUrlsById, setSignedUrlsById] = useState({});
  const [favoritesSet, setFavoritesSet] = useState(() => new Set());
  const [favoriteCountsById, setFavoriteCountsById] = useState({});
  const [heartFlashById, setHeartFlashById] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ageModalOpen, setAgeModalOpen] = useState(false);

  const pageRef = useRef(0);
  const sentinelRef = useRef(null);
  const fetchingRef = useRef(false);

  const heartFlashTimersRef = useRef({});
  const favoritePendingRef = useRef(new Set());
  const openTimersRef = useRef({});
  const lastTapRef = useRef({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
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
        console.error("Profile fetch error:", error);
        setProfile(null);
        return;
      }

      setProfile(data);
    })();

    return () => {
      alive = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (!alive) return;

      if (error) {
        console.error("Categories fetch error:", error);
        setCategories([]);
        return;
      }

      setCategories(data ?? []);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!session?.user?.id) {
        setFavoritesSet(new Set());
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("media_id")
        .eq("user_id", session.user.id);

      if (!alive) return;

      if (error) {
        console.error("Favorites fetch error:", error);
        setFavoritesSet(new Set());
        return;
      }

      setFavoritesSet(new Set((data ?? []).map((r) => r.media_id)));
    })();

    return () => {
      alive = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    pageRef.current = 0;
    setItems([]);
    setSignedUrlsById({});
    setFavoriteCountsById({});
    setHeartFlashById({});
    setHasMore(true);
    setLoading(true);

    void loadNextPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, profile?.role, profile?.is_age_verified, session?.user?.id]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void loadNextPage(false);
        }
      },
      { root: null, rootMargin: "800px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, selectedCategory, profile?.role, profile?.is_age_verified]);

  useEffect(() => {
    const heartFlashTimers = heartFlashTimersRef.current;
    const openTimers = openTimersRef.current;

    return () => {
      Object.values(heartFlashTimers).forEach((timerId) => {
        window.clearTimeout(timerId);
      });

      Object.values(openTimers).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

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
        console.error("Age verification update error:", error);
        return;
      }

      setProfile((prev) => ({
        ...(prev || { id: session.user.id }),
        is_age_verified: true,
      }));

      setAgeModalOpen(false);
    } catch (e) {
      console.error("confirmAgeVerification error:", e);
    }
  }

  function normalizeItem(item) {
    return {
      ...item,
      access_level: String(item?.access_level || "").toLowerCase(),
      status: String(item?.status || "").toLowerCase(),
      hidden: Boolean(item?.hidden),
      uploader_id: item?.uploader_id || item?.owner_id || null,
    };
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

  const categoryFilterValue = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") return null;
    return selectedCategory;
  }, [selectedCategory]);

  function getDisplayPathForItem(item) {
    const isSupremeUser =
      profile?.role === "supreme" || profile?.role === "admin";

    if (isSupremeUser && item.file_path) return item.file_path;
    if (item.watermarked_path) return item.watermarked_path;
    return item.file_path;
  }

  async function createSignedUrlForPath(path) {
    if (!path) {
      console.log("SIGNED URL: missing path");
      return null;
    }

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

    console.log("SIGNED URL RESULT:", {
      path,
      data,
      error,
    });

    if (error) {
      console.error("createSignedUrl error:", error, "for path:", path);
      return null;
    }

    return data?.signedUrl ?? null;
  }

  async function hydrateSignedUrlsForAllowed(newItems) {
    const updates = {};

    for (const raw of newItems) {
      const item = normalizeItem(raw);

      if (signedUrlsById[item.id]) continue;

      const decision = getDecision(item);
      if (!decision?.allowed) continue;

      const path = getDisplayPathForItem(item);

      console.log("HYDRATE ITEM:", {
        id: item.id,
        title: item.title,
        access_level: item.access_level,
        status: item.status,
        hidden: item.hidden,
        path,
        decision,
      });

      const url = await createSignedUrlForPath(path);
      if (url) updates[item.id] = url;
    }

    if (Object.keys(updates).length > 0) {
      setSignedUrlsById((prev) => ({ ...prev, ...updates }));
    }
  }

  function initializeFavoriteCounts(batch, replace = false) {
    const incomingCounts = {};

    batch.forEach((item) => {
      incomingCounts[item.id] = item?.favorites?.[0]?.count ?? 0;
    });

    setFavoriteCountsById((prev) =>
      replace ? incomingCounts : { ...prev, ...incomingCounts }
    );
  }

  async function loadNextPage(isFirstLoad) {
    if (!hasMore) return;
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    if (!isFirstLoad) setLoadingMore(true);

    try {
      const page = pageRef.current;
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let q = supabase
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
          owner_id,
          favorites(count),
          media_comments(count)
        `)
        .eq("status", "published")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (categoryFilterValue) {
        q = q.or(`category.eq.${categoryFilterValue},category.eq.${selectedCategory}`);
      }

      const { data, error } = await q;

      console.log("GALLERY QUERY RESULT:", { data, error });

      if (error) {
        console.error("Media fetch error:", error);
        setHasMore(false);
        return;
      }

      const batch = (data ?? []).map((item) => ({
        ...item,
        uploader_id: item.owner_id,
        uploader: null,
      }));

      console.log("GALLERY BATCH AFTER MAP:", batch);

      setItems((prev) => (page === 0 ? batch : [...prev, ...batch]));
      initializeFavoriteCounts(batch, page === 0);

      if (batch.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        pageRef.current = page + 1;
      }

      await hydrateSignedUrlsForAllowed(batch);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function triggerHeartFlash(mediaId) {
    if (!mediaId) return;

    if (heartFlashTimersRef.current[mediaId]) {
      window.clearTimeout(heartFlashTimersRef.current[mediaId]);
    }

    setHeartFlashById((prev) => ({
      ...prev,
      [mediaId]: true,
    }));

    heartFlashTimersRef.current[mediaId] = window.setTimeout(() => {
      setHeartFlashById((prev) => {
        const next = { ...prev };
        delete next[mediaId];
        return next;
      });
      delete heartFlashTimersRef.current[mediaId];
    }, HEART_FLASH_DURATION);
  }

  async function toggleFavorite(mediaId, decision, options = {}) {
    if (!decision?.allowed) return;

    if (!session?.user?.id) {
      navigate("/auth");
      return;
    }

    if (favoritePendingRef.current.has(mediaId)) {
      return;
    }

    favoritePendingRef.current.add(mediaId);

    const userId = session.user.id;
    const isFav = favoritesSet.has(mediaId);
    const shouldFlash = options.flash !== false;

    setFavoritesSet((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(mediaId);
      else next.add(mediaId);
      return next;
    });

    setFavoriteCountsById((prev) => {
      const currentCount = prev[mediaId] ?? 0;
      return {
        ...prev,
        [mediaId]: Math.max(0, currentCount + (isFav ? -1 : 1)),
      };
    });

    if (shouldFlash && !isFav) {
      triggerHeartFlash(mediaId);
    }

    try {
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("media_id", mediaId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: userId, media_id: mediaId });

        if (error) throw error;
      }
    } catch (e) {
      console.error("Favorite toggle error:", e);

      setFavoritesSet((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(mediaId);
        else next.delete(mediaId);
        return next;
      });

      setFavoriteCountsById((prev) => {
        const currentCount = prev[mediaId] ?? 0;
        return {
          ...prev,
          [mediaId]: Math.max(0, currentCount + (isFav ? 1 : -1)),
        };
      });
    } finally {
      favoritePendingRef.current.delete(mediaId);
    }
  }

  function clearPendingOpen(mediaId) {
    if (openTimersRef.current[mediaId]) {
      window.clearTimeout(openTimersRef.current[mediaId]);
      delete openTimersRef.current[mediaId];
    }
  }

  function handleMediaOpen(mediaId) {
    navigate(`/media/${mediaId}`);
  }

  function handleThumbInteraction(mediaId, decision) {
    const now = Date.now();
    const lastTapAt = lastTapRef.current[mediaId] ?? 0;
    const isDoubleTap = now - lastTapAt <= DOUBLE_TAP_DELAY;

    if (isDoubleTap) {
      clearPendingOpen(mediaId);
      lastTapRef.current[mediaId] = 0;
      void toggleFavorite(mediaId, decision, { flash: true });
      return;
    }

    lastTapRef.current[mediaId] = now;
    clearPendingOpen(mediaId);

    openTimersRef.current[mediaId] = window.setTimeout(() => {
      delete openTimersRef.current[mediaId];
      lastTapRef.current[mediaId] = 0;
      handleMediaOpen(mediaId);
    }, DOUBLE_TAP_DELAY);
  }

  function handleOpenCreatorProfile(item) {
    const uploaderId = item?.uploader?.id || item?.uploader_id || item?.owner_id;

    if (!uploaderId) return;

    navigate(`/creator/${uploaderId}`);
  }

  return (
    <div className="gallery-page">
      <style>
        {`
          .gallery-thumb {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }

          .gallery-thumb img {
            display: block;
            width: 100%;
            height: auto;
          }

          .gallery-heart-flash {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 3;
            background: rgba(0, 0, 0, 0.08);
            animation: galleryHeartFlashFade ${HEART_FLASH_DURATION}ms ease forwards;
          }

          .gallery-heart-flash-icon {
            font-size: clamp(44px, 10vw, 72px);
            line-height: 1;
            transform: scale(0.6);
            filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
            animation: galleryHeartFlashPop ${HEART_FLASH_DURATION}ms ease forwards;
            user-select: none;
          }

          @keyframes galleryHeartFlashPop {
            0% {
              opacity: 0;
              transform: scale(0.45);
            }
            35% {
              opacity: 1;
              transform: scale(1.18);
            }
            100% {
              opacity: 0;
              transform: scale(1);
            }
          }

          @keyframes galleryHeartFlashFade {
            0% {
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="gallery-header">
        <h1 className="gallery-title">Gallery</h1>

        <div className="gallery-filters">
          <select
            className="gallery-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug ?? c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="gallery-loading">Loading…</div>
      ) : (
        <div className="gallery-grid">
          {items.map((raw) => {
            const item = normalizeItem(raw);
            const decision = getDecision(item);

            const isLocked = !decision?.allowed;
            const signedUrl = signedUrlsById[item.id] || null;
            const isFav = favoritesSet.has(item.id);
            const isHeartFlashing = Boolean(heartFlashById[item.id]);

            const favCount =
              favoriteCountsById[item.id] ?? item?.favorites?.[0]?.count ?? 0;

            const commentCount = item?.media_comments?.[0]?.count ?? 0;

            if (isLocked) {
              const isBoudoir = item.access_level === "boudoir";
              const badgeText = isBoudoir ? "AGE VERIFIED" : "SUPREME ACCESS";
              const subtitle = isBoudoir
                ? "Verify your age to view boudoir content."
                : "Unlock this content with Supreme Access.";

              const buttonText = isBoudoir
                ? "Verify Age"
                : "Unlock with Supreme";

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

                        <button
                          type="button"
                          className="gallery-item-uploader locked-uploader"
                          onClick={() => handleOpenCreatorProfile(item)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            marginTop: "8px",
                            cursor:
                              item?.uploader?.id || item?.uploader_id
                                ? "pointer"
                                : "default",
                            textDecoration: "underline",
                            color: "inherit",
                            font: "inherit",
                          }}
                        >
                          Uploaded by{" "}
                          {item.uploader?.display_name || "The Aset Studio"}
                        </button>

                        <button className="locked-btn" onClick={buttonAction}>
                          {buttonText}
                        </button>
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
                  onClick={() => handleThumbInteraction(item.id, decision)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      clearPendingOpen(item.id);
                      lastTapRef.current[item.id] = 0;
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
                      draggable="false"
                    />
                  ) : (
                    <div className="gallery-thumb-skeleton" />
                  )}

                  {isHeartFlashing ? (
                    <div className="gallery-heart-flash" aria-hidden="true">
                      <div className="gallery-heart-flash-icon">♥</div>
                    </div>
                  ) : null}
                </div>

                <div className="gallery-meta">
                  <div className="gallery-meta-text">
                    <div className="gallery-item-title">{item.title ?? ""}</div>
                    <div className="gallery-item-tagline">
                      {item.tagline ?? ""}
                    </div>

                    <button
                      type="button"
                      className="gallery-item-uploader"
                      onClick={() => handleOpenCreatorProfile(item)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        marginTop: "6px",
                        cursor:
                          item?.uploader?.id || item?.uploader_id
                            ? "pointer"
                            : "default",
                        textDecoration: "underline",
                        textAlign: "left",
                        color: "inherit",
                        font: "inherit",
                      }}
                    >
                      Uploaded by{" "}
                      {item.uploader?.display_name || "The Aset Studio"}
                    </button>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        marginTop: 8,
                        fontSize: 13,
                        opacity: 0.85,
                      }}
                    >
                      {favCount > 0 ? <span>❤️ {favCount}</span> : null}
                      {commentCount > 0 ? <span>💬 {commentCount}</span> : null}
                      {favCount === 0 && commentCount === 0 ? (
                        <span style={{ opacity: 0.65 }}>—</span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`fav-btn ${isFav ? "is-fav" : ""}`}
                    onClick={() => toggleFavorite(item.id, decision, { flash: true })}
                    title={
                      session?.user?.id
                        ? "Toggle favorite"
                        : "Login required"
                    }
                  >
                    {isFav ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {loadingMore ? (
        <div className="gallery-loading-more">Loading more…</div>
      ) : null}

      {!hasMore && items.length > 0 ? (
        <div className="gallery-end">End of gallery</div>
      ) : null}

      <AgeVerificationModal
        open={ageModalOpen}
        onCancel={closeAgeModal}
        onConfirm={confirmAgeVerification}
      />
    </div>
  );
}