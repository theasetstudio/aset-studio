import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ServicesPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message.trim()) {
      alert("Message required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("inquiries").insert([
      {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error);
      alert("Error sending inquiry");
      return;
    }

    alert("Inquiry sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

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
        {/* Traveling Personal Assistant */}
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
          <p style={styles.paragraph}><strong>Availability:</strong> Flexible</p>
          <p style={styles.paragraph}><strong>Travel:</strong> Local, national, and international</p>
          <p style={styles.paragraph}><strong>Communication:</strong> Real-time updates</p>
          <p style={styles.paragraph}><strong>Billing:</strong> Project-based custom quotes</p>
        </section>

        {/* Virtual Assistant */}
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
            <strong>Access:</strong> Elite clients get live support; standard clients 9–5.
          </p>
          <p style={styles.paragraph}>
            <strong>Billing:</strong> Elite → project-based; Standard → hourly
          </p>
        </section>

        {/* Web Designer */}
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

        {/* Virtual Photographer */}
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

        {/* Red Carpet Interviewer */}
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

        {/* Request Access / Form */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Request Access</h3>
          <ul style={styles.list}>
            <li>216-474-5705</li>
            <li>DM via Instagram (@theasetstudioofficial)</li>
            <li>theasetstudio@gmail.com</li>
          </ul>

          <div style={styles.formWrap}>
            <h4 style={styles.formTitle}>Send a Direct Inquiry</h4>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={styles.textarea}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? "Sending..." : "Request Access"}
            </button>
          </div>
        </section>

        {/* Contact Bar */}
        <div style={styles.contactBar}>
          <div style={styles.contactItem}>216-474-5705</div>
          <div style={styles.contactItem}>DM via Instagram (@theasetstudioofficial)</div>
          <div style={styles.contactItem}>theasetstudio@gmail.com</div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerBrand}>THE ASET STUDIO</p>
          <p style={styles.footerTagline}>A creative world. Not just a platform.</p>
          <p style={styles.footerFounderTitle}>Founder &amp; Creative Director</p>
          <p style={styles.footerFounderName}>Franchesca Analisa “Sapphire”</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "Georgia, serif" },
  hero: { position: "relative", minHeight: "680px", display: "flex", alignItems: "center", overflow: "hidden" },
  heroImageWrap: { position: "absolute", inset: 0, overflow: "hidden" },
  heroImage: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 32%", transform: "scale(0.92)", filter: "brightness(0.65)" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.2) 100%)" },
  heroContent: { position: "relative", zIndex: 2, maxWidth: "600px", padding: "100px 24px" },
  eyebrow: { color: "#c99f4a", letterSpacing: "3px", fontSize: "14px", margin: "0 0 14px 0" },
  heroTitle: { fontSize: "72px", lineHeight: "1", margin: 0 },
  heroLine: { width: "60px", height: "2px", background: "#c99f4a", margin: "20px 0" },
  heroSubtitle: { color: "#d8b06a", fontSize: "28px", margin: "0 0 18px 0" },
  heroText: { color: "#e5ded4", lineHeight: "1.7", fontSize: "18px", marginBottom: "16px" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "80px 24px" },
  section: { marginTop: "70px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "30px" },
  sectionTitle: { fontSize: "30px", margin: "0 0 16px 0" },
  subSectionTitle: { fontSize: "22px", color: "#d8b06a", marginTop: "22px", marginBottom: "10px" },
  paragraph: { fontSize: "16px", color: "#ccc", lineHeight: "1.8", marginBottom: "14px" },
  label: { color: "#d8b06a", marginBottom: "10px", fontWeight: "600" },
  list: { paddingLeft: "20px", lineHeight: "1.9", color: "#ccc", marginBottom: "14px" },
  formWrap: { marginTop: "30px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "640px" },
  formTitle: { margin: "0 0 6px 0", fontSize: "22px", color: "#d8b06a" },
  input: { width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "10px", fontSize: "16px", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: "140px", padding: "14px 16px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "10px", fontSize: "16px", resize: "vertical", boxSizing: "border-box" },
  submitButton: { padding: "14px 20px", background: "#c99f4a", color: "#000", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600", width: "fit-content" },
  contactBar: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "40px" },
  contactItem: { border: "1px solid #333", padding: "12px", textAlign: "center", borderRadius: "10px", color: "#e5ded4" },
  footer: { marginTop: "60px", textAlign: "center" },
  footerBrand: { color: "#c99f4a", letterSpacing: "4px", marginBottom: "8px" },
  footerTagline: { fontStyle: "italic", color: "#ddd", marginBottom: "20px" },
  footerFounderTitle: { color: "#c99f4a", marginBottom: "6px" },
  footerFounderName: { fontSize: "20px", margin: 0 },
};