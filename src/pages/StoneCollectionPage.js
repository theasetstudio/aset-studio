import React from "react";
import { Link } from "react-router-dom";
import { stoneCollections } from "../data/stoneCollections";

const featuredCollections = [
  {
    title: "Protecting the Home",
    description:
      "Stone support for grounding, shielding, cleansing, and strengthening the energy of your living space.",
    path: "/sirens-realm/protecting-the-home",
  },
  {
    title: "Intuition",
    description:
      "Collections centered on inner knowing, spiritual clarity, heightened awareness, and deeper trust in self.",
    path: "/sirens-realm/intuition",
  },
  {
    title: "Full Moon",
    description:
      "A lunar-aligned collection for release, reflection, charging, ritual work, and emotional clearing.",
    path: "/sirens-realm/full-moon",
  },
  {
    title: "Bedroom",
    description:
      "Stones selected for rest, softness, intimacy, dreamwork, emotional calm, and sacred personal space.",
    path: "/sirens-realm/bedroom",
  },
  {
    title: "Focus",
    description:
      "Support for discipline, attention, clarity, productivity, and staying locked into your purpose.",
    path: "/sirens-realm/focus",
  },
  {
    title: "Confidence",
    description:
      "A bold collection built around self-belief, courage, visibility, personal power, and magnetic energy.",
    path: "/sirens-realm/confidence",
  },
  {
    title: "Luck",
    description:
      "Stones for expansion, aligned opportunity, prosperity, open roads, and favorable movement.",
    path: "/sirens-realm/luck",
  },
  {
    title: "Safe Travels",
    description:
      "Protective and steadying stones chosen for travel, movement, safe return, and energetic guarding on the road.",
    path: "/sirens-realm/safe-travels",
  },
  {
    title: "Moon Sign",
    description:
      "A collection focused on emotional patterns, inner rhythms, instinct, softness, and the unseen self.",
    path: "/sirens-realm/moon-sign",
  },
  {
    title: "Rising Sign",
    description:
      "Stones aligned with presence, projection, identity, outer energy, and the way you move through the world.",
    path: "/sirens-realm/rising-sign",
  },
  {
    title: "Motivation",
    description:
      "A high-energy collection for drive, momentum, courage, determination, and staying in motion.",
    path: "/sirens-realm/motivation",
  },
  {
    title: "Veterans",
    description:
      "A grounded and honoring collection centered on strength, resilience, protection, healing, and endurance.",
    path: "/sirens-realm/veterans",
  },
  {
    title: "Love",
    description:
      "Stones for softness, attraction, emotional opening, healing the heart, and deepening connection.",
    path: "/sirens-realm/love",
  },
  {
    title: "Friendship",
    description:
      "A connection-centered collection built around loyalty, trust, emotional support, honest communication, and soul-aligned bonds.",
    path: "/sirens-realm/friendship",
  },
  {
    title: "Meditation",
    description:
      "A stillness-centered collection designed for clarity, inner awareness, emotional balance, and deep meditative focus.",
    path: "/sirens-realm/meditation",
  },
  {
    title: "Creative Muse",
    description:
      "A collection designed to stir imagination, creative flow, expression, inspiration, and artistic confidence.",
    path: "/sirens-realm/creative-muse",
  },
  {
    title: "Blue",
    description:
      "A calming and expressive color-led collection tied to communication, peace, truth, and emotional cooling.",
    path: "/sirens-realm/blue",
  },
  {
    title: "Purple",
    description:
      "A mystical color-led collection tied to intuition, spiritual depth, emotional healing, peace, and transformation.",
    path: "/sirens-realm/purple",
  },
];

const zodiacCollections = [
  {
    key: "pisces",
    title: "Pisces",
    fallbackDescription:
      "Soft, intuitive, dreamy energy supported by stones that amplify feeling, sensitivity, and spiritual depth.",
    path: "/sirens-realm/pisces",
  },
  {
    key: "aquarius",
    title: "Aquarius",
    fallbackDescription:
      "Visionary, independent, and mentally expansive stones aligned with Aquarius energy.",
    path: "/sirens-realm/aquarius",
  },
  {
    key: "libra",
    title: "Libra",
    fallbackDescription:
      "A balanced, beauty-centered collection for harmony, grace, relationships, and refinement.",
    path: "/sirens-realm/libra",
  },
  {
    key: "gemini",
    title: "Gemini",
    fallbackDescription:
      "A versatile, quick-minded collection centered on communication, curiosity, adaptability, expression, and mental agility.",
    path: "/sirens-realm/gemini",
  },
];

