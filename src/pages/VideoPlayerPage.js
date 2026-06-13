import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const MEDIA_BUCKET = "media";
const SIGNED_URL_TTL_SECONDS = 600;

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function formatCategory(category) {
  const value = clean(category || "Aset Cinema");
  return value.replaceAll("_", " ");
}

function displayTitle(item) {
  const title = clean(item?.title);
  if (title) return title;

  const tagline = clean(item?.tagline);
  if (tagline) return tagline;

  const quote = clean(item?.quote);
  if (quote) return quote;

  return "Aset Cinema Presentation";
}

function normalizeItem(item) {
  return {
    ...item,
    type: norm(item?.type || item?.media_type || ""),
    status: norm(item?.status || ""),
    hidden: Boolean(item?.hidden || item?.is_hidden),
    category: clean(item?.category),
    file_path: clean(item?.file_path),
    watermarked_path: clean(item?.watermarked_path),
  };
}

function isVideoItem(item) {
  const path = norm(item?.file_path);

  return (
    path.endsWith(".mp4") ||
    path.endsWith(".mov") ||
    path.endsWith(".webm")
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function createSignedUrl(path) {
      const cleanPath = clean(path);
      if (!cleanPath) return "";

      const { data, error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

      if (error || !data?.signedUrl) {
        console.error("Video preview signed URL error:", error);
        return "";
      }

      return data.signedUrl;
    }

    async function loadVideos() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select(`
            id,
            slug,
            title,
            tagline,
            quote,
            description,
            category,
            type,
            status,
            hidden,
            is_hidden,
            access_level,
            file_path,
            watermarked_path,
            created_at
          `)
          .eq("is_hidden", false)
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("MEDIA ITEMS FOUND:", data);

        const safeVideos = (data || [])
          .map(normalizeItem)
          .filter((item) => !item.hidden)
          .filter(isVideoItem);

        console.log("SAFE VIDEOS:", safeVideos);

        const urlEntries = await Promise.all(
          safeVideos.map(async (video) => {
            const path = video.watermarked_path || video.file_path || "";
            const signedUrl = await createSignedUrl(path);
            return [video.id, signedUrl];
          })
        );

        if (!mounted) return;

        setVideos(safeVideos);
        setSignedUrls(Object.fromEntries(urlEntries));
        setLoading(false);
      } catch (error) {
        console.error("Videos page load failed:", error);

        if (!mounted) return;

        setVideos([]);
        setSignedUrls({});
        setLoading(false);
      }
    }

    loadVideos();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>THE ASET STUDIO</p>
        <h1 style={styles.title}>Aset Cinema</h1>
        <p style={styles.subtitle}>
          A curated screening room for video releases, interviews, cinematic
          tests, original stories, and studio presentations.
        </p>
      </section>

      {loading ? (
        <section style={styles.stateCard}>Loading screenings...</section>
      ) : videos.length === 0 ? (
        <section style={styles.stateCard}>
          No screenings have been published yet.
        </section>
      ) : (
        <section style={styles.grid}>
          {videos.map((video) => {
            const signedUrl = signedUrls[video.id] || "";

            return (
              <Link
                key={video.id}
                to={`/media/${video.id}`}
                style={styles.card}
              >
                <div style={styles.previewWrap}>
                  {signedUrl ? (
                    <video
                      src={signedUrl}
                      muted
                      playsInline
                      preload="metadata"
                      style={styles.previewVideo}
                    />
                  ) : (
                    <div style={styles.previewFallback}>
                      Preview unavailable
                    </div>
                  )}

                  <div style={styles.previewOverlay} />

                  <span style={styles.typeBadge}>Video</span>

                  <span style={styles.categoryBadge}>
                    {formatCategory(video.category)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{displayTitle(video)}</h2>

                  {video.description ? (
                    <p style={styles.description}>{video.description}</p>
                  ) : video.tagline ? (
                    <p style={styles.description}>{video.tagline}</p>
                  ) : null}

                  <span style={styles.watchButton}>Open Screening</span>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(198,136,55,0.16), transparent 36%), linear-gradient(180deg, #050505 0%, #0a0908 46%, #050505 100%)",
    color: "#f5f1eb",
    padding: "110px 20px 80px",
  },

  hero: {
    maxWidth: 980,
    margin: "0 auto 42px",
    textAlign: "center",
  },

  kicker: {
    margin: "0 0 12px",
    fontSize: 12,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(48px, 8vw, 110px)",
    lineHeight: 0.88,
    letterSpacing: "-0.075em",
    fontWeight: 900,
  },

  subtitle: {
    maxWidth: 760,
    margin: "20px auto 0",
    color: "rgba(245,241,235,0.72)",
    lineHeight: 1.8,
    fontSize: 16,
  },

  stateCard: {
    maxWidth: 900,
    margin: "0 auto",
    borderRadius: 24,
    padding: "34px 24px",
    textAlign: "center",
    color: "rgba(245,241,235,0.7)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },

  grid: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 22,
  },

  card: {
    display: "block",
    overflow: "hidden",
    borderRadius: 28,
    textDecoration: "none",
    color: "#f5f1eb",
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
    boxShadow: "0 26px 80px rgba(0,0,0,0.34)",
  },

  previewWrap: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  previewVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    background: "#000",
  },

  previewFallback: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.55)",
    background: "rgba(255,255,255,0.025)",
  },

  previewOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.64))",
    pointerEvents: "none",
  },

  typeBadge: {
    position: "absolute",
    left: 16,
    top: 16,
    padding: "7px 11px",
    borderRadius: 999,
    background: "rgba(245,241,235,0.86)",
    color: "#111",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  categoryBadge: {
    position: "absolute",
    left: 16,
    bottom: 16,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.16)",
    background: "rgba(0,0,0,0.48)",
    color: "rgba(245,241,235,0.84)",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },

  cardBody: {
    padding: 20,
  },

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 24,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
  },

  description: {
    margin: "0 0 18px",
    color: "rgba(245,241,235,0.66)",
    lineHeight: 1.65,
    fontSize: 14,
  },

  watchButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 999,
    background: "#f5f1eb",
    color: "#111",
    fontWeight: 850,
    fontSize: 13,
  },
};