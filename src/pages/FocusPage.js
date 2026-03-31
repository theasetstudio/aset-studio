import React from "react";
import "./PiscesStonePage.css";

export default function FocusPage() {
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
      name: "Yellow Onyx",
      description:
        "Encourages determination, mental strength, and a steady focused mindset.",
    },
    {
      name: "Black Tourmaline",
      description:
        "Protects the mind from distraction and absorbs negative or scattered energy.",
    },
    {
      name: "Azurite",
      description:
        "Enhances insight, mental clarity, and deeper intellectual awareness.",
    },
    {
      name: "Clear Quartz",
      description:
        "Amplifies mental clarity, strengthens concentration, and enhances the power of other stones.",
    },
    {
      name: "Lapis Lazuli",
      description:
        "Supports wisdom, truth, and focused thinking while improving intellectual clarity.",
    },
    {
      name: "Citrine",
      description:
        "Boosts motivation, creativity, confidence, and mental brightness.",
    },
    {
      name: "Fluorite",
      description:
        "Organizes thoughts, improves concentration, and clears mental confusion.",
    },
    {
      name: "Tiger Eye",
      description:
        "Strengthens confidence, discipline, and focused decision making.",
    },
    {
      name: "Amethyst",
      description:
        "Calms mental noise and supports clear, intuitive thinking.",
    },
    {
      name: "Hematite",
      description:
        "Grounds scattered thoughts and stabilizes mental focus.",
    },
    {
      name: "Blue Tiger Eye",
      description:
        "Enhances calm awareness, mental balance, and steady focus.",
    },
    {
      name: "Celestite",
      description:
        "Encourages peaceful thinking, clarity, and spiritual calm while focusing.",
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
          🎯
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">🎯</span>
          <h1 className="pisces-title">Focus</h1>
          <p className="pisces-subtitle">
            Stones chosen to support concentration, mental clarity,
            discipline, motivation, and a steady focused mind.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Focus Energy</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Concentration</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Air & Earth</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Mental clarity & discipline</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Clear, grounded, motivated</div>
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
            A focused mind is calm, grounded, and clear. These stones help
            strengthen concentration, remove distractions, and support
            disciplined thinking for study, work, and creative flow.
          </p>
        </section>
      </div>
    </div>
  );
}