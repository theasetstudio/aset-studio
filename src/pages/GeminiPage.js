import React from "react";
import { Link } from "react-router-dom";

const geminiCrystals = [
  {
    name: "Moss Agate",
    description:
      "Grounds Gemini’s fast-moving mind, helping balance thoughts and bring calm stability to mental energy.",
  },
  {
    name: "Tiger Eye",
    description:
      "Sharpens focus and strengthens decision-making, helping Gemini stay centered instead of scattered.",
  },
  {
    name: "Red Jasper",
    description:
      "Provides grounding and endurance, anchoring Gemini’s energy into steady action and follow-through.",
  },
  {
    name: "Fluorite",
    description:
      "A powerful mental clarity stone that organizes thoughts, enhances focus, and supports structured thinking.",
  },
  {
    name: "Citrine",
    description:
      "Boosts confidence, expression, and mental brightness, aligning perfectly with Gemini’s natural communication energy.",
  },
  {
    name: "Labradorite",
    description:
      "Enhances intuition and protects energy, helping Gemini navigate both logic and inner awareness.",
  },
  {
    name: "Blue Lace Agate",
    description:
      "Supports calm, clear communication and helps Gemini express thoughts with softness and ease.",
  },
  {
    name: "Sodalite",
    description:
      "Encourages truth, insight, and logical clarity, helping Gemini balance emotion and intellect.",
  },
  {
    name: "Serpentine",
    description:
      "Clears mental blockages and encourages adaptability, helping Gemini move smoothly through change.",
  },
  {
    name: "Aquamarine",
    description:
      "Brings calm expression and emotional clarity, helping Gemini communicate with confidence and peace.",
  },
  {
    name: "Dalmatian Jasper",
    description:
      "Lightens energy, encourages playfulness, and keeps Gemini’s spirit uplifted while staying grounded.",
  },
  {
    name: "Dumortierite",
    description:
      "Enhances patience, discipline, and mental control, helping Gemini stay focused and consistent.",
  },
  {
    name: "Garnierite",
    description:
      "Supports growth, emotional balance, and heart-mind alignment, helping Gemini stay centered and aligned.",
  },
];

export default function GeminiPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.floatingIconOne}>♊</div>
      <div style={styles.floatingIconTwo}>💭</div>
      <div style={styles.floatingIconThree}>💎</div>
      <div style={styles.floatingIconFour}>✨</div>

      <div style={styles.content}>
        <div style={styles.hero}>
          <div style={styles.heroIcon}>♊</div>
          <h1 style={styles.title}>Gemini</h1>
          <p style={styles.subtitle}>
            A crystal collection designed for clarity, communication, mental
            balance, adaptability, and aligned expression.
          </p>
        </div>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Collection Energy</h2>

          <div style={styles.energyGrid}>
            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Purpose</div>
              <div style={styles.energyValue}>
                Mental clarity, communication, balance
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Focus</div>
              <div style={styles.energyValue}>
                Thought organization, expression, adaptability
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Atmosphere</div>
              <div style={styles.energyValue}>
                Light, focused, expressive, mentally aligned
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Decor Theme</div>
              <div style={styles.energyValue}>
                Airy tones, journals, books, light movement, creative space
              </div>
            </div>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Gemini Crystals</h2>

          <div style={styles.crystalGrid}>
            {geminiCrystals.map((crystal) => (
              <div key={crystal.name} style={styles.crystalCard}>
                <h3 style={styles.crystalName}>{crystal.name}</h3>
                <p style={styles.crystalDescription}>{crystal.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.footerCard}>
          <p style={styles.footerText}>
            Gemini energy moves fast, thinks deeply, and communicates endlessly.
            This collection supports clarity, balance, and aligned expression so
            your mind works for you, not against you.
          </p>
        </section>

        <div style={styles.buttonRow}>
          <Link to="/sirens-realm/stones" style={styles.backButton}>
            Back to Collections
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top, rgba(40,50,90,0.45) 0%, rgba(8,6,20,1) 55%, rgba(3,2,12,1) 100%)",
    color: "#f5f1ff",
    padding: "48px 20px 80px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    opacity: 0.15,
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    marginBottom: "36px",
    paddingTop: "24px",
  },
  heroIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(42px, 7vw, 76px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
  },
  subtitle: {
    maxWidth: "780px",
    margin: "18px auto 0",
    fontSize: "20px",
    lineHeight: 1.7,
    color: "rgba(236, 229, 255, 0.85)",
  },
  sectionCard: {
    background: "rgba(18, 14, 38, 0.82)",
    border: "1px solid rgba(148, 128, 196, 0.20)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
    backdropFilter: "blur(10px)",
    marginBottom: "28px",
  },
  sectionTitle: {
    margin: "0 0 18px 0",
    fontSize: "clamp(26px, 3vw, 38px)",
    fontWeight: 700,
    color: "#ffffff",
  },
  energyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  energyItem: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(167, 145, 216, 0.18)",
    borderRadius: "18px",
    padding: "18px",
  },
  energyLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#b59de3",
    marginBottom: "10px",
    fontWeight: 700,
  },
  energyValue: {
    fontSize: "18px",
    lineHeight: 1.6,
    color: "#f4efff",
  },
  crystalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  crystalCard: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(167, 145, 216, 0.16)",
    borderRadius: "20px",
    padding: "20px",
    minHeight: "190px",
  },
  crystalName: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#ffffff",
  },
  crystalDescription: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.7,
    color: "rgba(240, 234, 255, 0.88)",
  },
  footerCard: {
    background: "rgba(18, 14, 38, 0.82)",
    border: "1px solid rgba(148, 128, 196, 0.20)",
    borderRadius: "28px",
    padding: "28px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
    backdropFilter: "blur(10px)",
  },
  footerText: {
    margin: 0,
    fontSize: "19px",
    lineHeight: 1.8,
    color: "rgba(241, 235, 255, 0.88)",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 22px",
    borderRadius: "999px",
    textDecoration: "none",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(180, 160, 225, 0.24)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "15px",
  },
  floatingIconOne: {
    position: "absolute",
    top: "120px",
    left: "6%",
    fontSize: "22px",
    opacity: 0.28,
  },
  floatingIconTwo: {
    position: "absolute",
    top: "260px",
    right: "8%",
    fontSize: "22px",
    opacity: 0.22,
  },
  floatingIconThree: {
    position: "absolute",
    bottom: "180px",
    left: "8%",
    fontSize: "20px",
    opacity: 0.2,
  },
  floatingIconFour: {
    position: "absolute",
    bottom: "130px",
    right: "10%",
    fontSize: "18px",
    opacity: 0.18,
  },
};