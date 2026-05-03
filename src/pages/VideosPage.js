import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VIDEO_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "film", label: "Films" },
  { key: "interview", label: "Interviews" },
  { key: "hot_take", label: "Hot Takes" },
  { key: "cinematic", label: "Cinematic" },
  { key: "studio_release", label: "Studio Releases" },
  { key: "music_video", label: "Music Videos" },
  { key: "show", label: "Shows" },
  { key: "red_carpet", label: "Red Carpet" },
];

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function getCategoryLabel(category) {
  return clean(category || "Aset Cinema").replaceAll("_", " ");
}

function getVideoPath(video) {
  return video?.slug ? `/video/${video.slug}` : `/media/${video.id}`;
}

function isValidVideo(item) {
  if (!item) return false;
  if (norm(item.type) !== "video") return false;
  if (norm(item.status) !== "published") return false;
  if (item.hidden === true) return false;
  if (!clean(item.file_path)) return false;
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
          safeVideos.find((item) => item.featured === true) ||
          safeVideos[0] ||
          null;

        setFeaturedVideo(featured);

        const urlEntries = await Promise.all(
          safeVideos.map(async (item) => {
            const signedUrl = await createVideoSignedUrl(
              item.watermarked_path || item.file_path
            );
            return [item.id, signedUrl];
          })
        );

        if (!isMounted) return;

        const nextSignedUrls = Object.fromEntries(urlEntries);
        setSignedUrls(nextSignedUrls);
        setFeaturedVideoUrl(featured ? nextSignedUrls[featured.id] || "" : "");
      } catch (err) {
        console.error("Failed to load videos:", err);

        if (!isMounted) return;

        setError(err.message || "Failed to load videos.");
        setVideos([]);
        setSignedUrls({});
        setFeaturedVideo(null);
        setFeaturedVideoUrl("");
      } finally {
        if (isMounted) setLoading(false);
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
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.identityPanel}>
            <p style={styles.eyebrow}>THE ASET STUDIO PRESENTS</p>

            <h1 style={styles.heroTitle}>Aset Cinema</h1>

            <p style={styles.heroText}>
              A controlled cinematic portal for featured screenings, films,
              music videos, shows, red carpet premieres, intimate interviews,
              sharp commentary, and story-driven releases.
            </p>

            <div style={styles.pillRow}>
              <span style={styles.pill}>Films</span>
              <span style={styles.pill}>Interviews</span>
              <span style={styles.pill}>Hot Takes</span>
              <span style={styles.pill}>Music Videos</span>
              <span style={styles.pill}>Shows</span>
              <span style={styles.pill}>Red Carpet</span>
              <span style={styles.pill}>Studio Releases</span>
            </div>
          </div>

          <div style={styles.featurePanel}>
            {featuredVideo && featuredVideoUrl ? (
              <>
                <div style={styles.featureMedia}>
                  <video
                    src={featuredVideoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedData={() => setVideoReady(true)}
                    style={{
                      ...styles.featureVideo,
                      opacity: videoReady ? 1 : 0,
                    }}
                  />
                  <div style={styles.featureOverlay} />
                </div>

                <div style={styles.featureBody}>
                  <p style={styles.featureEyebrow}>FEATURED SCREENING</p>

                  <h2 style={styles.featureTitle}>
                    {featuredVideo.title || "Featured Presentation"}
                  </h2>

                  {featuredVideo.description && (
                    <p style={styles.featureText}>
                      {featuredVideo.description}
                    </p>
                  )}

                  <Link to={getVideoPath(featuredVideo)} style={styles.goldButton}>
                    Enter Screening
                  </Link>
                </div>
              </>
            ) : (
              <div style={styles.emptyFeature}>
                {loading
                  ? "Preparing featured screening..."
                  : "Featured screening coming soon."}
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={styles.toolbar}>
        <div style={styles.toolbarInner}>
          {VIDEO_CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              style={{
                ...styles.filterButton,
                ...(activeCategory === category.key
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>NOW SCREENING</p>
            <h2 style={styles.sectionTitle}>
              {activeCategory === "all"
                ? "Curated Cinema"
                : VIDEO_CATEGORIES.find((cat) => cat.key === activeCategory)
                    ?.label || getCategoryLabel(activeCategory)}
            </h2>
          </div>

          <Link to="/" style={styles.textLink}>
            Return to Studio →
          </Link>
        </div>

        {loading ? (
          <div style={styles.stateCard}>Preparing the cinema...</div>
        ) : error ? (
          <div style={styles.stateCard}>{error}</div>
        ) : filteredVideos.length === 0 ? (
          <div style={styles.stateCard}>
            This category is being prepared. New screenings will appear here.
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredVideos.map((video) => {
              const videoUrl = signedUrls[video.id] || "";
              const categoryLabel = getCategoryLabel(video.category);

              return (
                <Link key={video.id} to={getVideoPath(video)} style={styles.card}>
                  <div style={styles.cardMedia}>
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={styles.cardVideo}
                        onMouseEnter={(e) => {
                          e.currentTarget.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    ) : (
                      <div style={styles.cardFallback}>Preview unavailable</div>
                    )}

                    <div style={styles.cardOverlay} />
                    <span style={styles.cardBadge}>{categoryLabel}</span>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>
                      {video.title || "Untitled Screening"}
                    </h3>

                    <p style={styles.cardDescription}>
                      {video.description || "Details coming soon."}
                    </p>

                    <span style={styles.cardCta}>Enter Screening</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 68% 0%, rgba(198,136,55,0.16), transparent 32%), linear-gradient(180deg, #050505 0%, #090806 46%, #050505 100%)",
    color: "#f5f1eb",
    paddingTop: 74,
  },

  hero: {
    padding: "44px 22px 28px",
  },

  heroInner: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(260px, 0.62fr) minmax(0, 1.38fr)",
    gap: 22,
    alignItems: "stretch",
  },

  identityPanel: {
    minHeight: 390,
    borderRadius: 28,
    padding: "30px 28px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.046), rgba(255,255,255,0.014))",
    border: "1px solid rgba(245,241,235,0.09)",
    boxShadow: "0 34px 110px rgba(0,0,0,0.42)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  heroTitle: {
    margin: "0 0 16px",
    fontSize: "clamp(44px, 5.8vw, 76px)",
    lineHeight: 0.88,
    letterSpacing: "-0.066em",
    fontWeight: 900,
  },

  heroText: {
    margin: "0 0 22px",
    maxWidth: 500,
    fontSize: 15,
    lineHeight: 1.75,
    color: "rgba(245,241,235,0.76)",
  },

  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
  },

  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(245,241,235,0.1)",
    color: "rgba(245,241,235,0.68)",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  featurePanel: {
    minHeight: 390,
    borderRadius: 30,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.11)",
    boxShadow:
      "0 52px 150px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.035)",
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr) auto",
  },

  featureMedia: {
    position: "relative",
    height: 260,
    background: "#000",
    overflow: "hidden",
  },

  featureVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "opacity 1s ease",
    background: "#000",
    filter: "brightness(0.7) contrast(1.06)",
  },

  featureOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.72))",
  },

  featureBody: {
    padding: "22px 24px 24px",
    background:
      "linear-gradient(180deg, rgba(10,10,10,0.96), rgba(0,0,0,0.99))",
  },

  featureEyebrow: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.54)",
  },

  featureTitle: {
    margin: "0 0 10px",
    fontSize: "clamp(28px, 3.8vw, 44px)",
    lineHeight: 0.96,
    letterSpacing: "-0.045em",
  },

  featureText: {
    margin: "0 0 16px",
    maxWidth: 720,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(245,241,235,0.72)",
  },

  goldButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 20px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #c58d36, #f1d08a)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
    letterSpacing: "0.03em",
    boxShadow: "0 20px 54px rgba(151,101,33,0.28)",
  },

  emptyFeature: {
    minHeight: 390,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.68)",
    background: "rgba(255,255,255,0.025)",
  },

  toolbar: {
    padding: "6px 22px 22px",
  },

  toolbarInner: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  filterButton: {
    border: "1px solid rgba(245,241,235,0.11)",
    background: "rgba(255,255,255,0.026)",
    color: "rgba(245,241,235,0.68)",
    borderRadius: 999,
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontSize: 11,
  },

  filterButtonActive: {
    background: "#f5f1eb",
    color: "#111",
    border: "1px solid #f5f1eb",
  },

  content: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "18px 22px 90px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 24,
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(32px, 4.5vw, 54px)",
    lineHeight: 0.95,
    letterSpacing: "-0.052em",
    fontWeight: 900,
  },

  textLink: {
    color: "rgba(245,241,235,0.7)",
    textDecoration: "none",
    fontSize: 14,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 18,
  },

  card: {
    display: "block",
    overflow: "hidden",
    borderRadius: 24,
    textDecoration: "none",
    color: "#f5f1eb",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.013))",
    border: "1px solid rgba(245,241,235,0.08)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.32)",
  },

  cardMedia: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  cardVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  cardOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.68))",
  },

  cardBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    zIndex: 2,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.62)",
    border: "1px solid rgba(245,241,235,0.12)",
    color: "rgba(245,241,235,0.82)",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  cardBody: {
    padding: "17px 17px 18px",
  },

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 20,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },

  cardDescription: {
    margin: "0 0 14px",
    fontSize: 13,
    lineHeight: 1.58,
    color: "rgba(245,241,235,0.66)",
  },

  cardCta: {
    fontSize: 12,
    fontWeight: 850,
    color: "rgba(245,241,235,0.84)",
  },

  cardFallback: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.56)",
    background: "rgba(255,255,255,0.025)",
  },

  stateCard: {
    borderRadius: 24,
    padding: "34px 24px",
    textAlign: "center",
    color: "rgba(245,241,235,0.7)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },
};