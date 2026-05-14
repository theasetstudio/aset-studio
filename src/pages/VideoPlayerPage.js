import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideoPlayerPage.css";

const categoryLabels = {
  film: "Feature Presentation",
  films: "Feature Presentation",
  music_video: "Visual Release",
  "music video": "Visual Release",
  interview: "Private Conversation",
  interviews: "Private Conversation",
  hot_take: "Commentary Room",
  "hot take": "Commentary Room",
  studio_release: "Aset Studio Original",
  "studio release": "Aset Studio Original",
  "aset original": "Aset Studio Original",
  red_carpet: "Red Carpet Moment",
  "red carpet": "Red Carpet Moment",
  event: "Red Carpet Moment",
  cinematic: "Aset Cinema Presentation",
};

function getPresentationLabel(video) {
  const rawCategory = (video?.category || "").toLowerCase().trim();

  if (categoryLabels[rawCategory]) return categoryLabels[rawCategory];

  if (video?.is_aset_original) {
    return "Aset Studio Original";
  }

  if (video?.studio_name) {
    return `Presented by ${video.studio_name}`;
  }

  return "Aset Cinema Presentation";
}

function formatCategory(category) {
  if (!category) return "Aset Cinema";

  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPosterPath(video) {
  return (
    video?.poster_url ||
    video?.thumbnail_url ||
    video?.image_url ||
    video?.cover_url ||
    ""
  );
}

function isFullUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

export default function VideoPlayerPage() {
  const { slug } = useParams();

  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [related, setRelated] = useState([]);
  const [moreFromCinema, setMoreFromCinema] = useState([]);
  const [relatedPosters, setRelatedPosters] = useState({});
  const [cinemaPosters, setCinemaPosters] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getSignedUrl(pathOrUrl) {
      if (!pathOrUrl) return "";
      if (isFullUrl(pathOrUrl)) return pathOrUrl;

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(pathOrUrl, 60 * 60);

      if (error) {
        console.error("Signed URL error:", error);
        return "";
      }

      return data?.signedUrl || "";
    }

    async function createPosterMap(items) {
      const entries = await Promise.all(
        (items || []).map(async (item) => {
          const poster = await getSignedUrl(getPosterPath(item));
          return [item.id, poster];
        })
      );

      return Object.fromEntries(entries);
    }

    async function loadVideoPage() {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("slug", slug)
        .eq("type", "video")
        .in("status", ["published", "approved"]);

      if (error || !data || data.length === 0) {
        console.error("Video not found:", error);

        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }

        return;
      }

      const videoData = data[0];

      const isHidden =
        videoData.hidden === true ||
        videoData.is_hidden === true ||
        videoData.published === false ||
        videoData.is_published === false;

      if (isHidden) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }

        return;
      }

      const videoFilePath =
        videoData.watermarked_path || videoData.file_path;

      if (!videoFilePath) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }

        return;
      }

      const signedVideoUrl = await getSignedUrl(videoFilePath);
      const signedPosterUrl = await getSignedUrl(
        getPosterPath(videoData)
      );

      const { data: relatedData } = await supabase
        .from("media_items")
        .select(
          "id, title, slug, category, poster_url, thumbnail_url, image_url, cover_url"
        )
        .eq("type", "video")
        .in("status", ["published", "approved"])
        .eq("category", videoData.category)
        .neq("slug", slug)
        .limit(8);

      const { data: cinemaData } = await supabase
        .from("media_items")
        .select(
          "id, title, slug, category, poster_url, thumbnail_url, image_url, cover_url"
        )
        .eq("type", "video")
        .in("status", ["published", "approved"])
        .neq("slug", slug)
        .limit(10);

      const nextRelatedPosters = await createPosterMap(
        relatedData || []
      );

      const nextCinemaPosters = await createPosterMap(
        cinemaData || []
      );

      if (isMounted) {
        setVideo(videoData);
        setVideoUrl(signedVideoUrl);
        setPosterUrl(signedPosterUrl);
        setRelated(relatedData || []);
        setMoreFromCinema(cinemaData || []);
        setRelatedPosters(nextRelatedPosters);
        setCinemaPosters(nextCinemaPosters);
        setLoading(false);
      }
    }

    loadVideoPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  function renderCinemaCard(item, posterMap) {
    const poster = posterMap[item.id];

    return (
      <Link
        key={item.id}
        to={`/video/${item.slug}`}
        className="video-card-link"
      >
        {poster && (
          <img
            src={poster}
            alt={item.title || "Aset Cinema poster"}
            className="video-card-poster"
          />
        )}

        <div className="video-card-shade" />

        <span>{formatCategory(item.category)}</span>

        <strong>{item.title}</strong>
      </Link>
    );
  }

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

          <p className="video-page-label">
            Aset Cinema Screening Room
          </p>
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
                poster={posterUrl || undefined}
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
          <p className="video-kicker">
            {getPresentationLabel(video)}
          </p>

          <h1>{video.title}</h1>

          {video.category && (
            <p className="video-category">
              {formatCategory(video.category)}
            </p>
          )}

          {video.tagline && (
            <p className="video-description">
              {video.tagline}
            </p>
          )}

          {video.quote && (
            <blockquote className="video-quote">
              “{video.quote}”
            </blockquote>
          )}

          {video.description && (
            <p className="video-description">
              {video.description}
            </p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="video-section">
          <div className="video-section-header">
            <p>Continue Inside This World</p>

            <h2>
              More {formatCategory(video.category)}
            </h2>
          </div>

          <div className="video-row">
            {related.map((item) =>
              renderCinemaCard(item, relatedPosters)
            )}
          </div>
        </section>
      )}

      {moreFromCinema.length > 0 && (
        <section className="video-section">
          <div className="video-section-header">
            <p>The Archive Expands</p>

            <h2>More From Aset Cinema</h2>
          </div>

          <div className="video-row">
            {moreFromCinema.map((item) =>
              renderCinemaCard(item, cinemaPosters)
            )}
          </div>
        </section>
      )}
    </main>
  );
}