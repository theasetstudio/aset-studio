import React from "react";
import { Link, useParams } from "react-router-dom";

const demoManager = {
  name: "Managers Door Presentation",
  title: "Executive Feature Preview",
  company: "Presented by The Aset Studio",
  category: "Talent Management",
  location: "Entertainment Industry",
  initials: "MD",
  statement:
    "The Aset Studio honors and showcases the professionals whose leadership, relationships, and vision help shape creative careers.",
  quote:
    "The spotlight belongs to the artist. The legacy also belongs to the people who helped build it.",
  bio:
    "This presentation preview represents the kind of executive feature Managers Door was created to build. Each presentation is designed to honor leadership, professional relationships, career impact, represented talent, media presence, and the legacy behind the work.",
  talent: [
    { name: "Featured Talent", role: "Actor | Singer | Creative Professional" },
    {
      name: "Featured Talent",
      role: "Recording Artist | Television Personality",
    },
  ],
  highlights: [
    "Entertainment industry leadership",
    "Talent management and career development",
    "Professional relationship building",
    "Executive brand presence",
  ],
};

export default function ManagerProfilePage() {
  const { slug } = useParams();

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroPortrait}>
          <div style={styles.portraitOverlay} />
          <p style={styles.portraitInitials}>{demoManager.initials}</p>
          <p style={styles.portraitLabel}>Executive Portrait</p>
        </div>

        <div style={styles.heroCopy}>
          <p style={styles.kicker}>Managers Door Presentation</p>
          <h1 style={styles.name}>{demoManager.name}</h1>
          <p style={styles.meta}>
            {demoManager.title} | {demoManager.category}
          </p>
          <p style={styles.company}>{demoManager.company}</p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>Invitation Only</span>
            <span style={styles.badge}>Managers Door Presentation</span>
            <span style={styles.badge}>Honored by The Aset Studio</span>
          </div>

          <p style={styles.statement}>{demoManager.statement}</p>

          <div style={styles.snapshot}>
            <Snapshot label="Presentation" value={demoManager.company} />
            <Snapshot label="Industry" value="Entertainment" />
            <Snapshot label="Focus" value={demoManager.location} />
            <Snapshot label="Created By" value="The Aset Studio" />
          </div>

          <p style={styles.slug}>Preview URL: /managers/{slug}</p>
        </div>
      </section>

      <section style={styles.quoteBlock}>
        <p style={styles.quoteMark}>“</p>
        <h2 style={styles.quote}>{demoManager.quote}</h2>
        <p style={styles.quoteCredit}>Aset Studio Statement</p>
      </section>

      <section style={styles.story}>
        <div>
          <p style={styles.kicker}>The Story</p>
          <h2 style={styles.sectionTitle}>
            The people behind the careers deserve a stage of their own.
          </h2>
        </div>

        <div>
          <p style={styles.bodyText}>{demoManager.bio}</p>
          <p style={styles.bodyText}>
            Managers Door is designed for executives, managers, and industry
            professionals whose work deserves more than a social media bio. Each
            feature becomes a polished home for their leadership, journey,
            represented talent, media presence, and professional legacy.
          </p>
        </div>
      </section>

      <section style={styles.honorFeature}>
        <div style={styles.imageTile}>
          <p style={styles.tileInitials}>MC</p>
        </div>

        <div>
          <p style={styles.kicker}>The Aset Studio Honors</p>
          <h2 style={styles.sectionTitle}>
            Recognizing leadership, vision, and professional impact.
          </h2>
          <p style={styles.bodyText}>
            Managers Door honors the work that often happens before the cameras
            turn on and after the applause fades. These presentations recognize
            the people who help talent prepare, grow, protect their vision, and
            walk into opportunity.
          </p>
        </div>
      </section>

      <section style={styles.talentSection}>
        <p style={styles.kicker}>Professional Influence</p>
        <h2 style={styles.sectionTitle}>
          A legacy reflected through the people, projects, and careers they help
          guide.
        </h2>

        <div style={styles.talentGrid}>
          {demoManager.talent.map((person, index) => (
            <article key={`${person.name}-${index}`} style={styles.talentCard}>
              <div style={styles.talentPortrait}>{person.name.charAt(0)}</div>
              <div>
                <h3 style={styles.talentName}>{person.name}</h3>
                <p style={styles.talentRole}>{person.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.timelineSection}>
        <p style={styles.kicker}>Professional Legacy</p>
        <h2 style={styles.sectionTitle}>
          Milestones, work, and moments that shaped the journey.
        </h2>

        <div style={styles.timeline}>
          {demoManager.highlights.map((item, index) => (
            <div key={item} style={styles.timelineItem}>
              <p style={styles.timelineNumber}>0{index + 1}</p>
              <p style={styles.timelineText}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.cinemaBlock}>
        <div>
          <p style={styles.kicker}>Featured Interview</p>
          <h2 style={styles.sectionTitle}>
            A conversation worthy of Aset Cinema.
          </h2>
          <p style={styles.bodyText}>
            Manager interviews live inside Aset Cinema, connecting each
            executive presentation to The Aset Studio’s video storytelling
            experience.
          </p>
        </div>

        <div style={styles.videoFrame}>
          <div style={styles.playCircle}>▶</div>
          <p style={styles.videoTitle}>Watch the Feature</p>
          <p style={styles.videoText}>Interview Placement</p>
        </div>
      </section>

      <section style={styles.galleryBlock}>
        <p style={styles.kicker}>Virtual Photoshoot</p>
        <h2 style={styles.sectionTitle}>
          Editorial imagery designed for executive presence.
        </h2>

        <div style={styles.galleryGrid}>
          <div style={styles.galleryTall}>Portrait</div>
          <div style={styles.galleryWide}>Brand Image</div>
          <div style={styles.galleryWide}>Media Image</div>
        </div>
      </section>

      <section style={styles.contactBlock}>
        <div>
          <p style={styles.kicker}>Professional Contact</p>
          <h2 style={styles.sectionTitle}>
            Clear contact preferences, approved by the manager.
          </h2>
        </div>

        <div style={styles.contactCard}>
          <p style={styles.contactLabel}>Availability</p>
          <h3 style={styles.contactTitle}>By Professional Inquiry</h3>
          <p style={styles.contactText}>
            Each presentation lists the manager’s preferred contact method,
            including email, agency website, referral instructions, or no
            unsolicited inquiries.
          </p>
        </div>
      </section>

      <section style={styles.closing}>
        <p style={styles.kicker}>Managers Door Presentation</p>
        <h2 style={styles.closingTitle}>
          Some careers deserve more than a biography. They deserve a
          presentation that honors the leadership, vision, and legacy behind the
          work.
        </h2>
        <Link to="/managers" style={styles.backButton}>
          Back to Managers Door
        </Link>
      </section>
    </main>
  );
}

function Snapshot({ label, value }) {
  return (
    <div style={styles.snapshotItem}>
      <p style={styles.snapshotLabel}>{label}</p>
      <p style={styles.snapshotValue}>{value}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "112px 6vw 80px",
    background:
      "radial-gradient(circle at top left, rgba(215,180,108,0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(116,68,24,0.2), transparent 32%), #000",
    color: "#f5efe5",
  },
  hero: {
    minHeight: "82vh",
    display: "grid",
    gridTemplateColumns: "minmax(320px, 480px) minmax(0, 1fr)",
    gap: "58px",
    alignItems: "center",
  },
  heroPortrait: {
    height: "680px",
    border: "1px solid rgba(215,180,108,0.34)",
    background:
      "linear-gradient(145deg, rgba(215,180,108,0.24), rgba(255,255,255,0.04), rgba(0,0,0,0.95))",
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 50px 140px rgba(0,0,0,0.7)",
  },
  portraitOverlay: {
    position: "absolute",
    inset: "10%",
    background: "rgba(215,180,108,0.18)",
    filter: "blur(70px)",
  },
  portraitInitials: {
    position: "relative",
    fontSize: "128px",
    fontWeight: 900,
    letterSpacing: "-0.08em",
    margin: 0,
  },
  portraitLabel: {
    position: "absolute",
    bottom: "24px",
    left: "24px",
    color: "#d7b46c",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "11px",
    fontWeight: 900,
  },
  heroCopy: {
    maxWidth: "1040px",
  },
  kicker: {
    color: "#d7b46c",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: 900,
    margin: "0 0 14px",
  },
  name: {
    fontSize: "clamp(62px, 9vw, 132px)",
    lineHeight: 0.86,
    margin: "0 0 22px",
    letterSpacing: "-0.07em",
  },
  meta: {
    color: "#f0d28c",
    fontSize: "23px",
    fontWeight: 900,
    margin: "0 0 8px",
  },
  company: {
    color: "#d8c7ad",
    fontSize: "19px",
    margin: "0 0 24px",
  },
  badgeRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  badge: {
    border: "1px solid rgba(215,180,108,0.38)",
    background: "rgba(255,255,255,0.045)",
    color: "#f6dfaa",
    padding: "10px 12px",
    fontWeight: 900,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  statement: {
    color: "#c9baa1",
    lineHeight: 1.8,
    fontSize: "20px",
    maxWidth: "900px",
  },
  snapshot: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "10px",
    maxWidth: "850px",
    marginTop: "28px",
  },
  snapshotItem: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.035)",
    padding: "14px",
  },
  snapshotLabel: {
    color: "#8f806d",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: "10px",
    fontWeight: 900,
    margin: "0 0 8px",
  },
  snapshotValue: {
    color: "#f5efe5",
    fontWeight: 900,
    margin: 0,
  },
  quoteBlock: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    padding: "84px 0",
    margin: "54px 0 88px",
    maxWidth: "1240px",
  },
  quoteMark: {
    color: "#d7b46c",
    fontSize: "94px",
    lineHeight: 0.65,
    margin: 0,
  },
  quote: {
    fontSize: "clamp(38px, 5vw, 78px)",
    lineHeight: 0.96,
    letterSpacing: "-0.058em",
    maxWidth: "1160px",
    margin: "0 0 20px",
  },
  quoteCredit: {
    color: "#b8aa96",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "12px",
    fontWeight: 900,
  },
  story: {
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gap: "50px",
    marginBottom: "100px",
  },
  sectionTitle: {
    fontSize: "clamp(36px, 5vw, 70px)",
    lineHeight: 0.96,
    margin: "0 0 22px",
    letterSpacing: "-0.058em",
  },
  bodyText: {
    color: "#b8aa96",
    lineHeight: 1.9,
    fontSize: "18px",
    margin: "0 0 18px",
  },
  honorFeature: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 430px) minmax(0, 1fr)",
    gap: "50px",
    alignItems: "center",
    margin: "92px 0",
  },
  imageTile: {
    height: "520px",
    border: "1px solid rgba(255,255,255,0.13)",
    background:
      "radial-gradient(circle at center, rgba(215,180,108,0.22), transparent 42%), #060606",
    display: "grid",
    placeItems: "center",
  },
  tileInitials: {
    fontSize: "90px",
    fontWeight: 900,
    letterSpacing: "-0.08em",
  },
  talentSection: {
    margin: "100px 0",
  },
  talentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
    marginTop: "30px",
  },
  talentCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    border: "1px solid rgba(215,180,108,0.25)",
    background: "rgba(255,255,255,0.035)",
    padding: "22px",
  },
  talentPortrait: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "rgba(215,180,108,0.18)",
    color: "#f6dfaa",
    fontSize: "34px",
    fontWeight: 900,
  },
  talentName: {
    margin: "0 0 8px",
    fontSize: "25px",
  },
  talentRole: {
    margin: 0,
    color: "#b8aa96",
    lineHeight: 1.5,
  },
  timelineSection: {
    margin: "100px 0",
  },
  timeline: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    marginTop: "28px",
  },
  timelineItem: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    padding: "26px 0",
  },
  timelineNumber: {
    color: "#d7b46c",
    fontWeight: 900,
    letterSpacing: "0.18em",
    margin: 0,
  },
  timelineText: {
    color: "#f5efe5",
    fontSize: "23px",
    fontWeight: 900,
    margin: 0,
  },
  cinemaBlock: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "38px",
    alignItems: "center",
    margin: "110px 0",
    border: "1px solid rgba(215,180,108,0.24)",
    background: "rgba(255,255,255,0.03)",
    padding: "38px",
  },
  videoFrame: {
    minHeight: "390px",
    background:
      "radial-gradient(circle at center, rgba(215,180,108,0.22), transparent 42%), #050505",
    border: "1px solid rgba(255,255,255,0.12)",
    display: "grid",
    placeItems: "center",
    position: "relative",
  },
  playCircle: {
    width: "86px",
    height: "86px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#d7b46c",
    color: "#000",
    fontWeight: 900,
    fontSize: "30px",
  },
  videoTitle: {
    position: "absolute",
    top: "24px",
    left: "24px",
    fontSize: "24px",
    fontWeight: 900,
    margin: 0,
  },
  videoText: {
    position: "absolute",
    bottom: "24px",
    left: "24px",
    color: "#b8aa96",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "12px",
    fontWeight: 900,
  },
  galleryBlock: {
    margin: "110px 0",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gridTemplateRows: "260px 260px",
    gap: "18px",
    marginTop: "30px",
  },
  galleryTall: {
    gridRow: "span 2",
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "radial-gradient(circle at center, rgba(215,180,108,0.22), transparent 44%), #070707",
    display: "grid",
    placeItems: "center",
    color: "#d7b46c",
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  galleryWide: {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.85))",
    display: "grid",
    placeItems: "center",
    color: "#d7b46c",
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  contactBlock: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    alignItems: "start",
    margin: "110px 0",
  },
  contactCard: {
    border: "1px solid rgba(215,180,108,0.28)",
    background: "rgba(255,255,255,0.04)",
    padding: "30px",
  },
  contactLabel: {
    color: "#d7b46c",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "12px",
    fontWeight: 900,
    margin: "0 0 14px",
  },
  contactTitle: {
    fontSize: "32px",
    margin: "0 0 14px",
  },
  contactText: {
    color: "#b8aa96",
    lineHeight: 1.8,
    margin: 0,
  },
  closing: {
    marginTop: "96px",
    paddingTop: "60px",
    borderTop: "1px solid rgba(215,180,108,0.24)",
  },
  closingTitle: {
    fontSize: "clamp(42px, 5vw, 82px)",
    lineHeight: 0.94,
    maxWidth: "1240px",
    margin: "0 0 32px",
    letterSpacing: "-0.065em",
  },
  backButton: {
    display: "inline-block",
    padding: "14px 20px",
    background: "#d7b46c",
    color: "#000",
    textDecoration: "none",
    fontWeight: 900,
  },
};