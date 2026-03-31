// src/components/ReviewPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ReviewPage() {
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApproved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApproved = async () => {
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase
      .from("service_reviews")
      .select("id, rating, comment, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setStatus("Failed to load reviews. Please refresh and try again.");
      setApprovedReviews([]);
      setLoading(false);
      return;
    }

    setApprovedReviews(data || []);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return approvedReviews;
    return approvedReviews.filter((r) => String(r?.comment || "").toLowerCase().includes(q));
  }, [approvedReviews, search]);

  const clampRating = (rating) => {
    const n = Number(rating);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5, Math.round(n)));
  };

  const renderStars = (rating) => {
    const r = clampRating(rating);
    return "★★★★★☆☆☆☆☆".slice(5 - r, 10 - r);
  };

  const GOLD = "rgba(212,175,55,1)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070a",
        color: "#f2f0ea",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              opacity: 0.9,
              fontSize: 13,
              letterSpacing: "0.18em",
            }}
          >
            ← HOME
          </Link>

          <Link
            to="/gallery"
            style={{
              textDecoration: "none",
              color: "inherit",
              opacity: 0.9,
              fontSize: 13,
              letterSpacing: "0.18em",
            }}
          >
            ENTER THE ASET STUDIO GALLERY →
          </Link>
        </div>

        {/* Title */}
        <div style={{ marginTop: 18 }}>
          <div style={{ letterSpacing: "0.22em", fontSize: 12, opacity: 0.8 }}>
            THE ASET STUDIO
          </div>

          <h1
            style={{
              margin: "10px 0 8px",
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: "0.04em",
              fontWeight: 600,
              fontSize: "clamp(28px, 3.4vw, 44px)",
              lineHeight: 1.12,
            }}
          >
            Reviews &amp; Testimonies
          </h1>

          <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.6, maxWidth: 760 }}>
            Verified experiences with the platform, the website, and our services — curated and
            approved before display.
          </p>
        </div>

        {/* Accent line */}
        <div
          style={{
            height: 1,
            marginTop: 18,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: 0.25,
          }}
        />

        {/* Controls */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search testimonies…"
            style={{
              flex: "1 1 280px",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid rgba(212,175,55,0.18)",
              background: "rgba(0,0,0,0.45)",
              color: "#f2f0ea",
              outline: "none",
            }}
          />

          <button
            type="button"
            onClick={fetchApproved}
            style={{
              padding: "10px 14px",
              borderRadius: 14,
              border: "1px solid rgba(212,175,55,0.28)",
              background: "rgba(212,175,55,0.10)",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            Refresh
          </button>
        </div>

        {/* Status / loading */}
        {status ? (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,0,0,0.22)",
              background: "rgba(255,0,0,0.06)",
              fontSize: 13,
              whiteSpace: "pre-wrap",
            }}
          >
            {status}
          </div>
        ) : null}

        {loading ? <div style={{ marginTop: 18, opacity: 0.85 }}>Loading…</div> : null}

        {/* Empty */}
        {!loading && filtered.length === 0 ? (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 18,
              border: "1px solid rgba(212,175,55,0.18)",
              background: "rgba(0,0,0,0.45)",
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            No approved reviews yet.
          </div>
        ) : null}

        {/* List */}
        {!loading && filtered.length > 0 ? (
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            {filtered.map((review) => {
              const rating = clampRating(review.rating);

              return (
                <div
                  key={review.id}
                  style={{
                    border: "1px solid rgba(212,175,55,0.15)",
                    borderRadius: 18,
                    padding: 16,
                    background: "rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: 700, letterSpacing: "0.04em" }}>
                      {rating > 0 ? (
                        <>
                          {renderStars(rating)}{" "}
                          <span style={{ opacity: 0.7, fontWeight: 600 }}>
                            ({rating}/5)
                          </span>
                        </>
                      ) : (
                        <span style={{ opacity: 0.75 }}>Testimony</span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.65 }}>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      opacity: 0.92,
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {review.comment}
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                      opacity: 0.18,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Footer */}
        <div style={{ marginTop: 28, opacity: 0.65, fontSize: 12 }}>
          Reviews are moderated and displayed after approval.
        </div>
      </div>
    </div>
  );
}