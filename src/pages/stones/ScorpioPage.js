import React from "react";
import "./ScorpioPage.css";

export default function ScorpioPage() {
  const floatingSymbols = [
    { id: 1, top: "6%", left: "4%" },
    { id: 2, top: "12%", right: "8%" },
    { id: 3, top: "20%", left: "14%" },
    { id: 4, top: "30%", right: "12%" },
    { id: 5, top: "40%", left: "6%" },
    { id: 6, top: "52%", right: "10%" },
    { id: 7, top: "64%", left: "10%" },
    { id: 8, top: "74%", right: "14%" },
    { id: 9, top: "84%", left: "18%" },
  ];

  const stones = [
    { name: "Opal", description: "Transformation, intuition, emotional depth." },
    { name: "Obsidian", description: "Protection, grounding, truth." },
    { name: "Unakite", description: "Emotional healing, balance, renewal." },
    { name: "Alexandrite", description: "Change, adaptability, inner strength." },
    { name: "Melanite", description: "Protection, resilience, grounding." },
    { name: "Rhodochrosite", description: "Self-love, healing, emotional release." },
    { name: "Labradorite", description: "Intuition, protection, vision." },
    { name: "Moonstone", description: "Balance, feminine energy, intuition." },
    { name: "Peridot", description: "Renewal, heart healing, release." },
    { name: "Dioptase", description: "Deep healing, compassion, forgiveness." },
    { name: "Nebula Stone", description: "Strength, grounding, clarity." },
    { name: "Pink Banded Agate", description: "Comfort, stability, gentle protection." },
    { name: "Kunzite", description: "Love, peace, emotional openness." },
  ];

  return (
    <div className="pisces-page">
      {floatingSymbols.map((symbol) => (
        <span
          key={symbol.id}
          className="pisces-float"
          style={{
            top: symbol.top,
            left: symbol.left,
            right: symbol.right,
          }}
        >
          ♏
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">♏</span>
          <h1 className="pisces-title">Scorpio</h1>
          <p className="pisces-subtitle">
            Sacred stones chosen to support Scorpio energy through transformation,
            protection, emotional healing, intuition, and spiritual depth.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Scorpio Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Transformation & Power</div>
            </div>
            <div>
              <div className="label">Element</div>
              <div className="value">Water</div>
            </div>
            <div>
              <div className="label">Purpose</div>
              <div className="value">Healing, protection, rebirth</div>
            </div>
            <div>
              <div className="label">Energy</div>
              <div className="value">Intense, intuitive, magnetic</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Scorpio Stones</h2>

          <div className="pisces-stones-grid">
            {stones.map((stone) => (
              <div className="stone-card" key={stone.name}>
                <h3>{stone.name}</h3>
                <p>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pisces-closing">
          <p>
            Scorpio energy moves through depth, truth, transformation, and emotional power.
            These stones support protection, release, and powerful inner evolution.
          </p>
        </section>
      </div>
    </div>
  );
}