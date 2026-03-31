import React from "react";

export default function MoonSignPage() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <p style={styles.eyebrow}>SIRENS REALM ALCHEMY</p>

          <h1 style={styles.title}>What Is a Moon Sign?</h1>

          <p style={styles.intro}>
            Your moon sign represents your emotional world — the part of you
            that feels, reacts, nurtures, remembers, and seeks comfort. While
            your sun sign reflects your core identity and outward essence, your
            moon sign reveals what is happening underneath the surface.
          </p>

          <section style={styles.section}>
            <h2 style={styles.heading}>The Deeper Self</h2>
            <p style={styles.text}>
              In astrology, the moon is connected to your inner life. It speaks
              to your instincts, your private emotions, your subconscious
              patterns, and the ways you process love, safety, vulnerability,
              and change.
            </p>
            <p style={styles.text}>
              Your moon sign can show how you respond when you are hurt, what
              makes you feel secure, and what kind of emotional environment
              helps you thrive.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Why It Matters</h2>
            <p style={styles.text}>
              Many people know their sun sign, but the moon sign often feels
              even more personal. It can explain emotional habits that others do
              not always see right away. It is the hidden tide beneath your
              personality.
            </p>
            <p style={styles.text}>
              Understanding your moon sign can help you better understand your
              needs, your relationships, your healing process, and the way your
              spirit seeks comfort and restoration.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>How Your Moon Sign Is Found</h2>
            <p style={styles.text}>
              Your moon sign is determined by the exact zodiac sign the moon was
              in at the moment of your birth. Because the moon changes signs
              more quickly than most planets, your accurate birth date and
              birth time are especially important.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Moon Sign vs. Sun Sign</h2>
            <div style={styles.cardRow}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Sun Sign</h3>
                <p style={styles.cardText}>
                  Your outer identity, life force, purpose, and the energy you
                  naturally radiate.
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Moon Sign</h3>
                <p style={styles.cardText}>
                  Your inner emotions, intuitive responses, comfort needs, and
                  the way your soul processes feeling.
                </p>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>A Simple Way to Think About It</h2>
            <p style={styles.text}>
              If your sun sign is the light people notice first, your moon sign
              is the sacred water underneath — the emotional current shaping how
              you love, grieve, trust, protect yourself, and return to
              yourself.
            </p>
          </section>

          <div style={styles.footerBox}>
            <p style={styles.footerText}>
              In Sirens Realm Alchemy, the moon sign is a doorway into emotional
              truth, softness, mystery, and self-understanding.
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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