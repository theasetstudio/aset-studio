import React, { useState } from "react";
import "./ProtectingTheHomePage.css";

const floatingSymbols = [
  { id: 1, top: "8%", left: "6%", icon: "🔮" },
  { id: 2, top: "18%", right: "8%", icon: "✦" },
  { id: 3, top: "34%", left: "10%", icon: "☾" },
  { id: 4, top: "48%", right: "12%", icon: "✧" },
  { id: 5, top: "66%", left: "7%", icon: "🔮" },
  { id: 6, top: "80%", right: "10%", icon: "☾" },
];

const intuitionStones = [
  {
    name: "Charoite",
    description:
      "Transformation, spiritual insight, and deep inner knowing.",
    energy:
      "Supports spiritual evolution, inner truth, and trusting what rises from within.",
  },
  {
    name: "Atlantisite",
    description:
      "Ancient wisdom, intuition, emotional healing, and heart-guided awareness.",
    energy:
      "Blends heart healing with intuitive perception, making guidance feel softer and wiser.",
  },
  {
    name: "Fluorite",
    description:
      "Mental clarity, energetic cleansing, focus, and intuitive alignment.",
    energy:
      "Helps clear mental fog so intuition can come through with order and precision.",
  },
  {
    name: "Lapis Lazuli",
    description:
      "Truth, vision, psychic awareness, and higher wisdom.",
    energy:
      "Encourages insight, spiritual depth, and the courage to honor inner truth.",
  },
  {
    name: "Purpurite",
    description:
      "Spiritual freedom, intuition, and strengthened inner voice.",
    energy:
      "Useful for opening higher awareness while strengthening confidence in your own knowing.",
  },
  {
    name: "Labradorite",
    description:
      "Mysticism, protection, awakening, and intuitive expansion.",
    energy:
      "A protective stone for awakening hidden sight and deepening mystical sensitivity.",
  },
  {
    name: "Purple Opal",
    description:
      "Dream energy, emotional insight, and gentle spiritual connection.",
    energy:
      "Carries soft visionary energy that supports subtle guidance and emotional wisdom.",
  },
  {
    name: "Sugilite",
    description:
      "Divine love, intuition, protection, and soul-centered guidance.",
    energy:
      "Supports spiritual protection while keeping the intuitive path rooted in compassion.",
  },
  {
    name: "Dianite",
    description:
      "Inner vision, calm intuition, and deep energetic flow.",
    energy:
      "Encourages quiet receiving, inner stillness, and a smoother connection to insight.",
  },
  {
    name: "Sodalite",
    description:
      "Wisdom, logic balanced with intuition, and truth-speaking energy.",
    energy:
      "Excellent for blending rational thought with intuitive truth and clear expression.",
  },
  {
    name: "Moonstone",
    description:
      "Feminine intuition, cycles, mystery, and emotional sensitivity.",
    energy:
      "Deepens receptivity, emotional awareness, and connection to natural inner rhythms.",
  },
  {
    name: "Amethyst",
    description:
      "Spiritual protection, peace, psychic awareness, and clarity.",
    energy:
      "A classic intuitive stone for peaceful focus, spiritual shielding, and clear perception.",
  },
  {
    name: "Rainbow Fluorite",
    description:
      "Balanced intuition, focus, energetic cleansing, and multidimensional clarity.",
    energy:
      "Brings layered clarity, helping intuition feel organized, balanced, and spiritually clean.",
  },
  {
    name: "Iolite",
    description:
      "Vision, inner guidance, spiritual navigation, and awakening intuitive perception.",
    energy:
      "Often associated with inner direction, helping you sense the path before it fully appears.",
  },
  {
    name: "Kammererite",
    description:
      "Deep psychic awareness, spiritual insight, and heightened intuitive sensitivity.",
    energy:
      "Supports a stronger connection to subtle impressions and elevated spiritual awareness.",
  },
  {
    name: "Azurite",
    description:
      "Third-eye activation, spiritual vision, truth, and expanded consciousness.",
    energy:
      "Known for intense visionary energy that supports profound insight and psychic depth.",
  },
  {
    name: "Angel Aura Quartz",
    description:
      "Celestial connection, spiritual upliftment, intuitive clarity, and higher guidance.",
    energy:
      "Carries an ethereal vibration that can feel soothing, luminous, and spiritually opening.",
  },
  {
    name: "Apatite",
    description:
      "Mental clarity, intuitive development, manifestation, and insight.",
    energy:
      "Useful for sharpening perception while keeping intuitive goals mentally focused.",
  },
  {
    name: "Kunzite",
    description:
      "Heart intuition, emotional clarity, compassion, and spiritual connection.",
    energy:
      "Encourages intuitive feeling through the heart, especially in matters of love and healing.",
  },
  {
    name: "Trolleite",
    description:
      "Higher consciousness, calm intuition, deep meditation, and spiritual wisdom.",
    energy:
      "Supports deep meditative states and access to quieter, higher guidance.",
  },
  {
    name: "Grape Agate",
    description:
      "Dream insight, intuitive awareness, spiritual calm, and meditative energy.",
    energy:
      "A gentle stone for dreamwork, calm reflection, and subtle intuitive unfolding.",
  },
  {
    name: "Rutile Quartz",
    description:
      "Amplified intuition, energetic clarity, spiritual illumination, and insight.",
    energy:
      "Amplifies energy and helps illuminate inner messages that may otherwise stay hidden.",
  },
  {
    name: "Blue Opal",
    description:
      "Emotional insight, calm perception, intuitive communication, and inner peace.",
    energy:
      "Helpful for softer emotional awareness and intuitive expression without overwhelm.",
  },
  {
    name: "Apophyllite",
    description:
      "Spiritual awakening, clarity of thought, intuition, and connection to higher realms.",
    energy:
      "Supports elevated awareness, spiritual openness, and a clearer channel for insight.",
  },
  {
    name: "Dumortierite",
    description:
      "Mental discipline, psychic perception, intuitive order, and focused insight.",
    energy:
      "Strengthens disciplined intuition, especially when clarity and structure are needed.",
  },
];

