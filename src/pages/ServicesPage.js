import React, { useState } from "react";
import "./ServicesPage.css";
import heroImg from "./services-hero.png";
import { supabase } from "../supabaseClient";

const services = [
  {
    title: "Traveling Personal Assistant",
    intro: "On-site support for production, talent, and creative execution.",
    bullets: [
      "On-set coordination",
      "Talent liaison and communication",
      "Travel planning and accommodation management",
      "Daily personal support during production or events",
      "Asset and media handling",
    ],
    details: [
      "Availability: Flexible depending on project needs.",
      "Travel: Local, national, and international.",
      "Communication: Real-time updates.",
      "Billing: Project-based custom quotes.",
    ],
  },
  {
    title: "Virtual Assistant",
    intro: "Digital support for creators, talent, and platform coordination.",
    bullets: [
      "Talent profile setup and verification",
      "Creator communication and onboarding",
      "Content coordination and scheduling",
      "Administrative support",
      "Platform-related assistance",
      "Regular virtual assistant duties",
    ],
    details: [
      "Access: Elite clients get live support; standard clients 9–5.",
      "Communication: Elite live updates; Standard summaries.",
      "Billing: Elite project-based; Standard hourly.",
    ],
  },
  {
    title: "Web Designer",
    intro: "Custom digital presentation aligned with cinematic identity.",
    bullets: [
      "Website design and full builds",
      "Page design and layout",
      "Branding and visual refinement",
      "Luxury UX alignment",
      "Creative direction",
    ],
  },
  {
    title: "Virtual Photographer",
    intro: "Remote and on-site visual capture for talent and creatives.",
    bullets: [
      "Profile imagery",
      "Campaign visuals",
      "Coordinated shoots",
      "Platform media integration",
    ],
  },
  {
    title: "Red Carpet Interviewer",
    intro: "Cinematic interview support for events, premieres, and talent moments.",
    bullets: [
      "Live on-site interviews",
      "Talent engagement",
      "Cinematic questioning",
      "Platform-ready content",
    ],
  },
  {
    title: "Social Media Manager",
    intro: "Controlled digital presence support for talent, creators, and brands.",
    bullets: [
      "Content planning and scheduling",
      "Growth strategy",
      "Audience engagement",
      "Brand alignment",
      "Performance tracking",
    ],
  },
];

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
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.service_interest || !form.project_scope || !form.timeline) {
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

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-copy">
          <p className="services-kicker">SERVICES</p>
          <h1>The Aset Studio</h1>
          <h2>Private Support for Creatives & Talent</h2>
          <p>
            High-touch, luxury support services for individuals within the world
            of entertainment and the arts. Each service is designed to ensure
            that talent, creators, and professionals are supported with
            precision, discretion, and intention.
          </p>
        </div>

        <div className="services-hero-image-wrap">
          <img src={heroImg} alt="Aset Studio Services" />
        </div>
      </section>

      <main className="services-content">
        <section className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.intro}</p>

              <ul>
                {service.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {service.details?.map((detail) => (
                <p key={detail}>
                  <strong>{detail.split(":")[0]}:</strong>
                  {detail.includes(":") ? ` ${detail.split(":").slice(1).join(":").trim()}` : ""}
                </p>
              ))}
            </article>
          ))}
        </section>

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
                  {services.map((service) => (
                    <option key={service.title}>{service.title}</option>
                  ))}
                </select>

                <textarea
                  name="project_scope"
                  placeholder="Describe your project or needs"
                  value={form.project_scope}
                  onChange={handleChange}
                />

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
            </>
          ) : (
            <div className="confirmation-state">
              <h2>Application Received</h2>
              <p>Your request has been entered into The Aset Studio system.</p>
              <p>
                Submissions are reviewed privately. Approved clients will be
                contacted directly.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="services-footer">
        <p>The Aset Studio — A creative world. Not just a platform.</p>
        <p>Founder & Creative Director — Franchesca Analisa “Sapphire”</p>
      </footer>
    </div>
  );
}