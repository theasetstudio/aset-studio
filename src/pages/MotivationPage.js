import React from "react";
import "./MotivationPage.css";

const floatingIcons = [
  { id: 1, top: "10%", left: "6%", icon: "🔥" },
  { id: 2, top: "16%", right: "9%", icon: "✨" },
  { id: 3, top: "30%", left: "12%", icon: "🔥" },
  { id: 4, top: "38%", right: "14%", icon: "✨" },
  { id: 5, top: "55%", left: "8%", icon: "🔥" },
  { id: 6, top: "66%", right: "10%", icon: "✨" },
  { id: 7, top: "80%", left: "15%", icon: "🔥" },
  { id: 8, top: "88%", right: "18%", icon: "✨" },
];

const motivationStones = [
  {
    name: "Pyrite",
    description:
      "Encourages ambition, confidence, personal power, and the courage to move forward boldly.",
  },
  {
    name: "Carnelian",
    description:
      "Supports action, motivation, creativity, courage, and inspired forward momentum.",
  },
  {
    name: "Amethyst",
    description:
      "Brings clarity, centered focus, inner strength, and aligned action guided by purpose.",
  },
  {
    name: "Bumblebee Jasper",
    description:
      "Promotes energy, optimism, self-belief, bold expression, and joyful movement.",
  },
  {
    name: "Unakite",
    description:
      "Supports balanced growth, emotional healing, consistency, and steady progress.",
  },
  {
    name: "Citrine",
    description:
      "Encourages success, confidence, empowered action, manifestation, and positive momentum.",
  },
  {
    name: "Red Jasper",
    description:
      "Strengthens stamina, grounding, discipline, endurance, and motivational stability.",
  },
  {
    name: "Garnet",
    description:
      "Supports passion, commitment, strength, determination, and sustained drive.",
  },
  {
    name: "Tiger Eye",
    description:
      "Encourages confidence, focus, determination, grounded awareness, and clear direction.",
  },
  {
    name: "Bloodstone",
    description:
      "Offers resilience, persistence, brave action, grounding, and strength under pressure.",
  },
  {
    name: "Fluorite",
    description:
      "Supports mental clarity, concentration, organization, structure, and disciplined motivation.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Encourages wisdom, vision, truth, inner purpose, and insight-led action.",
  },
];

export default function MotivationPage() {
  return (
    <div className="motivation-page">
      {floatingIcons.map((item) => (
        <span
          key={item.id}
          className="motivation-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div className="motivation-content">
        <header className="motivation-hero">
          <div className="motivation-icon-wrap">
            <span className="motivation-icon">🔥</span>
          </div>
          <h1>Motivation</h1>
          <p>
            Stones chosen to support drive, courage, resilience, confidence,
            focus, and forward-moving energy.
          </p>
        </header>

        <section className="motivation-summary-card">
          <div className="motivation-summary-block">
            <span className="motivation-label">Focus</span>
            <strong>Drive & Confidence</strong>
          </div>

          <div className="motivation-summary-block">
            <span className="motivation-label">Element</span>
            <strong>Fire & Earth</strong>
          </div>

          <div className="motivation-summary-block">
            <span className="motivation-label">Purpose</span>
            <strong>Momentum, courage, action</strong>
          </div>

          <div className="motivation-summary-block">
            <span className="motivation-label">Energy</span>
            <strong>Bold, steady, empowered, clear</strong>
          </div>
        </section>

        <section className="motivation-stones-card">
          <h2>Primary Motivation Stones</h2>

          <div className="motivation-stones-grid">
            {motivationStones.map((stone) => (
              <div className="motivation-stone-item" key={stone.name}>
                <h3>{stone.name}</h3>
                <p>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="motivation-closing-card">
          <p>
            Motivation energy should feel empowering, clear, steady, and alive.
            These stones are chosen to support courage, personal power,
            resilience, and inspired action as you keep moving toward what calls
            you.
          </p>
        </section>
      </div>
    </div>
  );
}