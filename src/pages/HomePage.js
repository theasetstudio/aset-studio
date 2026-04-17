import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");
  const [featuredVideoPoster, setFeaturedVideoPoster] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredItemUrls, setFeaturedItemUrls] = useState({});
  const [loadingFeaturedItems, setLoadingFeaturedItems] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const heroImageSrc = `${process.env.PUBLIC_URL}/images/aset-hero.png`;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load featured homepage video
  useEffect(() => {
    let mounted = true;

    async function loadFeaturedVideo() {
      setLoadingVideo(true);
      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("id, title, slug, description, file_path, watermarked_path, category")
          .eq("type", "video")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (!mounted || !data?.file_path) return setLoadingVideo(false);

        setFeaturedVideo(data);

        const { data: signedData } = await supabase.storage
          .from("media")
          .createSignedUrl(data.file_path, 3600);

        setFeaturedVideoUrl(signedData?.signedUrl || "");

        if (data.watermarked_path) {
          const { data: posterData } = await supabase.storage
            .from("media")
            .createSignedUrl(data.watermarked_path, 3600);

          setFeaturedVideoPoster(posterData?.signedUrl || "");
        }
      } catch (err) {
        console.error(err);
        setFeaturedVideo(null);
        setFeaturedVideoUrl("");
        setFeaturedVideoPoster("");
      } finally {
        if (mounted) setLoadingVideo(false);
      }
    }

    loadFeaturedVideo();
    return () => (mounted = false);
  }, []);

  // Load featured preview items
  useEffect(() => {
    let mounted = true;

    async function loadFeaturedItems() {
      setLoadingFeaturedItems(true);
      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("id, title, file_path, type, category")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;

        if (!mounted) return;

        setFeaturedItems(data || []);

        const urls = {};
        for (const item of data) {
          const { data: signedData } = await supabase.storage
            .from("media")
            .createSignedUrl(item.file_path, 3600);
          urls[item.id] = signedData?.signedUrl || null;
        }
        setFeaturedItemUrls(urls);
      } catch (err) {
        console.error(err);
        setFeaturedItems([]);
        setFeaturedItemUrls({});
      } finally {
        if (mounted) setLoadingFeaturedItems(false);
      }
    }

    loadFeaturedItems();
    return () => (mounted = false);
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
      {/* Hero Section */}
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
            Egyptian royalty. Mythic cinema. A siren&apos;s whisper beneath the surface.
          </p>
          <div style={styles.ctaRow}>
            <Link to="/gallery" style={styles.primaryBtn}>Enter the Gallery</Link>
            <Link to="/sirens-realm" style={styles.ghostBtn}>Enter Sirens Realm</Link>
          </div>
          <div style={styles.note}>
            Public access is open. Boudoir requires age verification.
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section style={styles.featuredVideoSection}>
        <div style={styles.featuredVideoInner}>
          <div style={styles.featuredVideoEyebrow}>WHO IS THE ASET STUDIO</div>
          <h2 style={styles.featuredVideoTitle}>
            See the world before you choose a portal.
          </h2>
          <p style={styles.featuredVideoText}>
            Start with the overview. Watch the introduction first, then move deeper into the gallery, creators, and the worlds inside the platform.
          </p>

          {loadingVideo ? (
            <div style={styles.featuredVideoPlaceholder}>Loading overview video...</div>
          ) : featuredVideo && featuredVideoUrl ? (
            <div style={featuredVideoCardStyle}>
              <Link
                to={featuredVideo.slug ? `/video/${featuredVideo.slug}` : "/videos"}
                style={styles.featuredVideoLinkWrap}
              >
                <div style={featuredVideoPlayerWrapStyle}>
                  <video
                    src={featuredVideoUrl}
                    poster={featuredVideoPoster}
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
                <h3 style={featuredVideoTitleStyle}>{featuredVideo.title || "Featured Overview"}</h3>
                <Link
                  to={featuredVideo.slug ? `/video/${featuredVideo.slug}` : "/videos"}
                  style={styles.featuredVideoButton}
                >
                  Enter Screening
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.featuredVideoPlaceholder}>No featured video set yet.</div>
          )}
        </div>
      </section>

      {/* Featured Preview Strip */}
      <section style={styles.previewSection}>
        <div style={styles.previewInner}>
          <div style={styles.previewHeaderRow}>
            <div>
              <div style={styles.previewEyebrow}>FEATURED PREVIEW</div>
              <h2 style={styles.previewTitle}>A glimpse into the highlighted work.</h2>
              <p style={styles.previewText}>
                Explore a curated preview of featured image and video pieces before entering the full portal.
              </p>
            </div>
            <Link to="/featured" style={styles.previewPortalButton}>Enter Featured</Link>
          </div>

          {loadingFeaturedItems ? (
            <div style={styles.previewPlaceholder}>Loading featured preview...</div>
          ) : featuredItems.length > 0 ? (
            <div style={styles.previewScroller}>
              {featuredItems.map((item) => {
                const signedUrl = featuredItemUrls[item.id];
                return (
                  <Link key={item.id} to={`/media/${item.id}`} style={styles.previewCard}>
                    <div style={styles.previewMediaWrap}>
                      {signedUrl ? (
                        item.type === "video" ? (
                          <video src={signedUrl} muted playsInline preload="metadata" style={styles.previewMedia} />
                        ) : (
                          <img src={signedUrl} alt={item.title || "Featured preview"} style={styles.previewMedia} />
                        )
                      ) : (
                        <div style={styles.previewMediaFallback}>Preview unavailable</div>
                      )}
                      <div style={styles.previewOverlay} />
                      <div style={styles.previewBadgeRow}>
                        <span style={styles.previewBadge}>Featured</span>
                        {item.type && <span style={styles.previewTypeBadge}>{item.type}</span>}
                      </div>
                    </div>
                    <div style={styles.previewCardBody}>
                      <div style={styles.previewCardMeta}>
                        {item.category && <span style={styles.previewMetaChip}>{item.category}</span>}
                      </div>
                      <h3 style={styles.previewCardTitle}>{item.title || "Untitled"}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={styles.previewPlaceholder}>No featured preview items yet.</div>
          )}
        </div>
      </section>

      {/* Portal Grid */}
      <section style={styles.portalSection}>
        <div style={styles.portalInner}>
          <div style={styles.portalEyebrow}>ENTER THE PLATFORM</div>
          <h2 style={styles.portalTitle}>Enter the world before you choose a portal.</h2>
          <p style={styles.portalText}>
            The Aset Studio is a cinematic creative world built around image, atmosphere, identity, and discovery. Move through the platform, explore the gallery, meet creators, and step deeper into the experience.
          </p>

          <div style={styles.grid}>
            <Link to="/gallery" style={styles.card}><h3 style={styles.cardTitle}>Gallery</h3><p style={styles.cardText}>Browse the public image experience.</p></Link>
            <Link to="/featured" style={styles.card}><h3 style={styles.cardTitle}>Featured</h3><p style={styles.cardText}>Enter the curated portal of highlighted work across the platform.</p></Link>
            <Link to="/creators" style={styles.card}><h3 style={styles.cardTitle}>Creators</h3><p style={styles.cardText}>Discover creators and profiles.</p></Link>
            <Link to="/creator-hub" style={styles.card}><h3 style={styles.cardTitle}>Creator Hub</h3><p style={styles.cardText}>Enter the creator side of the platform.</p></Link>
            <Link to="/favorites" style={styles.card}><h3 style={styles.cardTitle}>Favorites</h3><p style={styles.cardText}>Open your saved items.</p></Link>
            <Link to="/messages" style={styles.card}><h3 style={styles.cardTitle}>Messages</h3><p style={styles.cardText}>Connect inside the platform.</p></Link>
            <Link to="/sirens-realm" style={styles.card}><h3 style={styles.cardTitle}>Sirens Realm</h3><p style={styles.cardText}>Enter the Sirens Realm portal.</p></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Styles (same as before; unchanged)
const styles = { /* copy your previous styles here */ };