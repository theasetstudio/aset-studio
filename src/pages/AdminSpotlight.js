import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSpotlight() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    slug: "",
    alias: "",
    role: "",
    bio: "",
    aset_statement: "",
    profile_image_url: "",
    featured_video_url: "",
    featured_video_title: "",
    featured_video_caption: "",
    status: "draft",
    featured: false,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchProfiles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("spotlight_profiles")
      .select("*")
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("spotlight_profiles").insert([
      {
        ...form,
        slug: form.slug.trim().toLowerCase(),
      },
    ]);

    if (error) {
      console.error("Error creating spotlight profile:", error);
      alert("Error creating profile.");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setSaving(false);
    fetchProfiles();
  };

  const togglePublish = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("spotlight_profiles")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Error updating profile status.");
      return;
    }

    fetchProfiles();
  };

  const toggleFeatured = async (id, currentFeatured) => {
    const { error } = await supabase
      .from("spotlight_profiles")
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (error) {
      console.error("Error updating featured status:", error);
      alert("Error updating featured status.");
      return;
    }

    fetchProfiles();
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Admin Spotlight</h1>
      <p style={styles.subtitle}>
        Create and control curated Aset Spotlight profiles.
      </p>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Create New Profile</h2>

        <div style={styles.grid}>
          <input
            style={styles.input}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="slug"
            placeholder="Slug example: franchesca"
            value={form.slug}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="alias"
            placeholder="Alias / Stage Name"
            value={form.alias}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="profile_image_url"
            placeholder="Profile Image URL"
            value={form.profile_image_url}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <textarea
          style={styles.textarea}
          name="aset_statement"
          placeholder="Aset Statement"
          value={form.aset_statement}
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          name="bio"
          placeholder="Personal Bio / Archive"
          value={form.bio}
          onChange={handleChange}
        />

        <h3 style={styles.subheading}>Featured Screening</h3>

        <div style={styles.grid}>
          <input
            style={styles.input}
            name="featured_video_url"
            placeholder="Featured Video URL"
            value={form.featured_video_url}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="featured_video_title"
            placeholder="Featured Video Title"
            value={form.featured_video_title}
            onChange={handleChange}
          />
        </div>

        <textarea
          style={styles.textarea}
          name="featured_video_caption"
          placeholder="Featured Video Caption"
          value={form.featured_video_caption}
          onChange={handleChange}
        />

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Mark as featured Spotlight profile
        </label>

        <button style={styles.button} onClick={handleCreate} disabled={saving}>
          {saving ? "Creating..." : "Create Profile"}
        </button>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>All Profiles</h2>

        {loading ? (
          <p style={styles.muted}>Loading...</p>
        ) : profiles.length === 0 ? (
          <p style={styles.muted}>No profiles found.</p>
        ) : (
          profiles.map((profile) => (
            <article key={profile.id} style={styles.profileCard}>
              <div>
                <p style={styles.kicker}>Aset Spotlight</p>
                <h3 style={styles.profileName}>{profile.alias || profile.name}</h3>
                {profile.alias && (
                  <p style={styles.profileAlias}>{profile.name}</p>
                )}
                <p style={styles.muted}>Slug: {profile.slug}</p>
                <p style={styles.muted}>Status: {profile.status}</p>
                <p style={styles.muted}>
                  Featured Screening:{" "}
                  {profile.featured_video_url ? "Added" : "Not added"}
                </p>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.smallButton}
                  onClick={() => togglePublish(profile.id, profile.status)}
                >
                  {profile.status === "published" ? "Unpublish" : "Publish"}
                </button>

                <button
                  style={styles.smallButton}
                  onClick={() => toggleFeatured(profile.id, profile.featured)}
                >
                  {profile.featured ? "Remove Featured" : "Mark Featured"}
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "110px 6vw 70px",
    background:
      "radial-gradient(circle at top left, rgba(169,112,42,0.16), transparent 34%), #000",
    color: "#f5efe5",
  },

  title: {
    fontSize: "42px",
    margin: "0 0 8px",
  },

  subtitle: {
    color: "#b8aa96",
    marginBottom: "34px",
  },

  panel: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.035)",
    padding: "28px",
    marginBottom: "32px",
  },

  sectionTitle: {
    fontSize: "28px",
    marginTop: 0,
  },

  subheading: {
    color: "#d7b46c",
    fontSize: "16px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginTop: "26px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    background: "#090909",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "12px",
    marginBottom: "12px",
    background: "#090909",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
    resize: "vertical",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d9ccb8",
    margin: "14px 0 20px",
  },

  button: {
    padding: "12px 18px",
    background: "#d7b46c",
    color: "#000",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },

  profileCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.4)",
    padding: "20px",
    marginBottom: "16px",
  },

  kicker: {
    color: "#d7b46c",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },

  profileName: {
    fontSize: "24px",
    margin: "0 0 8px",
  },

  profileAlias: {
    color: "#ead7b4",
    margin: "0 0 10px",
  },

  muted: {
    color: "#b8aa96",
    margin: "6px 0",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "160px",
  },

  smallButton: {
    padding: "10px 12px",
    background: "transparent",
    color: "#f5efe5",
    border: "1px solid rgba(215,180,108,0.5)",
    cursor: "pointer",
  },
};