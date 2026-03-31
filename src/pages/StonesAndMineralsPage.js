import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function StonesAndMineralsPage() {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStones() {
      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("id, title, file_path, category, tags, status, hidden")
          .in("status", ["approved", "published"])
          .eq("category", "Stones and Minerals")
          .neq("hidden", true);

        if (error) {
          console.error("Error loading stones:", error);
          setStones([]);
          return;
        }

        const items = Array.isArray(data) ? data : [];

        const withUrls = await Promise.all(
          items.map(async (item) => {
            let imageUrl = null;

            if (item.file_path) {
              const { data: signedData, error: signedError } =
                await supabase.storage
                  .from("media")
                  .createSignedUrl(item.file_path, 60 * 60);

              if (signedError) {
                console.error(
                  `Error creating signed URL for ${item.title}:`,
                  signedError
                );
              }

              if (!signedError && signedData?.signedUrl) {
                imageUrl = signedData.signedUrl;
              }
            }

            return {
              ...item,
              imageUrl,
              slug: makeSlug(item.title),
            };
          })
        );

        setStones(withUrls);
      } catch (error) {
        console.error("Unexpected error loading stones:", error);
        setStones([]);
      } finally {
        setLoading(false);
      }
    }

    loadStones();
  }, []);

  function makeSlug(title) {
    return String(title || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function getStoneRoute(slug) {
    return `/stones-and-minerals/${slug}`;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.eyebrow}>SIRENS REALM</div>

        <h1 style={styles.title}>Stones and Minerals</h1>

        <p style={styles.subtitle}>
          A sacred archive of stones and minerals — each carrying its own
          energy, frequency, and teaching within Sirens Realm.
        </p>

        {loading ? (
          <div style={styles.messageBox}>Loading stones...</div>
        ) : stones.length === 0 ? (
          <div style={styles.messageBox}>
            No stones were found in the dashboard yet.
          </div>
        ) : (
          <div style={styles.grid}>
            {stones.map((stone) => (
              <Link
                key={stone.id}
                to={getStoneRoute(stone.slug)}
                style={styles.card}
              >
                <div style={styles.imageWrap}>
                  {stone.imageUrl ? (
                    <img
                      src={stone.imageUrl}
                      alt={stone.title}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholder}>{stone.title}</div>
                  )}
                  <div style={styles.overlay} />
                </div>

                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{stone.title}</h2>

                  <p style={styles.cardText}>
                    {Array.isArray(stone.tags) && stone.tags.length > 0
                      ? stone.tags.slice(0, 6).join(", ")
                      : "Open this stone page"}
                  </p>

                  <span style={styles.cardButton}>Enter</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(60% 60% at 50% 20%, rgba(80,110,200,0.18), rgba(0,0,0,1) 70%)",
    color: "white",
    padding: "60px 20px",
  },

  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  eyebrow: {
    letterSpacing: 3,
    fontSize: 12,
    opacity: 0.8,
  },

  title: {
    fontSize: "clamp(2.8rem, 6vw, 60px)",
    marginTop: 14,
    color: "#e6d3a3",
  },

  subtitle: {
    marginTop: 12,
    maxWidth: 700,
    lineHeight: 1.7,
    opacity: 0.85,
  },

  messageBox: {
    marginTop: 40,
    padding: 24,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e6d3a3",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 28,
    marginTop: 40,
  },

  card: {
    display: "block",
    borderRadius: 22,
    overflow: "hidden",
    textDecoration: "none",
    color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#000",
  },

  imageWrap: {
    position: "relative",
    height: 260,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1f2e, #2e3f66)",
    color: "#e6d3a3",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
  },

  cardContent: {
    padding: 22,
  },

  cardTitle: {
    fontSize: 26,
    marginBottom: 10,
    color: "#e6d3a3",
  },

  cardText: {
    opacity: 0.85,
    lineHeight: 1.6,
  },

  cardButton: {
    display: "inline-block",
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(230,211,163,0.25)",
    color: "#e6d3a3",
  },
};