import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function BeautyApplyPage() {
  const [formData, setFormData] = useState({
    applicationType: "",
    name: "",
    category: "",
    country: "",
    stateRegion: "",
    city: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    portfolioLink: "",
    introduction: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = {
      application_type: formData.applicationType,
      name: formData.name,
      category: formData.category,
      country: formData.country,
      state_region: formData.stateRegion,
      city: formData.city,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      instagram: formData.instagram,
      portfolio_link: formData.portfolioLink,
      introduction: formData.introduction,
      application_status: "pending",
    };

    const { error } = await supabase.from("beauty_applications").insert([payload]);

    if (error) {
      console.error("Beauty application error:", error);
      setMessage("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setMessage("Application received. Your submission is now pending review.");

    setFormData({
      applicationType: "",
      name: "",
      category: "",
      country: "",
      stateRegion: "",
      city: "",
      email: "",
      phone: "",
      website: "",
      instagram: "",
      portfolioLink: "",
      introduction: "",
    });

    setSubmitting(false);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <p style={styles.breadcrumb}>
            The Aset Studio / Collectives / Aset Beauty Collective
          </p>

          <h1 style={styles.title}>Apply for Consideration</h1>

          <p style={styles.subtitle}>
            Submit your information for review to be considered for inclusion in
            Aset Beauty Collective.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Applying As</label>

            <select
              name="applicationType"
              value={formData.applicationType}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select one</option>
              <option value="professional">Beauty Professional</option>
              <option value="company">Beauty Company / Team</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Name / Company Name</label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter name"
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select category</option>
              <option value="Makeup Artist">Makeup Artist</option>
              <option value="Hairstylist">Hairstylist</option>
              <option value="Wig Artist">Wig Artist</option>
              <option value="Grooming Artist">Grooming Artist</option>
              <option value="Nail Artist">Nail Artist</option>
              <option value="SFX Makeup Artist">SFX Makeup Artist</option>
              <option value="Beauty Company / Team">
                Beauty Company / Team
              </option>
            </select>
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Country</label>

              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={styles.input}
                placeholder="United States"
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>State / Region</label>

              <input
                name="stateRegion"
                value={formData.stateRegion}
                onChange={handleChange}
                style={styles.input}
                placeholder="Georgia"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>City</label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="Atlanta"
                required
              />
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="email@example.com"
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone</label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="Optional"
              />
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Website</label>

              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={styles.input}
                placeholder="https://..."
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Instagram</label>

              <input
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                style={styles.input}
                placeholder="@username"
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Portfolio Link</label>

            <input
              name="portfolioLink"
              value={formData.portfolioLink}
              onChange={handleChange}
              style={styles.input}
              placeholder="Website, Instagram, YouTube, Vimeo, or portfolio link"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Short Introduction</label>

            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Tell us about your work, experience, and focus."
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Consideration"}
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#f6f1e8",
    fontFamily: "inherit",
  },

  hero: {
    position: "relative",
    minHeight: "64vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "130px 24px 80px",
    background:
      "linear-gradient(135deg, #050505 0%, #160f0c 45%, #302018 100%)",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(201,166,107,0.18), transparent 45%)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "900px",
    textAlign: "center",
  },

  breadcrumb: {
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontSize: "0.68rem",
    color: "#c9a66b",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(3rem, 7vw, 6.4rem)",
    lineHeight: 0.95,
    margin: "0 0 26px",
    fontWeight: 500,
  },

  subtitle: {
    maxWidth: "720px",
    margin: "0 auto",
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "rgba(246,241,232,0.78)",
  },

  section: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "80px 24px 120px",
  },

  form: {
    border: "1px solid rgba(201,166,107,0.24)",
    background: "rgba(255,255,255,0.03)",
    padding: "32px",
  },

  message: {
    marginBottom: "24px",
    padding: "14px",
    border: "1px solid rgba(201,166,107,0.35)",
    color: "#f6f1e8",
    background: "rgba(201,166,107,0.08)",
    lineHeight: 1.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  fieldGroup: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#c9a66b",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: "0.68rem",
  },

  input: {
    width: "100%",
    padding: "14px",
    background: "#0b0b0b",
    color: "#f6f1e8",
    border: "1px solid rgba(201,166,107,0.3)",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "14px",
    background: "#0b0b0b",
    color: "#f6f1e8",
    border: "1px solid rgba(201,166,107,0.3)",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  button: {
    marginTop: "10px",
    padding: "15px 28px",
    background: "transparent",
    border: "1px solid rgba(201,166,107,0.8)",
    color: "#f6f1e8",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontSize: "0.76rem",
    cursor: "pointer",
  },
};