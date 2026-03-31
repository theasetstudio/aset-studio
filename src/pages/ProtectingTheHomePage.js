import React from "react";
import "./ProtectingTheHomePage.css";

export default function ProtectingTheHomePage() {
  const floatingHouses = [
    { id: 1, top: "7%", left: "5%" },
    { id: 2, top: "12%", right: "8%" },
    { id: 3, top: "24%", left: "10%" },
    { id: 4, top: "36%", right: "12%" },
    { id: 5, top: "48%", left: "6%" },
    { id: 6, top: "60%", right: "7%" },
    { id: 7, top: "73%", left: "14%" },
    { id: 8, top: "84%", right: "16%" },
    { id: 9, top: "54%", left: "45%" },
  ];

  const stones = [
    {
      name: "Moldavite",
      description:
        "Powerful transformational energy used to shift stagnant energy and raise the vibration of a space.",
    },
    {
      name: "Labradorite",
      description:
        "A protective shield stone that helps guard the home from unwanted energy while strengthening spiritual boundaries.",
    },
    {
      name: "Amethyst",
      description:
        "Brings peace, spiritual protection, and calm energy into the home environment.",
    },
    {
      name: "Shungite",
      description:
        "Known for grounding and cleansing, often used to absorb dense or heavy energy from a space.",
    },
    {
      name: "Selenite",
      description:
        "A cleansing crystal that clears stagnant energy and keeps the home feeling spiritually bright and peaceful.",
    },
    {
      name: "Smoky Quartz",
      description:
        "Anchors the energy of the home, helping to release stress, negativity, and energetic heaviness.",
    },
    {
      name: "Black Tourmaline",
      description:
        "One of the most trusted protection stones for shielding the home and creating strong energetic boundaries.",
    },
    {
      name: "Fire Agate",
      description:
        "Brings protective fire energy, courage, and strength to the atmosphere of the home.",
    },
    {
      name: "Tourmilated Quartz",
      description:
        "Combines clarity and protection, helping to transmute negativity while keeping the home balanced.",
    },
    {
      name: "Blue Calcite",
      description:
        "Softens the energy of a home, encourages peace, and creates a calming emotional atmosphere.",
    },
  ];

  return (
    <div className="protect-home-page">
      {floatingHouses.map((house) => (
        <span
          key={house.id}
          className="house-float"
          style={{
            top: house.top,
            left: house.left,
            right: house.right,
          }}
        >
          🏠
        </span>
      ))}

      <div className="protect-home-content">
        <header className="protect-home-hero">
          <span className="home-symbol-main">🏠</span>
          <h1 className="protect-home-title">Protecting The Home</h1>
          <p className="protect-home-subtitle">
            A protective crystal collection chosen to cleanse, shield, ground,
            and spiritually strengthen the energy of your home.
          </p>
        </header>

        <section className="protect-home-info-card">
          <h2>Collection Energy</h2>
          <div className="protect-home-info-grid">
            <div>
              <div className="label">Purpose</div>
              <div className="value">Protection, cleansing, grounding</div>
            </div>

            <div>
              <div className="label">Focus</div>
              <div className="value">Home energy and spiritual boundaries</div>
            </div>

            <div>
              <div className="label">Atmosphere</div>
              <div className="value">Peaceful, guarded, sacred</div>
            </div>

            <div>
              <div className="label">Decor Theme</div>
              <div className="value">Tiny houses</div>
            </div>
          </div>
        </section>

        <section className="protect-home-stones-section">
          <h2>Protecting The Home Crystals</h2>

          <div className="protect-home-stones-grid">
            {stones.map((stone) => (
              <div className="stone-card" key={stone.name}>
                <h3>{stone.name}</h3>
                <p>{stone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="protect-home-closing">
          <p>
            Home should feel like sanctuary. This collection was chosen to help
            clear heaviness, strengthen energetic protection, and create a space
            that feels safe, grounded, calm, and spiritually covered.
          </p>
        </section>
      </div>
    </div>
  );
}