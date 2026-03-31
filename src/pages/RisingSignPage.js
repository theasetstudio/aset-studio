import React from "react";

export default function RisingSignPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <p style={styles.eyebrow}>SIRENS REALM ALCHEMY</p>

          <h1 style={styles.title}>What Is a Rising Sign?</h1>

          <p style={styles.intro}>
            Your rising sign, also called your ascendant, is the zodiac sign
            that was rising on the eastern horizon at the exact moment of your
            birth. In astrology, it represents the energy you naturally project
            into the world and the way others first experience you.
          </p>

          <section style={styles.section}>
            <h2 style={styles.heading}>Your Outer Presence</h2>
            <p style={styles.text}>
              While your sun sign speaks to your core identity and your moon
              sign reveals your emotional inner world, your rising sign shapes
              your outer presentation. It influences first impressions, your
              personal style, the energy you carry, and the way you move
              through new environments.
            </p>
            <p style={styles.text}>
              It is the face you meet the world with — the first veil, the
              doorway, the introduction to your energy before anyone reaches
              the deeper layers underneath.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Why It Matters</h2>
            <p style={styles.text}>
              Your rising sign plays a powerful role in how your full birth
              chart is structured. It sets the starting point for the houses in
              your natal chart, which means it helps shape how different parts
              of your life are expressed.
            </p>
            <p style={styles.text}>
              This is why two people with the same sun sign can feel completely
              different. Their rising signs may change the tone, rhythm, and
              outer expression of their entire chart.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>The Mask and the Gateway</h2>
            <p style={styles.text}>
              Some astrologers describe the rising sign as the “mask” you wear,
              but it is more than that. It is not something false. It is the
              energetic gateway through which your spirit enters the world. It
              shapes how you begin things, how you approach people, and how
              your identity is first perceived.
            </p>
            <p style={styles.text}>
              Over time, many people grow more deeply into their rising sign,
              especially as they become more conscious of how they move through
              life and embody their power.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Why Birth Time Matters</h2>
            <p style={styles.text}>
              Your rising sign changes more quickly than your sun sign and is
              highly dependent on your exact birth time and location. Even a
              difference of a couple of hours can completely change the rising
              sign, which is why an accurate birth time matters so much when
              calculating a natal chart.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Sun, Moon, and Rising</h2>
            <div style={styles.cardRow}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Sun Sign</h3>
                <p style={styles.cardText}>
                  Your core self, life force, identity, and natural essence.
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Moon Sign</h3>
                <p style={styles.cardText}>
                  Your emotional world, instincts, needs, and inner responses.
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Rising Sign</h3>
                <p style={styles.cardText}>
                  Your outer presence, first impression, physical expression,
                  and the energy that introduces you to the world.
                </p>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>A Simple Way to Think About It</h2>
            <p style={styles.text}>
              If your sun sign is your essence and your moon sign is your inner
              tide, your rising sign is the horizon line — the place where your
              energy first appears and becomes visible to the world.
            </p>
          </section>

          <div style={styles.footerBox}>
            <p style={styles.footerText}>
              In Sirens Realm Alchemy, the rising sign is the first whisper of
              your presence — the aura that enters the room before your deeper
              story is even spoken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #050510 0%, #0b1020 45%, #11162a 100%)",
    color: "#f5f1ea",
    fontFamily: "'Georgia', serif",
  },
  overlay: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(127, 90, 240, 0.18), transparent 30%)",
    padding: "60px 20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  eyebrow: {
    letterSpacing: "4px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#cbb6ff",
    marginBottom: "14px",
  },
  title: {
    fontSize: "48px",
    marginBottom: "20px",
    lineHeight: 1.1,
  },
  intro: {
    fontSize: "20px",
    lineHeight: 1.8,
    color: "#e8ddff",
    marginBottom: "40px",
  },
  section: {
    marginBottom: "36px",
    padding: "28px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    backdropFilter: "blur(8px)",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "14px",
    color: "#ffffff",
  },
  text: {
    fontSize: "17px",
    lineHeight: 1.8,
    color: "#f1ebff",
    marginBottom: "14px",
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  cardTitle: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#d9c7ff",
  },
  cardText: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#f5f1ea",
  },
  footerBox: {
    marginTop: "28px",
    padding: "24px",
    borderRadius: "18px",
    background: "rgba(203, 182, 255, 0.08)",
    border: "1px solid rgba(203, 182, 255, 0.15)",
  },
  footerText: {
    fontSize: "18px",
    lineHeight: 1.8,
    color: "#f3eaff",
    margin: 0,
  },
};