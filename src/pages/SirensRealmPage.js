import React from "react";
import { Link } from "react-router-dom";

export default function SirensRealmPage() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
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
                  Curated stone groupings, themed collections, and focused spiritual
                  sets for specific energies and intentions.
                </div>
              </Link>

              <Link
                to="/sirens-realm/return-to-sender-deities"
                style={styles.sectionCard}
              >
                <div style={styles.cardEyebrow}>Sirens Realm</div>
                <div style={styles.cardTitle}>Return to Sender</div>
                <div style={styles.cardText}>
                  Protective forces, reversal work, divine witnesses, and spiritual
                  justice.
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
                  Protection, spiritual defense, fast movement, exposure of lies,
                  and keeping harmful energy away from your space.
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
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "white",
  },

  hero: {
    minHeight: "100vh",
    backgroundImage: "url('/images/sirens-hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
  },

  heroOverlay: {
    width: "100%",
    minHeight: "100vh",
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    padding: "48px 20px",
  },

  container: {
    maxWidth: 980,
    margin: "0 auto",
  },

  eyebrow: {
    letterSpacing: 3,
    fontSize: 12,
    opacity: 0.85,
  },

  title: {
    fontSize: "clamp(2.5rem, 6vw, 56px)",
    lineHeight: 1.05,
    marginTop: 16,
    marginBottom: 0,
  },

  subtitle: {
    maxWidth: 700,
    marginTop: 14,
    opacity: 0.85,
    fontSize: 16,
    lineHeight: 1.6,
  },

  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  },

  primaryButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
  },

  secondaryButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.20)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },

  fireButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,120,0.28)",
    background: "rgba(139,30,30,0.18)",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
  },

  ghostButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.10)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },

  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 36,
  },

  sectionCard: {
    display: "block",
    textDecoration: "none",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    color: "#f5f1ff",
    minHeight: 170,
  },

  cardEyebrow: {
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.68)",
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: 10,
  },

  cardText: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "rgba(245,241,255,0.84)",
  },

  featureSection: {
    marginTop: 44,
  },

  featureHeading: {
    fontSize: "1.6rem",
    marginBottom: 16,
    letterSpacing: "0.04em",
  },

  featureCard: {
    display: "block",
    textDecoration: "none",
    background: "rgba(139,30,30,0.12)",
    border: "1px solid rgba(255,120,120,0.25)",
    borderRadius: 18,
    padding: 20,
    color: "#f5e9e0",
    maxWidth: 560,
  },

  featureEyebrow: {
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#ffb3a7",
    marginBottom: 6,
  },

  featureTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: 8,
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
    background: "rgba(0,0,0,0.35)",
    maxWidth: 780,
  },

  comingNextTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },

  comingNextText: {
    opacity: 0.85,
    lineHeight: 1.6,
  },
};