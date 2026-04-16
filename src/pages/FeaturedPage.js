import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function FeaturedPage() {
  const [items, setItems] = useState([]);
  const [urlById, setUrlById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
  }, []);

  async function loadFeatured() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select(
          "id, title, tagline, description, file_path, category, access_level, type, featured, hidden, status"
        )
        .eq("featured", true)
        .eq("hidden", false)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const featuredItems = data || [];
      setItems(featuredItems);

      const map = {};

      for (const item of featuredItems) {
        if (!item.file_path) continue;

        const { data: signed } = await supabase.storage
          .from("media")
          .createSignedUrl(item.file_path, 60 * 60);

        map[item.id] = signed?.signedUrl || null;
      }

      setUrlById(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Featured</h1>
      <p style={styles.subtitle}>
        A curated showcase of featured work across image and video.
      </p>

      {loading && <p style={styles.message}>Loading...</p>}

      {/* HERO ITEM */}
      {items[0] && (
        <Link to={`/media/${items[0].id}`} style={styles.heroLink}>
          <div style={styles.hero}>
            <img src={urlById[items[0].id]} style={styles.heroImage} />

            <div style={styles.heroOverlay} />

            <div style={styles.heroContent}>
              <span style={styles.featuredBadge}>Featured</span>

              <h2 style={styles.heroTitle}>
                {items[0].title || "Untitled"}
              </h2>

              <p style={styles.heroText}>
                {items[0].tagline ||
                  items[0].description ||
                  "Curated featured release"}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* GRID */}
      <div style={styles.grid}>
        {items.slice(1).map((item) => (
          <Link
            key={item.id}
            to={`/media/${item.id}`}
            style={styles.cardLink}
          >
            <div style={styles.card}>
              <div style={styles.mediaWrap}>
                <img
                  src={urlById[item.id]}
                  style={styles.media}
                />

                <div style={styles.overlay} />

                <span style={styles.featuredBadgeSmall}>Featured</span>
              </div>

              <div style={styles.content}>
                <div style={styles.metaRow}>
                  {item.category && (
                    <span style={styles.metaChip}>{item.category}</span>
                  )}
                  {item.access_level && (
                    <span style={styles.metaChip}>{item.access_level}</span>
                  )}
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#08080d",
    color: "#fff",
  },

  title: {
    fontSize: "38px",
    marginBottom: "5px",
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "30px",
  },

  message: {
    opacity: 0.6,
  },

  heroLink: {
    textDecoration: "none",
    color: "inherit",
  },

  hero: {
    position: "relative",
    height: "420px",
    marginBottom: "30px",
    borderRadius: "20px",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
  },

  heroContent: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
  },

  heroTitle: {
    fontSize: "28px",
    margin: "10px 0",
  },

  heroText: {
    opacity: 0.8,
    maxWidth: "500px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },

  card: {
    background: "#111119",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #252533",
  },

  mediaWrap: {
    position: "relative",
    height: "300px",
  },

  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
  },

  featuredBadge: {
    background: "#d4af37",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  featuredBadgeSmall: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "#d4af37",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  content: {
    padding: "15px",
  },

  metaRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "8px",
  },

  metaChip: {
    background: "#232331",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "11px",
  },

  cardTitle: {
    fontSize: "16px",
    marginBottom: "6px",
  },

  tagline: {
    fontSize: "13px",
    opacity: 0.8,
  },
};