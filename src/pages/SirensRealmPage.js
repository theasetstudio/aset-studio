import React from "react";
import { Link } from "react-router-dom";

export default function SirensRealmPage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroInner}>
          <div style={styles.container}>
            <div style={styles.eyebrow}>SIRENS REALM</div>

            <h1 style={styles.title}>The Portal of Mystic Teaching.</h1>

            <p style={styles.subtitle}>
              A world of mystics and conjurers — guided by one voice. Teachings,
              rituals, symbols, stones, and sacred knowledge live here.
            </p>

            <div style={styles.buttonRow}>
              <Link
                to="/sirens-realm/stones-and-minerals"
                style={styles.primaryButton}
              >
                Stones and Minerals
              </Link>

              <Link to="/sirens-realm/stones" style={styles.secondaryButton}>
                Stone Collection
              </Link>

              <Link
                to="/sirens-realm/return-to-sender-deities"
                style={styles.secondaryButton}
              >
                Return to Sender
              </Link>

              <Link
                to="/sirens-realm/gemini"
                style={styles.secondaryButton}
              >
                Gemini
              </Link>

              <Link
                to="/sirens-realm-alchemy/conjurin-in-the-kitchen"
                style={styles.fireButton}
              >
                Conjurin in the Kitchen
              </Link>

              <Link
                to="/gallery?category=Sirens%20Realm"
                style={styles.secondaryButton}
              >
                View Relics (Gallery)
              </Link>

              <Link to="/" style={styles.ghostButton}>
                Return to The Aset Studio
              </Link>
            </div>

            <div style={styles.sectionsGrid}>
              <Link
                to="/sirens-realm/stones-and-minerals"
                style={styles.sectionCard}
              >
                <div style={styles.cardEyebrow}>Sirens Realm</div>
                <div style={styles.cardTitle}>Stones and Minerals</div>
                <div style={styles.cardText}>
                  Crystal knowledge, spiritual properties, symbolism, and focused
                  study pages.
                </div>
              </Link>

              <Link to="/sirens-realm/stones" style={styles.sectionCard}>
                <div style={styles.cardEyebrow}>Sirens Realm</div>
                <div style={styles.cardTitle}>Stone Collection</div>
                <div style={styles.cardText}>
                  Curated stone groupings, themed collections, and focused
                  spiritual sets for specific energies and intentions.
                </div>
              </Link>

              <Link
                to="/sirens-realm/return-to-sender-deities"
                style={styles.sectionCard}
              >
                <div style={styles.cardEyebrow}>Sirens Realm</div>
                <div style={styles.cardTitle}>Return to Sender</div>
                <div style={styles.cardText}>
                  Protective forces, reversal work, divine witnesses, and
                  spiritual justice.
                </div>
              </Link>

              <Link
                to="/sirens-realm/gemini"
                style={styles.sectionCard}
              >
                <div style={styles.cardEyebrow}>Sirens Realm</div>
                <div style={styles.cardTitle}>Gemini</div>
                <div style={styles.cardText}>
                  A versatile, quick-minded collection centered on communication,
                  curiosity, adaptability, expression, and mental agility.
                </div>
              </Link>
            </div>

            <div style={styles.featureSection}>
              <h2 style={styles.featureHeading}>Featured Inner Portal</h2>

              <Link
                to="/sirens-realm-alchemy/conjurin-in-the-kitchen"
                style={styles.featureCard}
              >
                <div style={styles.featureEyebrow}>Sirens Realm Alchemy</div>

                <div style={styles.featureTitle}>Conjurin in the Kitchen</div>

                <div style={styles.featureText}>
                  Protection, spiritual defense, fast movement, exposure of
                  lies, and keeping harmful energy away from your space.
                </div>
              </Link>
            </div>

            <div style={styles.comingNextCard}>
              <div style={styles.comingNextTitle}>Coming next</div>

              <div style={styles.comingNextText}>
                • Expanded stone teachings
                <br />
                • More deity and ritual pages
                <br />
                • Paid PDFs &amp; mystical lessons
                <br />
                • Ritual Library + Grimoire pages
                <br />
                • Audio teachings + cinematic lessons
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#ffffff",
  },

  hero: {
    position: "relative",
    minHeight: "100vh",
    backgroundImage: "url('/images/sirens-hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.46), rgba(0,0,0,0.72))",
    pointerEvents: "none",
  },

  heroInner: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "clamp(56px, 8vw, 92px) 16px",
  },

  container: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
  },

  eyebrow: {
    letterSpacing: "0.24em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    opacity: 0.88,
    marginBottom: 10,
  },

  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(32px, 6vw, 56px)",
    lineHeight: 1.05,
    margin: "0 0 14px",
    maxWidth: 760,
    textWrap: "balance",
  },

  subtitle: {
    maxWidth: 760,
    margin: "0 0 24px",
    opacity: 0.88,
    fontSize: "clamp(15px, 2.4vw, 17px)",
    lineHeight: 1.65,
  },

  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 36,
    width: "100%",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    minHeight: 50,
    flex: "1 1 220px",
    maxWidth: 260,
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.22)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    minHeight: 50,
    flex: "1 1 220px",
    maxWidth: 260,
  },

  fireButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,120,0.30)",
    background: "rgba(139,30,30,0.20)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    minHeight: 50,
    flex: "1 1 220px",
    maxWidth: 260,
  },

  ghostButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.12)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    minHeight: 50,
    flex: "1 1 220px",
    maxWidth: 260,
  },

  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 8,
  },

  sectionCard: {
    display: "block",
    textDecoration: "none",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    color: "#f5f1ff",
    minHeight: 180,
    backdropFilter: "blur(2px)",
  },

  cardEyebrow: {
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.68)",
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: "clamp(1rem, 2vw, 1.1rem)",
    fontWeight: 700,
    marginBottom: 10,
    lineHeight: 1.3,
  },

  cardText: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "rgba(245,241,255,0.84)",
  },

  featureSection: {
    marginTop: 42,
  },

  featureHeading: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(1.35rem, 3vw, 1.6rem)",
    margin: "0 0 16px",
    letterSpacing: "0.04em",
  },

  featureCard: {
    display: "block",
    textDecoration: "none",
    background: "rgba(139,30,30,0.14)",
    border: "1px solid rgba(255,120,120,0.26)",
    borderRadius: 18,
    padding: 20,
    color: "#f5e9e0",
    maxWidth: 620,
    width: "100%",
  },

  featureEyebrow: {
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#ffb3a7",
    marginBottom: 6,
  },

  featureTitle: {
    fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
    fontWeight: 700,
    marginBottom: 8,
    lineHeight: 1.3,
  },

  featureText: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "#e8d8cf",
  },

  comingNextCard: {
    marginTop: 32,
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.38)",
    maxWidth: 780,
  },

  comingNextTitle: {
    fontWeight: 700,
    marginBottom: 6,
    fontSize: 16,
  },

  comingNextText: {
    opacity: 0.88,
    lineHeight: 1.7,
    fontSize: 15,
  },
};