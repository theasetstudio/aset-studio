import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./VideosPage.css";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line
  }, []);

  async function getSignedUrl(path) {
    if (!path) return null;

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(path, 60 * 60);

    if (error) {
      console.error("Signed URL Error:", error);
      return null;
    }

    return data?.signedUrl || null;
  }

  async function loadVideos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("media_items")
      .select("*")
      .eq("type", "video")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Video Fetch Error:", error);
      setVideos([]);
      setFeaturedVideo(null);
      setLoading(false);
      return;
    }

    const visibleVideos = (data || []).filter((video) => !video.hidden);

    const formattedVideos = await Promise.all(
      visibleVideos.map(async (video) => {
        const posterPath =
          video.poster_path ||
          video.thumbnail_path ||
          video.image_path ||
          null;

        const posterUrl = await getSignedUrl(posterPath);

        return {
          ...video,
          displayTitle: video.title,
          displayCategory: video.category,
          posterUrl,
        };
      })
    );

    setFeaturedVideo(formattedVideos[0] || null);
    setVideos(formattedVideos);
    setLoading(false);
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
    }`.toLowerCase();

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

  const studioReleases = videos;

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
      items: studioReleases,
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
      return previewItems.map((video) => (
        <Link
          key={video.id}
          to={video.slug ? `/video/${video.slug}` : "/videos"}
          className="release-mini-card"
        >
          {video.posterUrl ? (
            <img
              src={video.posterUrl}
              alt={video.displayTitle || video.title || "Aset Cinema"}
            />
          ) : (
            <span />
          )}
        </Link>
      ));
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
          <span>{room.message}</span>
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

                <h2>
                  {featuredVideo.displayTitle ||
                    featuredVideo.title ||
                    "Aset Cinema Feature"}
                </h2>

                <span>
                  A curated cinematic presentation inside The Aset Studio
                  screening environment.
                </span>

                <Link
                  to={featuredVideo.slug ? `/video/${featuredVideo.slug}` : "/videos"}
                  className="featured-watch-link"
                >
                  Watch Screening
                </Link>
              </div>

              <div className="featured-cinema-image">
                {featuredVideo.posterUrl ? (
                  <img
                    src={featuredVideo.posterUrl}
                    alt={
                      featuredVideo.displayTitle ||
                      featuredVideo.title ||
                      "Aset Cinema"
                    }
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