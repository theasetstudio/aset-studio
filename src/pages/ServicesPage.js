import React from "react";
import "./ServicesPage.css";
import heroImg from "./services-hero.png"; // make sure this image is in src/pages

const ServicesPage = () => {
  return (
    <div className="services-page">
      {/* HERO SECTION */}
      <div className="services-hero">
        <img src={heroImg} alt="The Aset Studio Hero" className="hero-img" />
        <div className="hero-text">
          <h2>SERVICES</h2>
          <h1>The Aset Studio</h1>
          <h3>Private Support for Creatives & Talent</h3>
          <p>
            High-touch, luxury support services for individuals within the world of
            entertainment and the arts. Each service is designed to ensure that talent,
            creators, and professionals are supported with precision, discretion, and
            intention.
          </p>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="services-list">
        <div className="service-columns">
          <div className="service-item">
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
          </div>

          <div className="service-item">
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
            <p><strong>Communication:</strong> Elite — live updates; Standard — end-of-day summaries.</p>
            <p><strong>Billing:</strong> Elite — project-based; Standard — hourly.</p>
          </div>
        </div>

        {/* Additional services (single-column) */}
        <div className="service-item">
          <h2>Web Designer</h2>
          <p>Custom digital presentation aligned with cinematic identity.</p>
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
          <p>Remote and on-site visual capture for talent and creatives.</p>
          <ul>
            <li>Profile imagery</li>
            <li>Campaign and promotional visuals</li>
            <li>Coordinated shoots</li>
            <li>Integration with platform assets and media</li>
          </ul>
        </div>

        <div className="service-item">
          <h2>Red Carpet Interviewer</h2>
          <p>On-location, cinematic interview experience.</p>
          <ul>
            <li>Live on-site interviews</li>
            <li>Talent engagement and coordination</li>
            <li>Cinematic-style questioning and presence</li>
            <li>Content captured for platform or external use</li>
          </ul>
        </div>
      </div>

      {/* INQUIRY FORM */}
      <div className="inquiry-section">
        <h2>Request Access</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email (optional)" />
          <textarea placeholder="Your message" rows="5"></textarea>
          <button type="submit">Send Inquiry</button>
        </form>
      </div>

      <footer>
        <p>The Aset Studio — A creative world. Not just a platform.</p>
        <p>Founder & Creative Director — Franchesca Analisa “Sapphire”</p>
      </footer>
    </div>
  );
};

export default ServicesPage;