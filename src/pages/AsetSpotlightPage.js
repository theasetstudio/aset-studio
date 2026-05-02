import React from "react";
import { Link } from "react-router-dom";
import { spotlightProfiles } from "../data/spotlightProfiles";

export default function AsetSpotlightPage() {
  const profile = Array.isArray(spotlightProfiles) ? spotlightProfiles[0] : null;

  if (!profile) {
    return (
      <main style={{ minHeight: "100vh", padding: "80px 6vw", color: "#fff" }}>
        <h1>Aset Spotlight</h1>
        <p>No spotlight profiles are available right now.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "90px 6vw",
        color: "#fff",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#c9a46a",
            fontSize: "12px",
            marginBottom: "14px",
          }}
        >
          Aset Spotlight
        </p>

        <h1 style={{ fontSize: "46px", marginBottom: "36px" }}>
          Featured Presence
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "42px",
            alignItems: "center",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.035)",
          }}
        >
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt={profile.name}
              style={{
                width: "100%",
                borderRadius: "16px",
                objectFit: "cover",
              }}
            />
          )}

          <div>
            <h2 style={{ fontSize: "34px", marginBottom: "10px" }}>
              {profile.name}
            </h2>

            <p style={{ color: "#c9a46a", marginBottom: "10px" }}>
              {profile.alias}
            </p>

            <p style={{ color: "#d6d6d6", marginBottom: "16px" }}>
              {profile.role}
            </p>

            <p
              style={{
                maxWidth: "680px",
                lineHeight: "1.7",
                color: "#e5e5e5",
                marginBottom: "26px",
              }}
            >
              {profile.bio}
            </p>

            <Link
              to={`/aset-spotlight/${profile.slug}`}
              style={{
                display: "inline-block",
                color: "#000",
                background: "#c9a46a",
                padding: "12px 18px",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              View Spotlight Profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}