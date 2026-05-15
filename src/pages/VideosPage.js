import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const RELEASE_LANES = [
  {
    key: "cinematic",
    eyebrow: "FEATURED CINEMA",
    title: "Cinematic Releases",
    empty: "Cinematic releases are being prepared.",
  },
  {
    key: "interview",
    eyebrow: "PRIVATE CONVERSATIONS",
    title: "Interviews",
    empty: "Interview screenings are being prepared.",
  },
  {
    key: "hot_take",
    eyebrow: "COMMENTARY ROOM",
    title: "Hot Takes",
    empty: "Hot Takes are being prepared.",
  },
  {
    key: "film",
    eyebrow: "ASET ORIGINALS",
    title: "Films",
    empty: "Film releases are being prepared.",
  },
  {
    key: "music_video",
    eyebrow: "PERFORMANCE VISUALS",
    title: "Music Videos",
    empty: "Music video releases are being prepared.",
  },
  {
    key: "studio_release",
    eyebrow: "STUDIO RELEASES",
    title: "Studio Releases",
    empty: "Studio releases are being prepared.",
  },
  {
    key: "red_carpet",
    eyebrow: "EVENT COVERAGE",
    title: "Red Carpet",
    empty: "Red carpet moments are being prepared.",
  },
];

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function getCategoryLabel(category) {
  return clean(category || "Aset Cinema").replaceAll("_", " ");
}

