import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const [featuredVideoId, setFeaturedVideoId] = useState(null);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");
  const [featuredVideoPoster, setFeaturedVideoPoster] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredItemUrls, setFeaturedItemUrls] = useState({});
  const [loadingFeaturedItems, setLoadingFeaturedItems] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const heroImageSrc = `${process.env.PUBLIC_URL}/images/aset-hero.png`;
  const peopleImageSrc = `${process.env.PUBLIC_URL}/images/aset-person.png`;

  const portalCards = [
    {
      title: "Gallery",
      text: "Explore the public visual archive and immersive image collections.",
      path: "/gallery",
    },
    {
      title: "Featured",
      text: "Enter the curated front-facing showcase of highlighted Aset work.",
      path: "/featured",
    },
    {
      title: "Video Archive",
      text: "Enter cinematic interviews, visual storytelling, and featured screenings.",
      path: "/videos",
    },
    {
      title: "Creators Hub",
      text: "Step into the creator side of The Aset Studio.",
      path: "/creators",
    },
    {
      title: "The People of Aset",
      text: "Explore recognized individuals, elite profiles, and featured talent.",
      path: "/talent",
    },
    {
      title: "Sirens Realm",
      text: "Step into the spiritual, mythic, and alchemical side of the world.",
      path: "/sirens-realm",
    },
    {
      title: "Aset Lounge",
      text: "Enter the social and community side of the platform.",
      path: "/lounge",
    },
    {
      title: "Supreme Access",
      text: "Unlock the premium side of The Aset Studio experience.",
      path: "/supreme-access",
    },
    {
      title: "Services",
      text: "Explore creative services, bookings, and premium offerings.",
      path: "/services",
    },
  ];

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedVideo() {
      setLoadingVideo(true);
      setVideoReady(false);

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("*")
          .eq("type", "video")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (!mounted) return;

        if (!data?.file_path) {
          setFeaturedVideoId(null);
          setFeaturedVideoUrl("");
          setFeaturedVideoPoster("");
          setLoadingVideo(false);
          return;
        }

        setFeaturedVideoId(data.id);

        const { data: signedVideo, error: signedVideoError } =
          await supabase.storage
            .from("media")
            .createSignedUrl(data.file_path, 3600);

        if (!mounted) return;
        if (signedVideoError) throw signedVideoError;

        setFeaturedVideoUrl(signedVideo?.signedUrl || "");

        if (data.watermarked_path) {
          const { data: signedPoster } = await supabase.storage
            .from("media")
            .createSignedUrl(data.watermarked_path, 3600);

          if (!mounted) return;
          setFeaturedVideoPoster(signedPoster?.signedUrl || "");
        } else {
          setFeaturedVideoPoster("");
        }
      } catch (err) {
        console.error("Error loading featured video:", err);
        if (!mounted) return;
        setFeaturedVideoId(null);
        setFeaturedVideoUrl("");
        setFeaturedVideoPoster("");
      } finally {
        if (mounted) setLoadingVideo(false);
      }
    }

    loadFeaturedVideo();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedItems() {
      setLoadingFeaturedItems(true);

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("*")
          .eq("featured", true)
          .eq("status", "published")
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;
        if (!mounted) return;

        const allItems = data || [];
        const items =
          featuredVideoId != null
            ? allItems.filter((item) => item.id !== featuredVideoId)
            : allItems;

        setFeaturedItems(items);

        const signedMap = {};

        for (const item of items) {
          if (!item.file_path) {
            signedMap[item.id] = null;
            continue;
          }

          const { data: signedData, error: signedError } =
            await supabase.storage
              .from("media")
              .createSignedUrl(item.file_path, 3600);

          if (!mounted) return;

          signedMap[item.id] = signedError
            ? null
            : signedData?.signedUrl || null;
        }

        setFeaturedItemUrls(signedMap);
      } catch (err) {
        console.error("Error loading featured items:", err);
        if (!mounted) return;
        setFeaturedItems([]);
        setFeaturedItemUrls({});
      } finally {
        if (mounted) setLoadingFeaturedItems(false);
      }
    }

    loadFeaturedItems();

    return () => {
      mounted = false;
    };
  }, [featuredVideoId]);

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      setLoadingReviews(true);

      try {
        const { data, error } = await supabase
          .from("service_reviews")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        if (!mounted) return;

        setReviews(data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
        if (!mounted) return;
        setReviews([]);
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    }

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  const heroInnerStyle = {
    ...styles.heroInner,
    maxWidth: isMobile ? 980 : 1220,
  };

  const heroRowStyle = {
    ...styles.heroRow,
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
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

  const introGridStyle = {
    ...styles.introGrid,
    gridTemplateColumns: isMobile
      ? "1fr"
      : "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
  };

  const portalGridStyle = {
    ...styles.portalGrid,
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
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

        <div style={heroInnerStyle}>
          <div style={heroRowStyle}>
            <div style={heroLeftStyle}>
              <div style={styles.brand}>THE ASET STUDIO</div>

              <h1 style={styles.headline}>
                A Creative Temple of Image, Sound &amp; Sovereignty.
              </h1>

              <p style={styles.subtext}>
                Egyptian royalty. Mythic cinema. A siren&apos;s whisper beneath
                the surface.
              </p>

              <div
                style={{
                  ...styles.ctaRow,
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
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

            <div style={heroRightStyle}>
              <div style={styles.peoplePanel}>
                <img
                  src={peopleImageSrc}
                  alt="The People of Aset"
                  style={styles.peopleImage}
                />

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

      <section style={styles.introSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionEyebrow}>WHO IS THE ASET STUDIO</div>

          <div style={introGridStyle}>
            <div style={styles.introVideoWrap}>
              {loadingVideo ? (
                <div style={styles.introPlaceholder}>
                  Loading featured experience...
                </div>
              ) : featuredVideoUrl ? (
                <video
                  src={featuredVideoUrl}
                  poster={featuredVideoPoster || undefined}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setVideoReady(true)}
                  style={{
                    ...styles.introVideo,
                    opacity: videoReady ? 1 : 0,
                    transform: videoReady ? "scale(1)" : "scale(1.02)",
                    transition: "opacity 1.6s ease, transform 1.6s ease",
                    filter: "brightness(0.92) contrast(1.05)",
                  }}
                />
              ) : (
                <div style={styles.introPlaceholder}>
                  Featured video coming soon.
                </div>
              )}
            </div>

            <div style={styles.introCard}>
              <h2 style={styles.sectionTitle}>
                A world built for image, story, sound, and power.
              </h2>

              <p style={styles.sectionText}>
                The Aset Studio is not just a platform. It is a cinematic
                ecosystem built for galleries, creators, immersive storytelling,
                elevated visual culture, and premium digital experiences.
              </p>

              <p style={styles.sectionText}>
                Enter a world where beauty, mythology, sensuality, sovereignty,
                and media all move together under one identity.
              </p>

              <div style={styles.introActions}>
                <Link to="/videos" style={styles.primaryBtn}>
                  Enter Video Archive
                </Link>

                <Link to="/creators" style={styles.secondaryBtn}>
                  Explore Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.featuredSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionEyebrow}>FEATURED PREVIEW</div>

          <h2 style={styles.sectionTitleCenter}>
            A glimpse into the world of Aset.
          </h2>

          {loadingFeaturedItems ? (
            <div style={styles.featuredLoading}>Loading featured work...</div>
          ) : featuredItems.length === 0 ? (
            <div style={styles.featuredLoading}>
              Featured work is being rebuilt.
            </div>
          ) : (
            <div style={styles.featuredStrip}>
              {featuredItems.map((item) => {
                const itemUrl = featuredItemUrls[item.id];
                const isVideo =
                  String(item.type || "").trim().toLowerCase() === "video";

                return (
                  <Link
                    key={item.id}
                    to={isVideo ? `/media/${item.id}` : "/gallery"}
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
                            alt={item.title || "Featured item"}
                            style={styles.featuredMedia}
                          />
                        )
                      ) : (
                        <div style={styles.featuredFallback}>
                          Preview unavailable
                        </div>
                      )}

                      <div style={styles.featuredOverlay} />
                    </div>

                    <div style={styles.featuredMeta}>
                      <div style={styles.featuredType}>
                        {isVideo ? "VIDEO" : "FEATURED"}
                      </div>

                      <div style={styles.featuredTitle}>
                        {item.title || "Untitled"}
                      </div>
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
          <div style={styles.sectionEyebrow}>ENTER THE PLATFORM</div>

          <h2 style={styles.sectionTitleCenter}>Choose your path.</h2>

          <div style={portalGridStyle}>
            {portalCards.map((portal) => (
              <Link key={portal.path} to={portal.path} style={styles.portalCard}>
                <div style={styles.portalTitle}>{portal.title}</div>
                <div style={styles.portalText}>{portal.text}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.reviewSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionEyebrow}>TESTIMONIALS</div>

          <h2 style={styles.sectionTitleCenter}>
            What people are saying about Aset.
          </h2>

          {loadingReviews ? (
            <div style={styles.featuredLoading}>Loading testimonials...</div>
          ) : reviews.length === 0 ? (
            <div style={styles.featuredLoading}>
              Testimonials and reviews are coming soon.
            </div>
          ) : (
            <div
              style={{
                ...styles.reviewGrid,
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(0, 1fr))",
              }}
            >
              {reviews.map((review) => {
                const name =
                  review.name ||
                  review.client_name ||
                  review.reviewer_name ||
                  "Client";

                const text =
                  review.review_text ||
                  review.testimonial ||
                  review.message ||
                  review.body ||
                  "";

                const service =
                  review.service_name || review.service || "The Aset Studio";

                return (
                  <div key={review.id} style={styles.reviewCard}>
                    <div style={styles.quoteMark}>“</div>

                    <p style={styles.reviewText}>
                      {text || "A beautiful experience with The Aset Studio."}
                    </p>

                    <div style={styles.reviewDivider} />

                    <div style={styles.reviewName}>{name}</div>
                    <div style={styles.reviewService}>{service}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerLine}>
          The Aset Studio — building a world of image, sound, story, and
          sovereignty since 2025.
        </div>
      </footer>
    </div>
  );
}

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
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.72))",
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
    opacity: 0.88,
  },

  headline: {
    fontSize: "clamp(34px,6vw,56px)",
    fontFamily: "Georgia",
    marginBottom: 16,
    lineHeight: 1.02,
  },

  subtext: {
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 1.7,
    opacity: 0.9,
    maxWidth: 560,
  },

  ctaRow: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#d4af37",
    padding: "14px 18px",
    borderRadius: 12,
    color: "#000",
    textDecoration: "none",
    fontWeight: 700,
  },

  ghostBtn: {
    border: "1px solid gold",
    padding: "14px 18px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#fff",
    fontWeight: 600,
  },

  secondaryBtn: {
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "14px 18px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#fff",
    fontWeight: 600,
    background: "rgba(255,255,255,0.03)",
  },

  note: {
    fontSize: 12,
    opacity: 0.8,
  },

  peoplePanel: {
    width: 320,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(212,175,55,0.8)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    background: "rgba(0,0,0,0.5)",
  },

  peopleImage: {
    width: "100%",
    height: 400,
    objectFit: "cover",
    objectPosition: "center 15%",
    display: "block",
  },

  peopleContent: {
    padding: 16,
    background: "rgba(0,0,0,0.85)",
  },

  peopleTitle: {
    fontSize: 22,
    marginBottom: 8,
    fontFamily: "Georgia",
  },

  peopleSubtext: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 1.6,
    opacity: 0.9,
  },

  peopleButton: {
    display: "block",
    padding: 12,
    border: "1px solid gold",
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 600,
  },

  introSection: {
    position: "relative",
    padding: "72px 20px 48px",
    background:
      "linear-gradient(180deg, #050507 0%, #09090d 40%, #08080a 100%)",
  },

  featuredSection: {
    position: "relative",
    padding: "24px 20px 56px",
    background:
      "linear-gradient(180deg, #08080a 0%, #070709 50%, #050507 100%)",
  },

  portalSection: {
    position: "relative",
    padding: "24px 20px 72px",
    background: "linear-gradient(180deg, #050507 0%, #050507 100%)",
  },

  reviewSection: {
    position: "relative",
    padding: "24px 20px 72px",
    background:
      "linear-gradient(180deg, #050507 0%, #08080a 50%, #050507 100%)",
  },

  sectionInner: {
    maxWidth: 1220,
    margin: "0 auto",
  },

  sectionEyebrow: {
    fontSize: 12,
    letterSpacing: "0.22em",
    marginBottom: 16,
    opacity: 0.68,
  },

  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.08,
    margin: "0 0 18px",
    fontFamily: "Georgia",
  },

  sectionTitleCenter: {
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.08,
    margin: "0 0 26px",
    fontFamily: "Georgia",
    textAlign: "center",
  },

  sectionText: {
    fontSize: 15,
    lineHeight: 1.8,
    opacity: 0.9,
    marginBottom: 16,
  },

  introGrid: {
    display: "grid",
    gap: 24,
    alignItems: "stretch",
  },

  introVideoWrap: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    background: "#000",
    minHeight: 320,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.48)",
  },

  introVideo: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    minHeight: 320,
    background: "#000",
  },

  introPlaceholder: {
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
    color: "rgba(242,240,234,0.78)",
    background: "rgba(255,255,255,0.02)",
  },

  introCard: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    padding: 28,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  introActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 8,
  },

  featuredLoading: {
    borderRadius: 18,
    padding: "28px 20px",
    textAlign: "center",
    color: "rgba(242,240,234,0.74)",
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  featuredStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },

  featuredCard: {
    textDecoration: "none",
    color: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  featuredMediaWrap: {
    position: "relative",
    aspectRatio: "16 / 10",
    overflow: "hidden",
    background: "#0c0c0c",
  },

  featuredMedia: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    background: "#000",
  },

  featuredFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    textAlign: "center",
    color: "rgba(242,240,234,0.65)",
  },

  featuredOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)",
    pointerEvents: "none",
  },

  featuredMeta: {
    padding: 16,
  },

  featuredType: {
    fontSize: 11,
    letterSpacing: "0.18em",
    opacity: 0.65,
    marginBottom: 8,
  },

  featuredTitle: {
    fontSize: 18,
    lineHeight: 1.3,
    fontFamily: "Georgia",
  },

  portalGrid: {
    display: "grid",
    gap: 18,
  },

  portalCard: {
    textDecoration: "none",
    color: "#fff",
    borderRadius: 20,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
  },

  portalTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: "Georgia",
  },

  portalText: {
    fontSize: 14,
    lineHeight: 1.7,
    opacity: 0.84,
  },

  reviewGrid: {
    display: "grid",
    gap: 18,
  },

  reviewCard: {
    position: "relative",
    borderRadius: 22,
    padding: 24,
    border: "1px solid rgba(212,175,55,0.22)",
    background:
      "linear-gradient(180deg, rgba(212,175,55,0.08), rgba(255,255,255,0.018))",
    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
    overflow: "hidden",
  },

  quoteMark: {
    position: "absolute",
    top: 8,
    right: 18,
    fontFamily: "Georgia",
    fontSize: 72,
    lineHeight: 1,
    color: "rgba(212,175,55,0.22)",
  },

  reviewText: {
    position: "relative",
    zIndex: 1,
    fontSize: 15,
    lineHeight: 1.8,
    opacity: 0.92,
    margin: "0 0 18px",
  },

  reviewDivider: {
    height: 1,
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },

  reviewName: {
    fontFamily: "Georgia",
    fontSize: 18,
    marginBottom: 4,
  },

  reviewService: {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(212,175,55,0.82)",
  },

  footer: {
    padding: "34px 20px 48px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "#050507",
    textAlign: "center",
  },

  footerLine: {
    maxWidth: 900,
    margin: "0 auto",
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(242,240,234,0.58)",
    lineHeight: 1.8,
  },
};