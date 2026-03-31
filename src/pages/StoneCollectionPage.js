import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./StoneCollectionPage.css";

const floatingIcons = [
  { id: 1, top: "8%", left: "5%", icon: "✦" },
  { id: 2, top: "14%", right: "7%", icon: "✧" },
  { id: 3, top: "28%", left: "10%", icon: "✦" },
  { id: 4, top: "36%", right: "12%", icon: "✧" },
  { id: 5, top: "52%", left: "6%", icon: "✦" },
  { id: 6, top: "63%", right: "8%", icon: "✧" },
  { id: 7, top: "78%", left: "14%", icon: "✦" },
  { id: 8, top: "86%", right: "16%", icon: "✧" },
];

const collections = [
  {
    title: "Protecting The Home",
    icon: "🏠",
    description:
      "A grounded, protective collection chosen to cleanse the space, strengthen boundaries, and keep the home peaceful and spiritually covered.",
    path: "/sirens-realm/protecting-the-home",
    accent: "Tiny houses • Protection • Cleansing",
    category: "Protection",
  },
  {
    title: "Pisces Power Stones",
    icon: "♓",
    description:
      "Dreamy, intuitive stones aligned with Pisces energy for emotional healing, sensitivity, and spiritual flow.",
    path: "/sirens-realm/pisces",
    accent: "Pisces • Water • Intuition",
    category: "Zodiac",
  },
  {
    title: "Aquarius Power Stones",
    icon: "♒",
    description:
      "Visionary, balanced stones aligned with Aquarius energy for intuition, calm communication, originality, and spiritual clarity.",
    path: "/sirens-realm/aquarius",
    accent: "Aquarius • Air • Insight",
    category: "Zodiac",
  },
  {
    title: "Libra Power Stones",
    icon: "♎",
    description:
      "Balanced, harmonious stones aligned with Libra energy for love, communication, emotional grace, and inner equilibrium.",
    path: "/sirens-realm/libra",
    accent: "Libra • Air • Harmony",
    category: "Zodiac",
  },
  {
    title: "Intuition",
    icon: "🔮",
    description:
      "A spiritually attuned collection chosen to deepen inner knowing, sharpen discernment, and strengthen intuitive vision.",
    path: "/sirens-realm/intuition",
    accent: "Intuition • Psychic Vision • Spiritual Clarity",
    category: "Spiritual",
  },
  {
    title: "Full Moon",
    icon: "🌕",
    description:
      "A luminous collection chosen for clarity, intuition, grounding, protection, emotional balance, and full moon ritual energy.",
    path: "/sirens-realm/full-moon",
    accent: "Full Moon • Clarity • Ritual Energy",
    category: "Ritual",
  },
  {
    title: "Bedroom",
    icon: "🛏️",
    description:
      "A peaceful bedroom collection chosen for rest, emotional comfort, loving energy, and calming sleep support.",
    path: "/sirens-realm/bedroom",
    accent: "Bedroom • Rest • Peace",
    category: "Home",
  },
  {
    title: "Focus & Clarity",
    icon: "🧠",
    description:
      "A mentally clear collection chosen to support concentration, grounding, insight, discipline, and protection from distraction.",
    path: "/sirens-realm/focus",
    accent: "Focus • Clarity • Discipline",
    category: "Mind",
  },
  {
    title: "Confidence",
    icon: "👑",
    description:
      "An empowering collection chosen to strengthen self-belief, courage, personal power, emotional balance, and inner strength.",
    path: "/sirens-realm/confidence",
    accent: "Confidence • Courage • Personal Power",
    category: "Empowerment",
  },
  {
    title: "Luck",
    icon: "🍀",
    description:
      "A prosperity collection chosen to attract opportunity, fortunate outcomes, success energy, and aligned abundance.",
    path: "/sirens-realm/luck",
    accent: "Luck • Prosperity • Opportunity",
    category: "Prosperity",
  },
  {
    title: "Safe Travels",
    icon: "✈️",
    description:
      "A protective travel collection chosen to support safe journeys, grounded awareness, spiritual protection, and calm movement while traveling.",
    path: "/sirens-realm/safe-travels",
    accent: "Travel • Protection • Guidance",
    category: "Protection",
  },
  {
    title: "Motivation",
    icon: "🔥",
    description:
      "An energizing collection chosen to support drive, courage, resilience, focus, and forward movement.",
    path: "/sirens-realm/motivation",
    accent: "Motivation • Drive • Resilience",
    category: "Empowerment",
  },
  {
    title: "Creative Muse",
    icon: "🎨",
    description:
      "An inspired collection chosen to support creativity, expression, imagination, clarity, confidence, and artistic flow.",
    path: "/sirens-realm/creative-muse",
    accent: "Creativity • Expression • Artistic Flow",
    category: "Spiritual",
  },
  {
    title: "Blue",
    icon: "💙",
    description:
      "A soothing blue stone collection chosen for peace, communication, intuition, emotional healing, and spiritual clarity.",
    path: "/sirens-realm/blue",
    accent: "Blue Energy • Peace • Communication",
    category: "Spiritual",
  },
  {
    title: "Veterans",
    icon: "🛡️",
    description:
      "A supportive collection chosen for grounding, protection, emotional healing, peace, courage, and resilience.",
    path: "/sirens-realm/veterans",
    accent: "Healing • Protection • Resilience",
    category: "Spiritual",
  },
  {
    title: "Love",
    icon: "💗",
    description:
      "A heart-centered collection chosen for tenderness, emotional healing, compassion, passion, and loving connection.",
    path: "/sirens-realm/love",
    accent: "Love • Healing • Connection",
    category: "Spiritual",
  },
];

