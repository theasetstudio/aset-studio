import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getMyCreations, getSignedMediaUrl } from "../lib/asetLoungeApi";

export default function MyCreationsPage() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreations() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const rows = await getMyCreations(user.id);

        const withImages = await Promise.all(
          rows.map(async (creation) => {
            const previewPath =
              creation.final_image_path || creation.puzzles?.preview_path || null;

            const imageUrl = previewPath
              ? await getSignedMediaUrl(previewPath)
              : null;

            return {
              ...creation,
              imageUrl,
            };
          })
        );

        setCreations(withImages);
      } catch (error) {
        console.error("Error loading creations:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCreations();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Loading creations...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>My Creations</h1>

      {creations.length === 0 ? (
        <p>No saved creations yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {creations.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.puzzles?.title || "Creation"}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "220px",
                    borderRadius: "8px",
                    background: "#222",
                  }}
                />
              )}

              <h3 style={{ marginTop: "12px" }}>
                {item.puzzles?.title || "Untitled Creation"}
              </h3>
              <p>Visibility: {item.visibility}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

