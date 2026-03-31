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
    name: "Sodalite",
    description:
      "Supports logic, truth, intuition, and clear communication for ideas that need both structure and vision.",
  },
  {
    name: "Fluorite",
    description:
      "Encourages focus, clarity, organization, and mental balance for creative direction and disciplined flow.",
  },
  {
    name: "Picture Jasper",
    description:
      "Supports imagination, storytelling, grounding, and visionary creation rooted in meaning and inspiration.",
  },
  {
    name: "Crazy Lace Agate",
    description:
      "Encourages joy, motion, optimism, and playful creative energy that keeps inspiration alive.",
  },
  {
    name: "Blue Chalcedony",
    description:
      "Supports gentle expression, calm communication, emotional ease, and soft artistic confidence.",
  },
  {
    name: "Amazonite",
    description:
      "Encourages truth, self-expression, confidence, harmony, and courageous creative authenticity.",
  },
  {
    name: "Zebra Calcite",
    description:
      "Supports motivation, balance, momentum, and the steady drive needed to bring ideas forward.",
  },
  {
    name: "Dumortierite",
    description:
      "Encourages discipline, patience, focus, and inner strength for consistent creative work.",
  },
  {
    name: "Carnelian",
    description:
      "Supports passion, boldness, vitality, confidence, and action-driven creative energy.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Encourages wisdom, truth, intuition, and expansive creative vision expressed with depth and clarity.",
  },
  {
    name: "Moonstone",
    description:
      "Supports intuition, emotional flow, inspiration, softness, and new beginnings in the creative process.",
  },
];

export default function CreativeMusePage() {
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
          <div style={styles.iconWrap}>🎨</div>
          <h1 style={styles.title}>Creative Muse</h1>
          <p style={styles.subtitle}>
            Stones chosen to support inspiration, imagination, expression,
            confidence, clarity, and artistic flow.
          </p>
        </header>

        <section style={styles.metaCard}>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Focus</div>
            <div style={styles.metaValue}>Creativity & Expression</div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Element</div>
            <div style={styles.metaValue}>Air, Water & Fire Energy</div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Purpose</div>
            <div style={styles.metaValue}>
              Inspiration, vision, confidence, flow
            </div>
          </div>

          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Energy</div>
            <div style={styles.metaValue}>
              Imaginative, expressive, clear, bold
            </div>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Primary Creative Muse Stones</h2>

          <div style={styles.grid}>
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
            This collection is centered on inspiration, imagination, honest
            expression, creative courage, emotional flow, and clear artistic
            vision. These stones are chosen to support original ideas, confident
            creation, grounded focus, and the freedom to bring inner vision into
            reality.
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
      "radial-gradient(circle at top center, rgba(92, 49, 154, 0.22) 0%, rgba(10, 8, 35, 0.95) 26%, #040414 58%, #02020d 100%)",
    color: "#f7efe9",
    padding: "34px 20px 56px",
    fontFamily:
      '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  backgroundGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 50% 0%, rgba(182, 120, 255, 0.14), transparent 34%)",
    pointerEvents: "none",
  },
  floatingIcon: {
    position: "absolute",
    fontSize: "54px",
    color: "#f3c95f",
    textShadow: "0 0 18px rgba(243, 201, 95, 0.28)",
    pointerEvents: "none",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1100px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "14px",
    color: "#8b5cf6",
    textDecoration: "underline",
    fontSize: "15px",
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
    background:
      "linear-gradient(180deg, rgba(20,20,40,0.96) 0%, rgba(10,10,24,0.96) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.03), 0 0 24px rgba(181, 126, 255, 0.18)",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "clamp(48px, 7vw, 78px)",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    fontWeight: 800,
    color: "#f7efe9",
    textShadow: "0 0 24px rgba(255,255,255,0.06)",
  },
  subtitle: {
    maxWidth: "760px",
    margin: "0 auto",
    fontSize: "clamp(17px, 2.2vw, 22px)",
    lineHeight: 1.7,
    color: "rgba(247, 239, 233, 0.88)",
  },
  metaCard: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "22px",
    marginBottom: "24px",
    padding: "24px 22px",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, rgba(13,16,44,0.95) 0%, rgba(9,11,35,0.95) 100%)",
    border: "1px solid rgba(183, 137, 255, 0.16)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.24)",
  },
  metaItem: {
    minWidth: 0,
  },
  metaLabel: {
    marginBottom: "8px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    color: "#f1a8d2",
    fontWeight: 700,
  },
  metaValue: {
    fontSize: "16px",
    lineHeight: 1.45,
    color: "#f7efe9",
    fontWeight: 700,
  },
  sectionCard: {
    marginBottom: "24px",
    padding: "20px",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, rgba(13,16,44,0.96) 0%, rgba(10,11,34,0.96) 100%)",
    border: "1px solid rgba(183, 137, 255, 0.16)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.24)",
  },
  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "clamp(26px, 3vw, 34px)",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#f7efe9",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  },
  stoneCard: {
    padding: "18px 16px",
    borderRadius: "18px",
    background:
      "linear-gradient(180deg, rgba(73,29,61,0.62) 0%, rgba(54,24,53,0.52) 100%)",
    border: "1px solid rgba(226, 110, 167, 0.16)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
  },
  stoneName: {
    margin: "0 0 10px",
    fontSize: "17px",
    lineHeight: 1.25,
    fontWeight: 800,
    color: "#fff1ea",
  },
  stoneDescription: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.72,
    color: "rgba(247, 239, 233, 0.88)",
  },
  bottomCard: {
    padding: "28px 26px",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, rgba(13,16,44,0.95) 0%, rgba(10,11,34,0.95) 100%)",
    border: "1px solid rgba(183, 137, 255, 0.16)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.24)",
  },
  bottomText: {
    margin: 0,
    textAlign: "center",
    fontSize: "18px",
    lineHeight: 1.9,
    color: "rgba(247, 239, 233, 0.9)",
    maxWidth: "900px",
    marginInline: "auto",
  },
};

if (typeof window !== "undefined") {
  const styleId = "creative-muse-responsive-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media (max-width: 980px) {
        .creative-muse-meta-grid,
        .creative-muse-stone-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }

      @media (max-width: 640px) {
        .creative-muse-meta-grid,
        .creative-muse-stone-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}