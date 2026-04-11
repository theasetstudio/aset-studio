import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getSignedMediaUrl } from "../utils/storage";
import { getCreatorProfilePath } from "../utils/creatorLinks";

const PAGE_SIZE = 12;

export default function CreatorPortfolioPage() {
  const { username } = useParams();

  const [creatorProfile, setCreatorProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadInitialPortfolio() {
      try {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setPortfolioItems([]);

        const routeValue = decodeURIComponent(String(username || "").trim());

        if (!routeValue) {
          if (alive) {
            setCreatorProfile(null);
            setHasMore(false);
          }
          return;
        }

        let profileData = null;

        const { data: usernameMatch, error: usernameError } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, banner_url, quote, bio, description, about")
          .ilike("username", routeValue)
          .maybeSingle();

        if (usernameError) throw usernameError;
        profileData = usernameMatch;

        if (!profileData) {
          if (alive) {
            setCreatorProfile(null);
            setHasMore(false);
          }
          return;
        }

        const creatorId = profileData.id;

        const avatarSignedUrl = profileData.avatar_url
          ? await getSignedMediaUrl(profileData.avatar_url)
          : "";

        const bannerSignedUrl = profileData.banner_url
          ? await getSignedMediaUrl(profileData.banner_url)
          : "";

        const normalizedProfile = {
          ...profileData,
          avatar_signed_url: avatarSignedUrl,
          banner_signed_url: bannerSignedUrl,
        };

        if (alive) {
          setCreatorProfile(normalizedProfile);
        }

        const from = 0;
        const to = PAGE_SIZE - 1;

        let mediaRows = [];
        let mediaError = null;

        const byOwnerId = await supabase
          .from("media_items")
          .select("id, title, file_path, watermarked_path, status, access_level, created_at, category, tags, hidden")
          .eq("owner_id", creatorId)
          .in("status", ["approved", "published"])
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .range(from, to);

        mediaRows = byOwnerId.data || [];
        mediaError = byOwnerId.error || null;

        if ((mediaError || mediaRows.length === 0) && creatorId) {
          const byCreatorId = await supabase
            .from("media_items")
            .select("id, title, file_path, watermarked_path, status, access_level, created_at, category, tags, hidden")
            .eq("creator_id", creatorId)
            .in("status", ["approved", "published"])
            .eq("hidden", false)
            .order("created_at", { ascending: false })
            .range(from, to);

          if (!byCreatorId.error) {
            mediaRows = byCreatorId.data || [];
            mediaError = null;
          }
        }

        if (mediaError) throw mediaError;

        if (!mediaRows || mediaRows.length === 0) {
          if (alive) {
            setPortfolioItems([]);
            setHasMore(false);
          }
          return;
        }

        const itemsWithSignedUrls = await Promise.all(
          mediaRows.map(async (item) => {
            const previewPath = item.watermarked_path || item.file_path || "";
            const signedUrl = previewPath ? await getSignedMediaUrl(previewPath) : "";

            return {
              ...item,
              signedUrl,
            };
          })
        );

        if (alive) {
          setPortfolioItems(itemsWithSignedUrls);
          setPage(1);
          setHasMore(mediaRows.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Error loading creator portfolio:", error);

        if (alive) {
          setCreatorProfile(null);
          setPortfolioItems([]);
          setHasMore(false);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadInitialPortfolio();

    return () => {
      alive = false;
    };
  }, [username]);

  async function handleLoadMore() {
    if (loadingMore || !hasMore || !creatorProfile?.id) return;

    try {
      setLoadingMore(true);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let mediaRows = [];
      let mediaError = null;

      const byOwnerId = await supabase
        .from("media_items")
        .select("id, title, file_path, watermarked_path, status, access_level, created_at, category, tags, hidden")
        .eq("owner_id", creatorProfile.id)
        .in("status", ["approved", "published"])
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .range(from, to);

      mediaRows = byOwnerId.data || [];
      mediaError = byOwnerId.error || null;

      if ((mediaError || mediaRows.length === 0) && creatorProfile.id) {
        const byCreatorId = await supabase
          .from("media_items")
          .select("id, title, file_path, watermarked_path, status, access_level, created_at, category, tags, hidden")
          .eq("creator_id", creatorProfile.id)
          .in("status", ["approved", "published"])
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (!byCreatorId.error) {
          mediaRows = byCreatorId.data || [];
          mediaError = null;
        }
      }

      if (mediaError) throw mediaError;

      if (!mediaRows || mediaRows.length === 0) {
        setHasMore(false);
        return;
      }

      const itemsWithSignedUrls = await Promise.all(
        mediaRows.map(async (item) => {
          const previewPath = item.watermarked_path || item.file_path || "";
          const signedUrl = previewPath ? await getSignedMediaUrl(previewPath) : "";

          return {
            ...item,
            signedUrl,
          };
        })
      );

      setPortfolioItems((prev) => [...prev, ...itemsWithSignedUrls]);
      setPage((prev) => prev + 1);
      setHasMore(mediaRows.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error loading more portfolio items:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-6xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
          Loading creator portfolio...
        </div>
      </div>
    );
  }

  if (!creatorProfile) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-6xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Creator Portfolio</h1>
          <p className="text-white/70 leading-7">Creator not found.</p>

          <Link
            to="/creators"
            className="inline-flex items-center mt-6 rounded-2xl border border-white/15 px-5 py-3 text-white hover:bg-white hover:text-black transition"
          >
            Back to Creators
          </Link>
        </div>
      </div>
    );
  }

  const displayName = creatorProfile.display_name || "Unnamed Creator";
  const usernameLabel = creatorProfile.username ? `@${creatorProfile.username}` : null;
  const quote = creatorProfile.quote?.trim();
  const bio =
    creatorProfile.bio ||
    creatorProfile.description ||
    creatorProfile.about ||
    "";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <div className="relative h-[180px] md:h-[240px] bg-white/5">
            {creatorProfile.banner_signed_url ? (
              <img
                src={creatorProfile.banner_signed_url}
                alt={`${displayName} banner`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-[#161616] to-[#241b1b]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="px-6 md:px-8 pb-8">
            <div className="-mt-14 md:-mt-16 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex flex-col md:flex-row md:items-end gap-5">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-black bg-white/10">
                  {creatorProfile.avatar_signed_url ? (
                    <img
                      src={creatorProfile.avatar_signed_url}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">
                    Creator Portfolio
                  </div>

                  <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    {displayName}
                  </h1>

                  {usernameLabel ? (
                    <p className="mt-2 text-white/70">{usernameLabel}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={getCreatorProfilePath(creatorProfile)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Back to Profile
                </Link>
              </div>
            </div>

            {quote ? (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/90 italic leading-7">
                “{quote}”
              </div>
            ) : null}

            {bio ? (
              <div className="mt-6 max-w-3xl">
                <p className="text-white/75 leading-7">{bio}</p>
              </div>
            ) : null}

            <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <p className="mt-2 text-white/65">
                  A curated collection from this creator.
                </p>
              </div>
            </div>

            {portfolioItems.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/70">
                No portfolio items yet.
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {portfolioItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/media/${item.id}`}
                      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20"
                    >
                      {item.signedUrl ? (
                        <img
                          src={item.signedUrl}
                          alt={item.title || "portfolio item"}
                          className="block w-full aspect-square object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center px-4 text-center text-sm text-white/55">
                          Preview unavailable
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {hasMore ? (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:opacity-60"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}