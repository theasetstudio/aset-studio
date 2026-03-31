import React from "react";
import "./PiscesStonePage.css";

export default function AquariusPage() {
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
      name: "Amethyst",
      description:
        "Supports spiritual clarity, calm thinking, and intuitive wisdom for Aquarius energy.",
    },
    {
      name: "Moss Agate",
      description:
        "Brings grounding, emotional balance, and a deeper connection to natural flow and growth.",
    },
    {
      name: "Garnet",
      description:
        "Encourages strength, devotion, vitality, and grounded motivation.",
    },
    {
      name: "Rose Quartz",
      description:
        "Softens the heart, encourages compassion, and brings loving emotional balance.",
    },
    {
      name: "Red Jasper",
      description:
        "Adds stability, courage, endurance, and a strong grounding presence.",
    },
    {
      name: "Labradorite",
      description:
        "Enhances intuition, spiritual protection, and visionary insight.",
    },
    {
      name: "Aquamarine",
      description:
        "Supports calm communication, clear expression, and soothing emotional flow.",
    },
    {
      name: "Angelite",
      description:
        "Encourages peace, spiritual connection, and gentle higher guidance.",
    },
    {
      name: "Black Onyx",
      description:
        "Provides protection, grounding, and strength during emotional or energetic stress.",
    },
    {
      name: "Amber",
      description:
        "Brings warmth, uplifting energy, cleansing, and a bright stabilizing presence.",
    },
    {
      name: "Turquoise",
      description:
        "Supports truth, protection, healing, and balanced communication.",
    },
    {
      name: "Green Jade",
      description:
        "Invites harmony, wisdom, prosperity, and steady heart-centered balance.",
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
          ♒
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">♒</span>
          <h1 className="pisces-title">Aquarius</h1>
          <p className="pisces-subtitle">
            Sacred stones chosen to support Aquarius energy through intuition,
            innovation, emotional balance, protection, calm communication,
            and spiritual clarity.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Aquarius Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Vision & Insight</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Air</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Clarity, balance, expression</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Intuitive, calm, original</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Aquarius Stones</h2>

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
            Aquarius energy thrives when the mind is clear, the heart is balanced,
            and the spirit is free to expand. These stones support protection,
            emotional wisdom, calm self-expression, innovation, and the deeper
            spiritual insight that helps Aquarius move with purpose.
          </p>
        </section>
      </div>
    </div>
  );
}