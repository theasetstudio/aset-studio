// src/pages/ServicesPage.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./ServicesPage.css";

export default function ServicesPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: supaError } = await supabase
      .from("inquiries")
      .insert([{ name: form.name, email: form.email, message: form.message }]);

    setLoading(false);
    if (supaError) {
      setError("Error sending inquiry. Try again later.");
      return;
    }

    setSuccess("Inquiry sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="services-page">
      {/* Hero */}
      <section className="hero">
        <img src="/services-hero.png" alt="Services Hero" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-text">
          <span className="small">SERVICES</span>
          <h1>The Aset Studio</h1>
          <h3>Private Support for Creatives & Talent</h3>
          <p>
            High-touch, luxury support services for individuals within the
            world of entertainment and the arts. Each service is designed to
            ensure talent, creators, and professionals are supported with
            precision, discretion, and intention.
          </p>
        </div>
      </section>

      {/* Services */}
      <main className="services-list">
        <ServiceItem
          title="Traveling Personal Assistant"
          description="On-site support for production, talent, and creative execution."
          items={[
            "On-set coordination",
            "Talent liaison and communication",
            "Travel planning and accommodation management",
            "Daily personal support during production or events",
            "Asset and media handling",
          ]}
          notes={{
            Availability: "Flexible depending on project needs",
            Travel: "Local, national, and international",
            Communication: "Real-time updates",
            Billing: "Project-based custom quotes",
          }}
        />

        <ServiceItem
          title="Virtual Assistant"
          description="Digital support for creators, talent, and platform coordination."
          items={[
            "Talent profile setup and verification",
            "Creator communication and onboarding",
            "Content coordination and scheduling",
            "Administrative support",
            "Platform-related assistance",
            "Regular virtual assistant duties",
          ]}
          notes={{
            Access: "Elite → live support, Standard → 9–5",
            Communication: "Elite → live updates, Standard → daily summary",
            Billing: "Elite → project-based, Standard → hourly",
          }}
        />

        <ServiceItem
          title="Web Designer"
          description="Custom digital presentation aligned with cinematic identity."
          items={[
            "Website design and full website builds",
            "Page design and layout development",
            "Branding and visual refinement",
            "User experience alignment with luxury presentation",
            "Custom visual direction for projects or platforms",
          ]}
        />

        <ServiceItem
          title="Virtual Photographer"
          description="Remote and on-site visual capture for talent and creatives."
          items={[
            "Profile imagery",
            "Campaign and promotional visuals",
            "Coordinated shoots",
            "Integration with platform assets and media",
          ]}
        />

        <ServiceItem
          title="Red Carpet Interviewer"
          description="On-location, cinematic interview experience."
          items={[
            "Live on-site interviews",
            "Talent engagement and coordination",
            "Cinematic-style questioning and presence",
            "Content captured for platform or external use",
          ]}
        />
      </main>

      {/* Inquiry */}
      <section className="inquiry-section">
        <h2>Request Access</h2>
        <p>Contact directly or submit your inquiry below:</p>
        <ul>
          <li>Phone: 216-474-5705</li>
          <li>DM via Instagram (@theasetstudioofficial)</li>
          <li>Email: theasetstudio@gmail.com</li>
        </ul>
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
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit">{loading ? "Sending..." : "Send Inquiry"}</button>
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      {/* Footer */}
      <footer>
        <p>
          The Aset Studio — A creative world. Not just a platform.
          <br />
          Founder & Creative Director — Franchesca Analisa “Sapphire”
        </p>
      </footer>
    </div>
  );
}

function ServiceItem({ title, description, items, notes }) {
  return (
    <section className="service">
      <h2>{title}</h2>
      <p>{description}</p>
      {items && (
        <ul>
          {items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      )}
      {notes && (
        <div className="notes">
          {Object.entries(notes).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}