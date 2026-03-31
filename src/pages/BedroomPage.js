import React from "react";
import "./PiscesStonePage.css";

export default function BedroomPage() {
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
        "Supports peace, spiritual calm, and restful energy in the bedroom.",
    },
    {
      name: "Lepidolite",
      description:
        "Encourages emotional balance, stress relief, and a gentler state of rest.",
    },
    {
      name: "Howlite",
      description:
        "Promotes stillness, quieting the mind and easing tension before sleep.",
    },
    {
      name: "Moonstone",
      description:
        "Brings soft lunar energy, emotional comfort, and intuitive calm.",
    },
    {
      name: "Labradorite",
      description:
        "Protects sensitive energy and supports spiritual boundaries while resting.",
    },
    {
      name: "Selenite",
      description:
        "Cleanses the atmosphere, raises vibration, and keeps the room energetically clear.",
    },
    {
      name: "Celestiite",
      description:
        "Invites serenity, angelic softness, and peaceful dream energy.",
    },
    {
      name: "Rose Quartz",
      description:
        "Fills the bedroom with loving, soothing, heart-centered energy.",
    },
    {
      name: "Rhodonite",
      description:
        "Supports emotional healing, forgiveness, and peaceful heart energy.",
    },
    {
      name: "Garnet",
      description:
        "Adds warmth, grounding, devotion, and rooted protective energy.",
    },
    {
      name: "Black Tourmaline",
      description:
        "Provides strong energetic protection and helps absorb heavy energy.",
    },
    {
      name: "Obsidian",
      description:
        "Shields the space, grounds emotional intensity, and strengthens protection.",
    },
    {
      name: "Smoky Quartz",
      description:
        "Grounds the room, clears stagnant energy, and creates a steady calming presence.",
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
          🛏️
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">🛏️</span>
          <h1 className="pisces-title">Bedroom</h1>
          <p className="pisces-subtitle">
            Sacred stones chosen to support peace, protection, emotional comfort,
            loving energy, and restful sleep within the bedroom.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Bedroom Energy</h2>
          <div className="pisces-info-grid">
            <div>
              <div className="label">Focus</div>
              <div className="value">Rest & Comfort</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Earth & Water</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Sleep, peace, protection</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Calm, love, grounding</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Bedroom Stones</h2>

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
            The bedroom should feel safe, soft, restful, and energetically clean.
            These stones are chosen to support deep peace, loving comfort,
            emotional healing, and spiritual protection in the space where you
            restore yourself.
          </p>
        </section>
      </div>
    </div>
  );
}