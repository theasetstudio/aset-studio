import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function FeaturedPage() {
  const [items, setItems] = useState([]);
  const [urlById, setUrlById] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    loadFeatured();
  }, []);

  async function loadFeatured() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select(
          "id, created_at, title, tagline, description, file_path, access_level, hidden, status, category, type, featured"
        )
        .eq("featured", true)
        .eq("hidden", false)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const featuredItems = data || [];
      setItems(featuredItems);

      const signedUrlMap = {};

      for (const row of featuredItems) {
        if (!row.file_path) continue;

        const { data: signed, error: signErr } = await supabase.storage
          .from("media")
          .createSignedUrl(row.file_path, 60 * 60);

        if (signErr) {
          console.warn("Signed URL error:", signErr);
          continue;
        }

        signedUrlMap[row.id] = signed?.signedUrl || null;
      }

      setUrlById(signedUrlMap);
    } catch (error) {
      console.error("Featured load error:", error);
      setItems([]);
      setUrlById({});
    } finally {
      setLoading(false);
    }
  }

  function getItemLink(item) {
    return `/media/${item.id}`;
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerWrap}>
        <div>
          <h1 style={styles.title}>Featured</h1>
          <p style={styles.subtitle}>
            A curated showcase of featured work across image and video.
          </p>
        </div>
      </div>

      {loading ? <p style={styles.message}>Loading featured work...</p> : null}

      {!loading && items.length === 0 ? (
        <p style={styles.message}>No featured items yet.</p>
      ) : null}

      <div style={styles.grid}>
        {items.map((item) => {
          const mediaUrl = urlById[item.id];
          const isHovered = hoveredId === item.id;

          return (
            <Link
              key={item.id}
              to={getItemLink(item)}
              style={styles.cardLink}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={{
                  ...styles.card,
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  borderColor: isHovered ? "#d4af37" : "#252533",
                  boxShadow: isHovered
                    ? "0 18px 40px rgba(0,0,0,0.35)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
              >
                <div style={styles.mediaWrap}>
                  {mediaUrl ? (
                    item.type === "video" ? (
                      <video
                        src={mediaUrl}
                        style={{
                          ...styles.media,
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={item.title || "Featured media"}
                        style={{
                          ...styles.media,
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                      />
                    )
                  ) : (
                    <div style={styles.placeholder}>Preview unavailable</div>
                  )}

                  <div style={styles.topBadges}>
                    <span style={styles.featuredBadge}>Featured</span>
                  </div>
                </div>

                <div style={styles.content}>
                  <div style={styles.metaRow}>
                    {item.category ? (
                      <span style={styles.metaChip}>{item.category}</span>
                    ) : null}
                    {item.access_level ? (
                      <span style={styles.metaChip}>{item.access_level}</span>
                    ) : null}
                  </div>

                  <h2 style={styles.cardTitle}>{item.title || "Untitled"}</h2>

                  {item.tagline ? (
                    <p style={styles.tagline}>{item.tagline}</p>
                  ) : item.description ? (
                    <p style={styles.tagline}>{item.description}</p>
                  ) : (
                    <p style={styles.taglineMuted}>Curated featured release</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#08080d",
    color: "#f5f5f5",
    padding: "32px 20px 60px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  headerWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "40px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "10px 0 0 0",
    color: "#b8b8c7",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "720px",
  },
  message: {
    color: "#b8b8c7",
    fontSize: "15px",
    marginTop: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "24px",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #252533",
    background: "#111119",
    transition: "all 0.25s ease",
    height: "100%",
  },
  mediaWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 5",
    background: "#0f0f15",
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    background: "#0f0f15",
    transition: "transform 0.4s ease",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9b9bac",
    fontSize: "14px",
    padding: "16px",
    textAlign: "center",
  },
  topBadges: {
    position: "absolute",
    top: "12px",
    left: "12px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  featuredBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#d4af37",
    color: "#111111",
    fontSize: "12px",
    fontWeight: 700,
  },
  content: {
    padding: "16px",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#232331",
    color: "#f1f1f5",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1.25,
    color: "#f5f5f5",
  },
  tagline: {
    margin: "10px 0 0 0",
    color: "#d5d5df",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  taglineMuted: {
    margin: "10px 0 0 0",
    color: "#8f8fa3",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};