import React from "react";
import { Link } from "react-router-dom";

const friendshipCrystals = [
  {
    name: "Garnet",
    description:
      "A stone of loyalty, devotion, and enduring connection. Garnet strengthens friendship bonds through trust, grounded love, and emotional steadiness.",
  },
  {
    name: "Blue Agate",
    description:
      "Encourages calm communication and emotional balance, helping friendships remain peaceful, understanding, and supportive.",
  },
  {
    name: "Clear Quartz",
    description:
      "Brings clarity, truth, and energetic amplification. Clear Quartz strengthens the intention of sincere, aligned, and honest connection.",
  },
  {
    name: "Sodalite",
    description:
      "A stone of truth, insight, and understanding. Sodalite helps friends communicate openly and build stronger emotional trust.",
  },
  {
    name: "Moonstone",
    description:
      "Supports emotional awareness, intuition, and empathy, allowing friendships to move with softness, depth, and emotional care.",
  },
  {
    name: "Peridot",
    description:
      "Clears heaviness, resentment, and stale emotional energy so friendships can feel lighter, brighter, and more renewing.",
  },
  {
    name: "Rose Quartz",
    description:
      "Brings compassion, gentleness, and heart-centered energy into connection, helping friendships feel warm, safe, and emotionally open.",
  },
  {
    name: "Yellow Topaz",
    description:
      "Carries joyful, uplifting energy that supports laughter, positivity, confidence, and the bright side of companionship.",
  },
  {
    name: "Amethyst",
    description:
      "Protective and calming, Amethyst helps keep friendships spiritually balanced, peaceful, and clear of draining energy.",
  },
  {
    name: "Moss Agate",
    description:
      "A grounding stone for growth and stability. Moss Agate helps friendships mature naturally and remain rooted in authenticity.",
  },
  {
    name: "Rhodonite",
    description:
      "Known for emotional healing and compassion, Rhodonite supports forgiveness, repair, and deeper understanding between friends.",
  },
  {
    name: "Green Aventurine",
    description:
      "Attracts supportive energy, harmony, and positive social connection, helping friendships thrive in a balanced and encouraging way.",
  },
  {
    name: "Blue Lace Agate",
    description:
      "A gentle communication stone that softens tension, encourages kindness, and helps friends speak with honesty and peace.",
  },
];

export default function FriendshipPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.floatingIconOne}>💞</div>
      <div style={styles.floatingIconTwo}>🤝</div>
      <div style={styles.floatingIconThree}>💎</div>
      <div style={styles.floatingIconFour}>✨</div>

      <div style={styles.content}>
        <div style={styles.hero}>
          <div style={styles.heroIcon}>🤝</div>
          <h1 style={styles.title}>Friendship</h1>
          <p style={styles.subtitle}>
            A crystal collection chosen to support loyalty, truth, trust,
            compassion, healing, and emotionally aligned connection.
          </p>
        </div>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Collection Energy</h2>

          <div style={styles.energyGrid}>
            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Purpose</div>
              <div style={styles.energyValue}>
                Loyalty, connection, emotional support
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Focus</div>
              <div style={styles.energyValue}>
                Honest bonds and heart-centered friendship
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Atmosphere</div>
              <div style={styles.energyValue}>
                Warm, healing, trustworthy, open
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Decor Theme</div>
              <div style={styles.energyValue}>
                Soft hearts, stars, letters, shared memories
              </div>
            </div>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Friendship Crystals</h2>

          <div style={styles.crystalGrid}>
            {friendshipCrystals.map((crystal) => (
              <div key={crystal.name} style={styles.crystalCard}>
                <h3 style={styles.crystalName}>{crystal.name}</h3>
                <p style={styles.crystalDescription}>{crystal.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.footerCard}>
          <p style={styles.footerText}>
            Friendship is sacred when it is honest, mutual, and deeply felt.
            This collection was chosen to support bonds built on trust,
            compassion, healing, and soul-aligned connection.
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
      "radial-gradient(circle at top, rgba(50,30,90,0.45) 0%, rgba(8,6,20,1) 55%, rgba(3,2,12,1) 100%)",
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
    transition: "0.2s ease",
  },
  floatingIconOne: {
    position: "absolute",
    top: "120px",
    left: "6%",
    fontSize: "22px",
    opacity: 0.28,
    zIndex: 1,
  },
  floatingIconTwo: {
    position: "absolute",
    top: "260px",
    right: "8%",
    fontSize: "22px",
    opacity: 0.22,
    zIndex: 1,
  },
  floatingIconThree: {
    position: "absolute",
    bottom: "180px",
    left: "8%",
    fontSize: "20px",
    opacity: 0.2,
    zIndex: 1,
  },
  floatingIconFour: {
    position: "absolute",
    bottom: "130px",
    right: "10%",
    fontSize: "18px",
    opacity: 0.18,
    zIndex: 1,
  },
};