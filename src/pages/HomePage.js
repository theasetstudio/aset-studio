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
  const peopleImageSrc = `${process.env.PUBLIC_URL}/images/aset-person.png`;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= VIDEO =================
  useEffect(() => {
    let mounted = true;

    async function loadFeaturedVideo() {
      setLoadingVideo(true);
      try {
        const { data } = await supabase
          .from("media_items")
          .select("*")
          .eq("type", "video")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .limit(1)
          .maybeSingle();

        if (!mounted) return;

        if (!data?.file_path) {
          setFeaturedVideo(null);
          setLoadingVideo(false);
          return;
        }

        setFeaturedVideo(data);

        const { data: signed } = await supabase.storage
          .from("media")
          .createSignedUrl(data.file_path, 3600);

        if (!mounted) return;

        setFeaturedVideoUrl(signed?.signedUrl || "");

        if (data.watermarked_path) {
          const { data: poster } = await supabase.storage
            .from("media")
            .createSignedUrl(data.watermarked_path, 3600);

          setFeaturedVideoPoster(poster?.signedUrl || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingVideo(false);
      }
    }

    loadFeaturedVideo();
    return () => (mounted = false);
  }, []);

  // ================= FEATURED STRIP =================
  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      setLoadingFeaturedItems(true);
      try {
        const { data } = await supabase
          .from("media_items")
          .select("*")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .limit(8);

        if (!mounted) return;

        setFeaturedItems(data || []);

        const map = {};
        for (const item of data || []) {
          if (!item.file_path) continue;

          const { data: signed } = await supabase.storage
            .from("media")
            .createSignedUrl(item.file_path, 3600);

          map[item.id] = signed?.signedUrl || null;
        }

        setFeaturedItemUrls(map);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingFeaturedItems(false);
      }
    }

    loadItems();
    return () => (mounted = false);
  }, []);

  // ================= HERO LAYOUT =================
  const heroInnerStyle = {
    ...styles.heroInner,
    maxWidth: isMobile ? 980 : 1220,
  };

  const heroRowStyle = {
    ...styles.heroRow,
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "center" : "center",
    gap: isMobile ? 28 : 64,
  };

  const heroLeftStyle = {
    ...styles.heroLeft,
    maxWidth: isMobile ? 760 : 600,
    textAlign: isMobile ? "center" : "left",
  };

  const heroRightStyle = {
    ...styles.heroRight,
    width: isMobile ? "100%" : "320px",
    marginTop: isMobile ? 0 : -70,
    marginLeft: isMobile ? 0 : -60,
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          backgroundImage: `url('${heroImageSrc}')`,
        }}
      >
        <div style={styles.heroOverlay} />

        <div style={heroInnerStyle}>
          <div style={heroRowStyle}>
            <div style={heroLeftStyle}>
              <div style={styles.brand}>THE ASET STUDIO</div>

              <h1 style={styles.headline}>
                A Creative Temple of Image, Sound & Sovereignty.
              </h1>

              <p style={styles.subtext}>
                Egyptian royalty. Mythic cinema. A siren's whisper beneath the surface.
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

            {/* PEOPLE PANEL */}
            <div style={heroRightStyle}>
              <div style={styles.peoplePanel}>
                <img src={peopleImageSrc} style={styles.peopleImage} />

                <div style={styles.peopleContent}>
                  <div style={styles.peopleTitle}>The People of Aset</div>
                  <div style={styles.peopleSubtext}>
                    Recognized individuals within the world of Aset.
                  </div>

                  <Link to="/talent" style={styles.peopleButton}>
                    Explore The People of Aset
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEEP REST OF YOUR PAGE SAME */}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    background: "#050507",
    color: "#f2f0ea",
  },

  hero: {
    position: "relative",
    minHeight: "94vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(72px, 9vw, 120px) clamp(16px, 4vw, 32px)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },

  heroInner: {
    position: "relative",
    zIndex: 1,
    width: "100%",
  },

  heroRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  heroLeft: {},

  heroRight: {},

  brand: {
    fontSize: 12,
    letterSpacing: "0.2em",
    marginBottom: 10,
  },

  headline: {
    fontSize: "clamp(34px,6vw,56px)",
    fontFamily: "Georgia",
    marginBottom: 16,
  },

  subtext: {
    marginBottom: 24,
  },

  ctaRow: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },

  primaryBtn: {
    background: "#d4af37",
    padding: "14px 18px",
    borderRadius: 12,
    color: "#000",
    textDecoration: "none",
  },

  ghostBtn: {
    border: "1px solid gold",
    padding: "14px 18px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#fff",
  },

  note: {
    fontSize: 12,
    opacity: 0.8,
  },

  peoplePanel: {
    width: 320,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid gold",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },

  peopleImage: {
    width: "100%",
    height: 400,
    objectFit: "cover",
    objectPosition: "center 15%",
  },

  peopleContent: {
    padding: 16,
    background: "rgba(0,0,0,0.85)",
  },

  peopleTitle: {
    fontSize: 22,
    marginBottom: 8,
  },

  peopleSubtext: {
    fontSize: 13,
    marginBottom: 12,
  },

  peopleButton: {
    display: "block",
    padding: 12,
    border: "1px solid gold",
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    color: "#fff",
  },
};