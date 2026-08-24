import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "media";
const SIGNED_URL_SECONDS = 60 * 30;

export default function PhotographyStudioPage() {
  const location = useLocation();

  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [afterDarkChoice, setAfterDarkChoice] = useState("");
  const [vision, setVision] = useState("");

  const bookingReference = useMemo(() => {
    const params = new URLSearchParams(location.search);

    const source = params.get("source");
    const imageId = params.get("imageId");
    const imageTitle = params.get("imageTitle");

    if (
      source !== "after-dark" ||
      !imageId
    ) {
      return null;
    }

    return {
      source,
      imageId,
      imageTitle:
        imageTitle || "Selected After Dark Look",
    };
  }, [location.search]);

  const scrollToPortfolio = () => {
    document
      .getElementById("photography-portfolio")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToBooking = () => {
    document
      .getElementById("photography-booking")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const createSignedUrl = useCallback(async (filePath) => {
    if (!filePath) return "";

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(
        filePath,
        SIGNED_URL_SECONDS
      );

    if (error) {
      console.error(
        "Photography signed URL error:",
        error
      );

      return "";
    }

    return data?.signedUrl || "";
  }, []);

  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true);
    setPortfolioError("");

    try {
      const { data, error } = await supabase
        .from("photography_portfolio")
        .select(
          "id, title, file_path, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const itemsWithUrls = await Promise.all(
        (data || []).map(async (item) => ({
          ...item,
          signed_url: await createSignedUrl(
            item.file_path
          ),
        }))
      );

      setPortfolioItems(
        itemsWithUrls.filter(
          (item) => Boolean(item.signed_url)
        )
      );
    } catch (error) {
      console.error(
        "Photography portfolio load error:",
        error
      );

      setPortfolioError(
        error?.message ||
          "The Photography Portfolio could not be loaded."
      );
    } finally {
      setLoadingPortfolio(false);
    }
  }, [createSignedUrl]);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    if (!bookingReference) {
      return;
    }

    const timer = window.setTimeout(() => {
      document
        .getElementById("photography-booking")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [bookingReference]);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

  const featuredPhoto =
    portfolioItems.length > 0
      ? portfolioItems[0]
      : null;

  function handleBookingSubmit(event) {
    event.preventDefault();

    if (
      bookingReference &&
      !afterDarkChoice
    ) {
      alert(
        "Please choose how you want to use the selected After Dark look."
      );

      return;
    }

    alert(
      bookingReference
        ? "After Dark photography request received."
        : "Photography request received."
    );
  }

  return (
    <main style={styles.page}>
      <style>{responsiveStyles}</style>

      {/* PHOTOGRAPHY STUDIO NAV */}
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          THE ASET STUDIO
        </Link>

        <nav style={styles.nav}>
          <Link
            to="/"
            style={styles.navLink}
          >
            Home
          </Link>

          <Link
            to="/services"
            style={styles.navLink}
          >
            Services
          </Link>

          <button
            type="button"
            onClick={scrollToPortfolio}
            style={styles.navButton}
          >
            Portfolio
          </button>

          <button
            type="button"
            onClick={scrollToBooking}
            style={styles.goldNavButton}
          >
            Book
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="photography-hero"
        style={styles.hero}
      >
        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>
            VIRTUAL PHOTOGRAPHY STUDIO
          </p>

          <h1 style={styles.heroTitle}>
            Photography that feels
            <span style={styles.goldText}>
              {" "}
              beautifully real.
            </span>
          </h1>

          <p style={styles.heroDescription}>
            Photoshoot-quality portraits, beauty
            editorials, branding images, fashion
            photography and custom visual creations
            produced virtually by The Aset Studio.
          </p>

          <div style={styles.heroButtons}>
            <button
              type="button"
              onClick={scrollToPortfolio}
              style={styles.primaryButton}
            >
              Explore the Portfolio
            </button>

            <button
              type="button"
              onClick={scrollToBooking}
              style={styles.secondaryButton}
            >
              Request a Session
            </button>
          </div>
        </div>

        <div style={styles.heroCard}>
          {featuredPhoto ? (
            <button
              type="button"
              className="photography-featured-button"
              onClick={() =>
                setSelectedPhoto(featuredPhoto)
              }
            >
              <img
                src={featuredPhoto.signed_url}
                alt={featuredPhoto.title}
                style={styles.heroFeaturedImage}
              />

              <div
                style={styles.heroFeaturedShade}
              />

              <div
                style={styles.heroFeaturedInfo}
              >
                <span
                  style={styles.heroFeaturedLabel}
                >
                  FEATURED PORTRAIT
                </span>

                <h2
                  style={styles.heroFeaturedTitle}
                >
                  {featuredPhoto.title}
                </h2>
              </div>
            </button>
          ) : (
            <div style={styles.heroCardImage}>
              <span style={styles.placeholderText}>
                {loadingPortfolio
                  ? "LOADING PORTRAIT"
                  : "FEATURED PORTRAIT"}
              </span>
            </div>
          )}

          <p style={styles.heroCardCaption}>
            Professional virtual photography created
            with direction, imagination and polished
            studio detail.
          </p>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section
        className="photography-two-column"
        style={styles.introSection}
      >
        <div style={styles.sectionHeadingWrap}>
          <p style={styles.eyebrow}>
            THE EXPERIENCE
          </p>

          <h2 style={styles.sectionTitle}>
            A photoshoot without the limits of a
            physical studio.
          </h2>
        </div>

        <div style={styles.introCopy}>
          <p style={styles.bodyText}>
            The Aset Studio creates premium images
            that look and feel like professional
            photography sessions. Clients can submit
            their own photographs, request a
            transformation or bring us a completely
            new visual idea.
          </p>

          <p style={styles.bodyText}>
            Our focus is polished portraiture,
            beauty, fashion, branding, lifestyle and
            editorial work. Cinematic movie scenes
            remain inside The Aset Cinema.
          </p>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section
        id="photography-portfolio"
        style={styles.portfolioSection}
      >
        <div
          className="photography-portfolio-header"
          style={styles.portfolioHeader}
        >
          <div>
            <p style={styles.eyebrow}>
              SELECTED WORK
            </p>

            <h2 style={styles.sectionTitle}>
              The Photography Portfolio
            </h2>
          </div>

          <p style={styles.portfolioNote}>
            No categories. Just our strongest
            photoshoot-level work.
          </p>
        </div>

        {loadingPortfolio ? (
          <div style={styles.portfolioState}>
            Preparing the Photography Portfolio...
          </div>
        ) : portfolioError ? (
          <div
            style={{
              ...styles.portfolioState,
              ...styles.portfolioError,
            }}
          >
            {portfolioError}
          </div>
        ) : portfolioItems.length === 0 ? (
          <div style={styles.portfolioState}>
            New photography is being prepared for
            the portfolio.
          </div>
        ) : (
          <div className="photography-portfolio-grid">
            {portfolioItems.map((item) => (
              <article
                key={item.id}
                className="photography-portfolio-card"
              >
                <button
                  type="button"
                  className="photography-photo-button"
                  onClick={() =>
                    setSelectedPhoto(item)
                  }
                  aria-label={`Open ${item.title}`}
                >
                  <img
                    src={item.signed_url}
                    alt={item.title}
                    loading="lazy"
                    className="photography-portfolio-image"
                  />
                </button>

                <div className="photography-card-info">
                  <h3 className="photography-card-title">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CREATE ANYTHING */}
      <section
        className="photography-two-column"
        style={styles.createSection}
      >
        <div style={styles.createContent}>
          <p style={styles.eyebrow}>
            CREATE ANYTHING
          </p>

          <h2 style={styles.createTitle}>
            Bring the idea.
            <br />
            We will build the image.
          </h2>

          <p style={styles.createDescription}>
            Request a luxury portrait, beauty
            campaign, branding image,
            magazine-style editorial, album cover,
            professional headshot, family portrait
            or an original concept created
            specifically for you.
          </p>

          <button
            type="button"
            onClick={scrollToBooking}
            style={styles.primaryButton}
          >
            Start Your Vision
          </button>
        </div>

        <div style={styles.createList}>
          {[
            "Virtual portrait sessions",
            "Beauty and fashion editorials",
            "Professional branding images",
            "Photo transformations",
            "Retouching and restoration",
            "Custom creative concepts",
          ].map((service, index) => (
            <div
              key={service}
              style={styles.serviceRow}
            >
              <span style={styles.serviceNumber}>
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <span style={styles.serviceName}>
                {service}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.processSection}>
        <div style={styles.sectionHeadingWrap}>
          <p style={styles.eyebrow}>
            THE PROCESS
          </p>

          <h2 style={styles.sectionTitle}>
            From your vision to the final portrait.
          </h2>
        </div>

        <div className="photography-process-grid">
          {[
            {
              number: "01",
              title: "Share Your Vision",
              text:
                "Tell us what you want to create and provide reference photographs or inspiration.",
            },
            {
              number: "02",
              title: "Creative Direction",
              text:
                "We shape the concept, style, wardrobe, setting, composition and overall visual direction.",
            },
            {
              number: "03",
              title: "Studio Creation",
              text:
                "Your final images are created, refined, retouched and prepared for professional delivery.",
            },
            {
              number: "04",
              title: "Final Delivery",
              text:
                "Approved photographs are delivered digitally in high-quality formats.",
            },
          ].map((step) => (
            <article
              key={step.number}
              style={styles.processCard}
            >
              <span style={styles.processNumber}>
                {step.number}
              </span>

              <h3 style={styles.processTitle}>
                {step.title}
              </h3>

              <p style={styles.processText}>
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="photography-booking"
        className="photography-booking-grid"
        style={styles.bookingSection}
      >
        <div style={styles.bookingIntro}>
          <p style={styles.eyebrow}>
            REQUEST A SESSION
          </p>

          <h2 style={styles.bookingTitle}>
            Your next portrait begins with a
            conversation.
          </h2>

          <p style={styles.bookingDescription}>
            Send us your idea and preferred contact
            information. Approved sessions will
            receive payment and text-confirmation
            instructions.
          </p>

          {bookingReference && (
            <div style={styles.afterDarkReference}>
              <p
                style={
                  styles.afterDarkReferenceEyebrow
                }
              >
                ASET STUDIO AFTER DARK
              </p>

              <h3
                style={
                  styles.afterDarkReferenceTitle
                }
              >
                Selected Look
              </h3>

              <p
                style={
                  styles.afterDarkReferenceName
                }
              >
                {bookingReference.imageTitle}
              </p>

              <p
                style={
                  styles.afterDarkReferenceText
                }
              >
                This After Dark concept will stay
                attached to your photography request.
              </p>
            </div>
          )}

          <div style={styles.bookingDetails}>
            <p style={styles.detailLine}>
              <strong style={styles.detailLabel}>
                Payment:
              </strong>{" "}
              Cash App
            </p>

            <p style={styles.detailLine}>
              <strong style={styles.detailLabel}>
                Confirmation:
              </strong>{" "}
              Text message
            </p>

            <p style={styles.detailLine}>
              <strong style={styles.detailLabel}>
                Studio:
              </strong>{" "}
              Fully virtual
            </p>
          </div>
        </div>

        <form
          style={styles.form}
          onSubmit={handleBookingSubmit}
        >
          {bookingReference && (
            <>
              <div style={styles.afterDarkFormBanner}>
                <p
                  style={
                    styles.afterDarkFormEyebrow
                  }
                >
                  BOOK THIS LOOK
                </p>

                <h3
                  style={
                    styles.afterDarkFormTitle
                  }
                >
                  {bookingReference.imageTitle}
                </h3>

                <input
                  type="hidden"
                  name="source"
                  value="after-dark"
                />

                <input
                  type="hidden"
                  name="afterDarkImageId"
                  value={
                    bookingReference.imageId
                  }
                />

                <input
                  type="hidden"
                  name="afterDarkImageTitle"
                  value={
                    bookingReference.imageTitle
                  }
                />
              </div>

              <fieldset
                style={styles.choiceFieldset}
              >
                <legend
                  style={styles.choiceLegend}
                >
                  How would you like to use this
                  look?
                </legend>

                <label
                  style={{
                    ...styles.choiceCard,
                    ...(afterDarkChoice ===
                    "recreate"
                      ? styles.choiceCardActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="afterDarkChoice"
                    value="recreate"
                    checked={
                      afterDarkChoice ===
                      "recreate"
                    }
                    onChange={(event) =>
                      setAfterDarkChoice(
                        event.target.value
                      )
                    }
                    style={styles.radio}
                  />

                  <span>
                    <strong
                      style={
                        styles.choiceTitle
                      }
                    >
                      Recreate This Look
                    </strong>

                    <span
                      style={
                        styles.choiceDescription
                      }
                    >
                      Build your session around the
                      same overall concept, styling,
                      lighting, environment and
                      visual direction.
                    </span>
                  </span>
                </label>

                <label
                  style={{
                    ...styles.choiceCard,
                    ...(afterDarkChoice ===
                    "inspiration"
                      ? styles.choiceCardActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="afterDarkChoice"
                    value="inspiration"
                    checked={
                      afterDarkChoice ===
                      "inspiration"
                    }
                    onChange={(event) =>
                      setAfterDarkChoice(
                        event.target.value
                      )
                    }
                    style={styles.radio}
                  />

                  <span>
                    <strong
                      style={
                        styles.choiceTitle
                      }
                    >
                      Use This as Inspiration
                    </strong>

                    <span
                      style={
                        styles.choiceDescription
                      }
                    >
                      Use the selected image as the
                      creative starting point while
                      developing something
                      personalized for you.
                    </span>
                  </span>
                </label>
              </fieldset>
            </>
          )}

          <label style={styles.label}>
            Full Name

            <input
              type="text"
              name="fullName"
              required
              placeholder="Enter your full name"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Email

            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Phone Number

            <input
              type="tel"
              name="phone"
              required
              placeholder="Enter your phone number"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Desired Turnaround

            <select
              name="turnaround"
              required
              style={styles.input}
            >
              <option value="">
                Select a timeframe
              </option>

              <option value="standard">
                Standard
              </option>

              <option value="priority">
                Priority
              </option>

              <option value="flexible">
                Flexible
              </option>
            </select>
          </label>

          <label style={styles.label}>
            Describe Your Vision

            <textarea
              name="vision"
              required
              rows="7"
              value={vision}
              onChange={(event) =>
                setVision(event.target.value)
              }
              placeholder={
                bookingReference
                  ? "Tell us what you want to keep, change or personalize from the selected After Dark look..."
                  : "Tell us what you would like The Aset Studio to create..."
              }
              style={styles.textarea}
            />
          </label>

          <button
            type="submit"
            style={styles.submitButton}
          >
            {bookingReference
              ? "Submit After Dark Photography Request"
              : "Submit Photography Request"}
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerBrand}>
          THE ASET STUDIO
        </p>

        <p style={styles.footerText}>
          Virtual Photography Studio · Professional
          Visual Creation
        </p>

        <p style={styles.footerCopyright}>
          © {new Date().getFullYear()} The Aset Studio
        </p>
      </footer>

      {/* FULL IMAGE VIEWER */}
      {selectedPhoto ? (
        <div
          className="photography-viewer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelectedPhoto(null);
            }
          }}
        >
          <section
            className="photography-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
          >
            <button
              type="button"
              className="photography-viewer-close"
              onClick={() =>
                setSelectedPhoto(null)
              }
              aria-label="Close photograph"
            >
              ×
            </button>

            <div className="photography-viewer-image-wrap">
              <img
                src={selectedPhoto.signed_url}
                alt={selectedPhoto.title}
                className="photography-viewer-image"
              />
            </div>

            <div className="photography-viewer-info">
              <p className="photography-viewer-eyebrow">
                THE ASET STUDIO PHOTOGRAPHY
              </p>

              <h2 className="photography-viewer-title">
                {selectedPhoto.title}
              </h2>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#f4f0e8",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
  },

  header: {
    minHeight: 72,
    padding: "0 4vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    position: "sticky",
    top: 0,
    zIndex: 100,
    background:
      "rgba(5, 5, 5, 0.92)",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
  },

  brand: {
    color: "#ffffff",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.2em",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  navLink: {
    color: "#d8d3ca",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    padding: "10px 12px",
  },

  navButton: {
    border: "none",
    background: "transparent",
    color: "#d8d3ca",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    padding: "10px 12px",
  },

  goldNavButton: {
    border: "1px solid #d8b16f",
    borderRadius: 999,
    background: "transparent",
    color: "#e5c17e",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    padding: "9px 18px",
  },

  hero: {
    minHeight: "calc(100vh - 72px)",
    padding: "8vw 7vw",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.1fr) minmax(300px, 0.72fr)",
    alignItems: "center",
    gap: "7vw",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 75% 25%, rgba(205,157,89,0.18), transparent 35%), linear-gradient(120deg, #060606 0%, #0d0b09 55%, #050505 100%)",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45))",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 760,
  },

  eyebrow: {
    margin: "0 0 18px",
    color: "#d7ae6a",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.22em",
  },

  heroTitle: {
    margin: 0,
    maxWidth: 850,
    fontSize:
      "clamp(3.3rem, 7vw, 7.2rem)",
    fontWeight: 500,
    lineHeight: 0.93,
    letterSpacing: "-0.055em",
  },

  goldText: {
    color: "#d7ae6a",
  },

  heroDescription: {
    maxWidth: 660,
    margin: "28px 0 0",
    color: "#c5c0b8",
    fontFamily: "Arial, sans-serif",
    fontSize:
      "clamp(1rem, 1.5vw, 1.18rem)",
    lineHeight: 1.8,
  },

  heroButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 34,
  },

  primaryButton: {
    padding: "15px 24px",
    border: "1px solid #d7ae6a",
    borderRadius: 999,
    background: "#d7ae6a",
    color: "#090807",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    fontWeight: 800,
  },

  secondaryButton: {
    padding: "15px 24px",
    border:
      "1px solid rgba(255,255,255,0.25)",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.03)",
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    fontWeight: 700,
  },

  heroCard: {
    position: "relative",
    zIndex: 2,
    justifySelf: "center",
    width: "min(100%, 450px)",
  },

  heroCardImage: {
    minHeight: 560,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(145deg, rgba(216,177,111,0.25), rgba(255,255,255,0.03)), #111",
    border:
      "1px solid rgba(255,255,255,0.12)",
    boxShadow:
      "0 40px 100px rgba(0,0,0,0.5)",
  },

  heroFeaturedImage: {
    width: "100%",
    height: 560,
    display: "block",
    objectFit: "cover",
  },

  heroFeaturedShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.88), transparent 58%)",
  },

  heroFeaturedInfo: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    textAlign: "left",
  },

  heroFeaturedLabel: {
    display: "block",
    marginBottom: 9,
    color: "#d7ae6a",
    fontFamily: "Arial, sans-serif",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.2em",
  },

  heroFeaturedTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 500,
  },

  placeholderText: {
    color: "rgba(255,255,255,0.35)",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    letterSpacing: "0.25em",
  },

  heroCardCaption: {
    margin: "16px 0 0",
    color: "#a8a29a",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    lineHeight: 1.7,
  },

  introSection: {
    padding: "110px 7vw",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(300px, 0.8fr)",
    gap: "8vw",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  },

  sectionHeadingWrap: {
    maxWidth: 760,
  },

  sectionTitle: {
    margin: 0,
    fontSize:
      "clamp(2.5rem, 5vw, 5rem)",
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  introCopy: {
    alignSelf: "end",
  },

  bodyText: {
    margin: "0 0 20px",
    color: "#bdb7ae",
    fontFamily: "Arial, sans-serif",
    fontSize: 16,
    lineHeight: 1.9,
  },

  portfolioSection: {
    padding: "105px 5vw",
    background: "#080808",
  },

  portfolioHeader: {
    maxWidth: 1500,
    margin: "0 auto",
    padding: "0 0 40px",
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 40,
  },

  portfolioNote: {
    maxWidth: 330,
    color: "#99938b",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    lineHeight: 1.7,
  },

  portfolioState: {
    maxWidth: 1500,
    margin: "0 auto",
    padding: "90px 24px",
    textAlign: "center",
    color: "#99938b",
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    background: "#0d0d0d",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  portfolioError: {
    color: "#efc6c6",
  },

  createSection: {
    padding: "120px 7vw",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(320px, 0.85fr)",
    gap: "9vw",
    alignItems: "center",
  },

  createContent: {
    maxWidth: 760,
  },

  createTitle: {
    margin: 0,
    fontSize:
      "clamp(3rem, 6vw, 6.5rem)",
    fontWeight: 500,
    lineHeight: 0.98,
    letterSpacing: "-0.055em",
  },

  createDescription: {
    maxWidth: 650,
    margin: "28px 0 34px",
    color: "#bdb7ae",
    fontFamily: "Arial, sans-serif",
    fontSize: 16,
    lineHeight: 1.85,
  },

  createList: {
    borderTop:
      "1px solid rgba(255,255,255,0.15)",
  },

  serviceRow: {
    minHeight: 76,
    display: "grid",
    gridTemplateColumns: "55px 1fr",
    alignItems: "center",
    borderBottom:
      "1px solid rgba(255,255,255,0.12)",
  },

  serviceNumber: {
    color: "#d7ae6a",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    fontWeight: 800,
  },

  serviceName: {
    color: "#f4f0e8",
    fontSize: 21,
  },

  processSection: {
    padding: "110px 7vw",
    background: "#0a0a0a",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
  },

  processCard: {
    minHeight: 280,
    padding: 28,
    background: "#0f0f0f",
    border:
      "1px solid rgba(255,255,255,0.09)",
  },

  processNumber: {
    color: "#d7ae6a",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    fontWeight: 800,
  },

  processTitle: {
    margin: "80px 0 15px",
    fontSize: 24,
    fontWeight: 500,
  },

  processText: {
    margin: 0,
    color: "#a9a39b",
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    lineHeight: 1.75,
  },

  bookingSection: {
    padding: "120px 7vw",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 0.85fr) minmax(360px, 1fr)",
    gap: "9vw",
  },

  bookingIntro: {
    alignSelf: "start",
    position: "sticky",
    top: 110,
  },

  bookingTitle: {
    margin: 0,
    fontSize:
      "clamp(2.8rem, 5vw, 5.7rem)",
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "-0.045em",
  },

  bookingDescription: {
    maxWidth: 560,
    margin: "25px 0",
    color: "#b6b0a8",
    fontFamily: "Arial, sans-serif",
    fontSize: 15,
    lineHeight: 1.85,
  },

  afterDarkReference: {
    marginTop: 30,
    padding: 24,
    background:
      "linear-gradient(145deg, #1b1b1b, #090909)",
    border:
      "1px solid rgba(255,255,255,0.13)",
  },

  afterDarkReferenceEyebrow: {
    margin: "0 0 10px",
    color: "#9d9d9d",
    fontFamily: "Arial, sans-serif",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.22em",
  },

  afterDarkReferenceTitle: {
    margin: "0 0 8px",
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 500,
  },

  afterDarkReferenceName: {
    margin: "0 0 12px",
    color: "#d7ae6a",
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    fontWeight: 800,
  },

  afterDarkReferenceText: {
    margin: 0,
    color: "#999",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    lineHeight: 1.7,
  },

  bookingDetails: {
    marginTop: 34,
    paddingTop: 26,
    borderTop:
      "1px solid rgba(255,255,255,0.12)",
  },

  detailLine: {
    color: "#aaa49c",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
  },

  detailLabel: {
    color: "#f4f0e8",
  },

  form: {
    padding: 32,
    display: "grid",
    gap: 18,
    background: "#0d0d0d",
    border:
      "1px solid rgba(255,255,255,0.1)",
  },

  afterDarkFormBanner: {
    paddingBottom: 20,
    marginBottom: 4,
    borderBottom:
      "1px solid rgba(255,255,255,0.1)",
  },

  afterDarkFormEyebrow: {
    margin: "0 0 8px",
    color: "#9d9d9d",
    fontFamily: "Arial, sans-serif",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.22em",
  },

  afterDarkFormTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 500,
  },

  choiceFieldset: {
    margin: 0,
    padding: 0,
    display: "grid",
    gap: 10,
    border: "none",
  },

  choiceLegend: {
    marginBottom: 10,
    color: "#d5d0c7",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fontWeight: 800,
  },

  choiceCard: {
    padding: 18,
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: 12,
    alignItems: "start",
    cursor: "pointer",
    background: "#121212",
    border:
      "1px solid rgba(255,255,255,0.1)",
  },

  choiceCardActive: {
    background: "#181613",
    border:
      "1px solid rgba(215,174,106,0.7)",
  },

  radio: {
    marginTop: 4,
  },

  choiceTitle: {
    display: "block",
    marginBottom: 6,
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
  },

  choiceDescription: {
    display: "block",
    color: "#999",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    lineHeight: 1.6,
  },

  label: {
    display: "grid",
    gap: 9,
    color: "#d5d0c7",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 14px",
    border:
      "1px solid rgba(255,255,255,0.13)",
    borderRadius: 4,
    outline: "none",
    background: "#151515",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 14px",
    border:
      "1px solid rgba(255,255,255,0.13)",
    borderRadius: 4,
    outline: "none",
    resize: "vertical",
    background: "#151515",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },

  submitButton: {
    minHeight: 52,
    border: "none",
    borderRadius: 4,
    background: "#d7ae6a",
    color: "#090807",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    fontWeight: 900,
  },

  footer: {
    padding: "65px 7vw",
    textAlign: "center",
    borderTop:
      "1px solid rgba(255,255,255,0.09)",
  },

  footerBrand: {
    margin: "0 0 12px",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.22em",
  },

  footerText: {
    margin: "0 0 10px",
    color: "#9d978f",
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
  },

  footerCopyright: {
    margin: 0,
    color: "#706b65",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
  },
};

const responsiveStyles = `
  .photography-featured-button {
    width: 100%;
    padding: 0;
    position: relative;
    display: block;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    background: #111;
    cursor: pointer;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  }

  .photography-featured-button img {
    transition: transform 420ms ease;
  }

  .photography-featured-button:hover img {
    transform: scale(1.025);
  }

  .photography-portfolio-grid {
    width: min(100%, 1500px);
    margin: 0 auto;
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 28px;
  }

  .photography-portfolio-card {
    min-width: 0;
    overflow: hidden;
    background: #0d0d0d;
    border: 1px solid rgba(255,255,255,0.09);
    transition:
      transform 240ms ease,
      border-color 240ms ease,
      box-shadow 240ms ease;
  }

  .photography-portfolio-card:hover {
    transform: translateY(-5px);
    border-color: rgba(215,174,106,0.42);
    box-shadow:
      0 20px 50px rgba(0,0,0,0.42);
  }

  .photography-photo-button {
    width: 100%;
    padding: 0;
    display: block;
    overflow: hidden;
    border: none;
    background: #080808;
    cursor: pointer;
  }

  .photography-portfolio-image {
    width: 100%;
    aspect-ratio: 4 / 5;
    display: block;
    object-fit: cover;
    transition: transform 400ms ease;
  }

  .photography-photo-button:hover
  .photography-portfolio-image {
    transform: scale(1.025);
  }

  .photography-card-info {
    padding: 20px;
  }

  .photography-card-title {
    margin: 0;
    color: #ffffff;
    font-family:
      Georgia,
      "Times New Roman",
      serif;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.15;
  }

  .photography-process-grid {
    margin-top: 55px;
    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
    gap: 15px;
  }

  .photography-viewer-backdrop {
    position: fixed;
    inset: 0;
    z-index: 6000;
    padding: 28px;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    overflow-y: auto;
    background: rgba(0,0,0,0.94);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .photography-viewer {
    width: min(100%, 1200px);
    position: relative;
    overflow: hidden;
    background: #080808;
    border:
      1px solid rgba(255,255,255,0.12);
    box-shadow:
      0 40px 120px rgba(0,0,0,0.7);
  }

  .photography-viewer-close {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 3;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border:
      1px solid rgba(255,255,255,0.2);
    background: rgba(10,10,10,0.86);
    color: #ffffff;
    cursor: pointer;
    font-size: 20px;
  }

  .photography-viewer-image-wrap {
    width: 100%;
    max-height: 78vh;
    display: grid;
    place-items: center;
    background: #030303;
  }

  .photography-viewer-image {
    max-width: 100%;
    max-height: 78vh;
    display: block;
    object-fit: contain;
  }

  .photography-viewer-info {
    padding: 25px 28px 30px;
    border-top:
      1px solid rgba(255,255,255,0.08);
  }

  .photography-viewer-eyebrow {
    margin: 0 0 10px;
    color: #d7ae6a;
    font-family: Arial, sans-serif;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.22em;
  }

  .photography-viewer-title {
    margin: 0;
    color: #f4f0e8;
    font-family:
      Georgia,
      "Times New Roman",
      serif;
    font-size:
      clamp(2rem, 4vw, 4rem);
    font-weight: 500;
    line-height: 1;
  }

  @media (max-width: 1100px) {
    .photography-portfolio-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .photography-process-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 850px) {
    .photography-hero,
    .photography-two-column,
    .photography-booking-grid {
      grid-template-columns: 1fr !important;
    }

    .photography-hero {
      min-height: auto !important;
      padding-top: 90px !important;
      padding-bottom: 90px !important;
    }

    .photography-portfolio-header {
      align-items: flex-start !important;
      flex-direction: column;
    }
  }

  @media (max-width: 650px) {
    .photography-portfolio-grid,
    .photography-process-grid {
      grid-template-columns: 1fr;
    }

    .photography-viewer-backdrop {
      padding: 0;
    }

    .photography-viewer {
      width: 100%;
      min-height: 100vh;
      border: none;
    }

    .photography-viewer-image-wrap {
      min-height: 68vh;
    }

    .photography-card-title {
      font-size: 24px;
    }
  }
`;