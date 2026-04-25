import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function Services() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("inquiries")
      .insert([{ name, email, message }]);

    setLoading(false);

    if (error) {
      console.error(error);
      setError("Error sending inquiry. Try again.");
      return;
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return React.createElement(
    "div",
    { className: "services-page" },

    // Hero
    React.createElement(
      "section",
      {
        className: "hero",
        style: {
          backgroundImage: "url(/services-hero.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        },
      },
      React.createElement(
        "div",
        { className: "hero-text" },
        React.createElement("p", { className: "hero-subtitle" }, "SERVICES"),
        React.createElement("h1", { className: "hero-title" }, "THE ASET STUDIO"),
        React.createElement(
          "h2",
          { className: "hero-highlight" },
          "Private Support for Creatives & Talent"
        ),
        React.createElement(
          "p",
          { className: "hero-description" },
          "High-touch, luxury support services for individuals within the world of entertainment and the arts. From production to platform, each service is designed to ensure that talent, creators, and professionals are supported with precision, discretion, and intention."
        )
      )
    ),

    // Services List
    React.createElement(
      "section",
      { className: "services-list" },
      createServiceItem(
        "Traveling Personal Assistant",
        "On-site support for production, talent, and creative execution. Hybrid personal + production coordination for elite clients.",
        [
          "On-set coordination",
          "Talent liaison and communication",
          "Travel planning and accommodation management",
          "Daily personal support during production or events",
          "Asset and media handling",
        ],
        {
          Availability: "Flexible depending on project needs.",
          Travel: "Local, national, and international.",
          Communication: "Real-time updates.",
          Billing: "Project-based custom quotes.",
        }
      ),
      createServiceItem(
        "Virtual Assistant",
        "Digital support for creators, talent, and platform coordination.",
        [
          "Talent profile setup and verification",
          "Creator communication and onboarding",
          "Content coordination and scheduling",
          "Administrative support",
          "Platform-related assistance",
          "Regular virtual assistant duties",
        ],
        {
          Access: "Elite clients get live support; standard clients 9–5.",
          Communication: "Elite → live updates; Standard → end-of-day summaries.",
          Billing: "Elite → project-based; Standard → hourly.",
        }
      ),
      createServiceItem(
        "Web Designer",
        "Custom digital presentation aligned with cinematic identity.",
        [
          "Website design and full website builds",
          "Page design and layout development",
          "Branding and visual refinement",
          "User experience alignment with luxury presentation",
          "Custom visual direction for projects or platforms",
        ]
      ),
      createServiceItem(
        "Virtual Photographer",
        "Remote and on-site visual capture for talent and creatives.",
        [
          "Profile imagery",
          "Campaign and promotional visuals",
          "Coordinated shoots",
          "Integration with platform assets and media",
        ]
      ),
      createServiceItem(
        "Red Carpet Interviewer",
        "On-location, cinematic interview experience.",
        [
          "Live on-site interviews",
          "Talent engagement and coordination",
          "Cinematic-style questioning and presence",
          "Content captured for platform or external use",
        ]
      ),
      createServiceItem(
        "Interview Services",
        "Public / Standard Interviews",
        [
          "1-on-1 interviews",
          "1 hour",
          "Cinematic + intimate tone",
          "Structured, lighter production",
          "Published to platform for engagement",
        ]
      ),
      createServiceItem(
        "Elite Interview Experience",
        "Full production coordination with high-touch support.",
        [
          "High-touch talent support",
          "Enhanced cinematic execution",
          "Integrated with Traveling + Virtual Assistant services",
          "Premium content handling and delivery",
        ]
      )
    ),

    // Request Access Form
    React.createElement(
      "section",
      { className: "request-access" },
      React.createElement("h2", null, "Request Access"),
      React.createElement("p", null, "Contact directly or submit your inquiry below:"),
      React.createElement(
        "ul",
        { className: "contact-list" },
        React.createElement("li", null, "Phone: 216-474-5705"),
        React.createElement("li", null, "DM via Instagram (@theasetstudioofficial)"),
        React.createElement("li", null, "Email: theasetstudio@gmail.com")
      ),
      React.createElement(
        "form",
        { onSubmit: handleSubmit, className: "inquiry-form" },
        React.createElement("input", {
          type: "text",
          placeholder: "Name",
          value: name,
          required: true,
          onChange: (e) => setName(e.target.value),
        }),
        React.createElement("input", {
          type: "email",
          placeholder: "Email (optional)",
          value: email,
          onChange: (e) => setEmail(e.target.value),
        }),
        React.createElement("textarea", {
          placeholder: "Your message",
          value: message,
          required: true,
          onChange: (e) => setMessage(e.target.value),
        }),
        React.createElement(
          "button",
          { type: "submit", disabled: loading },
          loading ? "Sending..." : "Send Inquiry"
        ),
        submitted && React.createElement("p", { className: "success" }, "Inquiry submitted successfully."),
        error && React.createElement("p", { className: "error" }, error)
      )
    ),

    // Footer
    React.createElement(
      "footer",
      { className: "services-footer" },
      React.createElement(
        "div",
        { className: "footer-contact" },
        React.createElement("span", null, "216-474-5705"),
        React.createElement("span", null, "DM via Instagram (@theasetstudioofficial)"),
        React.createElement("span", null, "theasetstudio@gmail.com")
      ),
      React.createElement(
        "p",
        { className: "footer-signature" },
        "THE ASET STUDIO — A creative world. Not just a platform."
      ),
      React.createElement(
        "p",
        { className: "footer-founder" },
        "Founder & Creative Director — Franchesca Analisa \"Sapphire\""
      )
    )
  );
}

// Helper to render a service
function createServiceItem(title, description, items, notes) {
  return React.createElement(
    "div",
    { className: "service-item" },
    React.createElement("h3", null, title),
    React.createElement("p", null, description),
    items &&
      React.createElement(
        "ul",
        null,
        items.map((i, idx) => React.createElement("li", { key: idx }, i))
      ),
    notes &&
      React.createElement(
        "div",
        { className: "notes" },
        Object.entries(notes).map(([key, value]) =>
          React.createElement("p", { key }, React.createElement("strong", null, key + ":"), " ", value)
        )
      )
  );
}

export default Services;