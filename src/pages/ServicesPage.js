import React from "react";

export default function ServicesPage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroImageWrap}>
          <img
            src="/services-hero.png"
            alt="The Aset Studio Services"
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay} />
        </div>

        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>SERVICES</p>
          <h1 style={styles.heroTitle}>THE ASET STUDIO</h1>
          <div style={styles.heroLine} />
          <h2 style={styles.heroSubtitle}>
            Private Support for Creatives &amp; Talent
          </h2>

          <p style={styles.heroText}>
            High-touch, luxury support services for individuals within the world
            of entertainment and the arts.
          </p>

          <p style={styles.heroText}>
            From production to platform, each service is designed to ensure that
            talent, creators, and professionals are supported with precision,
            discretion, and intention.
          </p>
        </div>
      </section>

      <div style={styles.container}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Traveling Personal Assistant</h3>
          <p style={styles.paragraph}>
            On-site support for production, talent, and creative execution.
          </p>
          <p style={styles.paragraph}>
            This service provides hybrid support, combining personal assistance
            with production coordination for elite clients.
          </p>

          <p style={styles.label}>Scope includes:</p>
          <ul style={styles.list}>
            <li>On-set coordination</li>
            <li>Talent liaison and communication</li>
            <li>Travel planning and accommodation management</li>
            <li>Daily personal support during production or events</li>
            <li>Asset and media handling</li>
          </ul>

          <p style={styles.paragraph}>
            <strong>Availability:</strong> Flexible depending on project needs.
          </p>
          <p style={styles.paragraph}>
            <strong>Travel:</strong> Local, national, and international
            depending on project. Travel expenses covered by client when
            required.
          </p>
          <p style={styles.paragraph}>
            <strong>Communication:</strong> Real-time updates.
          </p>
          <p style={styles.paragraph}>
            <strong>Billing:</strong> Project-based custom quotes.
          </p>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Virtual Assistant</h3>
          <p style={styles.paragraph}>
            Digital support for creators, talent, and platform coordination.
          </p>

          <p style={styles.label}>Scope includes:</p>
          <ul style={styles.list}>
            <li>Talent profile setup and verification</li>
            <li>Creator communication and onboarding</li>
            <li>Content coordination and scheduling</li>
            <li>Administrative support</li>
            <li>Platform-related assistance</li>
            <li>Regular virtual assistant duties</li>
          </ul>

          <p style={styles.paragraph}>
            <strong>Access:</strong> Elite clients receive fuller access and
            real-time support. Standard clients receive structured 9–5 support.
          </p>
          <p style={styles.paragraph}>
            <strong>Communication:</strong> Elite → live updates. Standard →
            end-of-day summaries.
          </p>
          <p style={styles.paragraph}>
            <strong>Billing:</strong> Elite → project-based. Standard → hourly.
          </p>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Web Designer</h3>
          <p style={styles.paragraph}>
            Custom digital presentation aligned with cinematic identity.
          </p>

          <p style={styles.label}>Scope includes:</p>
          <ul style={styles.list}>
            <li>Website design and full website builds</li>
            <li>Page design and layout development</li>
            <li>Branding and visual refinement</li>
            <li>User experience alignment with luxury presentation</li>
            <li>Custom visual direction for projects or platforms</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Virtual Photographer</h3>
          <p style={styles.paragraph}>
            Remote and on-site visual capture for talent and creatives.
          </p>

          <p style={styles.label}>Scope includes:</p>
          <ul style={styles.list}>
            <li>Profile imagery</li>
            <li>Campaign and promotional visuals</li>
            <li>Coordinated shoots</li>
            <li>Integration with platform assets and media</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Red Carpet Interviewer</h3>
          <p style={styles.paragraph}>
            On-location, cinematic interview experience.
          </p>

          <p style={styles.label}>Scope includes:</p>
          <ul style={styles.list}>
            <li>Live on-site interviews</li>
            <li>Talent engagement and coordination</li>
            <li>Cinematic-style questioning and presence</li>
            <li>Content captured for platform or external use</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Interview Services</h3>

          <h4 style={styles.subSectionTitle}>Public / Standard Interviews</h4>
          <ul style={styles.list}>
            <li>1-on-1 interviews</li>
            <li>1 hour</li>
            <li>Cinematic + intimate tone</li>
            <li>Structured, lighter production</li>
            <li>Published to platform for engagement</li>
          </ul>

          <h4 style={styles.subSectionTitle}>Elite Interview Experience</h4>
          <ul style={styles.list}>
            <li>Full production coordination</li>
            <li>High-touch talent support</li>
            <li>Enhanced cinematic execution</li>
            <li>Integrated with Traveling + Virtual Assistant services</li>
            <li>Premium content handling and delivery</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Access &amp; Positioning</h3>
          <p style={styles.paragraph}>
            All services are aligned with The Aset Studio’s core focus:
          </p>
          <p style={styles.paragraph}>
            Entertainment, arts, and creative industries only.
          </p>
          <p style={styles.paragraph}>
            Services are visible publicly, but execution remains curated and
            selective to protect quality and brand integrity.
          </p>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Request Access</h3>
          <p style={styles.paragraph}>
            To inquire about services or begin a project:
          </p>
          <ul style={styles.list}>
            <li>216-474-5705</li>
            <li>DM via Instagram</li>
            <li>theasetstudio@gmail.com</li>
            <li>@theasetstudioofficial</li>
          </ul>
          <p style={styles.paragraph}>
            All engagements are reviewed and confirmed based on scope and
            alignment.
          </p>
        </section>

        <div style={styles.contactBar}>
          <div style={styles.contactItem}>216-474-5705</div>
          <div style={styles.contactItem}>DM via Instagram</div>
          <div style={styles.contactItem}>theasetstudio@gmail.com</div>
          <div style={styles.contactItem}>@theasetstudioofficial</div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerBrand}>THE ASET STUDIO</p>
          <p style={styles.footerTagline}>
            A creative world. Not just a platform.
          </p>

          <div style={styles.footerFounderBlock}>
            <p style={styles.footerFounderTitle}>
              Founder &amp; Creative Director
            </p>
            <p style={styles.footerFounderName}>
              Franchesca Analisa “Sapphire”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Georgia, Times New Roman, serif",
  },

  hero: {
    position: "relative",
    minHeight: "720px",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    borderBottom: "1px solid rgba(201, 159, 74, 0.22)",
  },

  heroImageWrap: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 58%",
    transform: "scale(1)",
    filter: "brightness(0.65)",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.68) 34%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.18) 100%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "620px",
    padding: "110px 24px",
    marginLeft: "max(24px, calc((100vw - 1200px) / 2))",
  },

  eyebrow: {
    margin: "0 0 14px 0",
    color: "#c99f4a",
    letterSpacing: "4px",
    fontSize: "15px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(52px, 8vw, 96px)",
    lineHeight: "0.95",
    letterSpacing: "1px",
    maxWidth: "500px",
  },

  heroLine: {
    width: "74px",
    height: "2px",
    background: "#c99f4a",
    margin: "28px 0",
  },

  heroSubtitle: {
    margin: "0 0 22px 0",
    color: "#d8b06a",
    fontSize: "clamp(26px, 3.2vw, 42px)",
    lineHeight: "1.08",
    maxWidth: "500px",
    fontWeight: "normal",
  },

  heroText: {
    margin: "0 0 18px 0",
    maxWidth: "520px",
    color: "#f0ebe3",
    fontSize: "20px",
    lineHeight: "1.7",
  },

  container: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "90px 24px 90px",
  },

  section: {
    marginTop: "70px",
    paddingBottom: "34px",
    borderBottom: "1px solid rgba(201, 159, 74, 0.12)",
  },

  sectionTitle: {
    fontSize: "38px",
    margin: "0 0 18px 0",
    color: "#fff",
    fontWeight: "600",
  },

  subSectionTitle: {
    fontSize: "26px",
    marginTop: "28px",
    marginBottom: "12px",
    color: "#d8b06a",
    fontWeight: "600",
  },

  label: {
    marginBottom: "10px",
    color: "#e0c188",
    fontWeight: "600",
    fontSize: "18px",
  },

  paragraph: {
    marginBottom: "16px",
    lineHeight: "1.9",
    color: "#ddd6cd",
    fontSize: "18px",
  },

  list: {
    paddingLeft: "24px",
    marginBottom: "18px",
    color: "#d3cbc1",
    lineHeight: "1.95",
    fontSize: "18px",
  },

  contactBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "52px",
    paddingTop: "28px",
    borderTop: "1px solid rgba(201, 159, 74, 0.18)",
  },

  contactItem: {
    border: "1px solid rgba(201, 159, 74, 0.28)",
    borderRadius: "14px",
    padding: "16px 18px",
    color: "#f0ebe3",
    background: "rgba(255,255,255,0.02)",
    fontSize: "16px",
    textAlign: "center",
  },

  footer: {
    marginTop: "70px",
    textAlign: "center",
    color: "#aaa",
    fontSize: "14px",
    paddingTop: "34px",
    borderTop: "1px solid rgba(201, 159, 74, 0.14)",
  },

  footerBrand: {
    margin: "0 0 8px 0",
    color: "#d8b06a",
    letterSpacing: "5px",
    fontSize: "22px",
  },

  footerTagline: {
    margin: "0 0 26px 0",
    color: "#d7c9b7",
    fontStyle: "italic",
    fontSize: "22px",
  },

  footerFounderBlock: {
    marginTop: "18px",
  },

  footerFounderTitle: {
    margin: "0 0 8px 0",
    color: "#c99f4a",
    fontSize: "16px",
    letterSpacing: "1px",
  },

  footerFounderName: {
    margin: 0,
    color: "#ffffff",
    fontSize: "26px",
  },
};