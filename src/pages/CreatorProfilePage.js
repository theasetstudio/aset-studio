import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CreatorPortfolioPage() {
  const { id } = useParams();

  const [creatorProfile, setCreatorProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 12;

  useEffect(() => {
    let alive = true;

    async function loadInitialPortfolio() {
      try {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setPortfolioItems([]);

        if (!id) {
          if (alive) {
            setCreatorProfile(null);
            setHasMore(false);
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, banner_url, quote")
          .eq("id", id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          if (alive) {
            setCreatorProfile(null);
            setHasMore(false);
          }
          return;
        }

        if (alive) {
          setCreatorProfile(profileData);
        }

        const from = 0;
        const to = PAGE_SIZE - 1;

        const { data: mediaRows, error: mediaError } = await supabase
          .from("media_items")
          .select("id, file_path, status, access_level, created_at")
          .eq("owner_id", id)
          .in("status", ["approved", "published"])
          .order("created_at", { ascending: false })
          .range(from, to);

        if (mediaError) throw mediaError;

        if (!mediaRows || mediaRows.length === 0) {
          if (alive) {
            setPortfolioItems([]);
            setHasMore(false);
          }
          return;
        }

        const itemsWithSignedUrls = await Promise.all(
          mediaRows.map(async (item) => {
            let signedUrl = "";

            if (item.file_path) {
              try {
                const { data: signedData, error: signedError } =
                  await supabase.storage
                    .from("media")
                    .createSignedUrl(item.file_path, 3600);

                if (!signedError && signedData?.signedUrl) {
                  signedUrl = signedData.signedUrl;
                }
              } catch (err) {
                console.error("Signed URL error:", err);
              }
            }

            return {
              ...item,
              signedUrl,
            };
          })
        );

        if (alive) {
          setPortfolioItems(itemsWithSignedUrls);
          setPage(1);
          setHasMore(mediaRows.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Error loading creator portfolio:", error);

        if (alive) {
          setCreatorProfile(null);
          setPortfolioItems([]);
          setHasMore(false);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadInitialPortfolio();

    return () => {
      alive = false;
    };
  }, [id]);

  async function handleLoadMore() {
    if (loadingMore || !hasMore || !id) return;

    try {
      setLoadingMore(true);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data: mediaRows, error: mediaError } = await supabase
        .from("media_items")
        .select("id, file_path, status, access_level, created_at")
        .eq("owner_id", id)
        .in("status", ["approved", "published"])
        .order("created_at", { ascending: false })
        .range(from, to);

      if (mediaError) throw mediaError;

      if (!mediaRows || mediaRows.length === 0) {
        setHasMore(false);
        return;
      }

      const itemsWithSignedUrls = await Promise.all(
        mediaRows.map(async (item) => {
          let signedUrl = "";

          if (item.file_path) {
            try {
              const { data: signedData, error: signedError } =
                await supabase.storage
                  .from("media")
                  .createSignedUrl(item.file_path, 3600);

              if (!signedError && signedData?.signedUrl) {
                signedUrl = signedData.signedUrl;
              }
            } catch (err) {
              console.error("Signed URL error:", err);
            }
          }

          return {
            ...item,
            signedUrl,
          };
        })
      );

      setPortfolioItems((prev) => [...prev, ...itemsWithSignedUrls]);
      setPage((prev) => prev + 1);
      setHasMore(mediaRows.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error loading more portfolio items:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 40, color: "#fff" }}>Loading creator profile...</div>;
  }

  if (!creatorProfile) {
    return (
      <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto", color: "#fff" }}>
        <h1 style={{ marginTop: 0 }}>Creator Profile</h1>
        <p>Creator not found.</p>
        <Link
          to="/creators"
          style={{
            display: "inline-block",
            marginTop: 16,
            color: "#fff",
            textDecoration: "underline",
          }}
        >
          Back to Creators
        </Link>
      </div>
    );
  }

  const displayName = creatorProfile.display_name || "Unnamed Creator";
  const username = creatorProfile.username ? `@${creatorProfile.username}` : null;
  const quote = creatorProfile.quote?.trim();

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto", color: "#fff" }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(20,20,20,0.96), rgba(8,8,8,0.98))",
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            height: 200,
            background: creatorProfile.banner_url
              ? `url(${creatorProfile.banner_url}) center/cover no-repeat`
              : "linear-gradient(135deg, #1b1b1b 0%, #2b1f1f 100%)",
          }}
        />

        <div style={{ padding: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginBottom: 22,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 8,
                }}
              >
                Creator Profile
              </div>

              <h1 style={{ margin: "0 0 6px 0", fontSize: 34 }}>{displayName}</h1>

              {username && (
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 15 }}>
                  {username}
                </div>
              )}

              {quote && (
                <div
                  style={{
                    marginTop: 14,
                    maxWidth: 720,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  “{quote}”
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                to={`/creator/${id}`}
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#fff",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.04)",
                  fontWeight: 600,
                }}
              >
                Back to Profile
              </Link>
            </div>
          </div>

          {portfolioItems.length === 0 ? (
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 20,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              No portfolio items yet.
            </div>
          ) : (
            <>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 14,
                }}
              >
                {portfolioItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/media/${item.id}`}
                    style={{
                      display: "block",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    {item.signedUrl ? (
                      <img
                        src={item.signedUrl}
                        alt="portfolio item"
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 220,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 13,
                        }}
                      >
                        Preview unavailable
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                      cursor: loadingMore ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      opacity: loadingMore ? 0.7 : 1,
                    }}
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}