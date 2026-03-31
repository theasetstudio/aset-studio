import React from "react";
import "./PiscesStonePage.css";

export default function PiscesPage() {
  const floatingSymbols = [
    { id: 1, top: "6%", left: "4%" },
    { id: 2, top: "14%", right: "8%" },
    { id: 3, top: "28%", left: "10%" },
    { id: 4, top: "38%", right: "12%" },
    { id: 5, top: "52%", left: "6%" },
    { id: 6, top: "62%", right: "7%" },
    { id: 7, top: "76%", left: "14%" },
    { id: 8, top: "86%", right: "16%" },
    { id: 9, top: "46%", left: "44%" },
  ];

  const stones = [
    {
      name: "Amethyst",
      description:
        "Supports spiritual clarity, intuition, emotional healing, and inner peace.",
    },
    {
      name: "Aquamarine",
      description:
        "Encourages calm expression, emotional flow, and soothing water energy.",
    },
    {
      name: "Fluorite",
      description:
        "Helps Pisces stay focused, clear-minded, and protected from overwhelm.",
    },
    {
      name: "Moonstone",
      description:
        "Deepens intuition, sensitivity, reflection, and connection to divine feminine energy.",
    },
    {
      name: "Labradorite",
      description:
        "Strengthens psychic protection, transformation, and spiritual vision.",
    },
    {
      name: "Clear Quartz",
      description:
        "Amplifies intentions, healing work, and the natural spiritual gifts of Pisces.",
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
          ♓
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">♓</span>
          <h1 className="pisces-title">Pisces Power Stones</h1>
          <p className="pisces-subtitle">
            Sacred crystals aligned with the dreamy, intuitive, emotional waters
            of Pisces.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Pisces Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Element</div>
              <div className="value">Water</div>
            </div>

            <div>
              <div className="label">Ruling Planet</div>
              <div className="value">Neptune</div>
            </div>

            <div>
              <div className="label">Birth Dates</div>
              <div className="value">Feb 19 – Mar 20</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Intuition, healing, sensitivity</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Pisces Stones</h2>

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
            Pisces carries deep emotion, spiritual softness, and quiet knowing.
            These stones are chosen to support intuition, protect sensitive
            energy, and help the soul stay grounded in beauty and peace.
          </p>
        </section>
      </div>
    </div>
  );
}