import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const heroImage = `${process.env.PUBLIC_URL}/images/aset-powerhouse.png`;
  const spotlightImage = `${process.env.PUBLIC_URL}/images/aset-person.png`;

  const [screeningItem, setScreeningItem] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const getInitialWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 1200;

  const [width, setWidth] = useState(getInitialWidth);

  const isMobile = width <= 760;
  const isTablet = width > 760 && width <= 1050;

  const worlds = [
    {
      eyebrow: "ASET CINEMA",
      title: "The release room for the world we are building.",
      text:
        "A controlled stage for studio releases, interviews, cinematic tests, visual campaigns, and original worlds.",
      panelEyebrow: "NOW PRESENTING",
      panelTitle: "Aset Cinema",
      panelText:
        "Not a feed. Not a shelf. A curated premiere environment.",
      path: "/videos",
      button: "Open Aset Cinema",
      variant: "light",
      featured: true,
      categories: [
        "Studio Releases",
        "Interviews",
        "Visual Releases",
        "Original Worlds",
      ],
    },

    {
      eyebrow: "ASET SPOTLIGHT",
      title: "Recognition is part of the studio system.",
      text:
        "Aset Spotlight is where established entertainment professionals and people who have put in the work are honored and showcased with intention.",
      panelEyebrow: "INVITATION ONLY",
      panelTitle: "Aset Spotlight",
      panelText:
        "A place for visibility, recognition, and studio-level presentation.",
      path: "/aset-spotlight",
      button: "Explore Aset Spotlight",
      variant: "gold",
    },

    {
      eyebrow: "MANAGERS DOOR",
      title:
        "Honoring the professionals behind extraordinary careers.",
      text:
        "Managers Door is an invitation-only executive presentation experience created to honor and showcase entertainment managers, executives, and industry professionals whose leadership helps shape creative careers.",
      panelEyebrow: "EXECUTIVE PRESENTATIONS",
      panelTitle: "Managers Door",
      panelText:
        "Presented by The Aset Studio. Honored. Showcased. Remembered.",
      path: "/managers",
      button: "Enter Managers Door",
      variant: "gold",
    },

    {
      eyebrow: "BRICK BY BRICK",
      title: "Dynasties are not inherited. They are taken.",
      text:
        "A cinematic soap opera world of old-money families, secret alliances, dangerous romance, organized power, and the calculated rise of Crown.",
      panelEyebrow: "ASET STUDIO ORIGINAL",
      panelTitle: "Brick by Brick",
      panelText:
        "A prestige dramatic universe where loyalty is currency, betrayal is inevitable, and power changes the people who survive long enough to hold it.",
      path: "/brick-by-brick",
      button: "Enter Brick by Brick",
      variant: "gold",
    },

    {
      eyebrow: "COLLECTIVES",
      title: "The creative rooms inside the larger studio.",
      text:
        "Collectives bring together creative professionals, aligned services, and specialized communities within The Aset Studio ecosystem.",
      panelEyebrow: "STUDIO ECOSYSTEM",
      panelTitle: "Collectives",
      panelText:
        "A connected space for creative groups, collaborations, and organized cultural movement.",
      path: "/collectives",
      button: "Open Collectives",
      variant: "light",
    },

    {
      eyebrow: "SERVICES",
      title:
        "Professional support for people building at a higher level.",
      text:
        "The Aset Studio offers executive virtual assistance, creative support, branding, visibility, and operational help for serious clients.",
      panelEyebrow: "WORK WITH US",
      panelTitle: "Services",
      panelText:
        "Structured support for business owners, creatives, talent, and professionals who need things handled.",
      path: "/services",
      button: "View Services",
      variant: "gold",
    },

    {
      eyebrow: "PHOTOGRAPHY STUDIO",
      title: "Photography that feels beautifully real.",
      text:
        "Photoshoot-quality portraits, beauty editorials, branding images, fashion photography, and custom visual creations produced virtually by The Aset Studio.",
      panelEyebrow: "VIRTUAL PHOTOGRAPHY",
      panelTitle: "Photography Studio",
      panelText:
        "Portraiture, beauty, fashion, branding, and custom photography without the limits of a physical studio.",
      path: "/photography-studio",
      button: "Enter Photography Studio",
      variant: "gold",
    },

    {
      eyebrow: "THE GALLERY",
      title: "Enter the Gallery",
      text:
        "A curated exhibition of original visual work from The Aset Studio, including artwork, creative concepts, and finished visual pieces.",
      panelEyebrow: "ASET GALLERY",
      panelTitle: "Gallery",
      panelText:
        "Original visual work presented as part of The Aset Studio collection.",
      path: "/gallery",
      button: "Open Gallery",
      variant: "light",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadHomepageScreening() {
      setLoading(true);
      setReady(false);

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("*")
          .eq("homepage_featured", true)
          .eq("status", "published")
          .eq("is_hidden", false)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        if (!data?.file_path) {
          setScreeningItem(null);
          setVideoUrl("");
          setLoading(false);
          return;
        }

        const path =
          data.watermarked_path || data.file_path;

        const { data: signed } =
          await supabase.storage
            .from("media")
            .createSignedUrl(path, 3600);

        setScreeningItem(data);
        setVideoUrl(
          signed?.signedUrl || ""
        );

        setLoading(false);
      } catch (error) {
        console.error(
          "Homepage screening load failed:",
          error
        );

        if (!mounted) {
          return;
        }

        setScreeningItem(null);
        setVideoUrl("");
        setLoading(false);
      }
    }

    loadHomepageScreening();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          padding: isMobile
            ? "130px 18px 70px"
            : "135px 22px 95px",
        }}
      >
        <div
          style={{
            ...styles.heroImage,
            backgroundImage: `url("${heroImage}")`,
            backgroundPosition: isMobile
              ? "center top"
              : "center 42%",
          }}
        />

        <div style={styles.heroShade} />

        <div style={styles.heroCenterShell}>
          <div style={styles.heroCenterContent}>
            <p style={styles.brand}>
              THE ASET STUDIO
            </p>

            <h1
              style={{
                ...styles.headline,
                fontSize: isMobile
                  ? "44px"
                  : "clamp(48px, 6vw, 86px)",
              }}
            >
              Egyptian Mystic
              <br />
              Powerhouse
            </h1>

            <p style={styles.subtext}>
              A cinematic entertainment company
              shaped by image, sound, story,
              mythology, talent, and sovereign
              creative presentation.
            </p>

            <div style={styles.ctaRow}>
              <Link
                to="/videos"
                style={styles.goldBtn}
              >
                Enter Aset Cinema
              </Link>
            </div>
          </div>

          {/* FLAGSHIP DOORS */}
          <div
            style={{
              ...styles.flagshipGrid,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(2, minmax(0, 1fr))",
            }}
          >
            <Link
              to="/aset-spotlight"
              style={styles.flagshipCard}
            >
              <div
                style={{
                  ...styles.flagshipImage,
                  backgroundImage: `url("${spotlightImage}")`,
                }}
              >
                <div
                  style={
                    styles.flagshipImageOverlay
                  }
                />
              </div>

              <p style={styles.flagshipEyebrow}>
                INVITATION ONLY
              </p>

              <h3 style={styles.flagshipTitle}>
                Aset Spotlight
              </h3>

              <p style={styles.flagshipText}>
                Honoring established artists,
                actors, filmmakers, musicians,
                storytellers, and entertainment
                professionals who have put in the
                work.
              </p>

              <span
                style={styles.flagshipButton}
              >
                Enter Spotlight →
              </span>
            </Link>

            <Link
              to="/managers"
              style={styles.flagshipCard}
            >
              <div style={styles.flagshipSeal}>
                MD
              </div>

              <p style={styles.flagshipEyebrow}>
                INVITATION ONLY
              </p>

              <h3 style={styles.flagshipTitle}>
                Managers Door
              </h3>

              <p style={styles.flagshipText}>
                Honoring managers, executives,
                and industry professionals whose
                leadership helps shape creative
                careers.
              </p>

              <span
                style={styles.flagshipButton}
              >
                Enter Managers →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO WORLDS */}
      <section style={styles.worldsWrap}>
        {worlds.map((world, index) => (
          <section
            key={world.title}
            style={{
              ...styles.worldSection,
              ...(world.featured
                ? styles.featuredWorldSection
                : {}),
            }}
          >
            <div
              style={{
                ...styles.worldInner,

                ...(world.featured &&
                !isMobile &&
                !isTablet
                  ? styles.featuredWorldInner
                  : {}),

                gridTemplateColumns:
                  isMobile || isTablet
                    ? "1fr"
                    : world.featured
                    ? "minmax(0, 1.6fr) minmax(320px, 0.6fr)"
                    : "minmax(0, 1.18fr) minmax(280px, 0.82fr)",

                direction:
                  isMobile || isTablet
                    ? "ltr"
                    : index % 2 === 1
                    ? "rtl"
                    : "ltr",
              }}
            >
              <div
                style={{
                  ...styles.worldCopy,
                  direction: "ltr",
                }}
              >
                <p style={styles.eyebrow}>
                  {world.eyebrow}
                </p>

                <h2 style={styles.worldTitle}>
                  {world.title}
                </h2>

                <p style={styles.sectionText}>
                  {world.text}
                </p>

                {world.categories && (
                  <div
                    style={styles.categoryRow}
                  >
                    {world.categories.map(
                      (category) => (
                        <span
                          key={category}
                          style={
                            styles.categoryPill
                          }
                        >
                          {category}
                        </span>
                      )
                    )}
                  </div>
                )}

                <Link
                  to={world.path}
                  style={
                    world.variant === "gold"
                      ? styles.goldBtn
                      : styles.lightBtn
                  }
                >
                  {world.button}
                </Link>
              </div>

              <div
                style={{
                  ...styles.worldPanel,
                  direction: "ltr",
                }}
              >
                <p style={styles.panelEyebrow}>
                  {world.panelEyebrow}
                </p>

                <h3 style={styles.panelTitle}>
                  {world.panelTitle}
                </h3>

                <p style={styles.panelText}>
                  {world.panelText}
                </p>
              </div>
            </div>
          </section>
        ))}
      </section>

      {/* SCREENING */}
      <section style={styles.screeningSection}>
        <div style={styles.sectionInnerNarrow}>
          <div style={styles.screeningHeader}>
            <div>
              <p style={styles.eyebrow}>
                NOW SCREENING
              </p>

              <h2 style={styles.sectionTitle}>
                {screeningItem?.title ||
                  "Inside The Aset Studio"}
              </h2>

              <p style={styles.screeningText}>
                {screeningItem?.description ||
                  screeningItem?.tagline ||
                  "A controlled cinematic environment for original releases, interviews, studio conversations, visual campaigns, and creative presentation."}
              </p>
            </div>

            <div style={styles.screeningBadge}>
              <span
                style={styles.screeningDot}
              />

              FEATURED PRESENTATION
            </div>
          </div>

          <div style={styles.screeningFrame}>
            <div
              style={styles.screeningOverlay}
            />

            {loading ? (
              <div style={styles.placeholder}>
                Preparing screening environment...
              </div>
            ) : videoUrl ? (
              <>
                <video
                  src={videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() =>
                    setReady(true)
                  }
                  style={{
                    ...styles.video,
                    opacity: ready ? 1 : 0,
                  }}
                />

                <div
                  style={
                    styles.screeningContent
                  }
                >
                  <p
                    style={
                      styles.screeningMini
                    }
                  >
                    THE ASET STUDIO
                  </p>

                  <h3
                    style={
                      styles.screeningTitle
                    }
                  >
                    {screeningItem?.title ||
                      "Cinematic Presentation Environment"}
                  </h3>

                  <p
                    style={
                      styles.screeningDescription
                    }
                  >
                    {screeningItem?.quote ||
                      "Original worlds, visual storytelling, interviews, studio releases, and evolving cinematic identity systems."}
                  </p>

                  <div
                    style={
                      styles.screeningActions
                    }
                  >
                    <Link
                      to={
                        screeningItem?.id
                          ? `/media/${screeningItem.id}`
                          : "/videos"
                      }
                      style={styles.goldBtn}
                    >
                      Open Screening
                    </Link>

                    <Link
                      to="/services"
                      style={styles.lightBtn}
                    >
                      Work With The Studio
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.placeholder}>
                Featured screening coming soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ENTER THE STUDIO */}
      <section style={styles.portalSection}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>
            ENTER THE STUDIO
          </p>

          <div style={styles.portalGrid}>
            <Link
              to="/videos"
              style={styles.portalCard}
            >
              Aset Cinema
            </Link>

            <Link
              to="/aset-spotlight"
              style={styles.portalCard}
            >
              Aset Spotlight
            </Link>

            <Link
              to="/managers"
              style={styles.portalCard}
            >
              Managers Door
            </Link>

            <Link
              to="/brick-by-brick"
              style={styles.portalCard}
            >
              Brick by Brick
            </Link>

            <Link
              to="/collectives"
              style={styles.portalCard}
            >
              Collectives
            </Link>

            <Link
              to="/services"
              style={styles.portalCard}
            >
              Services
            </Link>

            <Link
              to="/photography-studio"
              style={styles.portalCard}
            >
              Photography Studio
            </Link>

            <Link
              to="/gallery"
              style={styles.portalCard}
            >
              Gallery
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
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "#050505",
  },

  heroImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    opacity: 0.9,
    transform: "scale(1.015)",
  },

  heroShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.42) 48%, rgba(5,5,5,0.98) 100%), radial-gradient(circle at center, rgba(0,0,0,0.04), rgba(0,0,0,0.78))",
  },

  heroCenterShell: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 1180,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 42,
  },

  heroCenterContent: {
    width: "100%",
    maxWidth: 780,
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
    lineHeight: 0.9,
    letterSpacing: "-0.058em",
    fontWeight: 850,
    textShadow:
      "0 20px 70px rgba(0,0,0,0.92)",
  },

  subtext: {
    maxWidth: 640,
    margin: "0 0 26px",
    fontSize: 15,
    lineHeight: 1.75,
    color: "rgba(245,241,235,0.84)",
    textShadow:
      "0 10px 35px rgba(0,0,0,0.82)",
  },

  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  flagshipGrid: {
    width: "100%",
    display: "grid",
    gap: 18,
    marginTop: 12,
  },

  flagshipCard: {
    minHeight: 300,
    padding: "32px",
    borderRadius: 26,
    textDecoration: "none",
    color: "#f5f1eb",
    border:
      "1px solid rgba(245,241,235,0.14)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(0,0,0,0.78))",
    boxShadow:
      "0 40px 120px rgba(0,0,0,0.55)",
    overflow: "hidden",
  },

  flagshipImage: {
    height: 220,
    margin: "-32px -32px 24px",
    borderRadius: "26px 26px 0 0",
    backgroundSize: "cover",
    backgroundPosition: "center 25%",
    position: "relative",
    overflow: "hidden",
  },

  flagshipImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.76))",
  },

  flagshipSeal: {
    width: 92,
    height: 92,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    marginBottom: 26,
    border:
      "1px solid rgba(245,241,235,0.18)",
    background:
      "radial-gradient(circle at center, rgba(197,141,54,0.28), rgba(0,0,0,0.72))",
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: "-0.08em",
  },

  flagshipEyebrow: {
    margin: "0 0 10px",
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(214,168,79,0.88)",
    fontWeight: 900,
  },

  flagshipTitle: {
    margin: "0 0 12px",
    fontSize: 32,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  flagshipText: {
    margin: "0 0 22px",
    maxWidth: 520,
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(245,241,235,0.72)",
  },

  flagshipButton: {
    display: "inline-flex",
    color: "#f1d08a",
    fontWeight: 900,
  },

  goldBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, #c58d36, #f1d08a)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 850,
    letterSpacing: "0.03em",
    boxShadow:
      "0 18px 50px rgba(151,101,33,0.26)",
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
    borderBottom:
      "1px solid rgba(245,241,235,0.055)",
  },

  featuredWorldSection: {
    padding: "90px 22px",
    background:
      "radial-gradient(circle at center, rgba(214,168,79,0.18), transparent 60%)",
  },

  worldInner: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gap: 24,
    alignItems: "stretch",
  },

  featuredWorldInner: {
    transform: "scale(1.02)",
  },

  worldCopy: {
    borderRadius: 20,
    padding: "38px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.043), rgba(255,255,255,0.016))",
    border:
      "1px solid rgba(245,241,235,0.085)",
    boxShadow:
      "0 26px 80px rgba(0,0,0,0.38)",
  },

  worldTitle: {
    margin: "0 0 16px",
    maxWidth: 760,
    fontSize:
      "clamp(34px, 4.5vw, 60px)",
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
    border:
      "1px solid rgba(245,241,235,0.12)",
    background:
      "rgba(255,255,255,0.035)",
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
    border:
      "1px solid rgba(245,241,235,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: 300,
    boxShadow:
      "0 26px 80px rgba(0,0,0,0.38)",
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

  eyebrow: {
    margin: "0 0 11px",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.5)",
  },

  sectionTitle: {
    margin: "0 0 24px",
    fontSize:
      "clamp(34px, 4.4vw, 58px)",
    lineHeight: 0.98,
    letterSpacing: "-0.05em",
    fontWeight: 900,
  },

  sectionText: {
    margin: "0 0 26px",
    maxWidth: 720,
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.72)",
  },

  screeningSection: {
    position: "relative",
    padding: "110px 22px 120px",
    background:
      "radial-gradient(circle at center, rgba(198,136,55,0.14), transparent 42%), linear-gradient(180deg, #050505 0%, #080808 48%, #050505 100%)",
    overflow: "hidden",
  },

  sectionInner: {
    maxWidth: 1180,
    margin: "0 auto",
  },

  sectionInnerNarrow: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1120,
    margin: "0 auto",
  },

  screeningHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 28,
    flexWrap: "wrap",
  },

  screeningText: {
    maxWidth: 760,
    margin: 0,
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.72)",
  },

  screeningBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    borderRadius: 999,
    border:
      "1px solid rgba(245,241,235,0.12)",
    background:
      "rgba(255,255,255,0.03)",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.72)",
  },

  screeningDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#c58d36",
    boxShadow:
      "0 0 14px rgba(197,141,54,0.9)",
  },

  screeningFrame: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 36,
    overflow: "hidden",
    background: "#000",
    border:
      "1px solid rgba(245,241,235,0.12)",
    boxShadow:
      "0 80px 220px rgba(0,0,0,0.92), 0 0 80px rgba(198,136,55,0.08)",
  },

  screeningOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.88) 100%)",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "opacity 1s ease",
    background: "#000",
    filter:
      "brightness(0.9) contrast(1.04)",
  },

  placeholder: {
    height: "100%",
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.68)",
    background:
      "rgba(255,255,255,0.025)",
  },

  screeningContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    padding: "42px",
  },

  screeningMini: {
    margin: "0 0 12px",
    fontSize: 10,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.66)",
  },

  screeningTitle: {
    margin: "0 0 14px",
    maxWidth: 620,
    fontSize:
      "clamp(32px, 4vw, 58px)",
    lineHeight: 0.94,
    letterSpacing: "-0.05em",
    fontWeight: 900,
  },

  screeningDescription: {
    maxWidth: 620,
    margin: "0 0 24px",
    fontSize: 15,
    lineHeight: 1.72,
    color: "rgba(245,241,235,0.78)",
  },

  screeningActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  portalSection: {
    padding: "38px 22px 92px",
    background: "#050505",
  },

  portalGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },

  portalCard: {
    padding: "20px 18px",
    borderRadius: 18,
    textDecoration: "none",
    color: "#f5f1eb",
    border:
      "1px solid rgba(245,241,235,0.08)",
    background:
      "rgba(255,255,255,0.023)",
  },
};