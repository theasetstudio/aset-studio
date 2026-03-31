import React from "react";
import "./PiscesStonePage.css";

export default function LuckPage() {
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
      name: "Pyrite",
      description:
        "A powerful stone for attracting prosperity, wealth energy, and confident action.",
    },
    {
      name: "Tiger Eye",
      description:
        "Strengthens decision making, courage, and personal power while attracting success.",
    },
    {
      name: "Citrine",
      description:
        "A joyful abundance stone known for attracting prosperity, optimism, and opportunity.",
    },
    {
      name: "Labradorite",
      description:
        "Enhances intuition and alignment, helping you recognize fortunate opportunities.",
    },
    {
      name: "Carnelian",
      description:
        "Encourages bold action and motivation, helping you create your own lucky outcomes.",
    },
    {
      name: "Peridot",
      description:
        "Attracts abundance, growth, and fresh opportunities while releasing old limitations.",
    },
    {
      name: "Ruby Zoisite",
      description:
        "Encourages passion, vitality, and inspired action toward fortunate outcomes.",
    },
    {
      name: "Jade",
      description:
        "A classic prosperity stone associated with good fortune, harmony, and long-term success.",
    },
    {
      name: "Chrome Diopside",
      description:
        "Encourages heart-centered opportunities, prosperity, and emotional abundance.",
    },
    {
      name: "Sunstone",
      description:
        "Radiates joy, personal power, and fortunate energy connected to success and leadership.",
    },
    {
      name: "Green Aventurine",
      description:
        "Known as the stone of opportunity, supporting luck, prosperity, and positive outcomes.",
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
          🍀
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">🍀</span>
          <h1 className="pisces-title">Luck</h1>
          <p className="pisces-subtitle">
            Stones chosen to attract opportunity, prosperity, fortunate
            outcomes, and aligned abundance.
          </p>
        </header>

        <section className="pisces-info-card">
          <h2>Luck Energy</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">Luck</div>
              <div className="value">Opportunity</div>
            </div>

            <div>
              <div className="label">Element</div>
              <div className="value">Earth & Fire</div>
            </div>

            <div>
              <div className="label">Purpose</div>
              <div className="value">Prosperity & fortune</div>
            </div>

            <div>
              <div className="label">Energy</div>
              <div className="value">Abundant, positive, aligned</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>Primary Luck Stones</h2>

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
            Luck often appears when preparation meets opportunity. These stones
            help align your energy with prosperity, growth, and fortunate
            outcomes.
          </p>
        </section>
      </div>
    </div>
  );
}