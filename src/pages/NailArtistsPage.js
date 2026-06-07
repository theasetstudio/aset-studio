import React from "react";
import { Link } from "react-router-dom";

export default function NailArtistsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <p style={styles.breadcrumb}>
            The Aset Studio / Collectives / Aset Beauty Collective
          </p>

          <h1 style={styles.title}>Nail Artists</h1>

          <p style={styles.subtitle}>
            Discover nail artists contributing detail, polish, and visual
            character to beauty, editorial, and entertainment work.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>DISCOVERY FILTERS</p>

        <h2 style={styles.sectionTitle}>Find the right professional.</h2>

        <div style={styles.filters}>
          <select style={styles.select} defaultValue="">
            <option value="">Country</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Nigeria">Nigeria</option>
          </select>

          <select style={styles.select} defaultValue="">
            <option value="">State / Region</option>
            <option value="Georgia">Georgia</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="England">England</option>
          </select>

          <select style={styles.select} defaultValue="">
            <option value="">City</option>
            <option value="Atlanta">Atlanta</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="New York">New York</option>
            <option value="London">London</option>
          </select>

          <select style={styles.select} defaultValue="">
            <option value="">Specialty</option>
            <option value="Editorial Nails">Editorial Nails</option>
            <option value="Luxury Sets">Luxury Sets</option>
            <option value="Commercial">Commercial</option>
            <option value="Runway">Runway</option>
            <option value="Celebrity">Celebrity</option>
            <option value="Press-On Design">Press-On Design</option>
            <option value="Creative Nail Art">Creative Nail Art</option>
          </select>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>FEATURED</p>

        <h2 style={styles.sectionTitle}>Featured Nail Artists</h2>

        <p style={styles.sectionText}>
          Hand-selected nail artists will appear here as the Collective grows.
        </p>

        <div style={styles.featuredGrid}>
          <div style={styles.featuredCard}>
            <div style={styles.featuredImage} />
            <div style={styles.cardBody}>
              <p style={styles.cardLabel}>Featured Nail Artist</p>
              <h3 style={styles.cardTitle}>Coming Soon</h3>
              <p style={styles.cardMeta}>Global</p>
            </div>
          </div>

          <div style={styles.featuredCard}>
            <div style={styles.featuredImage} />
            <div style={styles.cardBody}>
              <p style={styles.cardLabel}>Featured Nail Artist</p>
              <h3 style={styles.cardTitle}>Coming Soon</h3>
              <p style={styles.cardMeta}>Global</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>DIRECTORY</p>

        <h2 style={styles.sectionTitle}>All Nail Artists</h2>

        <p style={styles.sectionText}>
          Verified nail artist listings will populate this section once approved
          profiles are added.
        </p>

        <div style={styles.directoryGrid}>
          <div style={styles.directoryCard}>
            <div style={styles.directoryImage} />
            <div style={styles.cardBody}>
              <h3 style={styles.directoryTitle}>Nail Artist Listing</h3>
              <p style={styles.cardMeta}>City, Region, Country</p>
            </div>
          </div>

          <div style={styles.directoryCard}>
            <div style={styles.directoryImage} />
            <div style={styles.cardBody}>
              <h3 style={styles.directoryTitle}>Nail Artist Listing</h3>
              <p style={styles.cardMeta}>City, Region, Country</p>
            </div>
          </div>

          <div style={styles.directoryCard}>
            <div style={styles.directoryImage} />
            <div style={styles.cardBody}>
              <h3 style={styles.directoryTitle}>Nail Artist Listing</h3>
              <p style={styles.cardMeta}>City, Region, Country</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <p style={styles.sectionEyebrow}>CONSIDERATION</p>

        <h2 style={styles.sectionTitle}>Apply for Consideration</h2>

        <p style={styles.sectionText}>
          Nail artists may submit for review. Hand-selected professionals may
          also be added directly by Aset.
        </p>

        <Link to="/collectives/beauty/apply" style={styles.ctaButton}>
          Apply for Consideration
        </Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#f6f1e8",
    fontFamily: "inherit",
  },

  hero: {
    position: "relative",
    minHeight: "72vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "130px 24px 90px",
    background:
      "linear-gradient(135deg, #050505 0%, #160f0c 45%, #302018 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(201,166,107,0.18), transparent 45%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "920px",
    textAlign: "center",
  },

  breadcrumb: {
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontSize: "0.68rem",
    color: "#c9a66b",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(3rem, 7vw, 6.5rem)",
    lineHeight: 0.95,
    margin: "0 0 26px",
    fontWeight: 500,
  },

  subtitle: {
    maxWidth: "760px",
    margin: "0 auto",
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.78)",
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "70px 24px",
  },

  sectionEyebrow: {
    letterSpacing: "0.24em",
    fontSize: "0.72rem",
    color: "#c9a66b",
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "clamp(2rem, 4vw, 4rem)",
    margin: "0 0 22px",
    fontWeight: 500,
  },

  sectionText: {
    maxWidth: "780px",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.72)",
    marginBottom: "28px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
    marginTop: "28px",
  },

  select: {
    width: "100%",
    padding: "14px 14px",
    background: "#0b0b0b",
    color: "#f6f1e8",
    border: "1px solid rgba(201,166,107,0.32)",
    outline: "none",
  },

  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    marginTop: "32px",
  },

  featuredCard: {
    border: "1px solid rgba(201,166,107,0.25)",
    background: "rgba(255,255,255,0.035)",
    overflow: "hidden",
  },

  featuredImage: {
    height: "340px",
    background:
      "linear-gradient(135deg, rgba(201,166,107,0.16), rgba(255,255,255,0.03)), radial-gradient(circle at top, #3a2118, #060606 72%)",
  },

  directoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "24px",
    marginTop: "32px",
  },

  directoryCard: {
    border: "1px solid rgba(201,166,107,0.22)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },

  directoryImage: {
    height: "220px",
    background:
      "linear-gradient(135deg, rgba(201,166,107,0.14), rgba(255,255,255,0.025)), radial-gradient(circle at top, #2f1d15, #060606 72%)",
  },

  cardBody: {
    padding: "22px",
  },

  cardLabel: {
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: "0.65rem",
    color: "#c9a66b",
    marginBottom: "10px",
  },

  cardTitle: {
    fontSize: "1.7rem",
    margin: "0 0 10px",
    fontWeight: 500,
  },

  directoryTitle: {
    fontSize: "1.25rem",
    margin: "0 0 10px",
    fontWeight: 500,
  },

  cardMeta: {
    color: "rgba(246,241,232,0.62)",
    margin: 0,
  },

  ctaSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px 120px",
    borderTop: "1px solid rgba(201,166,107,0.18)",
  },

  ctaButton: {
    display: "inline-block",
    marginTop: "24px",
    padding: "14px 28px",
    border: "1px solid rgba(201,166,107,0.8)",
    color: "#f6f1e8",
    textDecoration: "none",
    letterSpacing: "0.14em",
    fontSize: "0.78rem",
    textTransform: "uppercase",
  },
};