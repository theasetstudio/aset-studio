import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ExpressionVaultPage() {
  const [pieces, setPieces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVault() {
      setLoading(true);

      const { data, error } = await supabase
        .from("expression_vault")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Vault fetch error:", error);
        setPieces([]);
        setSelectedPieceId(null);
        setLoading(false);
        return;
      }

      const items = data || [];
      setPieces(items);
      setSelectedPieceId(items[0]?.id || null);
      setLoading(false);
    }

    fetchVault();
  }, []);

  const categories = useMemo(() => {
    const dynamic = [...new Set(pieces.map((piece) => piece.category).filter(Boolean))];
    return ["All", ...dynamic];
  }, [pieces]);

  const visiblePieces = useMemo(() => {
    if (selectedCategory === "All") return pieces;
    return pieces.filter((piece) => piece.category === selectedCategory);
  }, [pieces, selectedCategory]);

  const selectedPiece =
    visiblePieces.find((piece) => piece.id === selectedPieceId) ||
    visiblePieces[0] ||
    null;

  function handleCategoryChange(event) {
    const nextCategory = event.target.value;
    setSelectedCategory(nextCategory);

    const nextVisible =
      nextCategory === "All"
        ? pieces
        : pieces.filter((piece) => piece.category === nextCategory);

    setSelectedPieceId(nextVisible[0]?.id || null);
  }

  function handleCardClick(pieceId) {
    setSelectedPieceId(pieceId);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#f5f1eb",
          padding: "80px 20px 60px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            The Expression Vault
          </h1>
          <p style={{ color: "rgba(245, 241, 235, 0.75)" }}>
            Loading Expression Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050505 0%, #0b0b0d 45%, #111114 100%)",
        color: "#f5f1eb",
        padding: "80px 20px 60px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "42px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "24px",
            padding: "36px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#b8aa92",
            }}
          >
            The Studio
          </p>

          <h1
            style={{
              marginTop: "14px",
              marginBottom: "16px",
              fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            The Expression Vault
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "rgba(245, 241, 235, 0.78)",
            }}
          >
            A cinematic archive of language, emotion, and atmosphere. The
            Expression Vault holds curated pieces from The Aset Studio’s
            signature voice while preparing space for future community
            expression.
          </p>
        </div>

        <section style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.7rem",
                  fontWeight: 600,
                }}
              >
                Featured Vault
              </h2>
              <p
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  color: "rgba(245, 241, 235, 0.7)",
                  lineHeight: 1.7,
                }}
              >
                Click a card to open that piece below.
              </p>
            </div>

            <div style={{ minWidth: "180px" }}>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#f5f1eb",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    style={{ color: "#000" }}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visiblePieces.length === 0 ? (
            <div
              style={{
                borderRadius: "20px",
                padding: "22px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(245, 241, 235, 0.72)",
              }}
            >
              No published pieces found in this category yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {visiblePieces.map((piece) => {
                const isActive = selectedPiece?.id === piece.id;

                return (
                  <button
                    key={piece.id}
                    type="button"
                    onClick={() => handleCardClick(piece.id)}
                    style={{
                      borderRadius: "22px",
                      padding: "24px",
                      background: isActive
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.03)",
                      border: isActive
                        ? "1px solid rgba(214,195,165,0.55)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? "0 16px 34px rgba(0,0,0,0.30)"
                        : "0 12px 30px rgba(0,0,0,0.22)",
                      textAlign: "left",
                      color: "#f5f1eb",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        marginBottom: "14px",
                        fontSize: "11px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#c8b79d",
                      }}
                    >
                      Featured Vault
                    </div>

                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        fontSize: "1.35rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {piece.title}
                    </h3>

                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: "16px",
                        color: "rgba(245, 241, 235, 0.78)",
                        lineHeight: 1.8,
                      }}
                    >
                      {piece.excerpt || "No excerpt added yet."}
                    </p>

                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontSize: "0.88rem",
                        color: "#e9dcc9",
                      }}
                    >
                      {piece.category || "Uncategorized"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section style={{ marginBottom: "42px", marginTop: "18px" }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              fontSize: "1.7rem",
              fontWeight: 600,
            }}
          >
            Vault Categories
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {categories.map((category) => (
              <div
                key={category}
                style={{
                  padding: "10px 16px",
                  borderRadius: "999px",
                  border:
                    selectedCategory === category
                      ? "1px solid rgba(214,195,165,0.55)"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    selectedCategory === category
                      ? "rgba(214,195,165,0.12)"
                      : "rgba(255,255,255,0.03)",
                  color: "rgba(245, 241, 235, 0.88)",
                  fontSize: "0.92rem",
                }}
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginBottom: "42px",
            borderRadius: "24px",
            padding: "30px 24px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          }}
        >
          {selectedPiece ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#c8b79d",
                    }}
                  >
                    Open Piece
                  </p>

                  <h2
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      fontSize: "2rem",
                      lineHeight: 1.1,
                      fontWeight: 600,
                    }}
                  >
                    {selectedPiece.title}
                  </h2>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "0.88rem",
                    color: "#e9dcc9",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedPiece.category || "Uncategorized"}
                </div>
              </div>

              <div
                style={{
                  maxWidth: "760px",
                  color: "rgba(245, 241, 235, 0.92)",
                  fontSize: "1.08rem",
                  lineHeight: 2,
                  whiteSpace: "pre-line",
                }}
              >
                {selectedPiece.content}
              </div>
            </>
          ) : (
            <div
              style={{
                color: "rgba(245, 241, 235, 0.72)",
              }}
            >
              No piece selected.
            </div>
          )}
        </section>

        <section
          style={{
            borderRadius: "24px",
            padding: "30px 24px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "14px",
              fontSize: "1.7rem",
              fontWeight: 600,
            }}
          >
            Community Vault
          </h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              maxWidth: "760px",
              color: "rgba(245, 241, 235, 0.72)",
              lineHeight: 1.8,
            }}
          >
            Community posting is planned for a future phase. For now, this
            vault is being established as a cinematic archive with curated
            expression from The Aset Studio.
          </p>

          <div
            style={{
              padding: "18px 16px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.14)",
              color: "rgba(245, 241, 235, 0.75)",
            }}
          >
            Future expansion: user submissions, profile-linked pieces, moderated
            publishing flow, premium locked collections, and admin-managed
            vault publishing.
          </div>
        </section>

        <div style={{ marginTop: "28px" }}>
          <Link
            to="/"
            style={{
              color: "#d6c3a5",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}