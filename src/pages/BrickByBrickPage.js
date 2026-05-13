import React from "react";
import { Link } from "react-router-dom";

export default function BrickByBrickPage() {
  const themes = [
    "Power",
    "Inheritance",
    "Loyalty",
    "Control",
    "Legacy",
    "Betrayal",
  ];

  const chapters = [
    {
      title: "The Empire",
      text:
        "An institution built over decades begins to fracture beneath the pressure of loyalty, succession, and hidden ambition.",
    },
    {
      title: "The Family",
      text:
        "Behind wealth and polished public image exists a private world governed by silence, obligation, and bloodline politics.",
    },
    {
      title: "The Counsel",
      text:
        "Advisors, strategists, and protectors move carefully around power while deciding who deserves proximity to the throne.",
    },
    {
      title: "The Crown",
      text:
        "Leadership inside the empire is never inherited peacefully. Every seat of authority comes with a cost.",
    },
  ];

  const systems = [
    {
      label: "STUDIO ARCHIVE",
      title: "Originals Pipeline",
      text:
        "Internal media systems for posters, cinematic stills, visual campaigns, teaser assets, and future release materials are currently being structured inside the studio environment.",
    },
    {
      label: "PRODUCTION SYSTEM",
      title: "Release Control",
      text:
        "The Brick by Brick rollout is designed as a controlled cinematic release structure rather than an open-content ecosystem.",
    },
    {
      label: "DEVELOPMENT STATUS",
      title: "Private Build Phase",
      text:
        "Additional systems, world assets, visual language, and production materials remain in active internal development.",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>THE ASET STUDIO ORIGINALS</p>

        <h1 style={styles.title}>Brick by Brick</h1>

        <p style={styles.subtitle}>
          A cinematic prestige drama centered around power, family legacy,
          ambition, control, loyalty, wealth, and the quiet collapse hidden
          beneath polished public empires.
        </p>

        <div style={styles.actions}>
          <Link to="/" style={styles.goldButton}>
            Return to Studio
          </Link>

          <Link to="/videos" style={styles.lightButton}>
            Enter Aset Cinema
          </Link>
        </div>
      </section>

      <section style={styles.introSection}>
        <div style={styles.copyBlock}>
          <p style={styles.kicker}>SERIES WORLD</p>

          <h2 style={styles.sectionTitle}>
            An empire constructed behind closed doors.
          </h2>

          <p style={styles.bodyText}>
            Brick by Brick explores the architecture of influence inside a
            powerful family institution where loyalty is currency, public image
            is carefully controlled, and every decision quietly reshapes the
            future of the empire.
          </p>

          <p style={styles.bodyText}>
            The series blends cinematic drama, luxury atmosphere, family power
            dynamics, and psychological tension inside a world where control is
            rarely surrendered willingly.
          </p>
        </div>

        <div style={styles.statementCard}>
          <p style={styles.cardKicker}>CURRENT STATUS</p>

          <h3 style={styles.cardTitle}>Original Series In Development</h3>

          <p style={styles.cardText}>
            Story structure, cinematic presentation, visual language, and world
            expansion are currently being developed inside The Aset Studio.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.kicker}>CORE THEMES</p>

          <h2 style={styles.sectionTitle}>
            The foundation beneath the story.
          </h2>
        </div>

        <div style={styles.themeGrid}>
          {themes.map((theme) => (
            <div key={theme} style={styles.themeCard}>
              {theme}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.kicker}>WORLD STRUCTURE</p>

          <h2 style={styles.sectionTitle}>
            Inside the architecture of the empire.
          </h2>
        </div>

        <div style={styles.grid}>
          {chapters.map((chapter) => (
            <article key={chapter.title} style={styles.tile}>
              <p style={styles.cardKicker}>SERIES ELEMENT</p>

              <h3 style={styles.cardTitle}>{chapter.title}</h3>

              <p style={styles.cardText}>{chapter.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.kicker}>INTERNAL STUDIO SYSTEMS</p>

          <h2 style={styles.sectionTitle}>
            Development infrastructure inside The Aset Studio.
          </h2>
        </div>

        <div style={styles.grid}>
          {systems.map((system) => (
            <article key={system.title} style={styles.tile}>
              <p style={styles.cardKicker}>{system.label}</p>

              <h3 style={styles.cardTitle}>{system.title}</h3>

              <p style={styles.cardText}>{system.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.finalSection}>
        <div style={styles.finalPanel}>
          <p style={styles.kicker}>ASET STUDIO ORIGINAL IP</p>

          <h2 style={styles.sectionTitle}>
            Character dossiers remain sealed.
          </h2>

          <p style={styles.bodyText}>
            Additional story layers, visual campaigns, cinematic materials,
            interviews, and official releases will emerge as the world of Brick
            by Brick continues to evolve inside The Aset Studio ecosystem.
          </p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(198,136,55,0.18), transparent 36%), linear-gradient(180deg, #050505 0%, #090806 48%, #050505 100%)",
    color: "#f5f1eb",
    padding: "118px 22px 90px",
  },

  hero: {
    maxWidth: 1120,
    margin: "0 auto 70px",
    padding: "62px 34px",
    borderRadius: 34,
    border: "1px solid rgba(245,241,235,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.018))",
    boxShadow:
      "0 60px 160px rgba(0,0,0,0.75), 0 0 60px rgba(198,136,55,0.08)",
  },

  kicker: {
    margin: "0 0 12px",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  title: {
    margin: "0 0 18px",
    fontSize: "clamp(52px, 8vw, 110px)",
    lineHeight: 0.86,
    letterSpacing: "-0.075em",
    fontWeight: 950,
  },

  subtitle: {
    maxWidth: 780,
    margin: "0 0 30px",
    fontSize: 17,
    lineHeight: 1.75,
    color: "rgba(245,241,235,0.76)",
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  goldButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #c58d36, #f1d08a)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
  },

  lightButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    borderRadius: 999,
    background: "#f5f1eb",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
  },

  introSection: {
    maxWidth: 1120,
    margin: "0 auto 58px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)",
    gap: 22,
  },

  copyBlock: {
    borderRadius: 26,
    padding: 34,
    border: "1px solid rgba(245,241,235,0.09)",
    background: "rgba(255,255,255,0.028)",
  },

  statementCard: {
    borderRadius: 26,
    padding: 30,
    border: "1px solid rgba(198,136,55,0.18)",
    background:
      "linear-gradient(160deg, rgba(198,136,55,0.18), rgba(255,255,255,0.025))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: 260,
  },

  section: {
    maxWidth: 1120,
    margin: "0 auto 58px",
  },

  finalSection: {
    maxWidth: 1120,
    margin: "0 auto",
  },

  finalPanel: {
    borderRadius: 30,
    padding: 42,
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
    boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
  },

  sectionHeader: {
    marginBottom: 22,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(30px, 4vw, 54px)",
    lineHeight: 0.96,
    letterSpacing: "-0.052em",
    fontWeight: 900,
  },

  bodyText: {
    maxWidth: 760,
    margin: "0 0 18px",
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.72)",
  },

  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
  },

  themeCard: {
    padding: "28px 18px",
    borderRadius: 20,
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.014))",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  tile: {
    minHeight: 220,
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.014))",
    boxShadow: "0 26px 80px rgba(0,0,0,0.34)",
  },

  cardKicker: {
    margin: "0 0 10px",
    fontSize: 10,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "#c58d36",
  },

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 26,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  cardText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(245,241,235,0.66)",
  },
};