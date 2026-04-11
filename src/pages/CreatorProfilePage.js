import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getSignedMediaUrl } from "../utils/storage";
import { getCreatorFollowersPath, getCreatorProfilePath } from "../utils/creatorLinks";

export default function CreatorProfilePage() {
  const { username } = useParams();

  const [creator, setCreator] = useState(null);
  const [portfolioPreview, setPortfolioPreview] = useState([]);
  const [totalFavoritesReceived, setTotalFavoritesReceived] = useState(0);
  const [publishedWorksCount, setPublishedWorksCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadCreator() {
      try {
        setLoading(true);
        setAvatarFailed(false);
        setBannerFailed(false);
        setTotalFavoritesReceived(0);
        setPublishedWorksCount(0);

        const routeValue = decodeURIComponent(String(username || "").trim());

        if (!routeValue) {
          if (alive) {
            setCreator(null);
            setPortfolioPreview([]);
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .ilike("username", routeValue)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          if (alive) {
            setCreator(null);
            setPortfolioPreview([]);
          }
          return;
        }

        const avatarSignedUrl = profileData.avatar_url
          ? await getSignedMediaUrl(profileData.avatar_url)
          : "";

        const bannerSignedUrl = profileData.banner_url
          ? await getSignedMediaUrl(profileData.banner_url)
          : "";

        const normalizedCreator = {
          ...profileData,
          avatar_signed_url: avatarSignedUrl,
          banner_signed_url: bannerSignedUrl,
        };

        if (alive) {
          setCreator(normalizedCreator);
        }

        let mediaRows = [];

        const byOwner = await supabase
          .from("media_items")
          .select("id, title, file_path, watermarked_path, created_at, hidden, status")
          .eq("owner_id", profileData.id)
          .in("status", ["approved", "published"])
          .eq("hidden", false)
          .order("created_at", { ascending: false });

        if (byOwner.error) throw byOwner.error;

        mediaRows = byOwner.data || [];

        if (mediaRows.length === 0) {
          const byCreator = await supabase
            .from("media_items")
            .select("id, title, file_path, watermarked_path, created_at, hidden, status")
            .eq("creator_id", profileData.id)
            .in("status", ["approved", "published"])
            .eq("hidden", false)
            .order("created_at", { ascending: false });

          if (byCreator.error) throw byCreator.error;

          mediaRows = byCreator.data || [];
        }

        if (!alive) return;

        setPublishedWorksCount(mediaRows.length);

        const previewRows = mediaRows.slice(0, 6);

        const signedPreviewItems = await Promise.all(
          previewRows.map(async (item) => {
            const previewPath = item.watermarked_path || item.file_path || "";
            const signedUrl = previewPath ? await getSignedMediaUrl(previewPath) : "";
            return { ...item, signedUrl };
          })
        );

        if (alive) {
          setPortfolioPreview(signedPreviewItems);
        }

        const mediaIds = mediaRows.map((item) => item.id).filter(Boolean);

        if (mediaIds.length > 0) {
          const { data: favoriteRows, error: favoritesError } = await supabase
            .from("favorites")
            .select("media_item_id")
            .in("media_item_id", mediaIds);

          if (favoritesError) throw favoritesError;

          if (alive) {
            setTotalFavoritesReceived((favoriteRows || []).length);
          }
        } else {
          if (alive) {
            setTotalFavoritesReceived(0);
          }
        }
      } catch (err) {
        console.error("Error loading creator profile:", err);
        if (alive) {
          setCreator(null);
          setPortfolioPreview([]);
          setTotalFavoritesReceived(0);
          setPublishedWorksCount(0);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadCreator();

    return () => {
      alive = false;
    };
  }, [username]);

  const displayName = creator?.display_name || "Unnamed Creator";
  const usernameLabel = creator?.username ? `@${creator.username}` : "";
  const bio =
    creator?.bio ||
    creator?.description ||
    creator?.about ||
    "This creator is building their world inside The Aset Studio.";

  const specialties = Array.isArray(creator?.specialties)
    ? creator.specialties.slice(0, 4)
    : Array.isArray(creator?.tags)
      ? creator.tags.slice(0, 4)
      : [];

  const locationLabel = [creator?.city, creator?.state, creator?.country]
    .filter(Boolean)
    .join(", ");

  const showAvatar = creator?.avatar_signed_url && !avatarFailed;
  const showBanner = creator?.banner_signed_url && !bannerFailed;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-10">
        Loading creator...
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-10">
        Creator not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] overflow-hidden shadow-lg">
        <div className="relative h-[150px] md:h-[190px] xl:h-[150px]">
          {showBanner ? (
            <img
              src={creator.banner_signed_url}
              alt={`${displayName} banner`}
              className="h-full w-full object-cover"
              onError={() => setBannerFailed(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#161616] via-[#1d1d1d] to-[#241b1b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        </div>

        <div className="px-5 md:px-8 pb-8 md:pb-10 -mt-6 md:-mt-8 xl:-mt-4">
          <div className="flex flex-col xl:flex-row xl:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black bg-white/10">
                {showAvatar ? (
                  <img
                    src={creator.avatar_signed_url}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white text-2xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{displayName}</h1>
                {usernameLabel && <p className="text-white/70">{usernameLabel}</p>}
                {locationLabel && <p className="text-white/60">📍 {locationLabel}</p>}

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="px-4 py-3 rounded-2xl border border-white/12 bg-white/[0.04] min-w-[160px]">
                    <div className="text-white/55 text-xs uppercase tracking-[0.18em]">
                      Total Favorites
                    </div>
                    <div className="text-white text-2xl font-bold mt-1">
                      {totalFavoritesReceived}
                    </div>
                  </div>

                  <div className="px-4 py-3 rounded-2xl border border-white/12 bg-white/[0.04] min-w-[160px]">
                    <div className="text-white/55 text-xs uppercase tracking-[0.18em]">
                      Published Works
                    </div>
                    <div className="text-white text-2xl font-bold mt-1">
                      {publishedWorksCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`${getCreatorProfilePath(creator)}/portfolio`}
                className="px-5 py-3 rounded-2xl bg-white text-black font-semibold"
              >
                View Portfolio
              </Link>

              <Link
                to={getCreatorFollowersPath(creator)}
                className="px-5 py-3 rounded-2xl border border-white/15 text-white font-semibold"
              >
                Followers
              </Link>

              <Link
                to="/"
                className="px-5 py-3 rounded-2xl border border-white/15 text-white font-semibold"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {bio && <p className="text-white/75 leading-7">{bio}</p>}

            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {specialties.map((tag) => (
                  <span
                    key={`${creator.id}-${tag}`}
                    className="px-4 py-2 rounded-full border border-white/12 bg-white/[0.04] text-white/85 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold">Portfolio Preview</h2>

            {portfolioPreview.length === 0 ? (
              <div className="mt-4 p-6 bg-white/[0.03] rounded-2xl text-white/70">
                No portfolio items yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
                {portfolioPreview.map((item) => (
                  <Link
                    key={item.id}
                    to={`/media/${item.id}`}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                  >
                    {item.signedUrl ? (
                      <img
                        src={item.signedUrl}
                        alt={item.title || "portfolio item"}
                        className="w-full aspect-square object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-white/55">
                        Preview unavailable
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}