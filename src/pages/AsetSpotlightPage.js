import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AsetSpotlightPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("spotlight_profiles")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading spotlight profiles:", error);
        setProfiles([]);
        setLoading(false);
        return;
      }

      setProfiles(data || []);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.kicker}>Aset Spotlight</p>
        <h1 style={styles.title}>Loading Spotlight Profiles...</h1>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrap}>
        <p style={styles.kicker}>Aset Spotlight</p>
        <h1 style={styles.title}>Featured Presence</h1>

        {profiles.length === 0 ? (
          <p style={styles.empty}>No spotlight profiles are available right now.</p>
        ) : (
          <div style={styles.grid}>
            {profiles.map((profile) => (
              <article key={profile.id} style={styles.card}>
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.name || "Aset Spotlight profile"}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.placeholder}>Aset Spotlight</div>
                )}

                <div style={styles.content}>
                  <p style={styles.badge}>
                    {profile.featured ? "Featured Profile" : "Spotlight Profile"}
                  </p>

                  <h2 style={styles.name}>{profile.alias || profile.name}</h2>

                  {profile.alias && profile.name && (
                    <p style={styles.alias}>{profile.name}</p>
                  )}

                  {profile.role && <p style={styles.role}>{profile.role}</p>}

                  <p style={styles.bio}>
                    {profile.aset_statement ||
                      profile.bio ||
                      "A curated presence recognized by The Aset Studio."}
                  </p>

                  <Link
                    to={`/aset-spotlight/${profile.slug}`}
                    style={styles.button}
                  >
                    View Spotlight Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "110px 6vw 80px",
    color: "#fff",
    background:
      "radial-gradient(circle at top left, rgba(201,164,106,0.16), transparent 34%), #000",
  },

  wrap: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  kicker: {
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#c9a46a",
    fontSize: "12px",
    marginBottom: "14px",
    fontWeight: 800,
  },

  title: {
    fontSize: "clamp(42px, 7vw, 86px)",
    lineHeight: 0.95,
    margin: "0 0 42px",
    letterSpacing: "-0.06em",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    display: "block",
    background: "#080808",
  },

  placeholder: {
    height: "420px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.035)",
    color: "#c9a46a",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: "12px",
  },

  content: {
    padding: "26px",
  },

  badge: {
    color: "#c9a46a",
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontWeight: 900,
    margin: "0 0 12px",
  },

  name: {
    fontSize: "32px",
    lineHeight: 1,
    margin: "0 0 10px",
    color: "#fff7e8",
  },

  alias: {
    color: "#ead7b4",
    margin: "0 0 10px",
  },

  role: {
    color: "#c9c0b2",
    margin: "0 0 16px",
    lineHeight: 1.6,
  },

  bio: {
    color: "#dfd2bd",
    lineHeight: 1.75,
    marginBottom: "24px",
  },

  button: {
    display: "inline-block",
    color: "#000",
    background: "#c9a46a",
    padding: "12px 18px",
    textDecoration: "none",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "12px",
  },

  empty: {
    color: "#d8cab6",
    fontSize: "16px",
    lineHeight: 1.8,
  },
};