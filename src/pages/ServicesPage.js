import React, { useState } from "react";
import "./ServicesPage.css";
import heroImg from "./services-hero.png";
import { supabase } from "../supabaseClient";

export default function ServicesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    service_interest: "",
    project_scope: "",
    timeline: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // NEW

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.service_interest ||
      !form.project_scope ||
      !form.timeline
    ) {
      setStatus("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const { error } = await supabase.from("service_applications").insert([
        {
          name: form.name,
          email: form.email,
          instagram: form.instagram,
          service_interest: form.service_interest,
          project_scope: form.project_scope,
          budget_range: "Not collected",
          timeline: form.timeline,
          message: form.message,
        },
      ]);

      if (error) throw error;

      setSubmitted(true); // TRIGGER CONFIRMATION VIEW
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="services-page">

      {/* HERO */}
      <section className="services-hero">
        <div className="services-hero-copy">
          <p className="services-kicker">SERVICES</p>
          <h1>The Aset Studio</h1>
          <h2>Private Support for Creatives & Talent</h2>
          <p>
            High-touch, luxury support services for individuals within the world of
            entertainment and the arts. Each service is designed to ensure that talent,
            creators, and professionals are supported with precision, discretion, and intention.
          </p>
        </div>

        <div className="services-hero-image-wrap">
          <img src={heroImg} alt="Aset Studio Services" />
        </div>
      </section>

      {/* CONTENT */}
      <main className="services-content">

        {/* SERVICE SECTIONS (unchanged) */}
        {/* ...KEEP EVERYTHING ABOVE EXACTLY THE SAME... */}

        {/* INTAKE SECTION */}
        <section className="inquiry-section">

          {!submitted ? (
            <>
              <h2>Apply for Private Access</h2>

              <form onSubmit={handleSubmit}>
                <select
                  name="service_interest"
                  value={form.service_interest}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>
                  <option>Traveling Personal Assistant</option>
                  <option>Virtual Assistant</option>
                  <option>Web Designer</option>
                  <option>Virtual Photographer</option>
                  <option>Red Carpet Interviewer</option>
                  <option>Social Media Manager</option>
                </select>

                <textarea
                  name="project_scope"
                  placeholder="Describe your project or needs"
                  value={form.project_scope}
                  onChange={handleChange}
                />

                <select
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select Timeline</option>
                  <option>Immediate</option>
                  <option>Within 30 days</option>
                  <option>1–3 months</option>
                  <option>Flexible</option>
                </select>

                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                <input
                  name="instagram"
                  placeholder="Instagram (optional)"
                  value={form.instagram}
                  onChange={handleChange}
                />

                <textarea
                  name="message"
                  placeholder="Additional details (optional)"
                  value={form.message}
                  onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>

                {status && <p className="form-status">{status}</p>}
              </form>
            </>
          ) : (
            // 🔥 CINEMATIC CONFIRMATION STATE
            <div className="confirmation-state">
              <h2>Application Received</h2>
              <p>
                Your request has been entered into The Aset Studio system.
              </p>
              <p>
                Submissions are reviewed privately. Approved clients will be contacted directly.
              </p>
            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="services-footer">
        <p>The Aset Studio — A creative world. Not just a platform.</p>
        <p>Founder & Creative Director — Franchesca Analisa “Sapphire”</p>
      </footer>

    </div>
  );
}