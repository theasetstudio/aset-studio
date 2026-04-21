import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideosPage.css";

const VIDEO_CATEGORIES = ["all", "interview", "hot_take", "cinematic"];

function norm(v) {
  return String(v || "").trim().toLowerCase();
}

function isValidVideo(item) {
  if (!item) return false;
  if (norm(item.type) !== "video") return false;
  if (norm(item.status) !== "published") return false;
  if (item.hidden === true) return false;
  if (!item.file_path || String(item.file_path).trim() === "") return false;
  return true;
}

export default function VideosPage() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");

  const [videos, setVideos] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedVideo() {
      try {
        const { data, error: fetchError } = await supabase
          .from("media_items")
          .select(
            "id, title, description, file_path, type, status, hidden, category"
          )
          .eq("type", "video")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!isMounted) return;

        if (!data || !isValidVideo(data)) {
          setFeaturedVideo(null);
          setFeaturedVideoUrl("");
          return;
        }

        setFeaturedVideo(data);

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(data.file_path, 3600);

        if (!isMounted) return;

        if (signedError || !signedData?.signedUrl) {
          console.error("Featured video signed URL failed:", signedError);
          setFeaturedVideoUrl("");
          return;
        }

        setFeaturedVideoUrl(signedData.signedUrl);
      } catch (err) {
        console.error("Failed to load featured video:", err);
        if (!isMounted) return;
        setFeaturedVideo(null);
        setFeaturedVideoUrl("");
      }
    }

    async function loadVideos() {
      try {
        const { data, error: fetchError } = await supabase
          .from("media_items")
          .select(
            "id, title, description, file_path, type, category, status, hidden, created_at"
          )
          .eq("type", "video")
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        if (!isMounted) return;

        const safeVideos = Array.isArray(data) ? data.filter(isValidVideo) : [];
        setVideos(safeVideos);

        const urlMap = {};

        await Promise.all(
          safeVideos.map(async (item) => {
            try {
              const { data: signedData, error: signedError } =
                await supabase.storage
                  .from("media")
                  .createSignedUrl(item.file_path, 3600);

              if (!signedError && signedData?.signedUrl) {
                urlMap[item.id] = signedData.signedUrl;
              } else {
                console.error("Signed URL failed for:", item.id);
                urlMap[item.id] = "";
              }
            } catch (e) {
              console.error("URL generation crash:", item.id, e);
              urlMap[item.id] = "";
            }
          })
        );

        if (!isMounted) return;
        setSignedUrls(urlMap);
      } catch (err) {
        console.error("Failed to load videos:", err);
        if (!isMounted) return;
        setError(err.message || "Failed to load videos.");
        setVideos([]);
        setSignedUrls({});
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedVideo();
    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVideos = useMemo(() => {
    const baseVideos = featuredVideo
      ? videos.filter((video) => video.id !== featuredVideo.id)
      : videos;

    if (activeCategory === "all") return baseVideos;

    return baseVideos.filter((item) => norm(item.category) === activeCategory);
  }, [videos, activeCategory, featuredVideo]);

  return (
    <div className="videos-page">
      {featuredVideo && featuredVideoUrl ? (
        <section className="featured-video">
          <video
            className="featured-video-bg"
            src={featuredVideoUrl}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
          />

          <div className="featured-video-overlay" />

          <div className="featured-video-content">
            <h1>{featuredVideo.title || "Featured Video"}</h1>

            {featuredVideo.description ? (
              <p>{featuredVideo.description}</p>
            ) : null}

            <Link
              to={`/media/${featuredVideo.id}`}
              className="featured-video-button"
            >
              Watch Now
            </Link>
          </div>
        </section>
      ) : null}

      <section className="videos-hero">
        <div className="videos-hero-overlay" />
        <div className="videos-hero-content">
          <p className="videos-eyebrow">The Aset Studio</p>
          <h1 className="videos-title">Video Archive</h1>
          <p className="videos-subtitle">
            Cinematic interviews, sharp takes, and visual storytelling — all in
            one place.
          </p>
        </div>
      </section>

      <section className="videos-toolbar">
        <div className="videos-toolbar-inner">
          {VIDEO_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`videos-filter-button ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category === "all"
                ? "All"
                : category === "hot_take"
                  ? "Hot Take"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="videos-content">
        {loading ? (
          <div className="videos-state-card">
            <p>Loading video archive...</p>
          </div>
        ) : error ? (
          <div className="videos-state-card error">
            <p>{error}</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="videos-state-card">
            <p>No videos available.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.map((video) => {
              const videoUrl = signedUrls[video.id] || "";

              return (
                <article key={video.id} className="video-card">
                  <div className="video-card-media">
                    {videoUrl ? (
                      <video
                        className="video-card-preview"
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => {
                          const vid = e.currentTarget;
                          vid.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          const vid = e.currentTarget;
                          vid.pause();
                          vid.currentTime = 0;
                        }}
                        onError={() => {
                          console.error("Preview failed:", video.id);
                        }}
                      />
                    ) : (
                      <div className="video-card-placeholder">
                        <span>Preview unavailable</span>
                      </div>
                    )}
                  </div>

                  <div className="video-card-body">
                    <h2 className="video-card-title">
                      {video.title || "Untitled Video"}
                    </h2>

                    <Link to={`/media/${video.id}`} className="video-card-link">
                      Enter Screening
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}