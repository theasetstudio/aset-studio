import React, { useEffect, useMemo, useState } from "react";
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
          "id, title, tagline, description, file_path, category, access_level, type, featured, hidden, status, created_at"
        )
        .eq("featured", true)
        .eq("hidden", false)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const featuredItems = data || [];
      setItems(featuredItems);

      const signedMap = {};

      for (const item of featuredItems) {
        if (!item.file_path) continue;

        const { data: signed, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(item.file_path, 60 * 60);

        if (signedError) {
          console.error("Signed URL error:", signedError);
          signedMap[item.id] = null;
          continue;
        }

        signedMap[item.id] = signed?.signedUrl || null;
      }

      setUrlById(signedMap);
    } catch (err) {
      console.error("Featured load error:", err);
      setItems([]);
      setUrlById({});
    } finally {
      setLoading(false);
    }
  }

  const heroItem = items[0] || null;
  const portalItems = useMemo(() => items.slice(1), [items]);

  function renderMedia(item, imageStyle, fallbackText = "Preview unavailable") {
    const mediaUrl = urlById[item.id];

    if (!mediaUrl) {
      return <div style={styles.placeholder}>{fallbackText}</div>;
    }

    if (item.type === "video") {
      return (
        <video
          src={mediaUrl}
          style={imageStyle}
          muted
          playsInline
          preload="metadata"
        />
      );
    }

    return (
      <img
        src={mediaUrl}
        alt={item.title || "Featured media"}
        style={imageStyle}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.portalHeader}>
          <div>
            <p style={styles.kicker}>Curated Portal</p>
            <h1 style={styles.title}>Featured</h1>
            <p style={styles.subtitle}>
              A premium showcase of highlighted work across image and video.
            </p>
          </div>
        </section>

        {loading ? <p style={styles.message}>Loading featured work...</p> : null}

        {!loading && items.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>No featured items yet</h2>
            <p style={styles.emptyText}>
              Turn Featured on in the admin panel to populate this portal.
            </p>
          </div>
        ) : null}

        {!loading && heroItem ? (
          <section style={styles.heroSection}>
            <Link
              to={`/media/${heroItem.id}`}
              style={styles.heroLink}
              onMouseEnter={() => setHoveredId(heroItem.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={{
                  ...styles.heroCard,
                  transform:
                    hoveredId === heroItem.id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hoveredId === heroItem.id
                      ? "0 24px 60px rgba(0,0,0,0.42)"
                      : "0 18px 45px rgba(0,0,0,0.28)",
                  borderColor:
                    hoveredId === heroItem.id ? "#d4af37" : "#262633",
                }}
              >
                <div style={styles.heroMediaWrap}>
                  {renderMedia(heroItem, {
                    ...styles.heroMedia,
                    transform:
                      hoveredId === heroItem.id ? "scale(1.03)" : "scale(1)",
                  })}
                  <div style={styles.heroOverlay} />
                  <div style={styles.heroTopRow}>
                    <span style={styles.featuredBadge}>Featured</span>
                    {heroItem.type ? (
                      <span style={styles.typeBadge}>{heroItem.type}</span>
                    ) : null}
                  </div>
                  <div style={styles.heroContent}>
                    <div style={styles.heroMetaRow}>
                      {heroItem.category ? (
                        <span style={styles.heroMetaChip}>{heroItem.category}</span>
                      ) : null}
                      {heroItem.access_level ? (
                        <span style={styles.heroMetaChip}>{heroItem.access_level}</span>
                      ) : null}
                    </div>

                    <h2 style={styles.heroTitle}>
                      {heroItem.title || "Untitled"}
                    </h2>

                    <p style={styles.heroText}>
                      {heroItem.tagline ||
                        heroItem.description ||
                        "Curated featured release"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {!loading && portalItems.length > 0 ? (
          <section style={styles.gridSection}>
            <div style={styles.sectionHeadingRow}>
              <h2 style={styles.sectionTitle}>More Featured Work</h2>
            </div>

            <div style={styles.grid}>
              {portalItems.map((item) => {
                const isHovered = hoveredId === item.id;

                return (
                  <Link
                    key={item.id}
                    to={`/media/${item.id}`}
                    style={styles.cardLink}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <article
                      style={{
                        ...styles.card,
                        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                        borderColor: isHovered ? "#d4af37" : "#252533",
                        boxShadow: isHovered
                          ? "0 16px 36px rgba(0,0,0,0.34)"
                          : "0 0 0 rgba(0,0,0,0)",
                      }}
                    >
                      <div style={styles.mediaWrap}>
                        {renderMedia(item, {
                          ...styles.media,
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        })}
                        <div style={styles.overlay} />

                        <div style={styles.cardTopRow}>
                          <span style={styles.featuredBadgeSmall}>Featured</span>
                          {item.type ? (
                            <span style={styles.typeBadgeSmall}>{item.type}</span>
                          ) : null}
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

                        <h3 style={styles.cardTitle}>
                          {item.title || "Untitled"}
                        </h3>

                        <p style={styles.tagline}>
                          {item.tagline ||
                            item.description ||
                            "Curated featured release"}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(42,32,12,0.28), transparent 28%), #07070c",
    color: "#ffffff",
    padding: "32px 20px 60px",
  },

  shell: {
    maxWidth: "1360px",
    margin: "0 auto",
  },

  portalHeader: {
    marginBottom: "28px",
  },

  kicker: {
    margin: "0 0 10px 0",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#d4af37",
  },

  title: {
    margin: 0,
    fontSize: "48px",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: "14px 0 0 0",
    maxWidth: "760px",
    color: "#b8b8c7",
    fontSize: "15px",
    lineHeight: 1.7,
  },

  message: {
    color: "#a4a4b5",
    fontSize: "15px",
  },

  emptyState: {
    border: "1px solid #232330",
    borderRadius: "24px",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.02)",
  },

  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
  },

  emptyText: {
    margin: 0,
    color: "#a7a7b8",
    lineHeight: 1.7,
  },

  heroSection: {
    marginBottom: "34px",
  },

  heroLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  heroCard: {
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid #262633",
    background: "#101018",
    transition: "all 0.25s ease",
  },

  heroMediaWrap: {
    position: "relative",
    minHeight: "520px",
    background: "#0f0f15",
    overflow: "hidden",
  },

  heroMedia: {
    width: "100%",
    height: "100%",
    minHeight: "520px",
    objectFit: "cover",
    display: "block",
    background: "#0f0f15",
    transition: "transform 0.45s ease",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.82) 10%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.06) 100%)",
    pointerEvents: "none",
  },

  heroTopRow: {
    position: "absolute",
    top: "18px",
    left: "18px",
    right: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    zIndex: 2,
    flexWrap: "wrap",
  },

  heroContent: {
    position: "absolute",
    left: "24px",
    right: "24px",
    bottom: "24px",
    zIndex: 2,
  },

  heroMetaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  heroMetaChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    background: "rgba(18,18,28,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f4f4f8",
    textTransform: "capitalize",
    backdropFilter: "blur(8px)",
  },

  heroTitle: {
    margin: 0,
    maxWidth: "760px",
    fontSize: "clamp(30px, 4vw, 54px)",
    lineHeight: 1.02,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
  },

  heroText: {
    margin: "14px 0 0 0",
    maxWidth: "720px",
    color: "#ddddE8",
    fontSize: "16px",
    lineHeight: 1.7,
  },

  gridSection: {
    marginTop: "8px",
  },

  sectionHeadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },

  card: {
    background: "#101018",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #252533",
    transition: "all 0.25s ease",
    height: "100%",
  },

  mediaWrap: {
    position: "relative",
    height: "320px",
    overflow: "hidden",
    background: "#0f0f15",
  },

  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    background: "#0f0f15",
    transition: "transform 0.4s ease",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.64), rgba(0,0,0,0.08))",
    pointerEvents: "none",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    minHeight: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#9c9cad",
    padding: "16px",
    background: "#111119",
  },

  cardTopRow: {
    position: "absolute",
    top: "12px",
    left: "12px",
    right: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    zIndex: 2,
    flexWrap: "wrap",
  },

  featuredBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    background: "#d4af37",
    color: "#111111",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  featuredBadgeSmall: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    background: "#d4af37",
    color: "#111111",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    background: "rgba(18,18,28,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    textTransform: "capitalize",
    backdropFilter: "blur(8px)",
  },

  typeBadgeSmall: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    background: "rgba(18,18,28,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    textTransform: "capitalize",
    backdropFilter: "blur(8px)",
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
    fontSize: "17px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#f7f7fb",
    textTransform: "uppercase",
  },

  tagline: {
    margin: "10px 0 0 0",
    fontSize: "13px",
    lineHeight: 1.65,
    color: "#bfc0ce",
  },
};