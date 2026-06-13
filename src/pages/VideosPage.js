import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideosPage.css";

const SIGNED_URL_TTL_SECONDS = 600;

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function isVideoFile(path) {
  const value = norm(path);

  return (
    value.endsWith(".mp4") ||
    value.endsWith(".mov") ||
    value.endsWith(".webm")
  );
}

function displayTitle(video) {
  return (
    clean(video?.title) ||
    clean(video?.tagline) ||
    clean(video?.quote) ||
    "Aset Cinema Presentation"
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await loadVideos();
    }

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getSignedUrl(path) {
    const cleanPath = clean(path).replace(/^\/+/, "");
    if (!cleanPath) return "";

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      console.error("Signed URL Error:", error);
      return "";
    }

    return data.signedUrl;
  }

  async function loadVideos() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("status", "published")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const safeVideos = (data || []).filter((item) => {
        const filePath = clean(item.file_path);
        const watermarkedPath = clean(item.watermarked_path);

        return isVideoFile(filePath) || isVideoFile(watermarkedPath);
      });

      const urlEntries = await Promise.all(
        safeVideos.map(async (video) => {
          const path = video.watermarked_path || video.file_path || "";
          const signedUrl = await getSignedUrl(path);
          return [video.id, signedUrl];
        })
      );

      setVideos(safeVideos);
      setFeaturedVideo(safeVideos[0] || null);
      setPreviewUrls(Object.fromEntries(urlEntries));
    } catch (error) {
      console.error("Video Fetch Error:", error);
      setVideos([]);
      setFeaturedVideo(null);
      setPreviewUrls({});
    } finally {
      setLoading(false);
    }
  }

  function uniqueVideos(items) {
    const seen = new Set();

    return items.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function matches(video, terms) {
    const text = `${video.category || ""} ${video.title || ""} ${
      video.description || ""
    } ${video.tagline || ""}`.toLowerCase();

    return terms.some((term) => text.includes(term));
  }

  const cinematicReleases = videos.filter((video) =>
    matches(video, ["cinematic", "release", "screening", "portrait"])
  );

  const interviews = uniqueVideos(
    videos.filter((video) =>
      matches(video, ["interview", "conversation", "private"])
    )
  );

  const hotTakes = videos.filter((video) =>
    matches(video, ["hot", "take", "commentary", "reaction"])
  );

  const films = videos.filter((video) =>
    matches(video, ["film", "movie", "original"])
  );

  const musicVideos = videos.filter((video) =>
    matches(video, ["music", "performance", "visual"])
  );

  const studioReleases = videos.filter((video) =>
    matches(video, ["studio_release", "studio release", "studio"])
  );

  const redCarpet = videos.filter((video) =>
    matches(video, ["red carpet", "event", "premiere", "coverage"])
  );

  const releaseRooms = [
    {
      title: "Cinematic Releases",
      subtitle: "FEATURED CINEMA",
      message: "Cinematic releases are being prepared.",
      items: cinematicReleases,
    },
    {
      title: "Interviews",
      subtitle: "PRIVATE CONVERSATIONS",
      message: "Interview features are being prepared.",
      items: interviews,
    },
    {
      title: "Hot Takes",
      subtitle: "COMMENTARY ROOM",
      message: "Hot Takes are being prepared.",
      items: hotTakes,
    },
    {
      title: "Films",
      subtitle: "ASET ORIGINALS",
      message: "Film releases are being prepared.",
      items: films,
    },
    {
      title: "Music Videos",
      subtitle: "PERFORMANCE VISUALS",
      message: "Music video releases are being prepared.",
      items: musicVideos,
    },
    {
      title: "Studio Releases",
      subtitle: "STUDIO RELEASES",
      message: "Studio releases are being prepared.",
      items: studioReleases.length > 0 ? studioReleases : videos,
    },
    {
      title: "Red Carpet",
      subtitle: "EVENT COVERAGE",
      message: "Red carpet moments are being prepared.",
      items: redCarpet,
    },
  ];

  function renderMiniCards(items) {
    const previewItems = items.slice(0, 4);

    if (previewItems.length > 0) {
      return previewItems.map((video) => {
        const previewUrl = previewUrls[video.id] || "";

        return (
          <Link
            key={video.id}
            to={`/media/${video.id}`}
            className="release-mini-card"
          >
            {previewUrl ? (
              <video
                src={previewUrl}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <span />
            )}
          </Link>
        );
      });
    }

    return [1, 2, 3, 4].map((item) => (
      <div className="release-mini-card" key={item}>
        <span />
      </div>
    ));
  }

  function renderReleaseRoom(room) {
    return (
      <section className="release-room" key={room.title}>
        <div className="release-room-copy">
          <p>{room.subtitle}</p>
          <h2>{room.title}</h2>
          <span>{room.items.length > 0 ? "Open the room." : room.message}</span>
        </div>

        <div className="release-room-preview">{renderMiniCards(room.items)}</div>

        <div className="release-room-arrow">›</div>
      </section>
    );
  }

  return (
    <main className="videos-page">
      <section className="cinema-layout">
        <div className="cinema-left-panel">
          <p className="cinema-kicker">THE ASET STUDIO PRESENTS</p>

          <h1>Aset Cinema</h1>

          <p className="cinema-description">
            A curated screening room for interviews, cinematic releases, studio
            originals, performances, red carpet moments, and the world built
            around Aset.
          </p>

          <div className="cinema-buttons">
            <Link to="/videos" className="cinema-main-button">
              Enter Aset Cinema
            </Link>

            <Link to="/videos" className="cinema-secondary-button">
              Studio Originals
            </Link>

            <Link to="/videos" className="cinema-secondary-button">
              Private Screenings
            </Link>
          </div>
        </div>

        <div className="cinema-right-panel">
          {featuredVideo && (
            <section className="featured-cinema-card">
              <div className="featured-cinema-content">
                <p>FEATURED SCREENING</p>

                <h2>{displayTitle(featuredVideo)}</h2>

                <span>
                  A curated cinematic presentation inside The Aset Studio
                  screening environment.
                </span>

                <Link
                  to={`/media/${featuredVideo.id}`}
                  className="featured-watch-link"
                >
                  Watch Screening
                </Link>
              </div>

              <div className="featured-cinema-image">
                {previewUrls[featuredVideo.id] ? (
                  <video
                    src={previewUrls[featuredVideo.id]}
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="featured-cinema-fallback">Aset Cinema</div>
                )}
              </div>
            </section>
          )}

          <section className="release-rooms-panel">
            <div className="release-rooms-heading">
              <div>
                <p>NOW SCREENING</p>
                <h2>Cinema Release Rooms</h2>
                <span>
                  Explore release lanes across The Aset Studio screening
                  environment.
                </span>
              </div>

              <Link to="/" className="return-link">
                Return to Studio →
              </Link>
            </div>

            <div className="release-rooms-list">
              {releaseRooms.map(renderReleaseRoom)}
            </div>
          </section>
        </div>
      </section>

      {loading && (
        <div className="videos-loading">Loading cinema experience...</div>
      )}
    </main>
  );
}