import React from "react";
import sodaliteImage from "../assets/stones/sodalite.png";

export default function SodalitePage() {
  const positiveTraits = [
    "Intuition",
    "Rational Thinking",
    "Self Expression",
    "Truth",
    "Logic",
    "Inner Peace",
    "Self Esteem",
    "Self Acceptance",
  ];

  const supportFor = [
    "Confusion",
    "Mental Unrest",
    "Over Sensitivity",
    "Fear",
    "Communication",
  ];

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.container}>
            <p style={styles.eyebrow}>Sirens Realm • Stones and Minerals</p>

            <h1 style={styles.title}>Sodalite</h1>

            <div style={styles.imageWrap}>
              <img
                src={sodaliteImage}
                alt="Sodalite crystal"
                style={styles.image}
              />
            </div>

            <p style={styles.intro}>
              Sodalite is a stone of intuition, truth, and clear-minded calm.
              It is often associated with balancing inner knowing and rational
              thought, helping bring peace to the mind while encouraging honest
              self-expression.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.contentWrap}>
        <div style={styles.container}>
          <div style={styles.mainGrid}>
            <section style={styles.mainColumn}>
              <div style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>Overview</h2>

                <p style={styles.paragraph}>
                  Sodalite carries an energy that supports both spiritual
                  insight and mental clarity. It is often turned to when
                  emotions feel heavy, thoughts feel crowded, or the truth
                  feels difficult to speak. This stone encourages steadiness,
                  honest communication, and confidence in one’s own voice.
                </p>

                <p style={styles.paragraph}>
                  It resonates with themes of intuition, rational thinking,
                  self-expression, truth, logic, inner peace, self-esteem, and
                  self-acceptance. Sodalite is also commonly connected to
                  moments of confusion, mental unrest, over sensitivity, fear,
                  and communication struggles.
                </p>
              </div>

              <div style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>Affirmation</h2>

                <p style={styles.affirmation}>
                  I trust my inner truth, express myself clearly, and move with
                  calm, grounded wisdom.
                </p>
              </div>
            </section>

            <aside style={styles.sideColumn}>
              <div style={styles.sectionCard}>
                <h3 style={styles.sideTitle}>Associated Energies</h3>

                <div style={styles.tagWrap}>
                  {positiveTraits.map((item) => (
                    <span key={item} style={styles.tag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sideTitle}>Commonly Turned To For</h3>

                <div style={styles.tagWrap}>
                  {supportFor.map((item) => (
                    <span key={item} style={styles.tagMuted}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sideTitle}>Essence</h3>

                <p style={styles.sideText}>
                  A calming stone for truth, communication, logic, and intuitive
                  clarity.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#090b10",
    color: "#f5f1e8",
  },

  hero: {
    background:
      "linear-gradient(135deg, #0a0f18 0%, #16243a 35%, #314d75 70%, #0b0f16 100%)",
    minHeight: "420px",
  },

  heroOverlay: {
    minHeight: "420px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
    display: "flex",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },

  eyebrow: {
    fontSize: "0.88rem",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "#c0ab7f",
    marginBottom: "14px",
  },

  title: {
    fontSize: "clamp(2.8rem, 6vw, 5rem)",
    lineHeight: "1.02",
    marginBottom: "18px",
    fontWeight: "600",
  },

  imageWrap: {
    marginTop: "20px",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "center",
  },

  image: {
    width: "420px",
    maxWidth: "100%",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
  },

  intro: {
    maxWidth: "760px",
    fontSize: "1.08rem",
    lineHeight: "1.9",
    color: "#ddd6ca",
  },

  contentWrap: {
    padding: "60px 0 80px",
    background:
      "linear-gradient(180deg, #090b10 0%, #101521 50%, #0c1018 100%)",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "28px",
  },

  mainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  sectionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
  },

  sectionTitle: {
    fontSize: "1.55rem",
    marginBottom: "16px",
    color: "#f4efe5",
    fontWeight: "600",
  },

  sideTitle: {
    fontSize: "1.15rem",
    marginBottom: "16px",
    color: "#f4efe5",
    fontWeight: "600",
  },

  paragraph: {
    fontSize: "1rem",
    lineHeight: "1.9",
    color: "#ddd6ca",
    marginBottom: "16px",
  },

  affirmation: {
    fontSize: "1.1rem",
    lineHeight: "1.9",
    color: "#cfdcff",
    fontStyle: "italic",
  },

  sideText: {
    fontSize: "0.98rem",
    lineHeight: "1.8",
    color: "#ddd6ca",
  },

  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  tag: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(110, 148, 214, 0.18)",
    border: "1px solid rgba(159, 193, 255, 0.2)",
    fontSize: "0.95rem",
    color: "#e9f1ff",
  },

  tagMuted: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "0.95rem",
    color: "#f1e8db",
  },
};