import React, { useState } from "react";
import "./ServicesPage.css";
import heroImg from "./services-hero.png";
import { supabase } from "../supabaseClient"; // adjust path if needed

export default function ServicesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    service_interest: "",
    project_scope: "",
    budget_range: "",
    timeline: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    if (
      !form.name ||
      !form.service_interest ||
      !form.project_scope ||
      !form.budget_range ||
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
          budget_range: form.budget_range,
          timeline: form.timeline,
          message: form.message,
        },
      ]);

      if (error) throw error;

      setStatus("Application received. Our team will review your request.");

      setForm({
        name: "",
        email: "",
        instagram: "",
        service_interest: "",
        project_scope: "",
        budget_range: "",
        timeline: "",
        message: "",
      });
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

        {/* ROW 1 */}
        <section className="service-grid">
          <article className="service-card">
            <h2>Traveling Personal Assistant</h2>
            <p>On-site support for production, talent, and creative execution.</p>
            <ul>
              <li>On-set coordination</li>
              <li>Talent liaison and communication</li>
              <li>Travel planning and accommodation management</li>
              <li>Daily personal support during production or events</li>
              <li>Asset and media handling</li>
            </ul>
            <p><strong>Availability:</strong> Flexible depending on project needs.</p>
            <p><strong>Travel:</strong> Local, national, and international.</p>
            <p><strong>Communication:</strong> Real-time updates.</p>
            <p><strong>Billing:</strong> Project-based custom quotes.</p>
          </article>

          <article className="service-card">
            <h2>Virtual Assistant</h2>
            <p>Digital support for creators, talent, and platform coordination.</p>
            <ul>
              <li>Talent profile setup and verification</li>
              <li>Creator communication and onboarding</li>
              <li>Content coordination and scheduling</li>
              <li>Administrative support</li>
              <li>Platform-related assistance</li>
              <li>Regular virtual assistant duties</li>
            </ul>
            <p><strong>Access:</strong> Elite clients get live support; standard clients 9–5.</p>
            <p><strong>Communication:</strong> Elite — live updates; Standard — summaries.</p>
            <p><strong>Billing:</strong> Elite — project-based; Standard — hourly.</p>
          </article>
        </section>

        {/* ROW 2 */}
        <section className="service-grid">
          <article className="service-card">
            <h2>Web Designer</h2>
            <p>Custom digital presentation aligned with cinematic identity.</p>
            <ul>
              <li>Website design and full builds</li>
              <li>Page design and layout</li>
              <li>Branding and visual refinement</li>
              <li>Luxury UX alignment</li>
              <li>Creative direction</li>
            </ul>
          </article>

          <article className="service-card">
            <h2>Virtual Photographer</h2>
            <p>Remote and on-site visual capture for talent and creatives.</p>
            <ul>
              <li>Profile imagery</li>
              <li>Campaign visuals</li>
              <li>Coordinated shoots</li>
              <li>Platform media integration</li>
            </ul>
          </article>
        </section>

        {/* ROW 3 */}
        <section className="service-grid">
          <article className="service-card">
            <h2>Red Carpet Interviewer</h2>
            <p>On-location, cinematic interview experience.</p>
            <ul>
              <li>Live on-site interviews</li>
              <li>Talent engagement</li>
              <li>Cinematic questioning</li>
              <li>Platform-ready content</li>
            </ul>
          </article>

          <article className="service-card">
            <h2>Social Media Manager</h2>
            <p>Strategic digital presence for talent and brands.</p>
            <ul>
              <li>Content planning and scheduling</li>
              <li>Growth strategy</li>
              <li>Audience engagement</li>
              <li>Brand alignment</li>
              <li>Performance tracking</li>
            </ul>
          </article>
        </section>

        {/* INTAKE FUNNEL */}
        <section className="inquiry-section">
          <h2>Apply for Private Access</h2>

          <form onSubmit={handleSubmit}>

            <select name="service_interest" value={form.service_interest} onChange={handleChange}>
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

            <select name="budget_range" value={form.budget_range} onChange={handleChange}>
              <option value="">Select Budget Range</option>
              <option>$500 - $1,000</option>
              <option>$1,000 - $3,000</option>
              <option>$3,000 - $7,000</option>
              <option>$7,000+</option>
            </select>

            <select name="timeline" value={form.timeline} onChange={handleChange}>
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