import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPuzzleBySlug, getSignedMediaUrl } from "../lib/asetLoungeApi";

export default function PuzzlePlayPage() {
  const { slug } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [lineartUrl, setLineartUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPuzzle() {
      try {
        const row = await getPuzzleBySlug(slug);
        setPuzzle(row);

        const signed = await getSignedMediaUrl(row.lineart_path);
        setLineartUrl(signed);
      } catch (error) {
        console.error("Error loading puzzle:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPuzzle();
  }, [slug]);

  if (loading) return <div style={{ padding: "24px" }}>Loading puzzle...</div>;
  if (!puzzle) return <div style={{ padding: "24px" }}>Puzzle not found.</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>{puzzle.title}</h1>
      <p>Type: {puzzle.puzzle_type}</p>
      <p>Difficulty: {puzzle.difficulty}</p>
      <p>This page is the gameplay shell. We will add the real puzzle engine next.</p>

      {lineartUrl && (
        <img
          src={lineartUrl}
          alt={puzzle.title}
          style={{ maxWidth: "100%", marginTop: "20px", borderRadius: "12px" }}
        />
      )}

      <pre
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "#111",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(
          {
            palette_data: puzzle.palette_data,
            symbol_map: puzzle.symbol_map,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

