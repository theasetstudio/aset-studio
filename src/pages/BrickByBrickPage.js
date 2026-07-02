import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function BrickByBrickPage() {
  const [posterUrl, setPosterUrl] = useState("");
  const [worldActivity, setWorldActivity] = useState([]);
  const [receiptActivity, setReceiptActivity] = useState([]);

  useEffect(() => {
    loadPoster();
    loadWorldActivity();
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

  async function loadWorldActivity() {
    const { data, error } = await supabase
      .from("brick_world_activity")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const receipts = (data || []).filter(
      (item) => item.platform === "Receipts"
    );

    const activity = (data || []).filter(
      (item) => item.platform !== "Receipts"
    );

    setWorldActivity(activity);
    setReceiptActivity(receipts);
  }

  const socialPlatforms = [
    {
      name: "Pulse",
      type: "Public Network",
      description:
        "Family announcements, luxury events, public reputation, business updates, and community whispers.",
      color: "#d4af37",
    },
    {
      name: "Nova",
      type: "Luxury Image Feed",
      description:
        "Editorial glamour, gala appearances, cryptic captions, romance rumors, and controlled public images.",
      color: "#f3d6a4",
    },
    {
      name: "Surge",
      type: "Viral Video Network",
      description:
        "Leaked footage, nightlife clips, red carpet moments, confrontations, and dangerous viral attention.",
      color: "#9c6bff",
    },
    {
      name: "Blaze",
      type: "Scandal Wire",
      description:
        "Breaking exposés, anonymous sources, empire gossip, scandals, and family power shifts.",
      color: "#ff7446",
    },
  ];

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

            <Link to="/brick-by-brick/soundtrack" style={styles.secondaryButton}>
              Original Soundtrack
            </Link>
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

        <h2 style={styles.sectionTitle}>The World of Brick by Brick</h2>

        <p style={styles.bodyText}>
          A cinematic soap opera world of old-money families, organized power,
          luxury businesses, dangerous romance, betrayal, political influence,
          and the calculated rise of Crown inside a dynasty built on loyalty,
          secrecy, and control.
        </p>
      </section>

      <section style={styles.soundtrackSection}>
        <div style={styles.soundtrackCard}>
          <div style={styles.soundtrackGlow} />

          <p style={styles.sectionKicker}>Original Soundtrack</p>

          <h2 style={styles.sectionTitle}>
            Music From The World of Brick by Brick
          </h2>

          <p style={styles.bodyText}>
            Every empire has an anthem. Every betrayal has a melody. Every love
            story leaves a song.
          </p>

          <p style={styles.bodyText}>
            <strong>That Crown Love</strong> is the official signature love
            theme of Varney "Crown" Simmons and Staciana Charlotte "Sasha"
            Bellaire.
          </p>

          <Link to="/brick-by-brick/soundtrack" style={styles.primaryButton}>
            Enter The Soundtrack
          </Link>
        </div>
      </section>

      <section style={styles.socialSection}>
        <div style={styles.socialHeader}>
          <p style={styles.sectionKicker}>Empire Network</p>

          <h2 style={styles.sectionTitle}>
            The Digital Noise Around The Empire
          </h2>

          <p style={styles.bodyText}>
            Inside the Brick by Brick universe, power is no longer controlled
            only behind closed doors. Rumors spread. Videos leak. Public images
            fracture. Headlines ignite. Every family move leaves a digital trail.
          </p>
        </div>

        <div style={styles.socialGrid}>
          {socialPlatforms.map((platform) => (
            <div key={platform.name} style={styles.socialCard}>
              <div
                style={{
                  ...styles.socialGlow,
                  background: platform.color,
                }}
              />

              <p
                style={{
                  ...styles.socialType,
                  color: platform.color,
                }}
              >
                {platform.type}
              </p>

              <h3 style={styles.socialName}>{platform.name}</h3>

              <p style={styles.socialDescription}>{platform.description}</p>

              <button style={styles.socialButton}>Enter {platform.name}</button>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.feedSection}>
        <p style={styles.sectionKicker}>The Empire Never Sleeps</p>

        <h2 style={styles.sectionTitle}>Live World Activity</h2>

        <div style={styles.feedGrid}>
          {worldActivity.map((item) => (
            <div key={item.id} style={styles.feedCard}>
              <p style={styles.feedSource}>{item.label || item.platform}</p>

              <h3 style={styles.feedHeadline}>{item.title}</h3>

              <p style={styles.feedText}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {receiptActivity.length > 0 && (
        <section style={styles.receiptsSection}>
          <div style={styles.receiptsHeader}>
            <p style={styles.sectionKicker}>Leaked Receipts</p>

            <h2 style={styles.sectionTitle}>
              Private Messages. Public Consequences.
            </h2>

            <p style={styles.bodyText}>
              Not every betrayal reaches the headlines first.
            </p>
          </div>

          <div style={styles.messageGrid}>
            {receiptActivity.map((item) => (
              <div key={item.id} style={styles.messageCard}>
                <div style={styles.messageTop}>
                  <span style={styles.messageLabel}>
                    {item.label || "LEAKED THREAD"}
                  </span>
                </div>

                {item.message_one ? (
                  <div style={styles.messageBubbleDark}>
                    {item.message_one}
                  </div>
                ) : null}

                {item.message_two ? (
                  <div style={styles.messageBubbleGold}>
                    {item.message_two}
                  </div>
                ) : null}

                {item.caption ? (
                  <p style={styles.messageCaption}>{item.caption}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

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
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #d4af37, #f2daa0)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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

  soundtrackSection: {
    padding: "0 8vw 90px",
  },

  soundtrackCard: {
    position: "relative",
    overflow: "hidden",
    padding: "46px",
    borderRadius: "28px",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.18), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(212,175,55,0.18)",
    boxShadow: "0 40px 120px rgba(0,0,0,.45)",
  },

  soundtrackGlow: {
    position: "absolute",
    top: "-140px",
    right: "-120px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "#d4af37",
    opacity: 0.12,
    filter: "blur(60px)",
  },

  socialSection: {
    padding: "40px 8vw 90px",
  },

  socialHeader: {
    marginBottom: "40px",
  },

  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px",
  },

  socialCard: {
    position: "relative",
    overflow: "hidden",
    padding: "30px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  socialGlow: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    opacity: 0.12,
    filter: "blur(40px)",
  },

  socialType: {
    margin: "0 0 14px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "11px",
    fontWeight: 800,
  },

  socialName: {
    margin: "0 0 14px",
    fontSize: "38px",
    fontWeight: 900,
  },

  socialDescription: {
    margin: "0 0 26px",
    color: "#d2cabd",
    lineHeight: 1.7,
  },

  socialButton: {
    border: "none",
    borderRadius: "999px",
    padding: "12px 18px",
    background: "#f5f5f5",
    color: "#111",
    fontWeight: 800,
  },

  feedSection: {
    padding: "0 8vw 90px",
  },

  feedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  feedCard: {
    padding: "28px",
    borderRadius: "22px",
    background: "#0d0d10",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  feedSource: {
    margin: "0 0 14px",
    color: "#d4af37",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.16em",
  },

  feedHeadline: {
    margin: "0 0 14px",
    fontSize: "28px",
    lineHeight: 1.15,
  },

  feedText: {
    margin: 0,
    color: "#cfc6b9",
    lineHeight: 1.7,
  },

  receiptsSection: {
    padding: "0 8vw 90px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  receiptsHeader: {
    paddingTop: "82px",
    marginBottom: "34px",
  },

  messageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px",
  },

  messageCard: {
    padding: "24px",
    borderRadius: "26px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
    border: "1px solid rgba(212,175,55,0.14)",
  },

  messageTop: {
    marginBottom: "22px",
  },

  messageLabel: {
    color: "#d4af37",
    fontSize: "10px",
    letterSpacing: "0.18em",
    fontWeight: 900,
  },

  messageBubbleDark: {
    maxWidth: "92%",
    marginBottom: "12px",
    padding: "13px 15px",
    borderRadius: "18px 18px 18px 4px",
    background: "#171719",
    color: "#f7f0e5",
    lineHeight: 1.45,
    fontSize: "14px",
  },

  messageBubbleGold: {
    maxWidth: "92%",
    marginLeft: "auto",
    marginBottom: "18px",
    padding: "13px 15px",
    borderRadius: "18px 18px 4px 18px",
    background: "linear-gradient(135deg, #d4af37, #f2daa0)",
    color: "#111",
    lineHeight: 1.45,
    fontSize: "14px",
    fontWeight: 800,
  },

  messageCaption: {
    margin: 0,
    color: "#9e9689",
    fontSize: "12px",
    lineHeight: 1.6,
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
    position: "relative",
    zIndex: 2,
  },
};