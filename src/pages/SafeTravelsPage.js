import React from "react";
import "./PiscesStonePage.css";

export default function SafeTravelsPage() {
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
    { id: 10, top: "46%", left: "44%" },
    { id: 11, top: "60%", left: "30%" },
    { id: 12, top: "18%", right: "24%" },
  ];

  const stones = [
    {
      name: "Shungite",
      description:
        "Provides strong energetic protection and grounding while traveling through different spaces and environments.",
    },
    {
      name: "Sodalite",
      description:
        "Supports calm thinking, clear judgment, and steady communication during travel.",
    },
    {
      name: "Tourmaline",
      description:
        "Offers protection from heavy energy, helps absorb negativity, and strengthens energetic boundaries.",
    },
    {
      name: "Rose Quartz",
      description:
        "Brings emotional calm, gentle protection, and loving peaceful energy throughout the journey.",
    },
    {
      name: "Tiger Eye",
      description:
        "Encourages confidence, alertness, protection, and grounded awareness while on the move.",
    },
    {
      name: "Red Jasper",
      description:
        "Supports endurance, stability, courage, and a strong grounded presence during travel.",
    },
    {
      name: "Yellow Jasper",
      description:
        "Promotes positivity, steadiness, protection, and a balanced sense of confidence.",
    },
    {
      name: "Amethyst",
      description:
        "Encourages spiritual protection, calmness, intuitive guidance, and peaceful energy.",
    },
    {
      name: "Lapis Lazuli",
      description:
        "Supports wisdom, awareness, inner truth, and mentally clear navigation.",
    },
    {
      name: "Calcite",
      description:
        "Helps clear mental fog, renew energy, and bring a lighter more open flow while traveling.",
    },
    {
      name: "Selenite",
      description:
        "Cleanses energy, raises vibration, and helps keep your spiritual field clear and protected.",
    },
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
          ✈️
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">✈️</span>
          <h1 className="pisces-title">Safe Travels</h1>
          <p className="pisces-subtitle">
            Stones chosen to support protection, grounding, calm awareness,
            clear decision making, and peaceful energy while traveling.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Travel Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Protection & Guidance</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Air & Earth</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Safe travel, calm, stability</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Grounded, protected, clear</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Safe Travel Stones</h2>

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
            Travel energy should feel protected, steady, clear, and calm.
            These stones are chosen to support spiritual shielding, grounded
            movement, emotional ease, and wise awareness wherever your path
            takes you.
          </p>
        </section>
      </div>
    </div>
  );
}