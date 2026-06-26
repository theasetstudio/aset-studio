import React, { useCallback, useEffect, useMemo, useState } from "react";
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

function safariFrame(url) {
  return url ? `${url}#t=0.1` : "";
}

function textPool(item) {
  return `${item.category || ""} ${item.section || ""} ${
    item.collection || ""
  } ${item.type || ""} ${item.title || ""} ${item.description || ""} ${
    item.tagline || ""
  } ${item.quote || ""}`.toLowerCase();
}

function matches(item, terms) {
  const text = textPool(item);
  return terms.some((term) => text.includes(term));
}

function isGalleryOnly(item) {
  const text = textPool(item);

  return (
    text.includes("gallery") ||
    text.includes("visual art") ||
    text.includes("image gallery") ||
    text.includes("ai video") ||
    text.includes("ai visual") ||
    text.includes("experiment") ||
    text.includes("mood piece")
  );
}

function isApprovedForCinema(item) {
  const text = textPool(item);

  return (
    item.show_in_cinema === true ||
    item.cinema_approved === true ||
    item.is_cinema === true ||
    text.includes("aset cinema") ||
    text.includes("cinema release") ||
    text.includes("studio original") ||
    text.includes("official screening")
  );
}

function uniqueItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export default function VideosPage() {
  const [cinemaItems, setCinemaItems] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [loading, setLoading] = useState(true);

  const getSignedUrl = useCallback(async (path) => {
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
  }, []);

  const loadCinemaItems = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("status", "published")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const approvedCinemaItems = (data || []).filter((item) => {
        const filePath = clean(item.file_path);
        const watermarkedPath = clean(item.watermarked_path);

        return (
          (isVideoFile(filePath) || isVideoFile(watermarkedPath)) &&
          isApprovedForCinema(item) &&
          !isGalleryOnly(item)
        );
      });

      const urlEntries = await Promise.all(
        approvedCinemaItems.map(async (item) => {
          const path = item.watermarked_path || item.file_path || "";
          const signedUrl = await getSignedUrl(path);
          return [item.id, signedUrl];
        })
      );

      setCinemaItems(approvedCinemaItems);
      setPreviewUrls(Object.fromEntries(urlEntries));
    } catch (error) {
      console.error("Cinema Fetch Error:", error);
      setCinemaItems([]);
      setPreviewUrls({});
    } finally {
      setLoading(false);
    }
  }, [getSignedUrl]);

  useEffect(() => {
    loadCinemaItems();
  }, [loadCinemaItems]);

  const releaseRooms = useMemo(() => {
    return [
      {
        title: "Cinematic Releases",
        subtitle: "FEATURED CINEMA",
        message: "Curated cinematic releases are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, [
              "cinematic",
              "cinema release",
              "screening",
              "official screening",
            ])
          )
        ),
      },
      {
        title: "Interviews",
        subtitle: "PRIVATE CONVERSATIONS",
        message: "Interview features are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, ["interview", "conversation", "private"])
          )
        ),
      },
      {
        title: "Performance Room",
        subtitle: "MONOLOGUES & READS",
        message: "Monologue performances are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, [
              "monologue",
              "performance room",
              "actor",
              "acting",
              "audition",
              "character read",
              "script reading",
              "scene study",
              "self tape",
            ])
          )
        ),
      },
      {
        title: "Hot Takes",
        subtitle: "COMMENTARY ROOM",
        message: "Hot Takes are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, ["hot take", "commentary", "reaction"])
          )
        ),
      },
      {
        title: "Films",
        subtitle: "FEATURE FILMS & SHORTS",
        message: "Film releases are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, [
              "film",
              "movie",
              "short film",
              "feature film",
              "independent film",
            ])
          )
        ),
      },
      {
        title: "Comedy Corner",
        subtitle: "LAUGHTER LIVES HERE",
        message: "Comedy Corner is coming soon.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, [
              "comedy",
              "stand up",
              "stand-up",
              "standup",
              "sketch",
              "comedian",
            ])
          )
        ),
      },
      {
        title: "Music Videos",
        subtitle: "PERFORMANCE VISUALS",
        message: "Music video releases are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, ["music video", "performance visual"])
          )
        ),
      },
      {
        title: "Studio Releases",
        subtitle: "STUDIO ORIGINALS",
        message: "Studio releases are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, [
              "studio release",
              "studio_release",
              "studio original",
            ])
          )
        ),
      },
      {
        title: "Red Carpet",
        subtitle: "EVENT COVERAGE",
        message: "Red carpet moments are being prepared.",
        items: uniqueItems(
          cinemaItems.filter((item) =>
            matches(item, ["red carpet", "event coverage", "premiere"])
          )
        ),
      },
    ];
  }, [cinemaItems]);

  function renderMiniCards(items) {
    const previewItems = items.slice(0, 4);

    if (previewItems.length > 0) {
      return previewItems.map((item) => {
        const previewUrl = previewUrls[item.id] || "";

        return (
          <Link
            key={item.id}
            to={`/media/${item.id}`}
            className="release-mini-card"
          >
            {previewUrl ? (
              <video
                src={safariFrame(previewUrl)}
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
      <div className="release-mini-card is-empty" key={item}>
        <span />
      </div>
    ));
  }

  function renderReleaseRoom(room) {
    const hasItems = room.items.length > 0;

    return (
      <section className="release-room" key={room.title}>
        <div className="release-room-copy">
          <p>{room.subtitle}</p>
          <h2>{room.title}</h2>
          <span>{hasItems ? "Open the room." : room.message}</span>
        </div>

        <div className="release-room-preview">{renderMiniCards(room.items)}</div>

        <div className="release-room-arrow">›</div>
      </section>
    );
  }

  return (
    <main className="videos-page">
      <section className="cinema-layout">
        <aside className="cinema-left-panel">
          <p className="cinema-kicker">THE ASET STUDIO PRESENTS</p>

          <h1>Aset Cinema</h1>

          <p className="cinema-description">
            A curated screening environment for films, comedy programming,
            interviews, performances, studio originals, red carpet moments, and
            premium cinematic storytelling.
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
        </aside>

        <section className="cinema-right-panel">
          <section className="release-rooms-panel">
            <div className="release-rooms-heading">
              <div>
                <p>NOW SCREENING</p>
                <h2>Cinema Release Rooms</h2>
                <span>
                  Curated films, interviews, performances, comedy, music visuals,
                  and studio originals.
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
        </section>
      </section>

      {loading && (
        <div className="videos-loading">Loading cinema experience...</div>
      )}
    </main>
  );
}