import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const GALLERY_CACHE_KEY = "aset_gallery_cache_v1";
const GALLERY_CACHE_TIME_KEY = "aset_gallery_cache_time_v1";
const CACHE_DURATION_MS = 30 * 60 * 1000;

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        setErrorMessage("");

        const cachedItems = sessionStorage.getItem(GALLERY_CACHE_KEY);
        const cachedTime = sessionStorage.getItem(GALLERY_CACHE_TIME_KEY);

        const cacheIsValid =
          cachedItems &&
          cachedTime &&
          Date.now() - Number(cachedTime) < CACHE_DURATION_MS;

        if (cacheIsValid) {
          const parsedItems = JSON.parse(cachedItems);
          if (isMounted) {
            setItems(parsedItems);
            setLoading(false);
          }
          return;
        }

        setLoading(true);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Gallery request timed out.")), 15000);
        });

        const queryPromise = supabase
          .from("media_items")
          .select("id, title, file_path")
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false });

        const result = await Promise.race([queryPromise, timeoutPromise]);

        if (result.error) {
          throw result.error;
        }

        const finalItems = await Promise.all(
          (result.data || []).map(async (item) => {
            let imageUrl = null;

            if (item.file_path) {
              try {
                const signedUrlPromise = supabase.storage
                  .from("media")
                  .createSignedUrl(item.file_path, 3600);

                const signedTimeout = new Promise((resolve) => {
                  setTimeout(() => resolve({ data: null, error: true }), 5000);
                });

                const signedResult = await Promise.race([
                  signedUrlPromise,
                  signedTimeout,
                ]);

                if (!signedResult.error) {
                  imageUrl = signedResult.data?.signedUrl || null;
                }
              } catch (err) {
                console.error("Signed URL error:", err);
              }
            }

            return {
              id: item.id,
              title: item.title || "Untitled",
              imageUrl,
            };
          })
        );

        sessionStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(finalItems));
        sessionStorage.setItem(GALLERY_CACHE_TIME_KEY, String(Date.now()));

        if (isMounted) {
          setItems(finalItems);
        }
      } catch (err) {
        console.error("Gallery load error:", err);

        if (isMounted) {
          setItems([]);
          setErrorMessage(err.message || "Failed to load gallery.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Gallery</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Gallery</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Gallery</h1>

      {items.length === 0 ? (
        <p>No gallery items found.</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.imageWrap}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.placeholder}>Image unavailable</div>
                )}
              </div>

              <p style={styles.title}>{item.title}</p>

              <Link to={`/media/${item.id}`} style={styles.linkButton}>
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
  },
  heading: {
    marginBottom: "20px",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    borderRadius: "12px",
    padding: "12px",
    background: "#111",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    background: "#222",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholder: {
    color: "#fff",
    fontSize: "14px",
  },
  title: {
    margin: "0 0 10px 0",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  linkButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#fff",
    color: "#000",
    fontSize: "14px",
    fontWeight: "600",
  },
};