export default function StoneCollectionPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.container}>
        <div style={styles.hero}>
          <p style={styles.eyebrow}>SIRENS REALM</p>
          <h1 style={styles.title}>Stone Collections</h1>
          <p style={styles.subtitle}>
            Explore curated stone pathways created around intention, emotion,
            ritual, alignment, protection, beauty, and power.
          </p>

          <div style={styles.heroActions}>
            <Link to="/sirens-realm" style={styles.secondaryButton}>
              Back to Sirens Realm
            </Link>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionEyebrow}>Collections</p>
            <h2 style={styles.sectionTitle}>Intentional Pathways</h2>
            <p style={styles.sectionText}>
              Each collection is built around a specific energetic theme so the
              experience feels guided, immersive, and easy to explore.
            </p>
          </div>

          <div style={styles.grid}>
            {featuredCollections.map((item) => (
              <Link key={item.title} to={item.path} style={styles.card}>
                <div style={styles.cardInner}>
                  <p style={styles.cardLabel}>COLLECTION</p>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardDescription}>{item.description}</p>
                  <span style={styles.cardLink}>Enter Collection</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionEyebrow}>Zodiac</p>
            <h2 style={styles.sectionTitle}>Sign-Aligned Collections</h2>
            <p style={styles.sectionText}>
              Explore stone groupings shaped around sign energy, emotional
              signature, and natural energetic tendencies.
            </p>
          </div>

          <div style={styles.gridSmall}>
            {zodiacCollections.map((item) => {
              const collectionData = stoneCollections[item.key];
              const description =
                collectionData?.subtitle || item.fallbackDescription;

              return (
                <Link key={item.title} to={item.path} style={styles.card}>
                  <div style={styles.cardInner}>
                    <p style={styles.cardLabel}>ZODIAC</p>
                    <h3 style={styles.cardTitle}>{item.title}</h3>
                    <p style={styles.cardDescription}>{description}</p>
                    <span style={styles.cardLink}>Open Collection</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #08070c 0%, #0d0b12 35%, #120f18 100%)",
    color: "#f5f1ea",
    padding: "56px 20px 80px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(180,145,255,0.10) 0%, rgba(0,0,0,0) 45%)",
    pointerEvents: "none",
  },

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1240px",
    margin: "0 auto",
  },

  hero: {
    marginBottom: "56px",
    padding: "8px 0 0 0",
  },

  eyebrow: {
    margin: "0 0 12px 0",
    fontSize: "11px",
    letterSpacing: "3px",
    color: "#b7a8d6",
    textTransform: "uppercase",
  },

  title: {
    margin: "0 0 14px 0",
    fontSize: "clamp(36px, 6vw, 64px)",
    lineHeight: 1.02,
    fontWeight: "700",
    color: "#fffaf2",
  },

  subtitle: {
    maxWidth: "760px",
    margin: 0,
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#cfc7d8",
  },

  heroActions: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "26px",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: "999px",
    border: "1px solid rgba(204, 191, 220, 0.28)",
    background: "rgba(255,255,255,0.03)",
    color: "#f5f1ea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  section: {
    marginBottom: "56px",
  },

  sectionHeader: {
    marginBottom: "24px",
  },

  sectionEyebrow: {
    margin: "0 0 8px 0",
    fontSize: "11px",
    letterSpacing: "2.5px",
    color: "#9f90bf",
    textTransform: "uppercase",
  },

  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    lineHeight: 1.15,
    color: "#fffaf2",
  },

  sectionText: {
    margin: 0,
    maxWidth: "760px",
    color: "#c6becf",
    fontSize: "15px",
    lineHeight: "1.8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  gridSmall: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  card: {
    textDecoration: "none",
    color: "inherit",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(210, 197, 227, 0.12)",
    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(6px)",
    transition: "transform 0.18s ease, border-color 0.18s ease",
  },

  cardInner: {
    padding: "22px",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
  },

  cardLabel: {
    margin: "0 0 10px 0",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#a895c7",
  },

  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "24px",
    lineHeight: 1.15,
    color: "#fffaf2",
  },

  cardDescription: {
    margin: 0,
    color: "#d2cadb",
    lineHeight: "1.75",
    fontSize: "14px",
    flexGrow: 1,
  },

  cardLink: {
    marginTop: "18px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    color: "#f0d8ff",
  },
};