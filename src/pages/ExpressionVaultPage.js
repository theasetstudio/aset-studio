import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ExpressionVaultPage() {
  const [pieces, setPieces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM SUPABASE
  useEffect(() => {
    async function fetchVault() {
      const { data, error } = await supabase
        .from("expression_vault")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Vault fetch error:", error);
        return;
      }

      setPieces(data || []);
      setSelectedPieceId(data?.[0]?.id || null);
      setLoading(false);
    }

    fetchVault();
  }, []);

  // 🔥 DYNAMIC CATEGORIES
  const categories = useMemo(() => {
    const base = ["All"];
    const dynamic = [...new Set(pieces.map((p) => p.category).filter(Boolean))];
    return [...base, ...dynamic];
  }, [pieces]);

  const visiblePieces = useMemo(() => {
    if (selectedCategory === "All") return pieces;
    return pieces.filter((p) => p.category === selectedCategory);
  }, [pieces, selectedCategory]);

  const selectedPiece =
    visiblePieces.find((p) => p.id === selectedPieceId) ||
    visiblePieces[0] ||
    null;

  if (loading) {
    return (
      <div style={{ padding: "60px", color: "white" }}>
        Loading Expression Vault...
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
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          The Expression Vault
        </h1>

        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            const next = pieces.filter(
              (p) =>
                e.target.value === "All" || p.category === e.target.value
            );
            setSelectedPieceId(next[0]?.id || null);
          }}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* PIECES */}
        <div style={{ marginTop: "40px" }}>
          {visiblePieces.map((piece) => (
            <div
              key={piece.id}
              onClick={() => setSelectedPieceId(piece.id)}
              style={{
                padding: "20px",
                marginBottom: "12px",
                cursor: "pointer",
                border:
                  piece.id === selectedPieceId
                    ? "1px solid gold"
                    : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3>{piece.title}</h3>
              <p>{piece.excerpt}</p>
            </div>
          ))}
        </div>

        {/* FULL PIECE */}
        {selectedPiece && (
          <div style={{ marginTop: "40px", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            <h2>{selectedPiece.title}</h2>
            <p>{selectedPiece.content}</p>
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <Link to="/" style={{ color: "#d6c3a5" }}>
            ← Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}