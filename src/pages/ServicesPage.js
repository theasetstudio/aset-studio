// src/pages/ServicesPage.js
import React, { useState } from "react";
import "./ServicesPage.css";
import heroImg from "./services-hero.png"; // ensure this file is in src/pages

export default function ServicesPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!form.name || !form.message) {
      setStatus("error");
      return;
    }

    try {
      // Add your API or Supabase submission here
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="services-page">
      {/* HERO SECTION */}
      <section
        className="services-hero"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2>SERVICES</h2>
        <h1>The Aset Studio</h1>
        <h3>Private Support for Creatives & Talent</h3>
        <p>
          High-touch, luxury support services for individuals within the world
          of entertainment and the arts. Each service is designed to ensure that
          talent, creators, and professionals are supported with precision,
          discretion, and intention.
        </p>
      </section>

      {/* SERVICES LIST */}
      <section className="services-list">
        <div className="service-columns">
          <div className="service-item">
            <h2>Traveling Personal Assistant</h2>
            <ul>
              <li>On-set coordination</li>
              <li>Talent liaison and communication</li>
              <li>Travel planning and accommodation management</li>
              <li>Daily personal support during production or events</li>
              <li>Asset and media handling</li>
            </ul>
          </div>

          <div className="service-item">
            <h2>Virtual Assistant</h2>
            <ul>
              <li>Talent profile setup and verification</li>
              <li>Creator communication and onboarding</li>
              <li>Content coordination and scheduling</li>
              <li>Administrative support</li>
              <li>Platform-related assistance</li>
              <li>Regular virtual assistant duties</li>
            </ul>
          </div>
        </div>

        <div className="service-item">
          <h2>Web Designer</h2>
          <ul>
            <li>Website design and full website builds</li>
            <li>Page design and layout development</li>
            <li>Branding and visual refinement</li>
            <li>User experience alignment with luxury presentation</li>
            <li>Custom visual direction for projects or platforms</li>
          </ul>
        </div>

        <div className="service-item">
          <h2>Virtual Photographer</h2>
          <ul>
            <li>Profile imagery</li>
            <li>Campaign and promotional visuals</li>
            <li>Coordinated shoots</li>
            <li>Integration with platform assets and media</li>
          </ul>
        </div>

        <div className="service-item">
          <h2>Red Carpet Interviewer</h2>
          <ul>
            <li>Live on-site interviews</li>
            <li>Talent engagement and coordination</li>
            <li>Cinematic-style questioning and presence</li>
            <li>Content captured for platform or external use</li>
          </ul>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="inquiry-section">
        <h2>Request Access</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Inquiry</button>
        </form>
        {status === "success" && <p className="success">Message sent!</p>}
        {status === "error" && <p className="error">Please fill all required fields.</p>}
      </section>

      <footer>
        <p>The Aset Studio — A creative world. Not just a platform.</p>
        <p>Founder & Creative Director — Franchesca Analisa “Sapphire”</p>
      </footer>
    </div>
  );
}