function getVideoPath(video) {
  return video?.slug ? `/video/${video.slug}` : `/media/${video.id}`;
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

function isSupremeAccess(video) {
  return norm(video?.access_level) === "supreme";
}

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [posterUrls, setPosterUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getSignedUrl(pathOrUrl) {
      if (!pathOrUrl) return "";
      if (isFullUrl(pathOrUrl)) return pathOrUrl;

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(pathOrUrl, 3600);

      if (error) {
        console.error("Signed URL error:", error);
        return "";
      }

      return data?.signedUrl || "";
    }

    async function loadVideos() {
      setLoading(true);

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("type", "video")
        .eq("status", "published")
        .eq("hidden", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load videos:", error);

        if (isMounted) {
          setVideos([]);
          setSignedUrls({});
          setPosterUrls({});
          setLoading(false);
        }

        return;
      }

      const safeVideos = data || [];

      const videoEntries = await Promise.all(
        safeVideos.map(async (video) => {
          const videoPath = video.watermarked_path || video.file_path;
          const signedUrl = await getSignedUrl(videoPath);

          return [video.id, signedUrl];
        })
      );

      const posterEntries = await Promise.all(
        safeVideos.map(async (video) => {
          const posterPath = getPosterPath(video);
          const posterUrl = await getSignedUrl(posterPath);

          return [video.id, posterUrl];
        })
      );

      if (isMounted) {
        setVideos(safeVideos);
        setSignedUrls(Object.fromEntries(videoEntries));
        setPosterUrls(Object.fromEntries(posterEntries));
        setLoading(false);
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredVideo =
    videos.find((video) => video.homepage_featured) ||
    videos.find((video) => video.featured) ||
    videos[0] ||
    null;

  const categorizedVideos = useMemo(() => {
    const remaining = featuredVideo
      ? videos.filter((video) => video.id !== featuredVideo.id)
      : videos;

    const groups = {
      cinematic: [],
      interview: [],
      hot_take: [],
      film: [],
      music_video: [],
      studio_release: [],
      red_carpet: [],
    };

    remaining.forEach((video) => {
      const category = norm(video.category);

      if (groups[category]) {
        groups[category].push(video);
      } else {
        groups.cinematic.push(video);
      }
    });

    return groups;
  }, [videos, featuredVideo]);

  const allVisibleVideos = useMemo(() => {
    return featuredVideo
      ? videos.filter((video) => video.id !== featuredVideo.id)
      : videos;
  }, [videos, featuredVideo]);

  const activeLanes = RELEASE_LANES.map((lane) => {
    let laneVideos = categorizedVideos[lane.key] || [];

    if (laneVideos.length === 0 && lane.key === "cinematic") {
      laneVideos = allVisibleVideos;
    }

    return {
      ...lane,
      videos: laneVideos,
    };
  });

  const previewVideos = allVisibleVideos.slice(0, 12);

  function renderMiniPreview(video) {
    const previewUrl = posterUrls[video.id] || signedUrls[video.id] || "";
    const locked = isSupremeAccess(video);

    return (
      <Link
        key={video.id}
        to={getVideoPath(video)}
        style={{
          ...styles.miniThumb,
          ...(locked ? styles.lockedMiniThumb : {}),
        }}
      >
        {previewUrl ? (
          posterUrls[video.id] ? (
            <img
              src={previewUrl}
              alt={video.title || "Cinema preview"}
              style={{
                ...styles.miniThumbMedia,
                ...(locked ? styles.lockedMedia : {}),
              }}
            />
          ) : (
            <video
              src={previewUrl}
              muted
              playsInline
              preload="metadata"
              style={{
                ...styles.miniThumbMedia,
                ...(locked ? styles.lockedMedia : {}),
              }}
            />
          )
        ) : (
          <div style={styles.miniFallback} />
        )}

        {locked ? <span style={styles.miniLockBadge}>LOCKED</span> : null}
      </Link>
    );
  }

  function renderLanePreview(lane) {
    const laneVideos = lane.videos.slice(0, 4);
    const hasVideos = laneVideos.length > 0;

    return (
      <div key={lane.key} style={styles.releaseRoom}>
        <div>
          <p style={styles.roomEyebrow}>{lane.eyebrow}</p>
          <h3 style={styles.roomTitle}>{lane.title}</h3>

          <p style={styles.roomCount}>
            {hasVideos
              ? `${lane.videos.length} screening${
                  lane.videos.length === 1 ? "" : "s"
                }`
              : lane.empty}
          </p>
        </div>

        <div style={styles.roomPreviewStrip}>
          {hasVideos ? (
            laneVideos.map((video) => renderMiniPreview(video))
          ) : (
            <>
              <div style={styles.emptyMiniThumb} />
              <div style={styles.emptyMiniThumb} />
              <div style={styles.emptyMiniThumb} />
              <div style={styles.emptyMiniThumb} />
            </>
          )}
        </div>

        {hasVideos ? (
          <Link to={getVideoPath(laneVideos[0])} style={styles.roomArrow}>
            ›
          </Link>
        ) : (
          <span style={styles.roomArrowMuted}>›</span>
        )}
      </div>
    );
  }

  function renderVideoCard(video) {
    const isHovered = hoveredCard === video.id;
    const locked = isSupremeAccess(video);

    return (
      <Link
        key={video.id}
        to={getVideoPath(video)}
        style={{
          ...styles.card,
          ...(locked ? styles.lockedCard : {}),
          ...(isHovered ? styles.cardHover : {}),
        }}
        onMouseEnter={() => setHoveredCard(video.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={styles.cardMedia}>
          {posterUrls[video.id] && (
            <img
              src={posterUrls[video.id]}
              alt={video.title || "Aset Cinema poster"}
              style={{
                ...styles.posterImage,
                ...(locked ? styles.lockedMedia : {}),
              }}
            />
          )}

          {signedUrls[video.id] ? (
            <video
              src={signedUrls[video.id]}
              poster={posterUrls[video.id] || undefined}
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                ...styles.cardVideo,
                ...(locked ? styles.lockedMedia : {}),
                ...(isHovered && !locked ? styles.cardVideoHover : {}),
              }}
              onMouseEnter={(e) => {
                if (!locked) e.currentTarget.play().catch(() => {});
              }}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <div style={styles.mediaFallback}>Preview unavailable</div>
          )}

          <div style={styles.overlay} />

          <span style={styles.badge}>{getCategoryLabel(video.category)}</span>

          {locked ? (
            <div style={styles.lockOverlay}>
              <span style={styles.lockIcon}>◆</span>
              <span style={styles.lockText}>Supreme Access</span>
            </div>
          ) : null}
        </div>

        <div style={styles.cardBody}>
          <h3 style={styles.cardTitle}>
            {video.title || "Untitled Screening"}
          </h3>

          <p style={styles.cardText}>
            {locked
              ? "Private screening reserved for Supreme Access."
              : video.description || "Details coming soon."}
          </p>

          <span style={locked ? styles.lockedCta : styles.cardCta}>
            {locked ? "Unlock Screening" : "Enter Screening"}
          </span>
        </div>
      </Link>
    );
  }

  const featuredLocked = isSupremeAccess(featuredVideo);

  return (
    <main style={styles.page}>
      <section style={styles.portraitHero}>
        <div style={styles.heroSidePanel} />

        {featuredVideo ? (
          <Link
            to={getVideoPath(featuredVideo)}
            style={{
              ...styles.featurePortrait,
              ...(featuredLocked ? styles.lockedFeaturePortrait : {}),
              ...(hoveredFeature ? styles.featurePortraitHover : {}),
            }}
            onMouseEnter={() => setHoveredFeature(true)}
            onMouseLeave={() => setHoveredFeature(false)}
          >
            <div style={styles.featurePortraitMedia}>
              {posterUrls[featuredVideo.id] && (
                <img
                  src={posterUrls[featuredVideo.id]}
                  alt={featuredVideo.title || "Featured screening"}
                  style={{
                    ...styles.posterImage,
                    ...(featuredLocked ? styles.lockedFeatureMedia : {}),
                  }}
                />
              )}

              {signedUrls[featuredVideo.id] ? (
                <video
                  src={signedUrls[featuredVideo.id]}
                  poster={posterUrls[featuredVideo.id] || undefined}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    ...styles.featurePortraitVideo,
                    ...(featuredLocked ? styles.lockedFeatureMedia : {}),
                    ...(hoveredFeature && !featuredLocked
                      ? styles.featurePortraitVideoHover
                      : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!featuredLocked) e.currentTarget.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              ) : (
                <div style={styles.mediaFallback}>Preview loading...</div>
              )}

              <div style={styles.portraitOverlay} />

              {featuredLocked ? (
                <div style={styles.featureLockOverlay}>
                  <span style={styles.featureLockIcon}>◆</span>
                  <span style={styles.featureLockText}>Supreme Access Screening</span>
                </div>
              ) : null}
            </div>

            <div style={styles.featurePortraitBody}>
              <p style={styles.goldText}>
                {featuredLocked ? "SUPREME ACCESS" : "FEATURED SCREENING"}
              </p>

              <h1 style={styles.portraitTitle}>
                {featuredVideo.title || "Featured Presentation"}
              </h1>

              <p style={styles.portraitText}>
                {featuredLocked
                  ? "A private cinematic screening reserved for Supreme Access."
                  : featuredVideo.description ||
                    "A featured screening from inside The Aset Studio."}
              </p>

              <span style={featuredLocked ? styles.lockedCtaLarge : styles.cta}>
                {featuredLocked ? "Unlock Screening" : "Enter Screening"}
              </span>
            </div>
          </Link>
        ) : (
          <div style={styles.featurePortrait}>
            <div style={styles.mediaFallback}>Preparing featured screening...</div>
          </div>
        )}

        <div style={styles.heroSidePanel} />
      </section>

      <section style={styles.studioGrid}>
        <div style={styles.introCard}>
          <p style={styles.eyebrow}>THE ASET STUDIO PRESENTS</p>

          <h2 style={styles.introTitle}>Aset Cinema</h2>

          <p style={styles.text}>
            A curated screening room for interviews, cinematic releases, studio
            originals, performances, red carpet moments, and the world being
            built around Aset.
          </p>

          <div style={styles.heroPills}>
            <span style={styles.heroPill}>Interviews</span>
            <span style={styles.heroPill}>Studio Originals</span>
            <span style={styles.heroPill}>Private Screenings</span>
            <span style={styles.heroPillGold}>Supreme Access</span>
          </div>
        </div>

        <div style={styles.roomsCard}>
          <div style={styles.roomsHeader}>
            <div>
              <p style={styles.goldText}>NOW SCREENING</p>

              <h2 style={styles.roomsTitle}>Cinema Release Rooms</h2>

              <p style={styles.roomsText}>
                Explore release lanes across the Aset Studio screening
                environment.
              </p>
            </div>

            <Link to="/" style={styles.returnLink}>
              Return to Studio →
            </Link>
          </div>

          {loading ? (
            <div style={styles.stateCard}>Preparing Aset Cinema...</div>
          ) : (
            <div style={styles.roomStack}>
              {activeLanes.map((lane) => renderLanePreview(lane))}
            </div>
          )}
        </div>
      </section>

      <section style={styles.previewSection}>
        <div style={styles.previewHeader}>
          <div>
            <p style={styles.eyebrow}>CURATED SCREENINGS</p>
            <h2 style={styles.sectionTitle}>Recent Cinema</h2>
          </div>

          <span style={styles.previewNote}>
            {previewVideos.length} available screening
            {previewVideos.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div style={styles.stateCard}>Preparing recent screenings...</div>
        ) : previewVideos.length === 0 ? (
          <div style={styles.stateCard}>
            Additional screenings are being prepared.
          </div>
        ) : (
          <div style={styles.releaseRow}>
            {previewVideos.map((video) => renderVideoCard(video))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(198,136,55,0.14), transparent 30%), radial-gradient(circle at 18% 20%, rgba(245,241,235,0.04), transparent 28%), linear-gradient(180deg, #050505 0%, #090806 48%, #050505 100%)",
    color: "#f5f1eb",
    padding: "88px 24px 82px",
  },

  portraitHero: {
    maxWidth: 1120,
    margin: "0 auto 34px",
    display: "grid",
    gridTemplateColumns:
      "minmax(150px, 0.74fr) minmax(260px, 340px) minmax(150px, 0.74fr)",
    gap: 24,
    alignItems: "stretch",
  },

  heroSidePanel: {
    minHeight: 560,
    borderRadius: 28,
    border: "1px solid rgba(245,241,235,0.075)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.008)), radial-gradient(circle at center, rgba(198,136,55,0.07), transparent 62%)",
    boxShadow: "0 34px 100px rgba(0,0,0,0.46)",
  },

  featurePortrait: {
    position: "relative",
    minHeight: 560,
    borderRadius: 28,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.16)",
    textDecoration: "none",
    color: "#f5f1eb",
    boxShadow:
      "0 46px 130px rgba(0,0,0,0.82), 0 0 72px rgba(198,136,55,0.14)",
    transition:
      "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
  },

  lockedFeaturePortrait: {
    border: "1px solid rgba(241,208,138,0.32)",
    boxShadow:
      "0 46px 130px rgba(0,0,0,0.86), 0 0 88px rgba(198,136,55,0.2)",
  },

  featurePortraitHover: {
    transform: "translateY(-6px)",
    borderColor: "rgba(245,241,235,0.26)",
    boxShadow:
      "0 60px 160px rgba(0,0,0,0.92), 0 0 86px rgba(198,136,55,0.18)",
  },

  featurePortraitMedia: {
    position: "absolute",
    inset: 0,
    background: "#000",
  },

  posterImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "brightness(0.72) contrast(1.08)",
  },

  lockedMedia: {
    filter: "brightness(0.38) blur(3px) contrast(1.08)",
    transform: "scale(1.03)",
  },

  lockedFeatureMedia: {
    filter: "brightness(0.36) blur(4px) contrast(1.08)",
    transform: "scale(1.04)",
  },

  featurePortraitVideo: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    opacity: 0.46,
    filter: "brightness(0.7) contrast(1.04)",
    transition: "opacity 0.35s ease",
  },

  featurePortraitVideoHover: {
    opacity: 0.64,
  },

  portraitOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0.9) 100%)",
  },

  featureLockOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: "#f1d08a",
    textAlign: "center",
    pointerEvents: "none",
  },

  featureLockIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "1px solid rgba(241,208,138,0.5)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.52)",
    boxShadow: "0 0 34px rgba(198,136,55,0.28)",
  },

  featureLockText: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 900,
  },

  featurePortraitBody: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
    padding: "30px",
  },

  goldText: {
    margin: "0 0 8px",
    color: "#c58d36",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  portraitTitle: {
    margin: "0 0 12px",
    fontSize: "clamp(31px, 3.7vw, 50px)",
    lineHeight: 0.92,
    letterSpacing: "-0.06em",
    fontWeight: 900,
  },

  portraitText: {
    margin: "0 0 20px",
    maxWidth: 320,
    color: "rgba(245,241,235,0.72)",
    fontSize: 12,
    lineHeight: 1.62,
    textTransform: "uppercase",
    letterSpacing: "0.055em",
  },

  cta: {
    color: "#111",
    background: "linear-gradient(135deg, #c58d36, #f1d08a)",
    padding: "11px 16px",
    borderRadius: 999,
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    fontSize: 12,
  },

  lockedCtaLarge: {
    color: "#111",
    background: "linear-gradient(135deg, #d7b56d, #fff1b8)",
    padding: "11px 16px",
    borderRadius: 999,
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    fontSize: 12,
    boxShadow: "0 0 26px rgba(215,181,109,0.22)",
  },

  studioGrid: {
    maxWidth: 1120,
    margin: "0 auto 48px",
    display: "grid",
    gridTemplateColumns: "minmax(240px, 0.62fr) minmax(0, 1.62fr)",
    gap: 24,
    alignItems: "stretch",
  },

  introCard: {
    borderRadius: 28,
    padding: "30px",
    minHeight: 360,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012))",
    border: "1px solid rgba(245,241,235,0.085)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
  },

  eyebrow: {
    margin: "0 0 9px",
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  introTitle: {
    margin: "0 0 16px",
    fontSize: "clamp(44px, 4.7vw, 66px)",
    lineHeight: 0.86,
    letterSpacing: "-0.065em",
    fontWeight: 900,
  },

  text: {
    margin: 0,
    maxWidth: 520,
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(245,241,235,0.74)",
  },

  heroPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 24,
  },

  heroPill: {
    padding: "8px 11px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.11)",
    background: "rgba(255,255,255,0.025)",
    color: "rgba(245,241,235,0.72)",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 800,
  },

  heroPillGold: {
    padding: "8px 11px",
    borderRadius: 999,
    border: "1px solid rgba(241,208,138,0.22)",
    background: "rgba(198,136,55,0.12)",
    color: "#f1d08a",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 900,
  },

  roomsCard: {
    borderRadius: 28,
    padding: "30px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012))",
    border: "1px solid rgba(245,241,235,0.085)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
  },

  roomsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 20,
  },

  roomsTitle: {
    margin: "0 0 9px",
    fontSize: "clamp(30px, 3.2vw, 44px)",
    lineHeight: 0.95,
    letterSpacing: "-0.055em",
  },

  roomsText: {
    margin: 0,
    color: "rgba(245,241,235,0.66)",
    fontSize: 14,
    lineHeight: 1.6,
  },

  returnLink: {
    color: "#d7b56d",
    textDecoration: "none",
    fontSize: 13,
    whiteSpace: "nowrap",
  },

  roomStack: {
    display: "grid",
    gap: 10,
  },

  releaseRoom: {
    display: "grid",
    gridTemplateColumns: "minmax(150px, 0.52fr) minmax(250px, 1fr) auto",
    gap: 15,
    alignItems: "center",
    padding: "12px",
    borderRadius: 16,
    border: "1px solid rgba(245,241,235,0.07)",
    background: "rgba(255,255,255,0.017)",
    textDecoration: "none",
    color: "#f5f1eb",
  },

  roomEyebrow: {
    margin: "0 0 5px",
    color: "rgba(245,241,235,0.42)",
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  },

  roomTitle: {
    margin: "0 0 4px",
    fontSize: 19,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },

  roomCount: {
    margin: 0,
    color: "#c58d36",
    fontSize: 12,
  },

  roomPreviewStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 7,
  },

  miniThumb: {
    position: "relative",
    aspectRatio: "16 / 9",
    borderRadius: 8,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.06)",
  },

  lockedMiniThumb: {
    border: "1px solid rgba(241,208,138,0.2)",
  },

  miniThumbMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "brightness(0.8) contrast(1.05)",
  },

  miniLockBadge: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f1d08a",
    fontSize: 8,
    letterSpacing: "0.14em",
    fontWeight: 900,
    textTransform: "uppercase",
    background: "rgba(0,0,0,0.36)",
  },

  miniFallback: {
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.03)",
  },

  emptyMiniThumb: {
    aspectRatio: "16 / 9",
    borderRadius: 8,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
    border: "1px solid rgba(245,241,235,0.045)",
  },

  roomArrow: {
    color: "#d7b56d",
    textDecoration: "none",
    fontSize: 34,
    lineHeight: 1,
  },

  roomArrowMuted: {
    color: "rgba(245,241,235,0.18)",
    fontSize: 34,
    lineHeight: 1,
  },

  previewSection: {
    maxWidth: 1120,
    margin: "0 auto",
  },

  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(32px, 4vw, 50px)",
    lineHeight: 0.95,
    letterSpacing: "-0.05em",
  },

  previewNote: {
    color: "rgba(245,241,235,0.52)",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  releaseRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 10,
    scrollSnapType: "x proximity",
  },

  card: {
    minWidth: 270,
    maxWidth: 270,
    scrollSnapAlign: "start",
    display: "block",
    overflow: "hidden",
    borderRadius: 22,
    textDecoration: "none",
    color: "#f5f1eb",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012))",
    border: "1px solid rgba(245,241,235,0.08)",
    boxShadow: "0 24px 62px rgba(0,0,0,0.34)",
    transition:
      "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
  },

  lockedCard: {
    border: "1px solid rgba(241,208,138,0.2)",
    boxShadow:
      "0 24px 62px rgba(0,0,0,0.38), 0 0 28px rgba(198,136,55,0.08)",
  },

  cardHover: {
    transform: "translateY(-5px)",
    borderColor: "rgba(245,241,235,0.16)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  },

  cardMedia: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  cardVideo: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    opacity: 0.28,
    transition: "opacity 0.3s ease",
  },

  cardVideoHover: {
    opacity: 0.52,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.82)), linear-gradient(135deg, rgba(255,255,255,0.04), transparent 40%)",
  },

  badge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    zIndex: 3,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.62)",
    border: "1px solid rgba(245,241,235,0.12)",
    color: "rgba(245,241,235,0.82)",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  lockOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "rgba(0,0,0,0.26)",
    color: "#f1d08a",
    textAlign: "center",
  },

  lockIcon: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid rgba(241,208,138,0.5)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.5)",
    boxShadow: "0 0 24px rgba(198,136,55,0.24)",
  },

  lockText: {
    fontSize: 9,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontWeight: 900,
  },

  cardBody: {
    padding: "16px 17px 18px",
  },

  cardTitle: {
    margin: "0 0 8px",
    fontSize: 19,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },

  cardText: {
    margin: "0 0 12px",
    fontSize: 13,
    lineHeight: 1.52,
    color: "rgba(245,241,235,0.64)",
  },

  cardCta: {
    fontSize: 12,
    fontWeight: 850,
    color: "#d7b56d",
  },

  lockedCta: {
    fontSize: 12,
    fontWeight: 900,
    color: "#f1d08a",
  },

  mediaFallback: {
    height: "100%",
    minHeight: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.52)",
    background: "rgba(255,255,255,0.025)",
  },

  stateCard: {
    borderRadius: 22,
    padding: "30px 22px",
    textAlign: "center",
    color: "rgba(245,241,235,0.68)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },
};