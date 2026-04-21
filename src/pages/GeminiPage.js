import React from "react";
import { Link } from "react-router-dom";

export default function GeminiPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Gemini Collection</h1>

          <p style={styles.subtitle}>
            A versatile, quick-minded collection centered on communication,
            curiosity, adaptability, expression, and mental agility.
          </p>

          <div style={styles.heroActions}>
            <Link to="/sirens-realm/stones" style={styles.secondaryButton}>
              Back to Stone Collections
            </Link>

            <Link to="/sirens-realm" style={styles.secondaryButton}>
              Back to Sirens Realm
            </Link>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Gemini Stones & Energies</h2>

          <p style={styles.sectionText}>
            Gemini energy thrives on movement, communication, and curiosity.
            These stones support clarity, expression, adaptability, and mental
            expansion.
          </p>

          <div style={styles.grid}>
            {geminiStones.map((stone) => (
              <div key={stone.name} style={styles.card}>
                <h3 style={styles.cardTitle}>{stone.name}</h3>
                <p style={styles.cardDescription}>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const geminiStones = [
  {
    name: "Agate",
    description:
      "Enhances clarity, grounding, and communication while stabilizing mental energy.",
  },
  {
    name: "Citrine",
    description:
      "Boosts creativity, confidence, and intellectual flow while keeping energy light and active.",
  },
  {
    name: "Tiger Eye",
    description:
      "Supports perception, focus, and decisive thinking while balancing scattered energy.",
  },
  {
    name: "Moonstone",
    description:
      "Balances duality, enhances intuition, and supports emotional adaptability.",
  },
  {
    name: "Fluorite",
    description:
      "Clears mental fog, improves focus, and strengthens decision-making and learning.",
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #08070c 0%, #0d0b12 35%, #120f18 100%)",
    color: "#f5f1ea",
    padding: "56px 20px 80px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },

  hero: {
    marginBottom: "56px",
  },

  title: {
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: "700",
    color: "#fffaf2",
    marginBottom: "14px",
  },

  subtitle: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#cfc7d8",
    marginBottom: "26px",
    maxWidth: "760px",
  },

  heroActions: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
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
  },

  section: {
    marginBottom: "56px",
  },

  sectionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fffaf2",
    marginBottom: "12px",
  },

  sectionText: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "#c6becf",
    marginBottom: "24px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(210, 197, 227, 0.12)",
    borderRadius: "22px",
    padding: "22px",
    minHeight: "180px",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#fffaf2",
  },

  cardDescription: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#d2cadb",
  },
};