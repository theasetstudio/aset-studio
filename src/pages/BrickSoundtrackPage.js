import React from "react";
import { Link } from "react-router-dom";

export default function BrickSoundtrackPage() {
  const songUrl = `${process.env.PUBLIC_URL}/audio/that-crown-love.mp3`;

  return (
    <main style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <p style={styles.kicker}>THE ASET STUDIO PRESENTS</p>

          <h1 style={styles.heroTitle}>
            Brick by Brick
            <br />
            Original Soundtrack
          </h1>

          <p style={styles.heroText}>
            Every empire has an anthem.
            <br />
            Every betrayal has a melody.
            <br />
            Every love story leaves a song.
          </p>

          <Link to="/brick-by-brick" style={styles.backButton}>
            ← Return to Brick by Brick
          </Link>
        </div>
      </section>

      {/* FEATURED SONG */}
      <section style={styles.section}>
        <div style={styles.card}>
          <p style={styles.label}>FEATURED RELEASE</p>

          <h2 style={styles.songTitle}>That Crown Love</h2>

          <p style={styles.artist}>
            Varney "Crown" Simmons
            <br />
            &amp;
            <br />
            Staciana Charlotte "Sasha" Bellaire
          </p>

          <div style={styles.audioWrapper}>
            <audio controls style={styles.audio}>
              <source src={songUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>

          <div style={styles.story}>
            <h3 style={styles.heading}>About This Song</h3>

            <p style={styles.text}>
              <strong>That Crown Love</strong> is the signature love theme of
              Varney "Crown" Simmons and Staciana Charlotte "Sasha" Bellaire.
              Their relationship exists between passion, loyalty, power,
              obsession, sacrifice, and destiny. This record serves as the first
              official musical chapter from the world of <em>Brick by Brick</em>.
            </p>
          </div>
        </div>
      </section>

      {/* CHARACTER CONNECTION */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Character Connection</h2>

        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <p style={styles.smallLabel}>CHARACTER</p>

            <h3 style={styles.name}>Varney "Crown" Simmons</h3>

            <p style={styles.infoText}>
              A man whose love is as powerful as the empire he is building.
              Every decision is calculated, but Sasha remains the one person
              capable of reaching the man beneath the crown.
            </p>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.smallLabel}>INSPIRED BY</p>

            <h3 style={styles.name}>
              Staciana Charlotte "Sasha" Bellaire
            </h3>

            <p style={styles.infoText}>
              The heart of Crown's story. Their relationship defines the
              emotional foundation of the Brick by Brick universe.
            </p>
          </div>
        </div>
      </section>

      {/* FUTURE TRACKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Coming to the Soundtrack</h2>

        <div style={styles.trackGrid}>
          {[
            "No Crown Given",
            "Bellaire Bloodline",
            "The Island",
            "Roy's Revenge",
            "Empire Rules",
            "Ascension of Crown",
          ].map((track) => (
            <div key={track} style={styles.trackCard}>
              {track}
            </div>
          ))}
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
    fontFamily: "system-ui, sans-serif",
  },

  hero: {
    position: "relative",
    minHeight: "75vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "140px 24px 100px",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,.18), transparent 35%), linear-gradient(135deg,#070707,#16110b,#050507)",
    overflow: "hidden",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.82))",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 900,
    textAlign: "center",
  },

  kicker: {
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: ".28em",
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(58px,9vw,120px)",
    lineHeight: ".9",
    letterSpacing: "-.05em",
    fontWeight: 900,
  },

  heroText: {
    marginTop: 28,
    color: "#d8cfbf",
    lineHeight: 1.8,
    fontSize: 20,
  },

  backButton: {
    display: "inline-block",
    marginTop: 40,
    padding: "14px 24px",
    borderRadius: 999,
    background: "linear-gradient(135deg,#d4af37,#f2daa0)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 800,
  },

  section: {
    padding: "80px 8vw",
  },

  card: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 40,
    borderRadius: 30,
    background:
      "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
    border: "1px solid rgba(212,175,55,.2)",
    boxShadow: "0 40px 100px rgba(0,0,0,.5)",
  },

  label: {
    color: "#d4af37",
    letterSpacing: ".2em",
    fontWeight: 900,
    fontSize: 11,
    marginBottom: 14,
  },

  songTitle: {
    margin: 0,
    fontSize: "clamp(42px,7vw,80px)",
    letterSpacing: "-.05em",
  },

  artist: {
    marginTop: 18,
    color: "#f2daa0",
    fontSize: 22,
    lineHeight: 1.6,
    fontWeight: 700,
  },

  audioWrapper: {
    marginTop: 40,
  },

  audio: {
    width: "100%",
  },

  story: {
    marginTop: 40,
  },

  heading: {
    fontSize: 28,
    marginBottom: 18,
  },

  text: {
    color: "#d8cfbf",
    lineHeight: 1.9,
    fontSize: 17,
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: 50,
    fontSize: "clamp(36px,5vw,64px)",
    letterSpacing: "-.04em",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 24,
  },

  infoCard: {
    padding: 30,
    borderRadius: 24,
    background: "#111",
    border: "1px solid rgba(255,255,255,.08)",
  },

  smallLabel: {
    color: "#d4af37",
    fontSize: 11,
    letterSpacing: ".18em",
    fontWeight: 800,
  },

  name: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 30,
  },

  infoText: {
    color: "#d8cfbf",
    lineHeight: 1.8,
  },

  trackGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 18,
  },

  trackCard: {
    padding: 24,
    borderRadius: 20,
    background: "#111",
    border: "1px solid rgba(255,255,255,.08)",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 18,
  },
};