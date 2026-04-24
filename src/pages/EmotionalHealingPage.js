import React from "react";
import { Link } from "react-router-dom";

const stones = [
  {
    name: "Rose Quartz",
    description:
      "Opens the heart, encourages self-love, emotional healing, and softness.",
  },
  {
    name: "Lepidolite",
    description:
      "Supports emotional balance, reduces anxiety, and stabilizes mood.",
  },
  {
    name: "Obsidian",
    description:
      "A powerful grounding stone that releases emotional blockages and protects energy.",
  },
  {
    name: "Amethyst",
    description:
      "Calms the mind, supports emotional clarity, and deep inner peace.",
  },
  {
    name: "Rainbow Moonstone",
    description:
      "Encourages emotional flow, intuition, and gentle transformation.",
  },
  {
    name: "Rhodonite",
    description:
      "Promotes emotional healing, forgiveness, and heart-centered growth.",
  },
  {
    name: "Carnelian",
    description:
      "Restores confidence, motivation, and emotional strength.",
  },
  {
    name: "Selenite",
    description:
      "Cleanses emotional energy, promotes peace, and clears negativity.",
  },
  {
    name: "Amazonite",
    description:
      "Balances emotions, supports truth, and soothes the nervous system.",
  },
  {
    name: "Moonstone",
    description:
      "Enhances emotional intuition, balance, and feminine energy cycles.",
  },
  {
    name: "Smoky Quartz",
    description:
      "Grounds emotional energy, releases stress, and stabilizes the mind.",
  },
];

export default function EmotionalHealingPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.container}>
        <Link to="/sirens-realm/stones" style={styles.backLink}>
          ← Back to Stone Collections
        </Link>

        <div style={styles.hero}>
          <div style={styles.icon}>💗</div>

          <h1 style={styles.title}>Emotional Healing</h1>

          <p style={styles.subtitle}>
            Stones chosen to support emotional balance, healing, release, inner
            peace, and transformation through every phase of your journey.
          </p>
        </div>

        <div style={styles.cardContainer}>
          <h2 style={styles.sectionTitle}>Primary Healing Stones</h2>

          <div style={styles.grid}>
            {stones.map((stone) => (
              <div key={stone.name} style={styles.card}>
                <h3 style={styles.cardTitle}>{stone.name}</h3>
                <p style={styles.cardText}>{stone.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.footerBox}>
          This collection is centered on emotional balance, healing, release,
          and inner peace. These stones support you through growth, heartbreak,
          clarity, and transformation.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #07060a 0%, #0d0b12 40%, #120f18 100%)",
    color: "#f5f1ea",
    padding: "40px 20px 80px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(255,120,150,0.18) 0%, rgba(0,0,0,0) 55%)",
    pointerEvents: "none",
  },

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
  },

  backLink: {
    display: "inline-block",
    color: "#b7a8d6",
    textDecoration: "none",
    fontSize: "14px",
    marginBottom: "20px",
  },

  hero: {
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "50px",
  },

  icon: {
    fontSize: "28px",
    marginBottom: "10px",
    textShadow: "0 0 12px rgba(255, 80, 120, 0.6)",
  },

  title: {
    fontSize: "clamp(40px, 6vw, 70px)",
    margin: "10px 0",
    lineHeight: 1.05,
    color: "#fffaf2",
  },

  subtitle: {
    maxWidth: "720px",
    margin: "0 auto",
    color: "#cfc7d8",
    lineHeight: "1.7",
    fontSize: "15px",
  },

  cardContainer: {
    background: "rgba(255,255,255,0.035)",
    borderRadius: "20px",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#fffaf2",
    fontSize: "26px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s ease",
  },

  cardTitle: {
    margin: "0 0 8px 0",
    color: "#fffaf2",
    fontSize: "18px",
  },

  cardText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#d2cadb",
  },

  footerBox: {
    marginTop: "30px",
    padding: "20px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "14px",
    textAlign: "center",
    color: "#cfc7d8",
    lineHeight: "1.6",
  },
};