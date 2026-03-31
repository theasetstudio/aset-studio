import React from "react";
import { Link } from "react-router-dom";

const SHOW_GENERATOR_HOME = false;
const SHOW_GENERATOR_LAUNCH_TEXT = false;

const quickLinks = [
  {
    title: "Gallery",
    description: "Browse the public image experience and featured visual work.",
    to: "/gallery",
  },
  {
    title: "Creators",
    description: "Discover creators, profiles, portfolios, and connections.",
    to: "/creators",
  },
  {
    title: "Creator Hub",
    description: "Enter the creator side of the platform and manage your space.",
    to: "/creator-hub",
  },
  {
    title: "Favorites",
    description: "Open your saved items and revisit what you’ve collected.",
    to: "/favorites",
  },
  {
    title: "Reviews",
    description: "Read platform reviews, feedback, and testimony from visitors.",
    to: "/reviews",
  },
  {
    title: "Supreme Access",
    description: "Unlock the premium layer of the platform and deeper access.",
    to: "/supreme-access",
  },
  {
    title: "Messages",
    description: "Open creator and user messaging inside the platform.",
    to: "/messages",
  },
  {
    title: "Aset Lounge",
    description: "Enter the lounge experience and interactive creative areas.",
    to: "/aset-lounge",
  },
  {
    title: "Sirens Realm",
    description: "Explore stones, collections, and the Sirens Realm portal.",
    to: "/sirens-realm",
  },
];

export default function HomePage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroInner}>
          <div style={styles.brand}>THE ASET STUDIO</div>

          <h1 style={styles.headline}>
            A Creative Temple of Image, Sound &amp; Sovereignty.
          </h1>

          <p style={styles.subtext}>
            Egyptian royalty. Mythic cinema. A siren’s whisper beneath the
            surface.
          </p>

          {SHOW_GENERATOR_LAUNCH_TEXT && (
            <p style={styles.generatorLaunchText}>
              A new instrument has entered the temple. The Generator is now
              live.
            </p>
          )}

          <div style={styles.ctaRow}>
            <Link to="/gallery" style={styles.primaryBtn}>
              Enter the Gallery
            </Link>

            <Link to="/supreme-access" style={styles.goldBtn}>
              Supreme Access
            </Link>

            {SHOW_GENERATOR_HOME && (
              <Link to="/generator" style={styles.generatorBtn}>
                Enter the Generator
              </Link>
            )}

            <Link to="/sirens-realm" style={styles.ghostBtn}>
              Enter Sirens Realm
            </Link>
          </div>

          <div style={styles.note}>
            Public access is open. Supreme unlocks deeper layers. Boudoir
            requires age verification.
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionTitle}>Explore the Platform</div>

        <div style={styles.quickLinkGrid}>
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} style={styles.quickLinkCard}>
              <div style={styles.quickLinkTitle}>{item.title}</div>
              <div style={styles.quickLinkDesc}>{item.description}</div>
              <div style={styles.quickLinkAction}>Open →</div>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionTitle}>Access Levels</div>

        <div style={styles.tierGrid}>
          <div style={styles.tierCard}>
            <div style={styles.tierName}>Public</div>
            <div style={styles.tierDesc}>
              Witness the surface. Everyone can enter.
            </div>
          </div>

          <div style={styles.tierCard}>
            <div style={styles.tierName}>Supreme</div>
            <div style={styles.tierDesc}>
              Monthly subscription. Deeper releases and premium access.
            </div>

            <div style={{ marginTop: 10 }}>
              <Link to="/supreme-access" style={styles.textLink}>
                Explore Supreme →
              </Link>
            </div>
          </div>

          {SHOW_GENERATOR_HOME && (
            <div style={styles.tierCard}>
              <div style={styles.tierName}>Generator</div>
              <div style={styles.tierDesc}>
                Open the generator experience and create directly inside the
                platform.
              </div>

              <div style={{ marginTop: 10 }}>
                <Link to="/generator" style={styles.textLink}>
                  Open Generator →
                </Link>
              </div>
            </div>
          )}

          <div style={styles.tierCard}>
            <div style={styles.tierName}>Boudoir</div>
            <div style={styles.tierDesc}>
              Restricted content. Age verification required.
            </div>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.sectionTitle}>Reviews &amp; Testimonies</div>

        <div style={styles.quoteGrid}>
          <blockquote style={styles.quote}>
            “Aset is not just a gallery — it’s an experience. Every image feels
            like a scene.”
          </blockquote>

          <blockquote style={styles.quote}>
            “Luxury, mystery, and craft. The work speaks like mythology.”
          </blockquote>
        </div>

        <div style={{ marginTop: 14 }}>
          <Link to="/reviews" style={styles.textLink}>
            View all reviews →
          </Link>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          © {new Date().getFullYear()} The Aset Studio • Curated releases
          opening in waves.
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07070a",
    color: "#f2f0ea",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  hero: {
    position: "relative",
    minHeight: "78vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 18px",
    background:
      "radial-gradient(1200px 600px at 50% 30%, rgba(170,140,70,0.18), rgba(0,0,0,0)), linear-gradient(180deg, #07070a, #020204)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.88))",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 980,
    width: "100%",
    textAlign: "center",
  },
  brand: {
    letterSpacing: "0.22em",
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 10,
  },
  headline: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 600,
    fontSize: "clamp(30px, 4vw, 52px)",
    lineHeight: 1.1,
    margin: "0 0 14px",
  },
  subtext: {
    maxWidth: 720,
    margin: "0 auto 22px",
    opacity: 0.85,
    fontSize: 16,
    lineHeight: 1.6,
  },
  generatorLaunchText: {
    maxWidth: 760,
    margin: "0 auto 22px",
    opacity: 0.9,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(242,240,234,0.92)",
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(170,140,70,0.18)",
    border: "1px solid rgba(170,140,70,0.55)",
    color: "#f2f0ea",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
  },
  goldBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(212,175,55,0.14)",
    border: "1px solid rgba(212,175,55,0.55)",
    color: "#f2f0ea",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
  },
  generatorBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(120,120,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#f2f0ea",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#f2f0ea",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 600,
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
  },
  note: {
    opacity: 0.7,
    fontSize: 13,
    marginTop: 10,
  },
  section: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "44px 18px",
  },
  sectionAlt: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "44px 18px",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 22,
    marginBottom: 18,
    letterSpacing: "0.02em",
  },
  quickLinkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  quickLinkCard: {
    display: "block",
    textDecoration: "none",
    color: "#f2f0ea",
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.16)",
    transition: "transform 0.18s ease, border-color 0.18s ease",
  },
  quickLinkTitle: {
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: "0.01em",
  },
  quickLinkDesc: {
    opacity: 0.82,
    lineHeight: 1.5,
    minHeight: 68,
  },
  quickLinkAction: {
    marginTop: 14,
    color: "rgba(242,240,234,0.92)",
    fontWeight: 700,
  },
  tierGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  tierCard: {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(170,140,70,0.14)",
  },
  tierName: {
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: "0.01em",
  },
  tierDesc: {
    opacity: 0.8,
    lineHeight: 1.5,
  },
  quoteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
  },
  quote: {
    margin: 0,
    padding: 16,
    borderRadius: 18,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
    opacity: 0.9,
    lineHeight: 1.6,
  },
  textLink: {
    color: "rgba(242,240,234,0.92)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(170,140,70,0.55)",
    paddingBottom: 2,
  },
  footer: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 18px 48px",
    opacity: 0.7,
  },
  footerLine: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 12,
  },
};