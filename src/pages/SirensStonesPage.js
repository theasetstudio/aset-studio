// src/pages/SirensStonesPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function SirensStonesPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        color: "white",
        padding: "48px 20px",
        background:
          "radial-gradient(70% 60% at 50% 18%, rgba(120,90,255,0.18), rgba(0,0,0,1) 72%)",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ letterSpacing: 3, fontSize: 12, opacity: 0.85 }}>
          SIRENS REALM
        </div>

        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 56,
            lineHeight: 1.05,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Stones &amp; Minerals
        </h1>

        <p style={{ maxWidth: 760, opacity: 0.85, fontSize: 16, lineHeight: 1.7 }}>
          A field guide for mystics and conjurers — how stones carry memory, frequency, and spiritual function.
          This section will grow into detailed entries, cleansing methods, and pairing guidance.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <Link
            to="/sirens-realm"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ← Back to Sirens Realm
          </Link>

          <Link
            to="/gallery?category=Sirens%20Realm"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Return to Gallery
          </Link>
        </div>

        {/* ✅ Keep it elegant: one clean section */}
        <div
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ fontWeight: 800, letterSpacing: "0.01em", marginBottom: 10 }}>
            Coming Entries
          </div>

          <div style={{ opacity: 0.92, lineHeight: 1.8 }}>
            • Obsidian — protection &amp; shadow work<br />
            • Amethyst — intuition &amp; dream gates<br />
            • Rose Quartz — devotion &amp; heart repair<br />
            • Citrine — prosperity &amp; solar power<br />
            • Black Tourmaline — warding &amp; grounding
          </div>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.7 }}>
            More entries will be added as Sirens Realm expands.
          </div>
        </div>
      </div>
    </div>
  );
}