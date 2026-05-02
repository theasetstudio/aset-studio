import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const heroImage = `${process.env.PUBLIC_URL}/images/aset-powerhouse.png`;
  const spotlightImage = `${process.env.PUBLIC_URL}/images/aset-person.png`;

  const [videoUrl, setVideoUrl] = useState("");
  const [poster, setPoster] = useState("");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredUrls, setFeaturedUrls] = useState({});
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const worlds = [
    {
      eyebrow: "THE FIRST DOOR",
      title: "Enter the Gallery",
      text:
        "The Gallery is where Aset began. Before the cinema, before the portals, before the studio became a larger world, there was image: a visual archive, a portfolio, and the first signal.",
      panelEyebrow: "ORIGIN WORLD",
      panelTitle: "Gallery",
      panelText: "Image was the seed. The studio grew from there.",
      path: "/gallery",
      button: "Open Gallery",
      variant: "gold",
    },
    {
      eyebrow: "ASET CINEMA",
      title: "The release room for the world we are building.",
      text:
        "A controlled stage for feature presentations, visual releases, private conversations, Aset Studio originals, red carpet moments, and curated studio work.",
      panelEyebrow: "NOW PRESENTING",
      panelTitle: "Aset Cinema",
      panelText: "Not a feed. Not a shelf. A curated premiere environment.",
      path: "/videos",
      button: "Open Aset Cinema",
      variant: "light",
      featured: true,
      categories: [
        "Films",
        "Music Videos",
        "Interviews",
        "Studio Releases",
        "Red Carpet",
      ],
    },
    {
      eyebrow: "SIRENS REALM",
      title: "The mythic current beneath Aset.",
      text:
        "Sirens Realm carries the symbolic and spiritual layer of the studio: stones, signs, moods, protection, intuition, beauty, shadow, and transformation.",
      panelEyebrow: "MYTHIC WORLD",
      panelTitle: "Sirens Realm",
      panelText: "A deeper layer of ritual, archetype, mystery, and power.",
      path: "/sirens-realm",
      button: "Enter Sirens Realm",
      variant: "light",
      elevated: true,
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedVideo() {
      setLoading(true);

      const { data } = await supabase
        .from("media_items")
        .select("*")
        .eq("type", "video")
        .eq("featured", true)
        .eq("status", "published")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (!data?.file_path) {
        setLoading(false);
        return;
      }

      const { data: signed } = await supabase.storage
        .from("media")
        .createSignedUrl(data.file_path, 3600);

      setVideoUrl(signed?.signedUrl || "");

      if (data.watermarked_path) {
        const { data: signedPoster } = await supabase.storage
          .from("media")
          .createSignedUrl(data.watermarked_path, 3600);

        setPoster(signedPoster?.signedUrl || "");
      }

      setLoading(false);
    }

    loadFeaturedVideo();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedItems() {
      setLoadingFeatured(true);

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("featured", true)
        .eq("status", "published")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error || !mounted) {
        setFeaturedItems([]);
        setLoadingFeatured(false);
        return;
      }

      setFeaturedItems(data || []);

      const urlMap = {};

      for (const item of data || []) {
        if (!item.file_path) {
          urlMap[item.id] = "";
          continue;
        }

        const { data: signed } = await supabase.storage
          .from("media")
          .createSignedUrl(item.file_path, 3600);

        urlMap[item.id] = signed?.signedUrl || "";
      }

      if (mounted) {
        setFeaturedUrls(urlMap);
        setLoadingFeatured(false);
      }
    }

    loadFeaturedItems();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div
          style={{
            ...styles.heroImage,
            backgroundImage: `url("${heroImage}")`,
          }}
        />
        <div style={styles.heroShade} />

        <div style={styles.heroShell}>
          <div style={styles.heroContent}>
            <p style={styles.brand}>THE ASET STUDIO</p>

            <h1 style={styles.headline}>
              Egyptian Mystic
              <br />
              Powerhouse
            </h1>

            <p style={styles.subtext}>
              A cinematic entertainment company shaped by image, sound, story,
              mythology, talent, and sovereign creative presentation.
            </p>

            <div style={styles.ctaRow}>
              <Link to="/gallery" style={styles.goldBtn}>
                Enter the Gallery
              </Link>

              <Link to="/videos" style={styles.lightBtn}>
                Enter Aset Cinema
              </Link>
            </div>
          </div>

          <Link to="/aset-spotlight" style={styles.spotlightCard}>
            <div
              style={{
                ...styles.spotlightImage,
                backgroundImage: `url("${spotlightImage}")`,
              }}
            >
              <div style={styles.spotlightImageOverlay} />
            </div>

            <div style={styles.spotlightBody}>
              <p style={styles.spotlightEyebrow}>ASET SPOTLIGHT</p>
              <h3 style={styles.spotlightTitle}>Aset Spotlight</h3>

              <p style={styles.spotlightText}>
                Recognized individuals, featured talent, and cultural presence
                within the world of Aset.
              </p>

              <span style={styles.spotlightButton}>
                Explore Aset Spotlight
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section style={styles.worldsWrap}>
        {worlds.map((world, index) => (
          <section
            key={world.title}
            style={{
              ...styles.worldSection,
              ...(world.featured ? styles.featuredWorldSection : {}),
              ...(world.elevated ? styles.sirensWorldSection : {}),
            }}
          >
            <div
              style={{
                ...styles.worldInner,
                ...(world.featured ? styles.featuredWorldInner : {}),
                ...(world.elevated ? styles.sirensWorldInner : {}),
                direction: index % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              <div
                style={{
                  ...styles.worldCopy,
                  ...(world.elevated ? styles.sirensWorldCopy : {}),
                  direction: "ltr",
                }}
              >
                <p style={styles.eyebrow}>{world.eyebrow}</p>
                <h2 style={styles.worldTitle}>{world.title}</h2>
                <p style={styles.sectionText}>{world.text}</p>

                {world.categories && (
                  <div style={styles.categoryRow}>
                    {world.categories.map((category) => (
                      <span key={category} style={styles.categoryPill}>
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={world.path}
                  style={
                    world.variant === "gold" ? styles.goldBtn : styles.lightBtn
                  }
                >
                  {world.button}
                </Link>
              </div>

              <div
                style={{
                  ...styles.worldPanel,
                  ...(world.elevated ? styles.sirensWorldPanel : {}),
                  direction: "ltr",
                }}
              >
                <p style={styles.panelEyebrow}>{world.panelEyebrow}</p>
                <h3 style={styles.panelTitle}>{world.panelTitle}</h3>
                <p style={styles.panelText}>{world.panelText}</p>
              </div>
            </div>
          </section>
        ))}
      </section>

      <section style={styles.screeningSection}>
        <div style={styles.sectionInnerNarrow}>
          <p style={styles.eyebrow}>FEATURED SCREENING</p>
          <h2 style={styles.sectionTitle}>Who Is The Aset Studio</h2>

          <div style={styles.videoFrame}>
            {loading ? (
              <div style={styles.placeholder}>Preparing screening...</div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
                poster={poster || undefined}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setReady(true)}
                style={{
                  ...styles.video,
                  opacity: ready ? 1 : 0,
                }}
              />
            ) : (
              <div style={styles.placeholder}>
                Featured screening coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={styles.featuredSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.eyebrow}>CURATED FROM THE STUDIO</p>
              <h2 style={styles.sectionTitle}>Featured Work</h2>
            </div>

            <Link to="/videos" style={styles.textLink}>
              View Aset Cinema →
            </Link>
          </div>

          {loadingFeatured ? (
            <div style={styles.placeholderCard}>Loading featured work...</div>
          ) : featuredItems.length === 0 ? (
            <div style={styles.placeholderCard}>
              Featured work is being prepared.
            </div>
          ) : (
            <div style={styles.featuredStrip}>
              {featuredItems.map((item) => {
                const itemUrl = featuredUrls[item.id];
                const isVideo =
                  String(item.type || "").trim().toLowerCase() === "video";

                return (
                  <Link
                    key={item.id}
                    to={
                      isVideo && item.slug ? `/video/${item.slug}` : "/gallery"
                    }
                    style={styles.featuredCard}
                  >
                    <div style={styles.featuredMediaWrap}>
                      {itemUrl ? (
                        isVideo ? (
                          <video
                            src={itemUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            style={styles.featuredMedia}
                            onMouseEnter={(e) => {
                              e.currentTarget.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        ) : (
                          <img
                            src={itemUrl}
                            alt={item.title || "Featured work"}
                            style={styles.featuredMedia}
                          />
                        )
                      ) : (
                        <div style={styles.mediaFallback}>
                          Preview unavailable
                        </div>
                      )}

                      <div style={styles.featuredOverlay} />
                    </div>

                    <div style={styles.featuredMeta}>
                      <p style={styles.featuredType}>
                        {item.category ||
                          (isVideo ? "Aset Cinema" : "Featured")}
                      </p>

                      <h3 style={styles.featuredTitle}>
                        {item.title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section style={styles.portalSection}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>ENTER THE STUDIO</p>

          <div style={styles.portalGrid}>
            <Link to="/gallery" style={styles.portalCard}>
              Gallery
            </Link>
            <Link to="/videos" style={styles.portalCard}>
              Aset Cinema
            </Link>
            <Link to="/aset-spotlight" style={styles.portalCard}>
              Aset Spotlight
            </Link>
            <Link to="/sirens-realm" style={styles.portalCard}>
              Sirens Realm
            </Link>
            <Link to="/creators" style={styles.portalCard}>
              Creators
            </Link>
            <Link to="/services" style={styles.portalCard}>
              Services
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
    background: "#050505",
    color: "#f5f1eb",
  },

  hero: {
    minHeight: "92vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 22px 92px",
    overflow: "hidden",
    background: "#050505",
  },

  heroImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 42%",
    opacity: 0.9,
    transform: "scale(1.015)",
  },

  heroShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.3) 48%, rgba(5,5,5,0.98) 100%), radial-gradient(circle at center, rgba(0,0,0,0.04), rgba(0,0,0,0.76))",
  },

  heroShell: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 1180,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 360px",
    gap: 28,
    alignItems: "center",
  },

  heroContent: {
    width: "100%",
    maxWidth: 720,
    textAlign: "left",
  },

  brand: {
    margin: "0 0 12px",
    fontSize: 11,
    letterSpacing: "0.36em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.72)",
  },

  headline: {
    margin: "0 0 16px",
    fontSize: "clamp(40px, 5.5vw, 72px)",
    lineHeight: 0.9,
    letterSpacing: "-0.058em",
    fontWeight: 850,
    textShadow: "0 20px 70px rgba(0,0,0,0.92)",
  },

  subtext: {
    maxWidth: 640,
    margin: "0 0 26px",
    fontSize: 15,
    lineHeight: 1.75,
    color: "rgba(245,241,235,0.84)",
    textShadow: "0 10px 35px rgba(0,0,0,0.82)",
  },

  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  spotlightCard: {
    display: "block",
    overflow: "hidden",
    borderRadius: 24,
    textDecoration: "none",
    color: "#f5f1eb",
    border: "1px solid rgba(245,241,235,0.18)",
    background: "rgba(5,5,5,0.72)",
    boxShadow:
      "0 60px 160px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    transform: "scale(1.05)",
  },

  spotlightImage: {
    position: "relative",
    width: "100%",
    height: 360,
    backgroundSize: "cover",
    backgroundPosition: "center 28%",
    backgroundColor: "rgba(255,255,255,0.04)",
    filter: "brightness(0.95) contrast(1.05)",
  },

  spotlightImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 44%, rgba(0,0,0,0.76) 100%)",
  },

  spotlightBody: {
    padding: "18px 18px 20px",
    background:
      "linear-gradient(180deg, rgba(10,10,10,0.94), rgba(0,0,0,0.98))",
  },

  spotlightEyebrow: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.58)",
  },

  spotlightTitle: {
    margin: "0 0 8px",
    fontSize: 25,
    lineHeight: 1,
    letterSpacing: "-0.035em",
  },

  spotlightText: {
    margin: "0 0 14px",
    fontSize: 13,
    lineHeight: 1.55,
    color: "rgba(245,241,235,0.72)",
  },

  spotlightButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.22)",
    color: "#f5f1eb",
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: "0.02em",
  },

  goldBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #c58d36, #f1d08a)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 850,
    letterSpacing: "0.03em",
    boxShadow: "0 18px 50px rgba(151,101,33,0.26)",
  },

  lightBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    borderRadius: 999,
    background: "#f5f1eb",
    color: "#111",
    textDecoration: "none",
    fontWeight: 850,
    letterSpacing: "0.03em",
  },

  worldsWrap: {
    marginTop: "28px",
    paddingTop: "8px",
    background:
      "linear-gradient(180deg, #050505 0%, #080706 50%, #050505 100%)",
  },

  worldSection: {
    padding: "54px 22px",
    borderBottom: "1px solid rgba(245,241,235,0.055)",
  },

  featuredWorldSection: {
    padding: "90px 22px",
    background:
      "radial-gradient(circle at center, rgba(214,168,79,0.18), transparent 60%)",
  },

  sirensWorldSection: {
    padding: "48px 22px 72px",
    marginTop: "-18px",
    background:
      "radial-gradient(circle at 50% 22%, rgba(198,136,55,0.18), transparent 58%), linear-gradient(180deg, rgba(53,29,13,0.26), rgba(5,5,5,0.98))",
  },

  worldInner: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.18fr) minmax(280px, 0.82fr)",
    gap: 24,
    alignItems: "stretch",
  },

  featuredWorldInner: {
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.6fr)",
    transform: "scale(1.02)",
  },

  sirensWorldInner: {
    maxWidth: 1120,
    transform: "translateY(-18px)",
  },

  worldCopy: {
    borderRadius: 20,
    padding: "38px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.043), rgba(255,255,255,0.016))",
    border: "1px solid rgba(245,241,235,0.085)",
    boxShadow: "0 26px 80px rgba(0,0,0,0.38)",
  },

  sirensWorldCopy: {
    background:
      "linear-gradient(180deg, rgba(95,51,22,0.32), rgba(255,255,255,0.018))",
    border: "1px solid rgba(214,168,79,0.18)",
    boxShadow:
      "0 30px 90px rgba(0,0,0,0.52), 0 0 70px rgba(198,136,55,0.08)",
  },

  worldTitle: {
    margin: "0 0 16px",
    maxWidth: 760,
    fontSize: "clamp(34px, 4.5vw, 60px)",
    lineHeight: 0.96,
    letterSpacing: "-0.052em",
    fontWeight: 850,
  },

  categoryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
    margin: "0 0 26px",
  },

  categoryPill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.12)",
    background: "rgba(255,255,255,0.035)",
    color: "rgba(245,241,235,0.78)",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  worldPanel: {
    borderRadius: 20,
    padding: "32px",
    background:
      "linear-gradient(160deg, rgba(198,136,55,0.16), rgba(255,255,255,0.025) 46%, rgba(0,0,0,0.22))",
    border: "1px solid rgba(245,241,235,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: 300,
    boxShadow: "0 26px 80px rgba(0,0,0,0.38)",
  },

  sirensWorldPanel: {
    minHeight: 260,
    background:
      "linear-gradient(160deg, rgba(198,136,55,0.22), rgba(65,29,14,0.26) 48%, rgba(0,0,0,0.34))",
    border: "1px solid rgba(214,168,79,0.2)",
  },

  panelEyebrow: {
    margin: "0 0 10px",
    fontSize: 10,
    letterSpacing: "0.28em",
    color: "rgba(245,241,235,0.52)",
  },

  panelTitle: {
    margin: "0 0 10px",
    fontSize: 34,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  panelText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(245,241,235,0.7)",
  },

  screeningSection: {
    padding: "76px 22px 86px",
    background:
      "linear-gradient(180deg, #050505 0%, #080808 48%, #050505 100%)",
  },

  sectionInner: {
    maxWidth: 1180,
    margin: "0 auto",
  },

  sectionInnerNarrow: {
    maxWidth: 980,
    margin: "0 auto",
  },

  eyebrow: {
    margin: "0 0 11px",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.5)",
  },

  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "clamp(30px, 4vw, 46px)",
    lineHeight: 1.02,
    letterSpacing: "-0.038em",
    fontWeight: 850,
  },

  sectionText: {
    margin: "0 0 26px",
    maxWidth: 720,
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.72)",
  },

  videoFrame: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 28,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.1)",
    boxShadow:
      "0 60px 160px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "opacity 1s ease",
    background: "#000",
  },

  placeholder: {
    height: "100%",
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.68)",
    background: "rgba(255,255,255,0.025)",
  },

  featuredSection: {
    padding: "78px 22px",
    background:
      "linear-gradient(180deg, #050505 0%, #070707 48%, #050505 100%)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 22,
    flexWrap: "wrap",
  },

  textLink: {
    color: "rgba(245,241,235,0.74)",
    textDecoration: "none",
    fontSize: 14,
  },

  placeholderCard: {
    borderRadius: 22,
    padding: "30px 24px",
    textAlign: "center",
    color: "rgba(245,241,235,0.68)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },

  featuredStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
  },

  featuredCard: {
    display: "block",
    overflow: "hidden",
    borderRadius: 22,
    textDecoration: "none",
    color: "#fff",
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
    boxShadow: "0 20px 54px rgba(0,0,0,0.25)",
  },

  featuredMediaWrap: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  featuredMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  featuredOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.56))",
  },

  mediaFallback: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.55)",
  },

  featuredMeta: {
    padding: 16,
  },

  featuredType: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.5)",
  },

  featuredTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.22,
    letterSpacing: "-0.02em",
  },

  portalSection: {
    padding: "38px 22px 92px",
    background: "#050505",
  },

  portalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },

  portalCard: {
    padding: "20px 18px",
    borderRadius: 18,
    textDecoration: "none",
    color: "#f5f1eb",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.023)",
  },
};