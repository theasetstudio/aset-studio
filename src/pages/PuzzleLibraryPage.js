import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedPuzzles, getSignedMediaUrl } from "../lib/asetLoungeApi";

export default function PuzzleLibraryPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPuzzles() {
      try {
        const rows = await getPublishedPuzzles();

        const withImages = await Promise.all(
          rows.map(async (puzzle) => {
            const previewUrl = await getSignedMediaUrl(puzzle.preview_path);
            return {
              ...puzzle,
              previewUrl,
            };
          })
        );

        setPuzzles(withImages);
      } catch (error) {
        console.error("Error loading puzzles:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPuzzles();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Loading puzzles...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Puzzle Library</h1>

      {puzzles.length === 0 ? (
        <p>No published puzzles yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {puzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              {puzzle.previewUrl ? (
                <img
                  src={puzzle.previewUrl}
                  alt={puzzle.title}
                  style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "8px" }}
                />
              ) : (
                <div style={{ height: "220px", borderRadius: "8px", background: "#222" }} />
              )}

              <h3 style={{ marginTop: "12px" }}>{puzzle.title}</h3>
              <p>{puzzle.puzzle_type}</p>
              <p>{puzzle.difficulty}</p>

              <Link to={`/aset-lounge/puzzle/${puzzle.slug}`}>Open Puzzle</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
