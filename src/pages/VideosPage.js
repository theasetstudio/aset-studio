import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideosPage.css";

const VIDEO_CATEGORIES = ["all", "interview", "hot_take", "cinematic"];

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
          .select("id, title, slug, description, category, file_path, type, status, hidden, tags, created_at")
          .eq("type", "video")
          .eq("status", "approved")
          .eq("hidden", false)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (!isMounted) return;

        const safeVideos = Array.isArray(data) ? data : [];
        setVideos(safeVideos);

        const urlMap = {};

        await Promise.all(
          safeVideos.map(async (item) => {
            if (!item.file_path) return;

            const { data: signedData, error: signedError } = await supabase.storage
              .from("media")
              .createSignedUrl(item.file_path, 60 * 60);

            if (!signedError && signedData?.signedUrl) {
              urlMap[item.id] = signedData.signedUrl;
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
      const category = (item.category || "").trim().toLowerCase();
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
            Cinematic interviews, sharp takes, and visual storytelling — all in one place.
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
            <p>No videos found in this category yet.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.map((video) => {
              const videoUrl = signedUrls[video.id] || "";
              const categoryLabel = (video.category || "Uncategorized").replaceAll("_", " ");

              return (
                <article key={video.id} className="video-card">
                  <div className="video-card-media">
                    {videoUrl ? (
                      <video
                        className="video-card-preview"
                        src={videoUrl}
                        muted
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <div className="video-card-placeholder">
                        <span>Video preview unavailable</span>
                      </div>
                    )}
                  </div>

                  <div className="video-card-body">
                    <div className="video-card-meta">
                      <span className="video-card-category">{categoryLabel}</span>
                    </div>

                    <h2 className="video-card-title">{video.title || "Untitled Video"}</h2>

                    <p className="video-card-description">
                      {video.description || "No description available yet."}
                    </p>

                    {video.slug ? (
                      <Link to={`/video/${video.slug}`} className="video-card-link">
                        Enter Screening
                      </Link>
                    ) : (
                      <span className="video-card-link disabled">Slug required for player page</span>
                    )}
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