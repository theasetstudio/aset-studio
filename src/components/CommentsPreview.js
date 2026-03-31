import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CommentsPreview({ mediaId, onOpen }) {
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!mediaId) return;
    setLoading(true);

    // count
    const { count: cCount } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("media_id", mediaId);

    // latest 2
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at")
      .eq("media_id", mediaId)
      .order("created_at", { ascending: false })
      .limit(2);

    setCount(cCount || 0);
    setLatest(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onOpen}>
          {loading ? "Comments..." : `Comments (${count})`}
        </button>
      </div>

      {latest.length > 0 && (
        <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
          {latest.map((c) => (
            <div key={c.id} style={{ fontSize: 12, opacity: 0.85 }}>
              {c.content.length > 70 ? c.content.slice(0, 70) + "…" : c.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
