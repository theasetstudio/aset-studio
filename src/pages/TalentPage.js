// File: src/pages/TalentPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function TalentPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.eyebrow}>THE PEOPLE OF ASET</div>

        <h1 style={styles.title}>Recognized individuals within the world of Aset.</h1>

        <p style={styles.text}>
          This space is reserved for legitimate people across music, art, fashion,
          modeling, film, and related creative industries. It is curated intentionally and will feature selected individuals as this world grows.
        </p>

        {/* Featured Person Card */}
        <div style={styles.card}>
          <img
            src={`${process.env.PUBLIC_URL}/images/franchescaanalisa.png`}
            alt="Francesca Analisa"
            style={styles.cardImage}
          />
          <h2 style={styles.cardName}>Francesca Analisa</h2>
          <p style={styles.cardRole}>Actor / Model / Creative Talent</p>
          <p style={styles.cardBio}>
            Recognized in music, modeling, and cinematic work. Curated for The People of Aset.
          </p>
          <div style={styles.cardButtons}>
            <Link to="/creator/francesca-analisa" style={styles.cardButton}>
              View Profile
            </Link>
            <Link to="/creator/francesca-analisa/portfolio" style={styles.cardButton}>
              More Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050507",
    color: "#f2f0ea",
    padding: "80px 20px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  inner: {
    maxWidth: 960,
    margin: "0 auto",
    textAlign: "center",
  },
  eyebrow: {
    letterSpacing: "0.18em",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(32px, 6vw, 54px)",
    lineHeight: 1.1,
    fontWeight: 600,
    margin: "0 0 18px",
  },
  text: {
    maxWidth: 760,
    margin: "0 auto 34px",
    fontSize: 16,
    lineHeight: 1.7,
    opacity: 0.88,
  },
  card: {
    maxWidth: 360,
    margin: "40px auto",
    borderRadius: 20,
    overflow: "hidden",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(212,175,55,0.18)",
    boxShadow: "0 0 30px rgba(212,175,55,0.08)",
    textAlign: "center",
    paddingBottom: 20,
  },
  cardImage: {
    width: "100%",
    height: 420,
    objectFit: "cover",
    filter: "brightness(0.85)",
  },
  cardName: {
    margin: "14px 0 4px",
    fontSize: 22,
    fontWeight: 700,
  },
  cardRole: {
    margin: "0 0 10px",
    fontSize: 14,
    fontWeight: 600,
    color: "#d4af37",
  },
  cardBio: {
    margin: "0 16px 16px",
    fontSize: 14,
    lineHeight: 1.5,
    opacity: 0.85,
  },
  cardButtons: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
    padding: "0 16px",
  },
  cardButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid gold",
    background: "transparent",
    color: "gold",
    textDecoration: "none",
    fontWeight: 600,
    minWidth: 100,
    textAlign: "center",
  },
};