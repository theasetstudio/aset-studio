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
  const [videos, setVideos] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchVideos() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("media_items")
          .select(
            "id, title, description, category, file_path, type, status, hidden, tags, created_at"
          )
          .eq("type", "video")
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (!isMounted) return;

        const rawVideos = Array.isArray(data) ? data : [];
        const safeVideos = rawVideos.filter(isValidVideo);

        setVideos(safeVideos);

        const urlMap = {};

        await Promise.all(
          safeVideos.map(async (item) => {
            try {
              const { data: signedData, error: signedError } =
                await supabase.storage
                  .from("media")
                  .createSignedUrl(item.file_path, 60 * 60);

              if (!signedError && signedData?.signedUrl) {
                urlMap[item.id] = signedData.signedUrl;
              } else {
                console.error("Signed URL failed for:", item.id);
              }
            } catch (e) {
              console.error("URL generation crash:", item.id, e);
            }
          })
        );

        if (isMounted) {
          setSignedUrls(urlMap);
        }
      } catch (err) {
        console.error("Error loading videos:", err);

        if (isMounted) {
          setError(err.message || "Failed to load videos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return videos;

    return videos.filter((item) => {
      const category = norm(item.category);
      return category === activeCategory;
    });
  }, [videos, activeCategory]);

  return (
    <div className="videos-page">
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
              const categoryLabel = (
                video.category || "Uncategorized"
              ).replaceAll("_", " ");

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
                    <div className="video-card-meta">
                      <span className="video-card-category">{categoryLabel}</span>
                    </div>

                    <h2 className="video-card-title">
                      {video.title || "Untitled Video"}
                    </h2>

                    <p className="video-card-description">
                      {video.description || "No description available yet."}
                    </p>

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