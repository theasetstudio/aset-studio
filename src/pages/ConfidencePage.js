import React from "react";
import "./PiscesStonePage.css";

export default function ConfidencePage() {
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
      name: "Carnelian",
      description:
        "Encourages courage, motivation, and fearless action while strengthening confidence and vitality.",
    },
    {
      name: "Tiger Eye",
      description:
        "Builds personal power, grounded confidence, and clear decision making.",
    },
    {
      name: "Citrine",
      description:
        "Radiates optimism, confidence, creativity, and empowered self-belief.",
    },
    {
      name: "Red Jasper",
      description:
        "Strengthens determination, emotional stability, and steady confidence.",
    },
    {
      name: "Rose Quartz",
      description:
        "Encourages self-love, emotional healing, and compassionate confidence.",
    },
    {
      name: "Amethyst",
      description:
        "Calms insecurity and supports balanced self-trust and inner peace.",
    },
    {
      name: "Black Onyx",
      description:
        "Strengthens resilience, discipline, and inner authority.",
    },
    {
      name: "Blue Aventurine",
      description:
        "Supports calm, confident communication and self-expression.",
    },
    {
      name: "Lapis Lazuli",
      description:
        "Encourages wisdom, truth, and confident expression of one's authentic voice.",
    },
    {
      name: "Labradorite",
      description:
        "Strengthens intuition and self-trust while encouraging belief in your personal path.",
    },
    {
      name: "Sunstone",
      description:
        "Promotes independence, joy, leadership energy, and bold self-confidence.",
    },
    {
      name: "Black Tourmaline",
      description:
        "Protects confidence from negative energy and strengthens emotional boundaries.",
    },
    {
      name: "Yellow Jasper",
      description:
        "Encourages optimism, emotional balance, and grounded confidence.",
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
          👑
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">👑</span>
          <h1 className="pisces-title">Confidence</h1>
          <p className="pisces-subtitle">
            Stones chosen to strengthen self-belief, courage, personal power,
            emotional balance, and inner strength.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Confidence Energy</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">Confidence</div>
              <div className="value">Self-belief</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Fire & Earth</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Courage & personal power</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Bold, grounded, empowered</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Confidence Stones</h2>

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
            Confidence grows when the mind is steady and the heart trusts its
            own strength. These stones support courage, self-belief, and the
            ability to move forward with clarity and personal power.
          </p>
        </section>
      </div>
    </div>
  );
}