import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function InterviewCorner() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  async function fetchInterviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("interviews")
      .select(`
        id,
        title,
        excerpt,
        interview_assets (
          id,
          asset_type,
          file_path,
          watermarked_path
        )
      `)
      .eq("is_hidden", false)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInterviews(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading interviews…</p>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
      <h1>Interview Corner</h1>
      <p style={{ color: "#666" }}>
        Vlog-style interviews (video + optional images).
      </p>

      {interviews.length === 0 && (
        <p>No interviews yet.</p>
      )}

      {interviews.map((interview) => {
        const images = interview.interview_assets?.filter(
          (a) => a.asset_type === "image"
        ) || [];

        const videos = interview.interview_assets?.filter(
          (a) => a.asset_type === "video"
        ) || [];

        return (
          <div
            key={interview.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginTop: 30
            }}
          >
            <h2>{interview.title}</h2>

            {interview.excerpt && (
              <p style={{ color: "#555" }}>{interview.excerpt}</p>
            )}

            {/* VIDEO (future-ready) */}
            {videos.length > 0 && (
              <video
                controls
                style={{ width: "100%", borderRadius: 12, marginTop: 15 }}
                src={videos[0].file_path}
              />
            )}

            {/* IMAGE FALLBACK */}
            {videos.length === 0 && images.length > 0 && (
              <img
                src={images[0].watermarked_path}
                alt={interview.title}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginTop: 15
                }}
              />
            )}

            {/* NO MEDIA */}
            {videos.length === 0 && images.length === 0 && (
              <p style={{ color: "#999", marginTop: 15 }}>
                No media uploaded yet.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}



     
               