import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideosPage.css";

const VIDEO_CATEGORIES = ["all", "interview", "hot_take", "cinematic"];

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

function getCategoryLabel(category) {
  const value = category || "Uncategorized";
  return value.replaceAll("_", " ");
}

function isValidVideo(item) {
  if (!item) return false;
  if (norm(item.type) !== "video") return false;
  if (norm(item.status) !== "published") return false;
  if (item.hidden === true) return false;
  if (!item.file_path || String(item.file_path).trim() === "") return false;
  return true;
}

export default function VideoPage() {
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

    async function createVideoSignedUrl(filePath) {
      if (!filePath) return "";

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(filePath, 3600);

      if (error || !data?.signedUrl) {
        console.error("Signed URL failed:", error);
        return "";
      }

      return data.signedUrl;
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

        const featured =
          safeVideos.find((item) => item.featured === true) || null;

        setFeaturedVideo(featured);

        const urlEntries = await Promise.all(
          safeVideos.map(async (item) => {
            const signedUrl = await createVideoSignedUrl(item.file_path);
            return [item.id, signedUrl];
          })
        );

        if (!isMounted) return;

        const nextSignedUrls = Object.fromEntries(urlEntries);
        setSignedUrls(nextSignedUrls);

        if (featured) {
          setFeaturedVideoUrl(nextSignedUrls[featured.id] || "");
        } else {
          setFeaturedVideoUrl("");
        }
      } catch (err) {
        console.error("Failed to load videos:", err);

        if (!isMounted) return;

        setError(err.message || "Failed to load videos.");
        setVideos([]);
        setSignedUrls({});
        setFeaturedVideo(null);
        setFeaturedVideoUrl("");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVideos = useMemo(() => {
    const withoutFeatured = featuredVideo
      ? videos.filter((video) => video.id !== featuredVideo.id)
      : videos;

    if (activeCategory === "all") return withoutFeatured;

    return withoutFeatured.filter(
      (video) => norm(video.category) === activeCategory
    );
  }, [videos, activeCategory, featuredVideo]);

  return (
    <main className="videos-page">
      {featuredVideo && featuredVideoUrl && (
        <section className="featured-video" aria-label="Featured screening">
          <div className="featured-video-wrapper">
            <video
              className={`featured-video-bg ${videoReady ? "is-ready" : ""}`}
              src={featuredVideoUrl}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
            />

            <div className="featured-video-overlay" />

            <div className="featured-video-content">
              <p className="videos-eyebrow">Featured Screening</p>

              <h1>{featuredVideo.title || "Featured Presentation"}</h1>

              {featuredVideo.description && (
                <p>{featuredVideo.description}</p>
              )}

              <Link
                to={`/media/${featuredVideo.id}`}
                className="featured-video-button"
              >
                Enter Screening
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="videos-hero">
        <div className="videos-hero-overlay" />

        <div className="videos-hero-content">
          <p className="videos-eyebrow">The Aset Studio Presents</p>
          <h1 className="videos-title">Aset Cinema</h1>
          <p className="videos-subtitle">
            A curated cinematic portal for featured films, intimate interviews,
            sharp cultural commentary, and story-driven visual work.
          </p>
        </div>
      </section>

      <section className="videos-toolbar" aria-label="Cinema categories">
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
            <p>Preparing the cinema...</p>
          </div>
        ) : error ? (
          <div className="videos-state-card error">
            <p>{error}</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="videos-state-card">
            <p>No screenings available.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.map((video) => {
              const videoUrl = signedUrls[video.id] || "";
              const categoryLabel = getCategoryLabel(video.category);

              return (
                <article key={video.id} className="video-card">
                  <Link to={`/media/${video.id}`} className="video-card-link-wrap">
                    <div className="video-card-media">
                      {videoUrl ? (
                        <video
                          className="video-card-preview"
                          src={videoUrl}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="video-card-placeholder">
                          <span>Preview unavailable</span>
                        </div>
                      )}
                    </div>

                    <div className="video-card-body">
                      <span className="video-card-category">
                        {categoryLabel}
                      </span>

                      <h2 className="video-card-title">
                        {video.title || "Untitled Screening"}
                      </h2>

                      <p className="video-card-description">
                        {video.description || "Details coming soon."}
                      </p>

                      <span className="video-card-cta">Enter Screening</span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}