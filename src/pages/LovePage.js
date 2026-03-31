import React from "react";
import "./LovePage.css";

const floatingIcons = [
  { id: 1, top: "10%", left: "6%", icon: "💗" },
  { id: 2, top: "16%", right: "9%", icon: "✨" },
  { id: 3, top: "30%", left: "12%", icon: "💗" },
  { id: 4, top: "38%", right: "14%", icon: "✨" },
  { id: 5, top: "55%", left: "8%", icon: "💗" },
  { id: 6, top: "66%", right: "10%", icon: "✨" },
  { id: 7, top: "80%", left: "15%", icon: "💗" },
  { id: 8, top: "88%", right: "18%", icon: "✨" },
];

const loveStones = [
  {
    name: "Rose Quartz",
    description:
      "Supports unconditional love, tenderness, self-love, emotional healing, and gentle heart opening.",
  },
  {
    name: "Blue Calcite",
    description:
      "Encourages calm communication, emotional softness, peace, and a soothing presence in love.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Supports truth, honesty, emotional wisdom, and clear expression in matters of the heart.",
  },
  {
    name: "Mangano Calcite",
    description:
      "Encourages deep emotional healing, compassion, softness, and comfort for the heart space.",
  },
  {
    name: "Pink Tourmaline",
    description:
      "Supports emotional healing, heart-centered love, compassion, and loving vulnerability.",
  },
  {
    name: "Prehnite",
    description:
      "Encourages inner peace, unconditional love, trust, and a calm, nurturing heart energy.",
  },
  {
    name: "Smoky Quartz",
    description:
      "Helps ground emotional intensity, release heaviness, and bring steadiness into love.",
  },
  {
    name: "Rhodonite",
    description:
      "Supports forgiveness, compassion, emotional balance, and healing relationship wounds.",
  },
  {
    name: "Carnelian",
    description:
      "Encourages passion, vitality, courage, confidence, and warm, alive connection.",
  },
  {
    name: "Garnet",
    description:
      "Supports devotion, passion, commitment, strength, and enduring heart energy.",
  },
  {
    name: "Moonstone",
    description:
      "Encourages intuition, emotional flow, divine feminine energy, and softness in love.",
  },
  {
    name: "Sodalite",
    description:
      "Supports honest communication, emotional clarity, truth, and deeper understanding in connection.",
  },
];

export default function LovePage() {
  return (
    <div className="love-page">
      {floatingIcons.map((item) => (
        <span
          key={item.id}
          className="love-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div className="love-content">
        <header className="love-hero">
          <div className="love-icon-wrap">
            <span className="love-icon">💗</span>
          </div>
          <h1>Love</h1>
          <p>
            Stones chosen to support tenderness, emotional healing, honest
            connection, compassion, heart opening, passion, and loving harmony.
          </p>
        </header>

        <section className="love-summary-card">
          <div className="love-summary-block">
            <span className="love-label">Focus</span>
            <strong>Love & Heart Healing</strong>
          </div>

          <div className="love-summary-block">
            <span className="love-label">Element</span>
            <strong>Water & Heart Energy</strong>
          </div>

          <div className="love-summary-block">
            <span className="love-label">Purpose</span>
            <strong>Compassion, intimacy, connection</strong>
          </div>

          <div className="love-summary-block">
            <span className="love-label">Energy</span>
            <strong>Soft, honest, warm, nurturing</strong>
          </div>
        </section>

        <section className="love-stones-card">
          <h2>Primary Love Stones</h2>

          <div className="love-stones-grid">
            {loveStones.map((stone) => (
              <div className="love-stone-item" key={stone.name}>
                <h3>{stone.name}</h3>
                <p>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="love-closing-card">
          <p>
            This collection is centered on tenderness, emotional healing,
            honesty, passion, compassion, and heart-led connection. These stones
            are chosen to support loving softness, deeper intimacy, emotional
            balance, and relationships rooted in truth and care.
          </p>
        </section>
      </div>
    </div>
  );
}