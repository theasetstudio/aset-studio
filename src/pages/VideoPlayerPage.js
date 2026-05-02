import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideoPlayerPage.css";

const categoryLabels = {
  film: "Feature Presentation",
  films: "Feature Presentation",
  "music video": "Visual Release",
  "music videos": "Visual Release",
  interview: "Private Conversation",
  interviews: "Private Conversation",
  "studio release": "Aset Studio Original",
  "aset original": "Aset Studio Original",
  "red carpet": "Red Carpet Moment",
  event: "Red Carpet Moment",
};

function getPresentationLabel(video) {
  const rawCategory = (video?.category || "").toLowerCase().trim();

  if (categoryLabels[rawCategory]) {
    return categoryLabels[rawCategory];
  }

  if (video?.is_aset_original) {
    return "Aset Studio Original";
  }

  if (video?.studio_name) {
    return `Presented by ${video.studio_name}`;
  }

  return "Aset Cinema Presentation";
}

export default function VideoPlayerPage() {
  const { slug } = useParams();

  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [related, setRelated] = useState([]);
  const [moreFromCinema, setMoreFromCinema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadVideoPage() {
      setLoading(true);
      setNotFound(false);
      setVideo(null);
      setVideoUrl("");
      setRelated([]);
      setMoreFromCinema([]);

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("slug", slug)
        .eq("type", "video")
        .eq("status", "approved")
        .single();

      if (error || !data) {
        console.error("Video not found:", error);
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }

      const isHidden =
        data.hidden === true ||
        data.is_hidden === true ||
        data.published === false ||
        data.is_published === false;

      if (isHidden) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from("media")
        .createSignedUrl(data.file_path, 60 * 60);

      if (signedError) {
        console.error("Signed URL error:", signedError);
      }

      const { data: relatedData } = await supabase
        .from("media_items")
        .select("id, title, slug, category")
        .eq("type", "video")
        .eq("status", "approved")
        .eq("category", data.category)
        .neq("slug", slug)
        .limit(8);

      const { data: cinemaData } = await supabase
        .from("media_items")
        .select("id, title, slug, category")
        .eq("type", "video")
        .eq("status", "approved")
        .neq("slug", slug)
        .limit(10);

      if (isMounted) {
        setVideo(data);
        setVideoUrl(signedData?.signedUrl || "");
        setRelated(relatedData || []);
        setMoreFromCinema(cinemaData || []);
        setLoading(false);
      }
    }

    loadVideoPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="video-player-page">
        <section className="video-state-panel">
          <p>Preparing Aset Cinema...</p>
        </section>
      </main>
    );
  }

  if (notFound || !video) {
    return (
      <main className="video-player-page">
        <section className="video-state-panel">
          <p>This presentation is not available.</p>
          <Link to="/videos" className="video-return-link">
            Return to Aset Cinema
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="video-player-page">
      <section className="video-hero">
        <div className="video-hero-top">
          <Link to="/videos" className="video-back-link">
            ← Back to Aset Cinema
          </Link>

          <p className="video-page-label">Aset Cinema</p>
        </div>

        <div className="video-stage">
          <div className="video-frame">
            {videoUrl ? (
              <video
                className="main-video"
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="video-state-panel embedded">
                <p>Video playback is unavailable.</p>
              </div>
            )}
          </div>

          <aside className="aset-guide-video">
            <video
              src="/videos/aset-cinema-guide.mp4"
              controls
              muted
              playsInline
              preload="metadata"
            />
            <p>Inside Aset Cinema</p>
          </aside>
        </div>

        <div className="video-details">
          <p className="video-kicker">{getPresentationLabel(video)}</p>

          <h1>{video.title}</h1>

          {video.category && (
            <p className="video-category">{video.category}</p>
          )}

          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="video-section">
          <div className="video-section-header">
            <p>Curated by category</p>
            <h2>Continue Watching</h2>
          </div>

          <div className="video-row">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/video/${item.slug}`}
                className="video-card-link"
              >
                <span>{item.category || "Aset Cinema"}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      {moreFromCinema.length > 0 && (
        <section className="video-section">
          <div className="video-section-header">
            <p>The archive continues</p>
            <h2>More from Aset Cinema</h2>
          </div>

          <div className="video-row">
            {moreFromCinema.map((item) => (
              <Link
                key={item.id}
                to={`/video/${item.slug}`}
                className="video-card-link"
              >
                <span>{item.category || "Studio Release"}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}