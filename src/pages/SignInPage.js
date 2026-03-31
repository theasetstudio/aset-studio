// src/pages/SirensRealmPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function SirensRealmPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.eyebrow}>SIRENS REALM</div>

        <h1 style={styles.title}>The Portal of Mystic Teaching.</h1>

        <p style={styles.subtitle}>
          A world of mystics and conjurers — guided by one voice. Teachings,
          rituals, symbols, stones, and sacred knowledge live here.
        </p>

        <div style={styles.buttonRow}>
          <Link to="/stones" style={styles.primaryButton}>
            Stones and Minerals
          </Link>

          <Link
            to="/return-to-sender-deities"
            style={styles.secondaryButton}
          >
            Return to Sender
          </Link>

          <Link
            to="/gallery?category=Sirens%20Realm"
            style={styles.secondaryButton}
          >
            View Relics (Gallery)
          </Link>

          <Link to="/" style={styles.ghostButton}>
            Return to The Aset Studio
          </Link>
        </div>

        <div style={styles.comingNextCard}>
          <div style={styles.comingNextTitle}>Coming next</div>

          <div style={styles.comingNextText}>
            • Stones and Minerals knowledge library
            <br />
            • Lapis Lazuli teachings
            <br />
            • Paid PDFs & mystical lessons
            <br />
            • Ritual Library + Grimoire pages
            <br />• Audio teachings + cinematic lessons
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
      "radial-gradient(60% 60% at 50% 30%, rgba(120,90,255,0.18), rgba(0,0,0,1) 70%)",
    color: "white",
    padding: "48px 20px",
  },
  container: {
    maxWidth: 980,
    margin: "0 auto",
  },
  eyebrow: {
    letterSpacing: 3,
    fontSize: 12,
    opacity: 0.85,
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 56px)",
    lineHeight: 1.05,
    marginTop: 16,
  },
  subtitle: {
    maxWidth: 700,
    marginTop: 14,
    opacity: 0.85,
    fontSize: 16,
    lineHeight: 1.6,
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.20)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },
  ghostButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.10)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },
  comingNextCard: {
    marginTop: 32,
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    maxWidth: 780,
  },
  comingNextTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  comingNextText: {
    opacity: 0.85,
    lineHeight: 1.6,
  },
};