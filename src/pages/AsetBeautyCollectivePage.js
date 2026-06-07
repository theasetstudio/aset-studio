import React from "react";
import { Link } from "react-router-dom";

export default function AsetBeautyCollectivePage() {
  const categories = [
    {
      title: "Makeup Artists",
      description:
        "Discover verified makeup professionals shaping beauty, presentation, and transformation across entertainment, media, and creative productions.",
      button: "View Makeup Artists",
      path: "/collectives/beauty/makeup-artists",
    },
    {
      title: "Hairstylists",
      description:
        "Explore verified hairstylists specializing in beauty, editorial, production, and image-focused work.",
      button: "View Hairstylists",
      path: "/collectives/beauty/hairstylists",
    },
    {
      title: "Wig Artists",
      description:
        "Discover wig artists creating polished, character-driven, and production-ready looks for talent and creative projects.",
      button: "View Wig Artists",
      path: "/collectives/beauty/wig-artists",
    },
    {
      title: "Grooming Artists",
      description:
        "Explore grooming professionals supporting talent presentation, media appearances, and production-ready looks.",
      button: "View Grooming Artists",
      path: "/collectives/beauty/grooming-artists",
    },
    {
      title: "Nail Artists",
      description:
        "Discover nail artists contributing detail, polish, and visual character to beauty, editorial, and entertainment work.",
      button: "View Nail Artists",
      path: "/collectives/beauty/nail-artists",
    },
    {
      title: "SFX Makeup Artists",
      description:
        "Explore artists creating character transformations, prosthetics, fantasy effects, and cinematic visual storytelling.",
      button: "View SFX Makeup Artists",
      path: "/collectives/beauty/sfx-makeup-artists",
    },
    {
      title: "Beauty Companies & Teams",
      description:
        "Discover verified beauty companies and teams supporting entertainment, media, editorial, commercial, and creative productions around the world.",
      button: "View Companies & Teams",
      path: "/collectives/beauty/companies",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <p style={styles.breadcrumb}>
            The Aset Studio / Collectives / Aset Beauty Collective
          </p>

          <h1 style={styles.title}>Beauty, Transformation & Presentation</h1>

          <p style={styles.subtitle}>
            Discover the professionals behind the transformation. A curated
            collective of makeup artists, hairstylists, grooming specialists, wig
            artists, nail artists, and special effects professionals from around
            the world.
          </p>

          <a href="#explore-beauty" style={styles.heroButton}>
            Explore the Collective
          </a>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>ABOUT</p>

        <h2 style={styles.sectionTitle}>A global beauty directory within Aset.</h2>

        <p style={styles.sectionText}>
          Aset Beauty Collective is a curated discovery space for verified
          beauty professionals, companies, and teams. It exists to help talent,
          creatives, productions, and entertainment professionals discover the
          people behind the image, the polish, and the transformation.
        </p>

        <p style={styles.sectionText}>
          Every public listing is reviewed before appearing inside the
          Collective. Visitors can discover professionals directly, while
          subscriber profiles receive expanded presentation and portfolio
          features.
        </p>
      </section>

      <section id="explore-beauty" style={styles.section}>
        <p style={styles.sectionEyebrow}>EXPLORE</p>

        <h2 style={styles.sectionTitle}>Explore the Collective</h2>

        <div style={styles.categoryGrid}>
          {categories.map((category) => (
            <article key={category.title} style={styles.categoryCard}>
              <div style={styles.categoryImage} />

              <div style={styles.categoryBody}>
                <h3 style={styles.categoryTitle}>{category.title}</h3>

                <p style={styles.categoryText}>{category.description}</p>

                <Link to={category.path} style={styles.cardButton}>
                  {category.button}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>FEATURED</p>

        <h2 style={styles.sectionTitle}>Featured Beauty Professionals</h2>

        <p style={styles.sectionText}>
          Hand-selected beauty professionals will appear here as the Collective
          grows.
        </p>

        <div style={styles.placeholderGrid}>
          <div style={styles.placeholderCard}>Featured Professional</div>
          <div style={styles.placeholderCard}>Featured Professional</div>
          <div style={styles.placeholderCard}>Featured Professional</div>
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>COMPANIES & TEAMS</p>

        <h2 style={styles.sectionTitle}>Featured Companies & Teams</h2>

        <p style={styles.sectionText}>
          Verified beauty companies, studios, agencies, and production beauty
          teams will be featured here.
        </p>

        <div style={styles.placeholderGrid}>
          <div style={styles.placeholderCard}>Featured Company</div>
          <div style={styles.placeholderCard}>Featured Team</div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <p style={styles.sectionEyebrow}>CONSIDERATION</p>

        <h2 style={styles.sectionTitle}>Apply for Consideration</h2>

        <p style={styles.sectionText}>
          Beauty professionals, companies, and teams may submit for review.
          Hand-selected professionals may also be added directly by Aset.
        </p>

        <Link to="/collectives/beauty/apply" style={styles.ctaButton}>
          Apply for Consideration
        </Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#f6f1e8",
    fontFamily: "inherit",
  },

  hero: {
    position: "relative",
    minHeight: "82vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "130px 24px 90px",
    background:
      "linear-gradient(135deg, #050505 0%, #1a0f0b 45%, #3a2118 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(201,166,107,0.2), transparent 44%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "980px",
    textAlign: "center",
  },

  breadcrumb: {
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontSize: "0.7rem",
    color: "#c9a66b",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(3rem, 7vw, 6.8rem)",
    lineHeight: 0.95,
    margin: "0 0 26px",
    fontWeight: 500,
  },

  subtitle: {
    maxWidth: "820px",
    margin: "0 auto 36px",
    fontSize: "1.08rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.78)",
  },

  heroButton: {
    display: "inline-block",
    padding: "14px 28px",
    border: "1px solid rgba(201,166,107,0.8)",
    color: "#f6f1e8",
    textDecoration: "none",
    letterSpacing: "0.14em",
    fontSize: "0.78rem",
    textTransform: "uppercase",
  },

  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px",
  },

  sectionEyebrow: {
    letterSpacing: "0.24em",
    fontSize: "0.72rem",
    color: "#c9a66b",
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "clamp(2rem, 4vw, 4rem)",
    margin: "0 0 22px",
    fontWeight: 500,
  },

  sectionText: {
    maxWidth: "800px",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.72)",
    marginBottom: "18px",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginTop: "36px",
  },

  categoryCard: {
    border: "1px solid rgba(201,166,107,0.25)",
    background: "rgba(255,255,255,0.035)",
    overflow: "hidden",
    minHeight: "420px",
    display: "flex",
    flexDirection: "column",
  },

  categoryImage: {
    height: "190px",
    background:
      "linear-gradient(135deg, rgba(201,166,107,0.18), rgba(255,255,255,0.035)), radial-gradient(circle at top, #3a2118, #060606 72%)",
  },

  categoryBody: {
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  categoryTitle: {
    fontSize: "1.55rem",
    margin: "0 0 14px",
    fontWeight: 500,
  },

  categoryText: {
    color: "rgba(246,241,232,0.7)",
    lineHeight: 1.7,
    marginBottom: "24px",
    flex: 1,
  },

  cardButton: {
    display: "inline-block",
    color: "#f6f1e8",
    textDecoration: "none",
    borderBottom: "1px solid #c9a66b",
    paddingBottom: "6px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontSize: "0.72rem",
    alignSelf: "flex-start",
  },

  placeholderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginTop: "32px",
  },

  placeholderCard: {
    minHeight: "260px",
    border: "1px solid rgba(201,166,107,0.22)",
    background:
      "linear-gradient(135deg, rgba(201,166,107,0.12), rgba(255,255,255,0.025))",
    display: "flex",
    alignItems: "flex-end",
    padding: "24px",
    color: "rgba(246,241,232,0.72)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "0.72rem",
  },

  ctaSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px 120px",
    borderTop: "1px solid rgba(201,166,107,0.18)",
  },

  ctaButton: {
    display: "inline-block",
    marginTop: "24px",
    padding: "14px 28px",
    border: "1px solid rgba(201,166,107,0.8)",
    color: "#f6f1e8",
    textDecoration: "none",
    letterSpacing: "0.14em",
    fontSize: "0.78rem",
    textTransform: "uppercase",
  },
};