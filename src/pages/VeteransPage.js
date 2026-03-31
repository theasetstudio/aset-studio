import React from "react";
import "./VeteransPage.css";

const floatingIcons = [
  { id: 1, top: "10%", left: "6%", icon: "🛡️" },
  { id: 2, top: "16%", right: "9%", icon: "⭐" },
  { id: 3, top: "30%", left: "12%", icon: "🛡️" },
  { id: 4, top: "38%", right: "14%", icon: "⭐" },
  { id: 5, top: "55%", left: "8%", icon: "🛡️" },
  { id: 6, top: "66%", right: "10%", icon: "⭐" },
  { id: 7, top: "80%", left: "15%", icon: "🛡️" },
  { id: 8, top: "88%", right: "18%", icon: "⭐" },
];

const veteranStones = [
  {
    name: "Black Tourmaline",
    description:
      "Supports protection, grounding, energetic boundaries, and emotional steadiness during stressful or heavy periods.",
  },
  {
    name: "Lepidolite",
    description:
      "Encourages calm, emotional balance, nervous system support, and peace during times of overwhelm or transition.",
  },
  {
    name: "Black Obsidian",
    description:
      "Offers deep protection, truth, grounding, and the release of heavy emotional energy held beneath the surface.",
  },
  {
    name: "Bloodstone",
    description:
      "Strengthens courage, endurance, resilience, grounded action, and inner strength through difficult seasons.",
  },
  {
    name: "Ruby",
    description:
      "Supports vitality, life force, courage, passion, determination, and a renewed connection to personal power.",
  },
  {
    name: "Smoky Quartz",
    description:
      "Helps ground fear, clear emotional heaviness, promote stability, and create a calmer inner foundation.",
  },
  {
    name: "Green Calcite",
    description:
      "Encourages heart healing, softness, emotional renewal, and gentle recovery after stress or pain.",
  },
  {
    name: "Lithium Quartz",
    description:
      "Supports soothing emotional intensity, calming the spirit, and bringing peace, comfort, and quiet restoration.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Encourages truth, wisdom, inner vision, clear communication, and strength in speaking from lived experience.",
  },
  {
    name: "Chrysocolla",
    description:
      "Supports emotional expression, gentleness, inner peace, compassionate communication, and calming strength.",
  },
  {
    name: "Angelite",
    description:
      "Encourages peace, spiritual comfort, emotional softness, higher guidance, and a sense of being held.",
  },
  {
    name: "Rose Quartz",
    description:
      "Supports self-compassion, heart healing, emotional comfort, love, and gentleness toward yourself.",
  },
  {
    name: "Mangano Calcite",
    description:
      "Encourages deep emotional healing, tenderness, nervous system softness, and compassionate heart restoration.",
  },
];

export default function VeteransPage() {
  return (
    <div className="veterans-page">
      {floatingIcons.map((item) => (
        <span
          key={item.id}
          className="veterans-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div className="veterans-content">
        <header className="veterans-hero">
          <div className="veterans-icon-wrap">
            <span className="veterans-icon">🛡️</span>
          </div>
          <h1>Veterans</h1>
          <p>
            Stones chosen to support protection, grounding, emotional healing,
            courage, peace, resilience, and compassionate restoration.
          </p>
        </header>

        <section className="veterans-summary-card">
          <div className="veterans-summary-block">
            <span className="veterans-label">Focus</span>
            <strong>Healing & Protection</strong>
          </div>

          <div className="veterans-summary-block">
            <span className="veterans-label">Element</span>
            <strong>Earth & Spirit</strong>
          </div>

          <div className="veterans-summary-block">
            <span className="veterans-label">Purpose</span>
            <strong>Grounding, recovery, peace</strong>
          </div>

          <div className="veterans-summary-block">
            <span className="veterans-label">Energy</span>
            <strong>Steady, protected, calm, resilient</strong>
          </div>
        </section>

        <section className="veterans-stones-card">
          <h2>Primary Veterans Support Stones</h2>

          <div className="veterans-stones-grid">
            {veteranStones.map((stone) => (
              <div className="veterans-stone-item" key={stone.name}>
                <h3>{stone.name}</h3>
                <p>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="veterans-closing-card">
          <p>
            This collection is centered on grounding, emotional healing,
            protection, courage, peace, and heart restoration. These stones are
            chosen to support steadiness, release, comfort, and compassionate
            strength through every stage of healing and remembrance.
          </p>
        </section>
      </div>
    </div>
  );
}