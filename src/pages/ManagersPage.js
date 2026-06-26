import React from "react";

export default function ManagersPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.kicker}>The Aset Studio Presents</p>
          <h1 style={styles.title}>Managers Door</h1>
          <p style={styles.subtitle}>
            Honoring and showcasing the entertainment managers, executives, and
            industry professionals whose leadership helps shape creative careers.
          </p>

          <div style={styles.heroButtons}>
            <a href="#purpose" style={styles.primaryButton}>
              Enter the Door
            </a>
            <a href="#concierge" style={styles.secondaryButton}>
              Managers Concierge
            </a>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <p style={styles.panelKicker}>Invitation Only</p>
          <h2 style={styles.panelTitle}>Honored. Showcased. Remembered.</h2>
          <p style={styles.panelText}>
            Managers Door is built for the professionals behind the careers,
            the people who guide talent, protect vision, create opportunity,
            and help shape the entertainment industry from behind the scenes.
          </p>
        </div>
      </section>

      <section id="purpose" style={styles.section}>
        <p style={styles.kicker}>Our Purpose</p>
        <h2 style={styles.sectionTitle}>A New Kind of Executive Feature</h2>
        <p style={styles.text}>
          Managers Door is not a directory. It is an editorial recognition
          experience created by The Aset Studio to honor and showcase managers
          whose work, leadership, and relationships help move entertainment
          forward.
        </p>
        <p style={styles.text}>
          Each profile is professionally developed through Managers Concierge,
          combining biography, career highlights, represented talent, interviews,
          virtual photoshoots, media, testimonials, contact preferences, and an
          elevated digital presentation.
        </p>
      </section>

      <section style={styles.trio}>
        <article style={styles.card}>
          <p style={styles.cardNumber}>01</p>
          <h3 style={styles.cardTitle}>Honored</h3>
          <p style={styles.cardText}>
            We recognize the professionals whose dedication and leadership often
            happen behind the spotlight.
          </p>
        </article>

        <article style={styles.card}>
          <p style={styles.cardNumber}>02</p>
          <h3 style={styles.cardTitle}>Showcased</h3>
          <p style={styles.cardText}>
            Every profile is designed as a premium executive feature, not a
            basic listing.
          </p>
        </article>

        <article style={styles.card}>
          <p style={styles.cardNumber}>03</p>
          <h3 style={styles.cardTitle}>Presented</h3>
          <p style={styles.cardText}>
            Through interviews, visual storytelling, and digital presentation,
            Aset Studio gives each story a polished home.
          </p>
        </article>
      </section>

      <section style={styles.featureSection}>
        <div>
          <p style={styles.kicker}>Featured Manager Experience</p>
          <h2 style={styles.sectionTitle}>What a Manager Profile Includes</h2>
        </div>

        <div style={styles.featureGrid}>
          {[
            "Executive biography",
            "Aset Statement",
            "Career highlights",
            "Current projects",
            "Represented talent",
            "Professional services",
            "Feature interview",
            "Virtual photoshoot",
            "Media & press",
            "Testimonials",
            "Aset Studio Honors",
            "Preferred contact method",
          ].map((item) => (
            <div key={item} style={styles.featurePill}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.sample}>
        <div style={styles.sampleImageBox}>
          <div style={styles.sampleGlow} />
          <p style={styles.sampleInitials}>MD</p>
        </div>

        <div style={styles.sampleCopy}>
          <p style={styles.kicker}>Inaugural Features</p>
          <h2 style={styles.sectionTitle}>The First Class Is Being Built</h2>
          <p style={styles.text}>
            The Aset Studio is preparing its first Managers Door features for
            selected entertainment managers and executives whose work deserves
            to be honored and showcased with care.
          </p>
          <p style={styles.text}>
            Each invitation is personal. Each feature is intentional. Each
            profile is built to reflect the professional legacy behind the name.
          </p>
        </div>
      </section>

      <section id="concierge" style={styles.concierge}>
        <p style={styles.kicker}>Managers Concierge</p>
        <h2 style={styles.sectionTitle}>Built for Busy Industry Professionals</h2>
        <p style={styles.text}>
          Managers do not need another dashboard. The Aset Studio handles the
          creative presentation for them, making it easier to share their work,
          leadership, accomplishments, and professional contact preferences in
          one elevated space.
        </p>

        <div style={styles.conciergeBox}>
          <h3 style={styles.boxTitle}>The Aset Studio handles:</h3>
          <div style={styles.boxGrid}>
            <span>Profile creation</span>
            <span>Editorial writing</span>
            <span>Interview placement</span>
            <span>Media organization</span>
            <span>Virtual photoshoot presentation</span>
            <span>Profile updates</span>
          </div>
        </div>
      </section>

      <section style={styles.closing}>
        <p style={styles.kicker}>The Standard</p>
        <h2 style={styles.closingTitle}>
          The Aset Studio honors excellence and showcases the people who help
          shape entertainment.
        </h2>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "110px 6vw 80px",
    background:
      "radial-gradient(circle at top left, rgba(215,180,108,0.2), transparent 30%), radial-gradient(circle at bottom right, rgba(120,70,22,0.18), transparent 34%), #000",
    color: "#f5efe5",
  },
  hero: {
    minHeight: "72vh",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(320px, 0.7fr)",
    gap: "34px",
    alignItems: "center",
  },
  heroContent: {
    maxWidth: "900px",
  },
  kicker: {
    color: "#d7b46c",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: 900,
    margin: "0 0 14px",
  },
  title: {
    fontSize: "clamp(58px, 10vw, 132px)",
    lineHeight: 0.88,
    margin: "0 0 24px",
    letterSpacing: "-0.06em",
  },
  subtitle: {
    maxWidth: "800px",
    color: "#d8c7ad",
    fontSize: "clamp(18px, 2vw, 25px)",
    lineHeight: 1.65,
    marginBottom: "30px",
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "14px 20px",
    background: "#d7b46c",
    color: "#000",
    textDecoration: "none",
    fontWeight: 900,
  },
  secondaryButton: {
    padding: "14px 20px",
    background: "rgba(255,255,255,0.04)",
    color: "#f5efe5",
    border: "1px solid rgba(255,255,255,0.2)",
    textDecoration: "none",
    fontWeight: 900,
  },
  heroPanel: {
    border: "1px solid rgba(215,180,108,0.28)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))",
    padding: "32px",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
  },
  panelKicker: {
    color: "#f0d28c",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "11px",
    fontWeight: 900,
    margin: "0 0 16px",
  },
  panelTitle: {
    fontSize: "34px",
    lineHeight: 1.05,
    margin: "0 0 18px",
  },
  panelText: {
    color: "#c8b89e",
    lineHeight: 1.8,
    margin: 0,
  },
  section: {
    maxWidth: "1000px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: "42px",
    margin: "30px 0 34px",
  },
  sectionTitle: {
    fontSize: "clamp(30px, 4vw, 52px)",
    lineHeight: 1,
    margin: "0 0 18px",
    letterSpacing: "-0.04em",
  },
  text: {
    color: "#b8aa96",
    lineHeight: 1.85,
    fontSize: "17px",
    margin: "0 0 16px",
    maxWidth: "980px",
  },
  trio: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    margin: "44px 0",
  },
  card: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.035)",
    padding: "26px",
    minHeight: "220px",
  },
  cardNumber: {
    color: "#d7b46c",
    fontWeight: 900,
    letterSpacing: "0.18em",
    margin: "0 0 26px",
  },
  cardTitle: {
    fontSize: "28px",
    margin: "0 0 12px",
  },
  cardText: {
    color: "#b8aa96",
    lineHeight: 1.75,
    margin: 0,
  },
  featureSection: {
    border: "1px solid rgba(215,180,108,0.22)",
    background: "rgba(0,0,0,0.38)",
    padding: "34px",
    margin: "42px 0",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
    marginTop: "24px",
  },
  featurePill: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#e9d8bc",
    padding: "14px",
    fontWeight: 800,
  },
  sample: {
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: "34px",
    alignItems: "center",
    margin: "48px 0",
  },
  sampleImageBox: {
    height: "440px",
    border: "1px solid rgba(215,180,108,0.28)",
    background:
      "linear-gradient(145deg, rgba(215,180,108,0.2), rgba(255,255,255,0.04), rgba(0,0,0,0.9))",
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  sampleGlow: {
    position: "absolute",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(215,180,108,0.18)",
    filter: "blur(45px)",
  },
  sampleInitials: {
    position: "relative",
    fontSize: "82px",
    fontWeight: 900,
    letterSpacing: "-0.08em",
    color: "#f5efe5",
  },
  sampleCopy: {
    maxWidth: "840px",
  },
  concierge: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: "44px",
    marginTop: "48px",
  },
  conciergeBox: {
    marginTop: "24px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.035)",
    padding: "26px",
  },
  boxTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
    color: "#f6dfaa",
  },
  boxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    color: "#d8c7ad",
    fontWeight: 800,
  },
  closing: {
    marginTop: "58px",
    padding: "54px 0 10px",
    borderTop: "1px solid rgba(215,180,108,0.22)",
  },
  closingTitle: {
    fontSize: "clamp(34px, 5vw, 70px)",
    lineHeight: 0.98,
    maxWidth: "1100px",
    margin: 0,
    letterSpacing: "-0.055em",
  },
};