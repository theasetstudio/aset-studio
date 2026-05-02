import React from "react";
import { useParams } from "react-router-dom";
import { spotlightProfiles } from "../data/spotlightProfiles";

export default function SpotlightProfilePage() {
  const { slug } = useParams();

  const profile = spotlightProfiles.find((p) => p.slug === slug);

  if (!profile) {
    return (
      <div style={{ padding: 100, color: "white" }}>
        Profile not found.
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <img
          src={profile.image}
          alt={`${profile.name} portrait`}
          style={styles.heroImage}
        />

        <div style={styles.overlay} />

        <div style={styles.heroContent}>
          <div style={styles.status}>{profile.status}</div>

          <h1 style={styles.name}>
            {profile.name}
            <br />
            <span style={styles.alias}>{profile.alias}</span>
          </h1>

          <div style={styles.role}>{profile.role}</div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.inner}>
          <p style={styles.bio}>{profile.bio}</p>

          <div style={styles.tags}>
            {profile.focus.map((tag) => (
              <span key={tag} style={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    background: "#050507",
    color: "#f2f0ea",
  },

  hero: {
    position: "relative",
    height: "90vh",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, #050507, transparent)",
  },

  heroContent: {
    position: "absolute",
    bottom: 60,
    left: 40,
  },

  status: {
    color: "gold",
    fontSize: 12,
  },

  name: {
    fontSize: 60,
    lineHeight: 1.1,
  },

  alias: {
    fontSize: 28,
    opacity: 0.6,
  },

  role: {
    marginTop: 10,
    color: "gold",
  },

  section: {
    padding: "80px 20px",
  },

  inner: {
    maxWidth: 1000,
    margin: "0 auto",
  },

  bio: {
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 30,
  },

  tags: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  tag: {
    border: "1px solid gold",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
};