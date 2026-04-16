import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const heroImageSrc = `${process.env.PUBLIC_URL}/images/aset-hero.png`;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedVideo() {
      setLoadingVideo(true);

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("title, slug, description, file_path, category")
          .eq("type", "video")
          .eq("featured", true)
          .eq("status", "published")
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!mounted) return;

        if (!data?.file_path) {
          setFeaturedVideo(null);
          setFeaturedVideoUrl("");
          setLoadingVideo(false);
          return;
        }

        setFeaturedVideo(data);

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(data.file_path, 3600);

        if (!mounted) return;

        if (signedError) {
          throw signedError;
        }

        setFeaturedVideoUrl(signedData?.signedUrl || "");
      } catch (err) {
        console.error("Error loading featured homepage video:", err);

        if (!mounted) return;

        setFeaturedVideo(null);
        setFeaturedVideoUrl("");
      } finally {
        if (mounted) {
          setLoadingVideo(false);
        }
      }
    }

    loadFeaturedVideo();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredVideoCardStyle = {
    ...styles.featuredVideoCard,
    gridTemplateColumns: isMobile
      ? "1fr"
      : "minmax(0, 1.25fr) minmax(300px, 0.85fr)",
    gap: isMobile ? 16 : 24,
  };

  const featuredVideoPlayerWrapStyle = {
    ...styles.featuredVideoPlayerWrap,
    aspectRatio: isMobile ? "9 / 16" : "16 / 9",
    maxWidth: isMobile ? 420 : "none",
    margin: isMobile ? "0 auto" : 0,
  };

  const featuredVideoMetaStyle = {
    ...styles.featuredVideoMeta,
    padding: isMobile ? 18 : 24,
  };

  const featuredVideoTitleStyle = {
    ...styles.featuredVideoCardTitle,
    fontSize: isMobile ? "2rem" : "clamp(24px, 3vw, 34px)",
  };

  return (
    <div style={styles.page}>
      <section
        style={{
          ...styles.hero,
          backgroundImage: `url('${heroImageSrc}')`,
        }}
      >
        <div style={styles.heroOverlay} />

        <div style={styles.heroInner}>
          <div style={styles.brand}>THE ASET STUDIO</div>

          <h1 style={styles.headline}>
            A Creative Temple of Image, Sound &amp; Sovereignty.
          </h1>

          <p style={styles.subtext}>
            Egyptian royalty. Mythic cinema. A siren&apos;s whisper beneath the
            surface.
          </p>

          <div style={styles.ctaRow}>
            <Link to="/gallery" style={styles.primaryBtn}>
              Enter the Gallery
            </Link>

            <Link to="/sirens-realm" style={styles.ghostBtn}>
              Enter Sirens Realm
            </Link>
          </div>

          <div style={styles.note}>
            Public access is open. Boudoir requires age verification.
          </div>
        </div>
      </section>

      <section style={styles.featuredVideoSection}>
        <div style={styles.featuredVideoInner}>
          <div style={styles.featuredVideoEyebrow}>WHO IS THE ASET STUDIO</div>

          <h2 style={styles.featuredVideoTitle}>
            See the world before you choose a portal.
          </h2>

          <p style={styles.featuredVideoText}>
            Start with the overview. Watch the introduction first, then move
            deeper into the gallery, creators, and the worlds inside the
            platform.
          </p>

          {loadingVideo ? (
            <div style={styles.featuredVideoPlaceholder}>
              Loading overview video...
            </div>
          ) : featuredVideo && featuredVideoUrl ? (
            <div style={featuredVideoCardStyle}>
              <Link
                to={featuredVideo.slug ? `/video/${featuredVideo.slug}` : "/videos"}
                style={styles.featuredVideoLinkWrap}
              >
                <div style={featuredVideoPlayerWrapStyle}>
                  <video
                    src={featuredVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={styles.featuredVideoPlayer}
                  />
                  <div style={styles.featuredVideoOverlay} />
                </div>
              </Link>

              <div style={featuredVideoMetaStyle}>
                <div style={styles.featuredVideoBadge}>
                  {(featuredVideo.category || "overview").replaceAll("_", " ")}
                </div>

                <h3 style={featuredVideoTitleStyle}>
                  {featuredVideo.title || "Featured Overview"}
                </h3>

                <Link
                  to={featuredVideo.slug ? `/video/${featuredVideo.slug}` : "/videos"}
                  style={styles.featuredVideoButton}
                >
                  Enter Screening
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.featuredVideoPlaceholder}>
              No featured video set yet.
            </div>
          )}
        </div>
      </section>

      <section style={styles.portalSection}>
        <div style={styles.portalInner}>
          <div style={styles.portalEyebrow}>ENTER THE PLATFORM</div>

          <h2 style={styles.portalTitle}>
            Enter the world before you choose a portal.
          </h2>

          <p style={styles.portalText}>
            The Aset Studio is a cinematic creative world built around image,
            atmosphere, identity, and discovery. Move through the platform,
            explore the gallery, meet creators, and step deeper into the
            experience.
          </p>

          <div style={styles.grid}>
            <Link to="/gallery" style={styles.card}>
              <h3 style={styles.cardTitle}>Gallery</h3>
              <p style={styles.cardText}>Browse the public image experience.</p>
            </Link>

            <Link to="/featured" style={styles.card}>
              <h3 style={styles.cardTitle}>Featured</h3>
              <p style={styles.cardText}>
                Enter the curated portal of highlighted work across the platform.
              </p>
            </Link>

            <Link to="/creators" style={styles.card}>
              <h3 style={styles.cardTitle}>Creators</h3>
              <p style={styles.cardText}>Discover creators and profiles.</p>
            </Link>

            <Link to="/creator-hub" style={styles.card}>
              <h3 style={styles.cardTitle}>Creator Hub</h3>
              <p style={styles.cardText}>Enter the creator side of the platform.</p>
            </Link>

            <Link to="/favorites" style={styles.card}>
              <h3 style={styles.cardTitle}>Favorites</h3>
              <p style={styles.cardText}>Open your saved items.</p>
            </Link>

            <Link to="/messages" style={styles.card}>
              <h3 style={styles.cardTitle}>Messages</h3>
              <p style={styles.cardText}>Connect inside the platform.</p>
            </Link>

            <Link to="/sirens-realm" style={styles.card}>
              <h3 style={styles.cardTitle}>Sirens Realm</h3>
              <p style={styles.cardText}>Enter the Sirens Realm portal.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050507",
    color: "#f2f0ea",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(56px, 8vw, 96px) clamp(16px, 4vw, 28px)",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.44), rgba(0,0,0,0.66))",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 980,
    width: "100%",
    textAlign: "center",
    paddingTop: "clamp(18px, 4vw, 40px)",
    paddingBottom: "clamp(18px, 4vw, 40px)",
  },
  brand: {
    letterSpacing: "0.22em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.95,
    marginBottom: 10,
  },
  headline: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(32px, 6vw, 52px)",
    lineHeight: 1.08,
    margin: "0 0 14px",
    textWrap: "balance",
  },
  subtext: {
    maxWidth: 720,
    margin: "0 auto 22px",
    opacity: 0.9,
    fontSize: "clamp(15px, 2.6vw, 17px)",
    lineHeight: 1.6,
    paddingLeft: 4,
    paddingRight: 4,
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 14,
    width: "100%",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(170,140,70,0.20)",
    border: "1px solid rgba(170,140,70,0.60)",
    color: "#f2f0ea",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    minHeight: 50,
    minWidth: 190,
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#f2f0ea",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 600,
    minHeight: 50,
    minWidth: 190,
  },
  note: {
    opacity: 0.78,
    fontSize: "clamp(12px, 2.2vw, 13px)",
    marginTop: 10,
    lineHeight: 1.5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  featuredVideoSection: {
    width: "100%",
    padding: "clamp(34px, 6vw, 56px) clamp(16px, 4vw, 24px)",
    background:
      "linear-gradient(to bottom, rgba(5,5,8,0.98), rgba(10,10,14,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  featuredVideoInner: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  featuredVideoEyebrow: {
    letterSpacing: "0.18em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.82,
    marginBottom: 10,
    textAlign: "center",
  },
  featuredVideoTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(26px, 4vw, 38px)",
    lineHeight: 1.12,
    margin: "0 0 12px",
    textAlign: "center",
  },
  featuredVideoText: {
    maxWidth: 760,
    margin: "0 auto 28px",
    opacity: 0.86,
    fontSize: "clamp(14px, 2.3vw, 16px)",
    lineHeight: 1.6,
    textAlign: "center",
  },
  featuredVideoPlaceholder: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "28px 22px",
    borderRadius: 24,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.16)",
    textAlign: "center",
    color: "rgba(242,240,234,0.82)",
  },
  featuredVideoCard: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    alignItems: "stretch",
  },
  featuredVideoLinkWrap: {
    display: "block",
    textDecoration: "none",
  },
  featuredVideoPlayerWrap: {
    position: "relative",
    background: "#000",
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
  },
  featuredVideoPlayer: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
    display: "block",
    background: "#000",
  },
  featuredVideoOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0.04))",
    pointerEvents: "none",
  },
  featuredVideoMeta: {
    borderRadius: 24,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.16)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  featuredVideoBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(170,140,70,0.16)",
    border: "1px solid rgba(170,140,70,0.28)",
    color: "#f2f0ea",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  featuredVideoCardTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    lineHeight: 1.16,
    margin: "0 0 14px",
  },
  featuredVideoButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    minHeight: 50,
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(170,140,70,0.60)",
    background: "rgba(170,140,70,0.20)",
    color: "#f2f0ea",
    textDecoration: "none",
    fontWeight: 700,
  },
  portalSection: {
    width: "100%",
    padding: "clamp(34px, 6vw, 56px) clamp(16px, 4vw, 24px) 70px",
    background:
      "linear-gradient(to bottom, rgba(8,8,12,0.98), rgba(12,12,18,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  portalInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  portalEyebrow: {
    letterSpacing: "0.18em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.82,
    marginBottom: 10,
    textAlign: "center",
  },
  portalTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(26px, 4vw, 38px)",
    lineHeight: 1.12,
    margin: "0 0 12px",
    textAlign: "center",
  },
  portalText: {
    maxWidth: 760,
    margin: "0 auto 28px",
    opacity: 0.86,
    fontSize: "clamp(14px, 2.3vw, 16px)",
    lineHeight: 1.6,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginTop: 30,
  },
  card: {
    display: "block",
    textDecoration: "none",
    color: "#f2f0ea",
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.16)",
    minHeight: 150,
  },
  cardTitle: {
    fontWeight: 800,
    margin: "0 0 8px",
    letterSpacing: "0.01em",
    fontSize: 16,
  },
  cardText: {
    opacity: 0.82,
    lineHeight: 1.5,
    fontSize: 14,
    margin: 0,
  },
};