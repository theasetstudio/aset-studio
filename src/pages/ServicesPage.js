import React from "react";

export default function ServicesPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>SERVICES — THE ASET STUDIO</h1>

        <h2 style={styles.subtitle}>Private Support for Creatives & Talent</h2>

        <p style={styles.paragraph}>
          The Aset Studio offers high-touch, luxury support services for individuals within the world of entertainment and the arts.
        </p>

        <p style={styles.paragraph}>
          From production to platform, each service is designed to ensure that talent, creators, and professionals are supported with precision, discretion, and intention.
        </p>

        {/* Traveling Personal Assistant */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Traveling Personal Assistant</h3>
          <p style={styles.paragraph}>
            On-site support for production, talent, and creative execution.
          </p>
          <p style={styles.paragraph}>
            This service provides hybrid support, combining personal assistance with production coordination for elite clients.
          </p>

          <ul style={styles.list}>
            <li>On-set coordination</li>
            <li>Talent liaison and communication</li>
            <li>Travel planning and accommodation management</li>
            <li>Daily personal support during production or events</li>
            <li>Asset and media handling</li>
          </ul>

          <p style={styles.paragraph}><strong>Availability:</strong> Flexible depending on project needs</p>
          <p style={styles.paragraph}><strong>Travel:</strong> Local, national, and international depending on project. Travel expenses covered by client when required</p>
          <p style={styles.paragraph}><strong>Communication:</strong> Real-time updates</p>
          <p style={styles.paragraph}><strong>Billing:</strong> Project-based custom quotes</p>
        </section>

        {/* Virtual Assistant */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Virtual Assistant</h3>
          <p style={styles.paragraph}>
            Digital support for creators, talent, and platform coordination.
          </p>

          <ul style={styles.list}>
            <li>Talent profile setup and verification</li>
            <li>Creator communication and onboarding</li>
            <li>Content coordination and scheduling</li>
            <li>Administrative support</li>
            <li>Platform-related assistance</li>
            <li>Regular virtual assistant duties</li>
          </ul>

          <p style={styles.paragraph}><strong>Access:</strong></p>
          <ul style={styles.list}>
            <li>Elite clients receive fuller access and real-time support</li>
            <li>Standard clients receive structured 9–5 support</li>
          </ul>

          <p style={styles.paragraph}><strong>Communication:</strong></p>
          <ul style={styles.list}>
            <li>Elite → live updates</li>
            <li>Standard → end-of-day summaries</li>
          </ul>

          <p style={styles.paragraph}><strong>Billing:</strong></p>
          <ul style={styles.list}>
            <li>Elite → project-based</li>
            <li>Standard → hourly</li>
          </ul>
        </section>

        {/* Web Designer */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Web Designer</h3>
          <p style={styles.paragraph}>
            Custom digital presentation aligned with cinematic identity.
          </p>

          <ul style={styles.list}>
            <li>Page design and layout development</li>
            <li>Branding and visual refinement</li>
            <li>User experience alignment with luxury presentation</li>
            <li>Custom visual direction for projects or platforms</li>
          </ul>
        </section>

        {/* Virtual Photographer */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Virtual Photographer</h3>
          <p style={styles.paragraph}>
            Remote and on-site visual capture for talent and creatives.
          </p>

          <ul style={styles.list}>
            <li>Profile imagery</li>
            <li>Campaign and promotional visuals</li>
            <li>Coordinated shoots</li>
            <li>Integration with platform assets and media</li>
          </ul>
        </section>

        {/* Red Carpet Interviewer */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Red Carpet Interviewer</h3>
          <p style={styles.paragraph}>
            On-location, cinematic interview experience.
          </p>

          <ul style={styles.list}>
            <li>Live on-site interviews</li>
            <li>Talent engagement and coordination</li>
            <li>Cinematic-style questioning and presence</li>
            <li>Content captured for platform or external use</li>
          </ul>
        </section>

        {/* Interview Services */}
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

        {/* Access & Positioning */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Access & Positioning</h3>
          <p style={styles.paragraph}>
            All services are aligned with The Aset Studio’s core focus:
          </p>
          <p style={styles.paragraph}>
            Entertainment, arts, and creative industries only.
          </p>
          <p style={styles.paragraph}>
            Services are visible publicly, but execution remains curated and selective to protect quality and brand integrity.
          </p>
        </section>

        {/* Request Access */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Request Access</h3>
          <p style={styles.paragraph}>
            To inquire about services or begin a project:
          </p>
          <ul style={styles.list}>
            <li>direct contact</li>
            <li>or request access through the platform</li>
          </ul>
          <p style={styles.paragraph}>
            All engagements are reviewed and confirmed based on scope and alignment.
          </p>
        </section>

        {/* Brand Close */}
        <div style={styles.footer}>
          <p>The Aset Studio</p>
          <p>A creative world.</p>
          <p>Not just a platform.</p>
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
    padding: "60px 20px",
    fontFamily: "serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    letterSpacing: "2px",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#ccc",
  },
  section: {
    marginTop: "40px",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  subSectionTitle: {
    fontSize: "18px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  paragraph: {
    marginBottom: "12px",
    lineHeight: "1.6",
    color: "#ddd",
  },
  list: {
    paddingLeft: "20px",
    marginBottom: "15px",
    color: "#ccc",
  },
  footer: {
    marginTop: "60px",
    textAlign: "center",
    color: "#aaa",
    fontSize: "14px",
  },
};