import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function BrickSongPage() {
  const songUrl = `${process.env.PUBLIC_URL}/audio/that-crown-love.mp3`;
  const [copied, setCopied] = useState(false);

  async function shareSong() {
    const shareUrl = `${window.location.origin}/brick-by-brick/music/that-crown-love`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.content}>
          <p style={styles.kicker}>Brick by Brick Original Soundtrack</p>

          <h1 style={styles.title}>That Crown Love</h1>

          <p style={styles.subtitle}>
            The signature love theme of Varney “Crown” Simmons and Staciana
            Charlotte “Sasha” Bellaire.
          </p>

          <div style={styles.buttonRow}>
            <button onClick={shareSong} style={styles.primaryButton}>
              {copied ? "Link Copied" : "Share Song"}
            </button>

            <Link to="/brick-by-brick/soundtrack" style={styles.secondaryButton}>
              Back to Soundtrack
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.songSection}>
        <div style={styles.songCard}>
          <p style={styles.label}>Featured Song</p>

          <h2 style={styles.songTitle}>That Crown Love</h2>

          <p style={styles.meta}>
            Varney “Crown” Simmons × Staciana Charlotte “Sasha” Bellaire
          </p>

          <div style={styles.audioBox}>
            <audio controls style={styles.audio}>
              <source src={songUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>

          <p style={styles.bodyText}>
            <strong>That Crown Love</strong> belongs to the emotional center of
            <em> Brick by Brick</em>. It carries Crown’s devotion, possession,
            loyalty, heat, and the dangerous tenderness he has for Sasha.
          </p>

          <p style={styles.bodyText}>
            This is not just a song. It is a character moment. A piece of the
            empire. A love letter with fingerprints on it.
          </p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050507",
    color: "#f7f0e5",
  },

  hero: {
    position: "relative",
    minHeight: "78vh",
    display: "flex",
    alignItems: "center",
    padding: "120px 8vw 80px",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.24), transparent 32%), linear-gradient(135deg, #070707 0%, #15100b 45%, #050507 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.86))",
  },

  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: 900,
  },

  kicker: {
    margin: "0 0 18px",
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    fontSize: 12,
    fontWeight: 900,
  },

  title: {
    margin: 0,
    fontSize: "clamp(58px, 10vw, 126px)",
    lineHeight: 0.9,
    letterSpacing: "-0.06em",
    fontWeight: 950,
  },

  subtitle: {
    maxWidth: 760,
    margin: "28px 0 0",
    color: "#dfd5c3",
    fontSize: "clamp(20px, 2vw, 28px)",
    lineHeight: 1.45,
    fontWeight: 600,
  },

  buttonRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 34,
  },

  primaryButton: {
    border: "none",
    padding: "14px 22px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #d4af37, #f2daa0)",
    color: "#111",
    fontWeight: 900,
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "14px 22px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
    background: "rgba(255,255,255,0.06)",
  },

  songSection: {
    padding: "90px 8vw",
  },

  songCard: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 42,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
    border: "1px solid rgba(212,175,55,0.18)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
  },

  label: {
    margin: "0 0 12px",
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: 11,
    fontWeight: 900,
  },

  songTitle: {
    margin: 0,
    fontSize: "clamp(42px, 7vw, 84px)",
    letterSpacing: "-0.05em",
  },

  meta: {
    margin: "18px 0 28px",
    color: "#f2daa0",
    fontSize: 18,
    fontWeight: 800,
  },

  audioBox: {
    padding: 18,
    borderRadius: 22,
    background: "#09090b",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 30,
  },

  audio: {
    width: "100%",
  },

  bodyText: {
    maxWidth: 860,
    color: "#d8d0c2",
    fontSize: 18,
    lineHeight: 1.75,
  },
};