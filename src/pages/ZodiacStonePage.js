import React from "react";
import "./PiscesStonePage.css";

export default function ZodiacStonePage({
  symbol,
  title,
  subtitle,
  info,
  stones,
  closing,
  sectionTitle = "Primary Stones",
}) {
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

  return (
    <div className="pisces-page">
      {floatingSymbols.map((item) => (
        <span
          key={item.id}
          className="pisces-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {symbol}
        </span>
      ))}

      <div className="pisces-content">
        <header className="pisces-hero">
          <span className="pisces-symbol-main">{symbol}</span>
          <h1 className="pisces-title">{title}</h1>
          <p className="pisces-subtitle">{subtitle}</p>
        </header>

        <section className="pisces-info-card">
          <h2>{info.heading}</h2>

          <div className="pisces-info-grid">
            <div>
              <div className="label">{info.label1}</div>
              <div className="value">{info.value1}</div>
            </div>

            <div>
              <div className="label">{info.label2}</div>
              <div className="value">{info.value2}</div>
            </div>

            <div>
              <div className="label">{info.label3}</div>
              <div className="value">{info.value3}</div>
            </div>

            <div>
              <div className="label">{info.label4}</div>
              <div className="value">{info.value4}</div>
            </div>
          </div>
        </section>

        <section className="pisces-stones-section">
          <h2>{sectionTitle}</h2>

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
          <p>{closing}</p>
        </section>
      </div>
    </div>
  );
}