// src/pages/FeaturedPage.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function norm(v) {
  return String(v || "").trim().toLowerCase();
}

function hasFeaturedTag(tags) {
  if (!tags) return false;
  if (!Array.isArray(tags)) return false;
  return tags.map(norm).includes("featured");
}

export default function FeaturedPage() {
  const [items, setItems] = useState([]);
  const [urlById, setUrlById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFeatured() {
    setLoading(true);

    const { data, error } = await supabase
      .from("media_items")
      .select("id, created_at, title, tagline, tags, file_path, watermarked_path, access_level, hidden, status, category")
      .eq("status", "approved")
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Featured load error:", error);
      setItems([]);
      setUrlById({});
      setLoading(false);
      return;
    }

    const featured = (data || []).filter((row) => hasFeaturedTag(row.tags));
    setItems(featured);

    // Build signed URLs
    const map = {};
    for (const row of featured) {
      const path = row.file_path;
      if (!path) continue;

      const { data: signed, error: signErr } = await supabase.storage
        .from("media")
        .createSignedUrl(path, 60 * 60); // 1 hour

      if (signErr) {
        console.warn("Signed URL error:", signErr);
        continue;
      }

      map[row.id] = signed?.signedUrl || null;
    }

    setUrlById(map);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
        <h1 style={{ marginBottom: 10 }}>Featured</h1>
        <div style={{ opacity: 0.75, fontSize: 13 }}>
          Curated releases. Add the tag <b>featured</b> in Admin to show it here.
        </div>
      </div>

      {loading ? <p>Loading featured work…</p> : null}

      {!loading && items.length === 0 ? <p>No featured items yet.</p> : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 16,
          marginTop: 14,
        }}
      >
        {items.map((item) => {
          const imgUrl = urlById[item.id];

          return (
            <Link
              key={item.id}
              to={`/media/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "4 / 5", background: "rgba(255,255,255,0.04)" }}>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={item.title || ""}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div style={{ padding: 14, opacity: 0.7 }}>Image unavailable</div>
                  )}
                </div>

                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                    {item.title || "Untitled"}
                  </div>
                  {item.tagline ? (
                    <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
                      {item.tagline}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.55, marginTop: 6, fontSize: 12 }}>
                      —
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}