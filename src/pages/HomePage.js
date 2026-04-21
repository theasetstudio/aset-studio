// File: src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const heroImageSrc = `${process.env.PUBLIC_URL}/images/aset-hero.png`;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <section style={{ ...styles.hero, backgroundImage: `url('${heroImageSrc}')` }}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroInner}>
          <div style={styles.heroRow}>
            {/* Left side: headline and buttons */}
            <div style={styles.heroLeft}>
              <div style={styles.brand}>THE ASET STUDIO</div>
              <h1 style={styles.headline}>
                A Creative Temple of Image, Sound & Sovereignty.
              </h1>
              <p style={styles.subtext}>
                Egyptian royalty. Mythic cinema. A siren&apos;s whisper beneath the surface.
              </p>
              <div style={styles.ctaRow}>
                <Link to="/gallery" style={styles.primaryBtn}>
                  Enter the Gallery
                </Link>
                <Link to="/sirens-realm" style={styles.ghostBtn}>
                  Enter Sirens Realm
                </Link>
              </div>
              <div style={styles.note}>
                Public access is open. Boudoir requires age verification.
              </div>
            </div>

            {/* Right side: People of Aset panel */}
            <div style={styles.heroRight}>
              <div style={styles.peoplePanel}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/aset-person.jpg`}
                  alt="The People of Aset"
                  style={styles.peopleImage}
                />
                <div style={styles.peopleContent}>
                  <h2>The People of Aset</h2>
                  <p>Recognized individuals within the world of Aset.</p>
                  <Link to="/talent" style={styles.peopleButton}>
                    Enter The People of Aset
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS THE ASET STUDIO VIDEO SECTION */}
      <section style={styles.featuredVideoSection}>
        {/* Existing video component goes here */}
      </section>

      {/* FEATURED PREVIEW STRIP */}
      <section style={styles.previewSection}>
        {/* Existing featured preview content goes here */}
      </section>

      {/* PORTAL GRID */}
      <section style={styles.portalSection}>
        {/* Existing portal grid content goes here */}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050507",
    color: "#f2f0ea",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    padding: "80px 20px",
  },
  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    padding: "clamp(56px, 8vw, 96px) clamp(16px, 4vw, 28px)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.44), rgba(0,0,0,0.66))",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 980,
    width: "100%",
  },
  heroRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 40,
    width: "100%",
  },
  heroLeft: { maxWidth: 600, textAlign: "left" },
  heroRight: { marginTop: -40 },
  brand: { fontSize: 12, letterSpacing: "0.18em", opacity: 0.8, marginBottom: 14 },
  headline: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(32px, 6vw, 54px)",
    lineHeight: 1.1,
    fontWeight: 600,
    marginBottom: 18,
  },
  subtext: { fontSize: 16, lineHeight: 1.7, opacity: 0.88, marginBottom: 24 },
  ctaRow: { display: "flex", gap: 16, marginBottom: 14 },
  primaryBtn: {
    padding: "12px 20px",
    borderRadius: 8,
    backgroundColor: "gold",
    color: "black",
    textDecoration: "none",
    fontWeight: 600,
  },
  ghostBtn: {
    padding: "12px 20px",
    borderRadius: 8,
    border: "1px solid gold",
    backgroundColor: "transparent",
    color: "gold",
    textDecoration: "none",
    fontWeight: 600,
  },
  note: { fontSize: 12, opacity: 0.7 },
  peoplePanel: {
    width: 300,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(212,175,55,0.4)",
    boxShadow: "0 0 30px rgba(212,175,55,0.15)",
    position: "relative",
  },
  peopleImage: { width: "100%", height: 420, objectFit: "cover", filter: "brightness(0.85)" },
  peopleContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
    color: "white",
  },
  peopleButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid gold",
    background: "transparent",
    color: "gold",
    textDecoration: "none",
    marginTop: 10,
  },
  featuredVideoSection: { marginTop: 60 },
  previewSection: { marginTop: 60 },
  portalSection: { marginTop: 60 },
};