import React from "react";
import { Link } from "react-router-dom";

/*
  SPOTLIGHT PROFILES (MANUAL CONTROL)
  Add new people here when needed
*/
const spotlightProfiles = [
  {
    slug: "franchesca",
    name: "Franchesca Analisa",
    alias: "Sapphire",
    role:
      "Owner of The Aset Studio • Aspiring Actress • Virtual Photographer • Host • Writer",
    status: "Aset Spotlight Feature",
    image: "/images/aset-person.png",
    bio: "Franchesca Analisa / Sapphire is a visual storyteller known for building cinematic worlds rooted in sensuality, luxury, and bold expression. As the owner of The Aset Studio, she creates controlled environments where image, identity, and storytelling move as one. Her creative work includes writing Brick by Brick: The Series, co-hosting Mixtape Love in da Trap in 2017, and hosting the Let Go Live Rap Showcase in 2017. With a distinct visual identity and a focus on narrative-driven work, she is positioning herself for a breakout into acting. 2026 marks the transition.",
    focus: [
      "Visual Storytelling",
      "Acting",
      "Hosting",
      "Creative Direction",
      "Aset Studio",
    ],
  },
  {
    slug: "coming-soon",
    name: "Next Feature",
    alias: "",
    role: "Entertainment • Media • Culture",
    status: "Coming Soon",
    image: "/images/aset-hero.png",
    bio: "",
    focus: [],
  },
];

/*
  SPOTLIGHT GALLERY (SEPARATE FROM MAIN GALLERY)
*/
const galleryFrames = [
  {
    title: "Sapphire Frame",
    image: "/images/aset-person.png",
    alt: "Franchesca Analisa cinematic portrait",
  },
  {
    title: "Visual Study",
    image: "/images/aset-hero.png",
    alt: "Aset Studio visual study",
  },
  {
    title: "World Build",
    image: "/images/aset-person.png",
    alt: "Sapphire world building portrait",
  },
];

export default function AsetSpotlightPage() {
  const featuredProfile = spotlightProfiles[0];
  const nextProfile = spotlightProfiles[1];

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.inner}>
          <div style={styles.eyebrow}>THE ASET STUDIO PRESENTS</div>

          <h1 style={styles.title}>Aset Spotlight</h1>

          <p style={styles.subtitle}>
            A curated spotlight of notable figures across entertainment, media,
            and culture — presented within The Aset Studio.
          </p>
        </div>
      </section>

      {/* FEATURED PROFILE */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.grid}>
            {/* IMAGE */}
            <Link
              to={`/aset-spotlight/${featuredProfile.slug}`}
              style={styles.noLink}
            >
              <div style={styles.imageWrap}>
                <img
                  src={featuredProfile.image}
                  alt={`${featuredProfile.name} portrait`}
                  style={styles.image}
                />
              </div>
            </Link>

            {/* CONTENT */}
            <div>
              <div style={styles.status}>{featuredProfile.status}</div>

              <Link
                to={`/aset-spotlight/${featuredProfile.slug}`}
                style={styles.noLink}
              >
                <h2 style={styles.name}>
                  {featuredProfile.name}
                  <br />
                  <span style={styles.alias}>
                    {featuredProfile.alias}
                  </span>
                </h2>
              </Link>

              <div style={styles.role}>{featuredProfile.role}</div>

              <p style={styles.bio}>{featuredProfile.bio}</p>

              <div style={styles.tags}>
                {featuredProfile.focus.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/aset-spotlight/${featuredProfile.slug}`}
                style={styles.button}
              >
                Enter Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT FEATURE */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.sectionLabel}>NEXT FEATURE</div>

          <Link
            to={`/aset-spotlight/${nextProfile.slug}`}
            style={styles.noLink}
          >
            <div style={styles.nextCard}>
              <img
                src={nextProfile.image}
                alt="Next spotlight feature preview"
                style={styles.nextImage}
              />

              <div style={styles.nextOverlay}>
                <div style={styles.nextTitle}>{nextProfile.name}</div>
                <div style={styles.nextStatus}>{nextProfile.status}</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* SPOTLIGHT GALLERY */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.sectionLabel}>SPOTLIGHT GALLERY</div>

          <h2 style={styles.sectionTitle}>
            A curated visual world in motion.
          </h2>

          <div style={styles.gallery}>
            {galleryFrames.map((item) => (
              <div key={item.title} style={styles.card}>
                <img
                  src={item.image}
                  alt={item.alt}
                  style={styles.cardImage}
                />
                <div style={styles.overlay}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    background: "#050507",
    color: "#f2f0ea",
  },

  hero: {
    padding: "200px 20px 80px",
    textAlign: "center",
  },

  inner: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.3em",
    color: "gold",
    marginBottom: 16,
  },

  title: {
    fontFamily: "Georgia",
    fontSize: "clamp(60px, 8vw, 110px)",
  },

  subtitle: {
    marginTop: 12,
    opacity: 0.7,
  },

  section: {
    padding: "60px 20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "400px 1fr",
    gap: 40,
  },

  imageWrap: {
    height: 500,
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
  },

  status: {
    color: "gold",
    fontSize: 12,
    marginBottom: 10,
  },

  name: {
    fontSize: 48,
    marginBottom: 6,
  },

  alias: {
    fontSize: 18,
    opacity: 0.6,
    letterSpacing: "0.1em",
  },

  role: {
    color: "gold",
    marginBottom: 16,
  },

  bio: {
    lineHeight: 1.8,
    marginBottom: 20,
  },

  tags: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  tag: {
    border: "1px solid gold",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 12,
  },

  button: {
    display: "inline-block",
    padding: "12px 20px",
    background: "gold",
    color: "#000",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: "bold",
  },

  sectionLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 10,
  },

  nextCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },

  nextImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  nextOverlay: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    background: "linear-gradient(to top, black, transparent)",
    width: "100%",
  },

  nextTitle: {
    fontSize: 20,
  },

  nextStatus: {
    fontSize: 12,
    color: "gold",
  },

  sectionTitle: {
    fontSize: 32,
    marginBottom: 20,
  },

  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },

  card: {
    height: 320,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    padding: 15,
    background: "linear-gradient(to top, black, transparent)",
    width: "100%",
  },

  noLink: {
    textDecoration: "none",
    color: "inherit",
  },
};