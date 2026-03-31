import React from "react";
import { Link } from "react-router-dom";

const floatingIcons = [
  { id: 1, top: "10%", left: "7%", icon: "✦", opacity: 0.12 },
  { id: 2, top: "18%", right: "9%", icon: "✧", opacity: 0.16 },
  { id: 3, top: "34%", left: "6%", icon: "✦", opacity: 0.12 },
  { id: 4, top: "45%", right: "11%", icon: "✧", opacity: 0.14 },
  { id: 5, top: "62%", left: "8%", icon: "✦", opacity: 0.12 },
  { id: 6, top: "74%", right: "10%", icon: "✧", opacity: 0.15 },
  { id: 7, top: "86%", left: "12%", icon: "✦", opacity: 0.1 },
  { id: 8, top: "88%", right: "14%", icon: "✧", opacity: 0.12 },
];

const primaryStones = [
  {
    name: "Larimar",
    description:
      "Supports calm communication, emotional healing, peace, and soothing water energy.",
  },
  {
    name: "Sodalite",
    description:
      "Encourages truth, intuition, emotional clarity, and honest expression.",
  },
  {
    name: "Blue Lace Agate",
    description:
      "Supports gentle speech, calm communication, and peaceful emotional balance.",
  },
  {
    name: "Blue Opal",
    description:
      "Encourages emotional release, tranquility, and fluid communication.",
  },
  {
    name: "Aquamarine",
    description:
      "Supports courage, serenity, and clear, confident communication.",
  },
  {
    name: "Blue Agate",
    description:
      "Encourages stability, grounding, calmness, and balanced communication.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Supports wisdom, truth, intuition, and expressive clarity.",
  },
  {
    name: "Blue Calcite",
    description:
      "Encourages rest, emotional ease, softness, and peaceful energy.",
  },
  {
    name: "Angelite",
    description:
      "Supports peace, compassion, spiritual connection, and serenity.",
  },
  {
    name: "Blue Chalcedony",
    description:
      "Encourages soft communication, emotional harmony, and gentle expression.",
  },
  {
    name: "Azurite",
    description:
      "Supports intuition, insight, psychic awareness, and mental clarity.",
  },
  {
    name: "Blue Apatite",
    description:
      "Encourages inspiration, motivation, manifestation, and expressive flow.",
  },
];

export default function BluePage() {
  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow} />

      {floatingIcons.map((item) => (
        <span
          key={item.id}
          style={{
            ...styles.floatingIcon,
            top: item.top,
            left: item.left,
            right: item.right,
            opacity: item.opacity,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div style={styles.content}>
        <Link to="/stones" style={styles.backLink}>
          ← Back to Stone Collections
        </Link>

        <header style={styles.hero}>
          <div style={styles.iconWrap}>💙</div>
          <h1 style={styles.title}>Blue</h1>
          <p style={styles.subtitle}>
            Stones chosen to support peace, calm communication, emotional
            healing, intuition, clarity, softness, and soothing blue energy.
          </p>
        </header>

        <section style={styles.metaCard} className="blue-meta-grid">
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Focus</div>
            <div style={styles.metaValue}>Peace & Communication</div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Element</div>
            <div style={styles.metaValue}>Water & Air Energy</div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Purpose</div>
            <div style={styles.metaValue}>
              Calm, truth, intuition, healing
            </div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Energy</div>
            <div style={styles.metaValue}>
              Soothing, clear, gentle, spiritual
            </div>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Primary Blue Stones</h2>

          <div style={styles.grid} className="blue-stone-grid">
            {primaryStones.map((stone) => (
              <div key={stone.name} style={styles.stoneCard}>
                <h3 style={styles.stoneName}>{stone.name}</h3>
                <p style={styles.stoneDescription}>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.bottomCard}>
          <p style={styles.bottomText}>
            This collection is centered on peace, emotional healing, truth,
            gentle expression, spiritual clarity, and calming blue energy.
            These stones support soothing communication, inner balance,
            intuitive flow, and a quiet strength rooted in softness and wisdom.
          </p>
        </section>
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
      "radial-gradient(circle at top center, rgba(70,124,201,0.22) 0%, rgba(10,8,35,0.95) 26%, #040414 58%, #02020d 100%)",
    color: "#f7efe9",
    padding: "34px 20px 56px",
  },
  backgroundGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 50% 0%, rgba(120,185,255,0.14), transparent 34%)",
  },
  floatingIcon: {
    position: "absolute",
    fontSize: "54px",
    color: "#8fd3ff",
  },
  content: {
    position: "relative",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "14px",
    color: "#8b5cf6",
    textDecoration: "underline",
  },
  hero: {
    textAlign: "center",
    marginBottom: "28px",
  },
  iconWrap: {
    width: "68px",
    height: "68px",
    margin: "0 auto 16px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    background: "#141428",
  },
  title: {
    fontSize: "64px",
    fontWeight: "800",
    marginBottom: "12px",
  },
  subtitle: {
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.7",
  },
  metaCard: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "24px",
    padding: "20px",
    borderRadius: "20px",
    background: "#101028",
  },
  metaItem: {},
  metaLabel: {
    fontSize: "12px",
    color: "#9fd8ff",
  },
  metaValue: {
    fontWeight: "700",
  },
  sectionCard: {
    padding: "20px",
    borderRadius: "20px",
    background: "#101028",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "28px",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },
  stoneCard: {
    padding: "16px",
    borderRadius: "14px",
    background: "#1a1a3a",
  },
  stoneName: {
    fontWeight: "700",
    marginBottom: "8px",
  },
  stoneDescription: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  bottomCard: {
    padding: "24px",
    borderRadius: "20px",
    background: "#101028",
  },
  bottomText: {
    textAlign: "center",
    lineHeight: "1.8",
  },
};

if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 900px) {
      .blue-meta-grid, .blue-stone-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 600px) {
      .blue-meta-grid, .blue-stone-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}