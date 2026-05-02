import React from "react";
import { useParams, Link } from "react-router-dom";
import { spotlightProfiles } from "../data/spotlightProfiles";

export default function SpotlightProfilePage() {
  const { slug } = useParams();

  const profile = Array.isArray(spotlightProfiles)
    ? spotlightProfiles.find((item) => item.slug === slug)
    : null;

  if (!profile) {
    return (
      <main style={{ minHeight: "100vh", padding: "90px 6vw", color: "#fff" }}>
        <h1>Spotlight Profile Not Found</h1>
        <p>This spotlight profile is not available.</p>
        <Link to="/aset-spotlight" style={{ color: "#c9a46a" }}>
          Back to Aset Spotlight
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#fff",
        background:
          "radial-gradient(circle at top left, rgba(201,164,106,0.12), transparent 34%), #050505",
      }}
    >
      <section
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          alignItems: "center",
          gap: "56px",
          padding: "120px 6vw 80px",
        }}
      >
        <div>
          <Link
            to="/aset-spotlight"
            style={{
              color: "#c9a46a",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Back to Aset Spotlight
          </Link>

          <p
            style={{
              marginTop: "42px",
              marginBottom: "18px",
              color: "#c9a46a",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            Aset Spotlight
          </p>

          <h1
            style={{
              fontSize: "clamp(48px, 7vw, 92px)",
              lineHeight: "0.95",
              margin: "0 0 18px",
            }}
          >
            {profile.name}
          </h1>

          <h2
            style={{
              fontSize: "clamp(22px, 3vw, 34px)",
              color: "#c9a46a",
              margin: "0 0 24px",
              fontWeight: "400",
            }}
          >
            {profile.alias}
          </h2>

          <p
            style={{
              maxWidth: "620px",
              color: "#d8d8d8",
              fontSize: "17px",
              lineHeight: "1.8",
              marginBottom: "18px",
            }}
          >
            {profile.role}
          </p>

          <p
            style={{
              maxWidth: "680px",
              color: "#f1f1f1",
              fontSize: "18px",
              lineHeight: "1.8",
              marginBottom: "18px",
            }}
          >
            {profile.focus}
          </p>

          <p
            style={{
              maxWidth: "680px",
              color: "#bdbdbd",
              fontSize: "16px",
              lineHeight: "1.85",
            }}
          >
            {profile.bio}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: "620px",
            borderRadius: "34px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 35px 90px rgba(0,0,0,0.55)",
          }}
        >
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt={profile.name}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "620px",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72), transparent 55%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "28px",
              right: "28px",
              bottom: "28px",
            }}
          >
            <p
              style={{
                color: "#c9a46a",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize: "11px",
                marginBottom: "8px",
              }}
            >
              Featured Presence
            </p>

            <h3 style={{ fontSize: "28px", margin: 0 }}>{profile.alias}</h3>
          </div>
        </div>
      </section>
    </main>
  );
}