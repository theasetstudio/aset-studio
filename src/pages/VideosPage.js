import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VIDEO_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "cinematic", label: "Cinematic" },
  { key: "interview", label: "Interviews" },
  { key: "film", label: "Films" },
  { key: "music_video", label: "Music Videos" },
  { key: "studio_release", label: "Studio Releases" },
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

function getPosterPath(video) {
  return (
    video?.poster_url ||
    video?.thumbnail_url ||
    video?.image_url ||
    video?.cover_url ||
    ""
  );
}

function isFullUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [posterUrls, setPosterUrls] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getSignedUrl(pathOrUrl) {
      if (!pathOrUrl) return "";
      if (isFullUrl(pathOrUrl)) return pathOrUrl;

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(pathOrUrl, 3600);

      if (error) {
        console.error("Signed URL error:", error);
        return "";
      }

      return data?.signedUrl || "";
    }

    async function loadVideos() {
      setLoading(true);

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("type", "video")
        .eq("status", "published")
        .eq("hidden", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load videos:", error);

        if (isMounted) {
          setVideos([]);
          setSignedUrls({});
          setPosterUrls({});
          setLoading(false);
        }

        return;
      }

      const safeVideos = data || [];

      const videoEntries = await Promise.all(
        safeVideos.map(async (video) => {
          const videoPath = video.watermarked_path || video.file_path;
          const signedUrl = await getSignedUrl(videoPath);
          return [video.id, signedUrl];
        })
      );

      const posterEntries = await Promise.all(
        safeVideos.map(async (video) => {
          const posterPath = getPosterPath(video);
          const posterUrl = await getSignedUrl(posterPath);
          return [video.id, posterUrl];
        })
      );

      if (isMounted) {
        setVideos(safeVideos);
        setSignedUrls(Object.fromEntries(videoEntries));
        setPosterUrls(Object.fromEntries(posterEntries));
        setLoading(false);
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredVideo = videos[0] || null;

  const filteredVideos = useMemo(() => {
    const remaining = featuredVideo
      ? videos.filter((video) => video.id !== featuredVideo.id)
      : videos;

    if (activeCategory === "all") return remaining;

    return remaining.filter((video) => norm(video.category) === activeCategory);
  }, [videos, featuredVideo, activeCategory]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroCopy}>
          <p style={styles.eyebrow}>THE ASET STUDIO PRESENTS</p>
          <h1 style={styles.title}>Aset Cinema</h1>
          <p style={styles.text}>
            A curated screening room for interviews, cinematic releases, studio
            originals, performances, and the world being built around Aset.
          </p>
        </div>

        {featuredVideo && (
          <Link
            to={getVideoPath(featuredVideo)}
            style={{
              ...styles.featureCard,
              ...(hoveredFeature ? styles.featureCardHover : {}),
            }}
            onMouseEnter={() => setHoveredFeature(true)}
            onMouseLeave={() => setHoveredFeature(false)}
          >
            <div style={styles.featureMedia}>
              {posterUrls[featuredVideo.id] && (
                <img
                  src={posterUrls[featuredVideo.id]}
                  alt={featuredVideo.title || "Featured screening"}
                  style={styles.posterImage}
                />
              )}

              {signedUrls[featuredVideo.id] ? (
                <video
                  src={signedUrls[featuredVideo.id]}
                  poster={posterUrls[featuredVideo.id] || undefined}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    ...styles.featureVideo,
                    ...(hoveredFeature ? styles.featureVideoHover : {}),
                  }}
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              ) : (
                <div style={styles.mediaFallback}>Preview loading...</div>
              )}

              <div style={styles.overlay} />
            </div>

            <div style={styles.featureBody}>
              <p style={styles.goldText}>FEATURED SCREENING</p>
              <h2 style={styles.featureTitle}>
                {featuredVideo.title || "Featured Presentation"}
              </h2>
              <span style={styles.cta}>Enter Screening</span>
            </div>
          </Link>
        )}
      </section>

      <section style={styles.filters}>
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
      </section>

      <section style={styles.content}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>NOW SCREENING</p>
            <h2 style={styles.sectionTitle}>
              {activeCategory === "all"
                ? "Curated Cinema"
                : VIDEO_CATEGORIES.find((item) => item.key === activeCategory)
                    ?.label || "Aset Cinema"}
            </h2>
          </div>

          <Link to="/" style={styles.returnLink}>
            Return to Studio →
          </Link>
        </div>

        {loading ? (
          <div style={styles.stateCard}>Preparing Aset Cinema...</div>
        ) : filteredVideos.length === 0 ? (
          <div style={styles.stateCard}>
            This room is being prepared. New screenings will appear here.
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                to={getVideoPath(video)}
                style={{
                  ...styles.card,
                  ...(hoveredCard === video.id ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(video.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardMedia}>
                  {posterUrls[video.id] && (
                    <img
                      src={posterUrls[video.id]}
                      alt={video.title || "Aset Cinema poster"}
                      style={styles.posterImage}
                    />
                  )}

                  {signedUrls[video.id] ? (
                    <video
                      src={signedUrls[video.id]}
                      poster={posterUrls[video.id] || undefined}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      style={{
                        ...styles.cardVideo,
                        ...(hoveredCard === video.id
                          ? styles.cardVideoHover
                          : {}),
                      }}
                      onMouseEnter={(e) =>
                        e.currentTarget.play().catch(() => {})
                      }
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div style={styles.mediaFallback}>Preview unavailable</div>
                  )}

                  <div style={styles.overlay} />
                  <span style={styles.badge}>
                    {getCategoryLabel(video.category)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>
                    {video.title || "Untitled Screening"}
                  </h3>
                  <p style={styles.cardText}>
                    {video.description || "Details coming soon."}
                  </p>
                  <span style={styles.cardCta}>Enter Screening</span>
                </div>
              </Link>
            ))}
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
      "radial-gradient(circle at 70% 0%, rgba(198,136,55,0.16), transparent 34%), radial-gradient(circle at 18% 18%, rgba(245,241,235,0.045), transparent 28%), linear-gradient(180deg, #050505 0%, #090806 48%, #050505 100%)",
    color: "#f5f1eb",
    paddingTop: 78,
  },

  hero: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "42px 24px 28px",
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.52fr) minmax(0, 1.48fr)",
    gap: 24,
    alignItems: "stretch",
  },

  heroCopy: {
    borderRadius: 30,
    padding: "30px 28px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.014))",
    border: "1px solid rgba(245,241,235,0.09)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: 420,
    boxShadow: "0 30px 90px rgba(0,0,0,0.32)",
  },

  eyebrow: {
    margin: "0 0 9px",
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  title: {
    margin: "0 0 15px",
    fontSize: "clamp(46px, 5vw, 76px)",
    lineHeight: 0.88,
    letterSpacing: "-0.06em",
    fontWeight: 900,
  },

  text: {
    margin: 0,
    maxWidth: 520,
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(245,241,235,0.74)",
  },

  featureCard: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "1fr auto",
    minHeight: 420,
    borderRadius: 30,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.1)",
    textDecoration: "none",
    color: "#f5f1eb",
    boxShadow:
      "0 50px 140px rgba(0,0,0,0.82), 0 0 40px rgba(197,141,54,0.08)",
    transition:
      "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
  },

  featureCardHover: {
    transform: "translateY(-6px)",
    borderColor: "rgba(245,241,235,0.18)",
    boxShadow:
      "0 62px 160px rgba(0,0,0,0.92), 0 0 56px rgba(197,141,54,0.12)",
  },

  featureMedia: {
    position: "relative",
    minHeight: 320,
    background: "#000",
    overflow: "hidden",
  },

  posterImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "brightness(0.72) contrast(1.08)",
  },

  featureVideo: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    opacity: 0.38,
    filter: "brightness(0.6) contrast(1.04)",
    transition: "opacity 0.35s ease",
  },

  featureVideoHover: {
    opacity: 0.62,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.82)), linear-gradient(135deg, rgba(255,255,255,0.04), transparent 40%)",
  },

  featureBody: {
    padding: "20px 24px 24px",
    background: "linear-gradient(180deg, rgba(10,10,10,0.95), #000)",
  },

  goldText: {
    margin: "0 0 8px",
    color: "#c58d36",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  featureTitle: {
    margin: "0 0 14px",
    fontSize: "clamp(28px, 3.4vw, 46px)",
    lineHeight: 0.96,
    letterSpacing: "-0.045em",
  },

  cta: {
    color: "#111",
    background: "linear-gradient(135deg, #c58d36, #f1d08a)",
    padding: "11px 16px",
    borderRadius: 999,
    fontWeight: 900,
    display: "inline-flex",
    fontSize: 12,
  },

  filters: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "10px 24px 26px",
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
  },

  filterButton: {
    border: "1px solid rgba(245,241,235,0.11)",
    background: "rgba(255,255,255,0.025)",
    color: "rgba(245,241,235,0.7)",
    borderRadius: 999,
    padding: "9px 13px",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontSize: 10,
  },

  filterButtonActive: {
    background: "#f5f1eb",
    color: "#111",
  },

  content: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "12px 24px 96px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 24,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(32px, 4.2vw, 54px)",
    lineHeight: 0.95,
    letterSpacing: "-0.05em",
  },

  returnLink: {
    color: "rgba(245,241,235,0.7)",
    textDecoration: "none",
    fontSize: 13,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 22,
  },

  card: {
    display: "block",
    overflow: "hidden",
    borderRadius: 24,
    textDecoration: "none",
    color: "#f5f1eb",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))",
    border: "1px solid rgba(245,241,235,0.08)",
    boxShadow: "0 26px 70px rgba(0,0,0,0.38)",
    transition:
      "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
  },

  cardHover: {
    transform: "translateY(-6px)",
    borderColor: "rgba(245,241,235,0.16)",
    boxShadow: "0 34px 90px rgba(0,0,0,0.52)",
  },

  cardMedia: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  cardVideo: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    opacity: 0.28,
    transition: "opacity 0.3s ease",
  },

  cardVideoHover: {
    opacity: 0.52,
  },

  badge: {
    position: "absolute",
    left: 13,
    bottom: 13,
    zIndex: 3,
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
    padding: "17px 18px 20px",
  },

  cardTitle: {
    margin: "0 0 9px",
    fontSize: 20,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },

  cardText: {
    margin: "0 0 13px",
    fontSize: 13,
    lineHeight: 1.55,
    color: "rgba(245,241,235,0.64)",
  },

  cardCta: {
    fontSize: 12,
    fontWeight: 850,
    color: "#d7b56d",
  },

  mediaFallback: {
    height: "100%",
    minHeight: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.52)",
    background: "rgba(255,255,255,0.025)",
  },

  stateCard: {
    borderRadius: 24,
    padding: "34px 24px",
    textAlign: "center",
    color: "rgba(245,241,235,0.68)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },
};