export default function IntuitionPage() {
  const [openStone, setOpenStone] = useState(null);

  const handleToggle = (stoneName) => {
    setOpenStone((prev) => (prev === stoneName ? null : stoneName));
  };

  return (
    <div className="protect-home-page">
      {floatingSymbols.map((item) => (
        <span
          key={item.id}
          className="house-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div className="protect-home-content">
        <div className="protect-home-hero">
          <span className="home-symbol-main">🔮</span>
          <h1 className="protect-home-title">Intuition</h1>
          <p className="protect-home-subtitle">
            A spiritually attuned crystal collection chosen to deepen inner
            knowing, sharpen discernment, and strengthen intuitive vision.
          </p>
        </div>

        <section className="protect-home-info-card">
          <h2>Collection Energy</h2>
          <div className="protect-home-info-grid">
            <div>
              <div className="label">Purpose</div>
              <div className="value">
                Intuition, clarity, spiritual perception
              </div>
            </div>

            <div>
              <div className="label">Focus</div>
              <div className="value">Psychic awareness and inner knowing</div>
            </div>

            <div>
              <div className="label">Atmosphere</div>
              <div className="value">Mystical, clear, receptive</div>
            </div>

            <div>
              <div className="label">Portal Theme</div>
              <div className="value">Vision, instinct, discernment</div>
            </div>
          </div>
        </section>

        <section className="protect-home-stones-section">
          <h2>Intuition Crystals</h2>
          <div className="protect-home-stones-grid">
            {intuitionStones.map((stone) => {
              const isOpen = openStone === stone.name;

              return (
                <button
                  key={stone.name}
                  type="button"
                  className={`stone-card ${isOpen ? "open" : ""}`}
                  onClick={() => handleToggle(stone.name)}
                >
                  <div className="stone-card-top">
                    <h3>{stone.name}</h3>
                    <span className="stone-toggle">{isOpen ? "−" : "+"}</span>
                  </div>

                  <p>{stone.description}</p>

                  {isOpen && (
                    <div className="stone-expanded">
                      <div className="stone-expanded-label">Extended Energy</div>
                      <div className="stone-expanded-text">{stone.energy}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="protect-home-closing">
          <p>
            Intuition is the whisper before the answer, the pull before the
            path, and the knowing before proof. This portal supports spiritual
            sight, discernment, emotional intelligence, and trusting what your
            soul already understands.
          </p>
        </section>
      </div>
    </div>
  );
}