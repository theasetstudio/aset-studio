import React from "react";
import "./PiscesStonePage.css";

export default function LibraPage() {
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
      name: "Lapis Lazuli",
      description:
        "Encourages truth, wisdom, and clear communication while strengthening Libra's intellectual clarity.",
    },
    {
      name: "Rose Quartz",
      description:
        "Supports love, harmony, compassion, and emotional balance.",
    },
    {
      name: "Opal",
      description:
        "Enhances creativity, inspiration, emotional expression, and spiritual sensitivity.",
    },
    {
      name: "Labradorite",
      description:
        "Strengthens intuition and insight while helping Libra stay aligned with their inner guidance.",
    },
    {
      name: "Turquoise",
      description:
        "Encourages honest communication, protection, and emotional balance.",
    },
    {
      name: "Citrine",
      description:
        "Radiates positivity, abundance, joy, and confident self-expression.",
    },
    {
      name: "Tourmaline",
      description:
        "Protects emotional energy and encourages balanced grounding.",
    },
    {
      name: "Peridot",
      description:
        "Encourages growth, renewal, prosperity, and emotional healing.",
    },
    {
      name: "Black Kyanite",
      description:
        "Clears energetic blockages and restores energetic balance.",
    },
    {
      name: "Sunstone",
      description:
        "Encourages joy, leadership, personal power, and confident action.",
    },
    {
      name: "Ametrine",
      description:
        "Balances emotional intuition and logical clarity.",
    },
    {
      name: "Chrysoprase",
      description:
        "Supports emotional healing, optimism, and heart-centered balance.",
    },
    {
      name: "Blue Lace Agate",
      description:
        "Encourages calm communication, emotional peace, and gentle expression.",
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
          ♎
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">♎</span>
          <h1 className="pisces-title">Libra Power Stones</h1>
          <p className="pisces-subtitle">
            Stones aligned with Libra energy to encourage harmony, balance,
            love, communication, and graceful personal power.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Libra Energy</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">Zodiac</div>
              <div className="value">Libra</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Air</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Balance & harmony</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Peaceful, graceful, balanced</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Libra Stones</h2>

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
            Libra thrives when life is balanced, beautiful, and harmonious.
            These stones support emotional balance, graceful communication,
            loving relationships, and clear inner alignment.
          </p>
        </section>
      </div>
    </div>
  );
}