const filters = [
  "All",
  "Zodiac",
  "Spiritual",
  "Protection",
  "Ritual",
  "Home",
  "Mind",
  "Empowerment",
  "Prosperity",
];

export default function StoneCollectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCollections = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return collections.filter((collection) => {
      const matchesFilter =
        activeFilter === "All" || collection.category === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        collection.title.toLowerCase().includes(normalizedSearch) ||
        collection.description.toLowerCase().includes(normalizedSearch) ||
        collection.accent.toLowerCase().includes(normalizedSearch) ||
        collection.category.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="stone-collections-page">
      {floatingIcons.map((item) => (
        <span
          key={item.id}
          className="stone-collections-float"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
        >
          {item.icon}
        </span>
      ))}

      <div className="stone-collections-content">
        <Link to="/sirens-realm" className="stone-back-link">
          ← Back to Sirens Realm
        </Link>

        <header className="stone-collections-hero">
          <span className="stone-collections-symbol">✦</span>
          <h1 className="stone-collections-title">Stone Collections</h1>
          <p className="stone-collections-subtitle">
            Curated crystal collections created for specific energies, needs,
            moods, and sacred spaces.
          </p>
        </header>

        <section className="stone-collections-toolbar">
          <div className="stone-search-wrap">
            <input
              type="text"
              className="stone-search-input"
              placeholder="Search collections, energy, or theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="stone-filter-row">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`stone-filter-chip ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="stone-results-count">
            {filteredCollections.length} collection
            {filteredCollections.length === 1 ? "" : "s"} found
          </div>
        </section>

        <section className="stone-collections-grid">
          {filteredCollections.map((collection) => (
            <Link
              to={collection.path}
              className="stone-collection-card"
              key={collection.title}
            >
              <div className="stone-collection-card-icon">{collection.icon}</div>
              <h2>{collection.title}</h2>
              <p>{collection.description}</p>
              <span className="stone-collection-accent">
                {collection.accent}
              </span>
              <span className="stone-collection-category">
                {collection.category}
              </span>
            </Link>
          ))}
        </section>

        {filteredCollections.length === 0 && (
          <div className="stone-empty-state">
            <div className="stone-empty-symbol">✧</div>
            <h3>No collections found</h3>
            <p>Try a different search word or choose another energy filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}