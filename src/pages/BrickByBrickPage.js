import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function BrickByBrickPage() {
  const [posterUrl, setPosterUrl] = useState("");

  useEffect(() => {
    loadPoster();
  }, []);

  async function loadPoster() {
    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(
        "brick-by-brick/posters/brick-by-brick-world-bible-poster.png",
        3600
      );

    if (!error && data?.signedUrl) {
      setPosterUrl(data.signedUrl);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.content}>
          <p style={styles.kicker}>The Aset Studio Original Series</p>

          <h1 style={styles.title}>Brick by Brick</h1>

          <p style={styles.subtitle}>
            Dynasties are not inherited. They are taken.
          </p>

          <div style={styles.buttonRow}>
            <a href="#world" style={styles.primaryButton}>
              Enter the World
            </a>

            <a href="#characters" style={styles.secondaryButton}>
              Meet the Characters
            </a>
          </div>
        </div>
      </section>

      <section style={styles.posterSection}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt="Brick by Brick Character and World Bible"
            style={styles.posterImage}
          />
        ) : (
          <div style={styles.posterPlaceholder}>
            Loading Brick by Brick poster...
          </div>
        )}
      </section>

      <section id="world" style={styles.section}>
        <p style={styles.sectionKicker}>Series World</p>

        <h2 style={styles.sectionTitle}>
          The World of Brick by Brick
        </h2>

        <p style={styles.bodyText}>
          A cinematic soap opera world of old-money families, organized
          power, luxury businesses, dangerous romance, betrayal,
          political influence, and the calculated rise of Crown inside a
          dynasty built on loyalty, secrecy, and control.
        </p>
      </section>

      <section style={styles.gridSection}>
        <div style={styles.card}>
          <p style={styles.cardKicker}>Format</p>

          <h3 style={styles.cardTitle}>Long-Form Soap Opera</h3>

          <p style={styles.cardText}>
            Built for ongoing storytelling, family conflict, power shifts,
            betrayals, romance, and evolving character arcs without being
            trapped inside short-season limits.
          </p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardKicker}>Tone</p>

          <h3 style={styles.cardTitle}>Prestige Drama</h3>

          <p style={styles.cardText}>
            Dark, elegant, emotional, wealthy, dangerous, and cinematic. A world
            where boardrooms, bedrooms, estates, clubs, and family tables become
            battlefields.
          </p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardKicker}>Studio Layer</p>

          <h3 style={styles.cardTitle}>Aset Cinema Original</h3>

          <p style={styles.cardText}>
            Designed as a story universe that expands through cinematic scenes,
            visual campaigns, interviews, trailers, lore systems, and prestige
            dramatic storytelling.
          </p>
        </div>
      </section>

      <section id="characters" style={styles.section}>
        <p style={styles.sectionKicker}>Character Bible</p>

        <h2 style={styles.sectionTitle}>The Power Players</h2>

        <p style={styles.bodyText}>
          The official Brick by Brick character world is being built through the
          studio admin system. Profiles, family roles, portraits, alliances,
          betrayals, and story positions will appear here as the universe
          expands.
        </p>
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
      "radial-gradient(circle at top left, rgba(212,175,55,0.2), transparent 30%), linear-gradient(135deg, #070707 0%, #15100b 45%, #050507 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.82))",
  },

  content: {
    position: "relative",
    maxWidth: "860px",
    zIndex: 2,
  },

  kicker: {
    margin: "0 0 18px",
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    fontSize: "12px",
    fontWeight: 800,
  },

  title: {
    margin: 0,
    fontSize: "clamp(58px, 10vw, 128px)",
    lineHeight: 0.9,
    letterSpacing: "-0.06em",
    fontWeight: 900,
  },

  subtitle: {
    maxWidth: "720px",
    margin: "28px 0 0",
    color: "#dfd5c3",
    fontSize: "clamp(20px, 2vw, 28px)",
    lineHeight: 1.4,
    fontWeight: 600,
  },

  buttonRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "34px",
  },

  primaryButton: {
    padding: "14px 20px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #d4af37, #f2daa0)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
  },

  secondaryButton: {
    padding: "14px 20px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    background: "rgba(255,255,255,0.06)",
  },

  posterSection: {
    padding: "20px 8vw 40px",
    display: "flex",
    justifyContent: "center",
  },

  posterImage: {
    width: "100%",
    maxWidth: "920px",
    borderRadius: "26px",
    border: "1px solid rgba(212,175,55,0.2)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
  },

  posterPlaceholder: {
    width: "100%",
    maxWidth: "920px",
    minHeight: "500px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    color: "#aaa",
  },

  section: {
    padding: "82px 8vw",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  sectionKicker: {
    margin: "0 0 12px",
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "12px",
    fontWeight: 800,
  },

  sectionTitle: {
    margin: "0 0 20px",
    fontSize: "clamp(34px, 5vw, 72px)",
    letterSpacing: "-0.04em",
  },

  bodyText: {
    maxWidth: "880px",
    color: "#d8d0c2",
    fontSize: "18px",
    lineHeight: 1.75,
  },

  gridSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    padding: "0 8vw 82px",
  },

  card: {
    padding: "26px",
    borderRadius: "22px",
    border: "1px solid rgba(212,175,55,0.18)",
    background: "rgba(255,255,255,0.045)",
  },

  cardKicker: {
    margin: "0 0 10px",
    color: "#d4af37",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "11px",
    fontWeight: 800,
  },

  cardTitle: {
    margin: "0 0 12px",
    fontSize: "24px",
  },

  cardText: {
    margin: 0,
    color: "#cfc6b9",
    lineHeight: 1.65,
  },
};