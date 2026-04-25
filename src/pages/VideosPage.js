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
  const [videoReady, setVideoReady] = useState(false);

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
          .select("*")
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
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("media_items")
          .select("*")
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

              urlMap[item.id] = signedError || !signedData?.signedUrl
                ? ""
                : signedData.signedUrl;
            } catch {
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
        if (isMounted) setLoading(false);
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
      {/* Featured Hero Section */}
      {featuredVideo && featuredVideoUrl && (
        <section className="featured-video">
          <div className="featured-video-wrapper">
            <video
              className="featured-video-bg"
              src={featuredVideoUrl}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
              style={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                background: "#000",
                opacity: videoReady ? 1 : 0,
                transform: videoReady ? "scale(1)" : "scale(1.02)",
                transition: "opacity 1.8s ease, transform 1.8s ease",
              }}
            />

            <div
              className="featured-video-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
              }}
            />

            <div
              className="featured-video-content"
              style={{
                position: "absolute",
                left: "5%",
                top: "60%",
                transform: "translateY(-50%)",
                color: "#fff",
                maxWidth: "45%",
                textShadow: "0 4px 12px rgba(0,0,0,0.45)",
              }}
            >
              <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
                {featuredVideo.title || "Featured Video"}
              </h1>
              {featuredVideo.description && <p>{featuredVideo.description}</p>}
              <Link
                to={`/media/${featuredVideo.id}`}
                className="featured-video-button"
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "10px",
                  background: "rgba(214,195,165,0.9)",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6c3a5cc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(214,195,165,0.9)";
                }}
              >
                Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Hero Header */}
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

      {/* Category Toolbar */}
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

      {/* Video Grid */}
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
              const categoryLabel = (video.category || "Uncategorized").replaceAll(
                "_",
                " "
              );

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
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
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

                    <h2 className="video-card-title">{video.title || "Untitled Video"}</h2>
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