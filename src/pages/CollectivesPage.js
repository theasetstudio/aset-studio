import React from "react";
import { Link } from "react-router-dom";

export default function CollectivesPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>THE ASET STUDIO</p>

          <h1 style={styles.title}>Aset Collectives</h1>

          <p style={styles.subtitle}>
            Curated professional directories within The Aset Studio designed to
            showcase verified talent, companies, and teams across entertainment,
            media, production, and the arts.
          </p>

          <a href="#explore-collectives" style={styles.heroButton}>
            Explore Collectives
          </a>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>WHAT ARE THE COLLECTIVES?</p>

        <h2 style={styles.sectionTitle}>Built for discovery. Curated by Aset.</h2>

        <p style={styles.sectionText}>
          Aset Collectives are professional discovery spaces inside The Aset
          Studio. Each collective is designed to highlight verified creative
          professionals, companies, and teams while keeping the experience
          curated, cinematic, and intentional.
        </p>
      </section>

      <section id="explore-collectives" style={styles.section}>
        <p style={styles.sectionEyebrow}>EXPLORE</p>

        <h2 style={styles.sectionTitle}>Explore the Collectives</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardImage} />

            <div style={styles.cardBody}>
              <p style={styles.cardEyebrow}>NOW OPEN</p>

              <h3 style={styles.cardTitle}>Aset Beauty Collective</h3>

              <p style={styles.cardText}>
                Discover the professionals behind the transformation. A curated
                collective of makeup artists, hairstylists, grooming specialists,
                wig artists, nail artists, and special effects professionals from
                around the world.
              </p>

              <Link to="/collectives/beauty" style={styles.cardButton}>
                Enter Collective
              </Link>
            </div>
          </div>

          <div style={styles.cardMuted}>
            <div style={styles.cardBody}>
              <p style={styles.cardEyebrow}>COMING LATER</p>

              <h3 style={styles.cardTitle}>Future Collectives</h3>

              <p style={styles.cardText}>
                Additional collectives will be introduced as The Aset Studio
                expands its professional ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <p style={styles.sectionEyebrow}>CONSIDERATION</p>

        <h2 style={styles.sectionTitle}>Apply for Consideration</h2>

        <p style={styles.sectionText}>
          Beauty professionals, companies, and teams may submit for review.
          Hand-selected professionals may also be added directly by Aset.
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
    minHeight: "78vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 24px 80px",
    background:
      "linear-gradient(135deg, #050505 0%, #14100c 45%, #2a1a12 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(214,174,102,0.18), transparent 42%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "900px",
    textAlign: "center",
  },

  eyebrow: {
    letterSpacing: "0.28em",
    fontSize: "0.78rem",
    color: "#c9a66b",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(3rem, 8vw, 7rem)",
    lineHeight: 0.95,
    margin: "0 0 24px",
    fontWeight: 500,
  },

  subtitle: {
    maxWidth: "760px",
    margin: "0 auto 36px",
    fontSize: "1.1rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.78)",
  },

  heroButton: {
    display: "inline-block",
    padding: "14px 28px",
    border: "1px solid rgba(201,166,107,0.8)",
    color: "#f6f1e8",
    textDecoration: "none",
    letterSpacing: "0.14em",
    fontSize: "0.78rem",
    textTransform: "uppercase",
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px",
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
    maxWidth: "760px",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.72)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginTop: "36px",
  },

  card: {
    border: "1px solid rgba(201,166,107,0.25)",
    background: "rgba(255,255,255,0.035)",
    overflow: "hidden",
  },

  cardMuted: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.02)",
    minHeight: "360px",
    display: "flex",
    alignItems: "flex-end",
  },

  cardImage: {
    height: "260px",
    background:
      "linear-gradient(135deg, rgba(201,166,107,0.2), rgba(255,255,255,0.04)), radial-gradient(circle at top, #3a2418, #060606 70%)",
  },

  cardBody: {
    padding: "28px",
  },

  cardEyebrow: {
    letterSpacing: "0.2em",
    fontSize: "0.68rem",
    color: "#c9a66b",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "1.8rem",
    margin: "0 0 14px",
    fontWeight: 500,
  },

  cardText: {
    color: "rgba(246,241,232,0.72)",
    lineHeight: 1.7,
    marginBottom: "24px",
  },

  cardButton: {
    display: "inline-block",
    color: "#f6f1e8",
    textDecoration: "none",
    borderBottom: "1px solid #c9a66b",
    paddingBottom: "6px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontSize: "0.75rem",
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