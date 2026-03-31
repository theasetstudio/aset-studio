import React from "react";
import "./PiscesStonePage.css";

export default function FullMoonPage() {
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
      name: "Moonstone",
      description:
        "Strengthens intuition, emotional reflection, and connection to lunar cycles.",
    },
    {
      name: "Citrine",
      description:
        "Amplifies manifestation energy, clarity of intention, and radiant positivity.",
    },
    {
      name: "Black Tourmaline",
      description:
        "Provides powerful energetic protection and grounding during spiritual work.",
    },
    {
      name: "Selenite",
      description:
        "Cleanses energy, raises vibration, and purifies spaces and spiritual tools.",
    },
    {
      name: "Amethyst",
      description:
        "Encourages spiritual awareness, peace of mind, and intuitive clarity.",
    },
    {
      name: "Aquamarine",
      description:
        "Supports emotional flow, calm expression, and gentle lunar water energy.",
    },
    {
      name: "Clear Quartz",
      description:
        "Amplifies intentions, rituals, and energetic alignment during the full moon.",
    },
    {
      name: "Labradorite",
      description:
        "Enhances psychic protection, transformation, and spiritual insight.",
    },
    {
      name: "Peach Moonstone",
      description:
        "Supports emotional balance, feminine energy, and gentle inner reflection.",
    },
    {
      name: "Angelite",
      description:
        "Encourages peaceful communication with higher guidance and angelic energy.",
    },
    {
      name: "Lepidolite",
      description:
        "Brings emotional calm, stress release, and balance during powerful lunar shifts.",
    },
    {
      name: "Mystic Merlinite",
      description:
        "Connects spiritual and earthly realms, enhancing magic, intuition, and deep wisdom.",
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
          🌕
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">🌕</span>
          <h1 className="pisces-title">Full Moon</h1>
          <p className="pisces-subtitle">
            Sacred crystals aligned with the illumination, intuition, release,
            and spiritual power of the Full Moon.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Full Moon Energy</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">Cycle</div>
              <div className="value">Lunar Peak</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Water & Light</div>
            </div>

            <div>
              <div className="label">Focus</div>
              <div className="value">Clarity, Release, Manifestation</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Intuition, Reflection, Protection</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Full Moon Stones</h2>

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
            The Full Moon is a sacred moment of illumination where emotions,
            intentions, and spiritual awareness rise fully into the light.
            These stones support clarity, protection, intuition, and powerful
            manifestation during lunar rituals and reflection.
          </p>
        </section>
      </div>
    </div>
  );
}