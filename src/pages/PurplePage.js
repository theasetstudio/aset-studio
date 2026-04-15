import React from "react";
import { Link } from "react-router-dom";

const purpleCrystals = [
  {
    name: "Amethyst",
    description:
      "A calming and protective stone tied to intuition, spiritual clarity, peace, and emotional balance.",
  },
  {
    name: "Purple Tourmaline",
    description:
      "Supports higher awareness, heart-centered intuition, emotional healing, and deeper energetic alignment.",
  },
  {
    name: "Kunzite",
    description:
      "A soft but powerful stone of love, emotional openness, compassion, and heart healing.",
  },
  {
    name: "Sugilite",
    description:
      "Known for spiritual protection, emotional strength, and shielding the spirit during difficult seasons.",
  },
  {
    name: "Iolite",
    description:
      "A vision stone that supports inner guidance, self-discovery, intuition, and mental clarity.",
  },
  {
    name: "Charoite",
    description:
      "A transformative stone that helps move fear into courage, supporting deep healing and spiritual growth.",
  },
  {
    name: "Fluorite",
    description:
      "Brings focus, clarity, energetic organization, and mental cleansing while supporting intuitive flow.",
  },
  {
    name: "Auralite 23",
    description:
      "A high-frequency stone associated with awakening, inner expansion, spiritual connection, and energetic depth.",
  },
  {
    name: "Grape Agate",
    description:
      "Encourages calm intuition, gentle spiritual connection, emotional peace, and dreamlike inner reflection.",
  },
  {
    name: "Lepidolite",
    description:
      "A soothing stone for emotional regulation, stress relief, stability, and soft release of heaviness.",
  },
  {
    name: "Spirit Quartz",
    description:
      "Supports harmony, collective healing, spiritual protection, and amplified peaceful energy.",
  },
  {
    name: "Phosphosiderite",
    description:
      "A tender, high-vibrational stone linked to comfort, spiritual peace, emotional softness, and rest.",
  },
  {
    name: "Hackmanite",
    description:
      "Encourages truth, inner depth, intuition, and embracing what is hidden beneath the surface.",
  },
];

export default function PurplePage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.floatingIconOne}>💜</div>
      <div style={styles.floatingIconTwo}>🔮</div>
      <div style={styles.floatingIconThree}>✨</div>
      <div style={styles.floatingIconFour}>💎</div>

      <div style={styles.content}>
        <div style={styles.hero}>
          <div style={styles.heroIcon}>💜</div>
          <h1 style={styles.title}>Purple</h1>
          <p style={styles.subtitle}>
            A stone collection centered on intuition, spiritual depth, peace,
            emotional healing, transformation, and higher awareness.
          </p>
        </div>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Collection Energy</h2>

          <div style={styles.energyGrid}>
            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Purpose</div>
              <div style={styles.energyValue}>
                Intuition, peace, spiritual protection
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Focus</div>
              <div style={styles.energyValue}>
                Healing, clarity, higher awareness, transformation
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Atmosphere</div>
              <div style={styles.energyValue}>
                Mystical, calming, deep, elevated
              </div>
            </div>

            <div style={styles.energyItem}>
              <div style={styles.energyLabel}>Decor Theme</div>
              <div style={styles.energyValue}>
                Velvet tones, candlelight, moonlight, amethyst glow
              </div>
            </div>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Purple Crystals</h2>

          <div style={styles.crystalGrid}>
            {purpleCrystals.map((crystal) => (
              <div key={crystal.name} style={styles.crystalCard}>
                <h3 style={styles.crystalName}>{crystal.name}</h3>
                <p style={styles.crystalDescription}>{crystal.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.footerCard}>
          <p style={styles.footerText}>
            Purple carries the energy of mystery, intuition, healing, and quiet
            power. This collection was chosen for those drawn to inner depth,
            emotional peace, spiritual protection, and transformation that
            begins within.
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
      "radial-gradient(circle at top, rgba(88,44,140,0.45) 0%, rgba(15,8,28,1) 55%, rgba(6,3,15,1) 100%)",
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
    background: "rgba(22, 12, 42, 0.82)",
    border: "1px solid rgba(174, 135, 225, 0.20)",
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
    border: "1px solid rgba(186, 152, 233, 0.18)",
    borderRadius: "18px",
    padding: "18px",
  },
  energyLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#c8a9ff",
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
    border: "1px solid rgba(186, 152, 233, 0.16)",
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
    background: "rgba(22, 12, 42, 0.82)",
    border: "1px solid rgba(174, 135, 225, 0.20)",
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