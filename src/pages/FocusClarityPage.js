import React from "react";
import "./PiscesStonePage.css";

export default function FocusClarityPage() {
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
      name: "Clear Quartz",
      description:
        "Amplifies mental clarity, focus, and intention while enhancing the energy of other stones.",
    },
    {
      name: "Hematite",
      description:
        "Grounds scattered thoughts, strengthens concentration, and stabilizes mental energy.",
    },
    {
      name: "Fluorite",
      description:
        "Organizes the mind, sharpens decision making, and improves concentration and learning.",
    },
    {
      name: "Sodalite",
      description:
        "Encourages rational thinking, mental clarity, and deeper intellectual insight.",
    },
    {
      name: "Tiger Eye",
      description:
        "Supports focus, motivation, and confidence when working toward goals.",
    },
    {
      name: "Malachite",
      description:
        "Stimulates mental transformation, insight, and deeper understanding.",
    },
    {
      name: "Selenite",
      description:
        "Clears mental fog, raises clarity, and keeps the energetic space pure and balanced.",
    },
    {
      name: "Pyrite",
      description:
        "Boosts mental strength, determination, and strategic thinking.",
    },
    {
      name: "Black Tourmaline",
      description:
        "Protects the mind from negative energy and distractions, creating a focused environment.",
    },
    {
      name: "Amethyst",
      description:
        "Calms mental noise while supporting intuitive insight and thoughtful awareness.",
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
          🧠
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">🧠</span>
          <h1 className="pisces-title">Focus & Clarity</h1>
          <p className="pisces-subtitle">
            Stones chosen to sharpen focus, strengthen mental clarity,
            enhance decision making, and create a clear, productive energy
            for study, work, and deep thinking.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Focus Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Mental Clarity</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Air & Earth</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Focus, logic, insight</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Clarity, grounding, discipline</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Focus Stones</h2>

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
            A focused space should feel clear, organized, and mentally calm.
            These stones support concentration, logical thinking, energetic
            protection from distractions, and the ability to remain present
            while working, studying, or creating.
          </p>
        </section>
      </div>
    </div>
  );
}