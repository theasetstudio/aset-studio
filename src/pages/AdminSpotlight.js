import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSpotlight() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    alias: "",
    role: "",
    bio: "",
    aset_statement: "",
    profile_image_url: "",
    status: "draft",
  });

  const fetchProfiles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("spotlight_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.name || !form.slug) {
      alert("Name and slug are required");
      return;
    }

    const { error } = await supabase.from("spotlight_profiles").insert([
      {
        ...form,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating profile");
      return;
    }

    setForm({
      name: "",
      slug: "",
      alias: "",
      role: "",
      bio: "",
      aset_statement: "",
      profile_image_url: "",
      status: "draft",
    });

    fetchProfiles();
  };

  const togglePublish = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("spotlight_profiles")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchProfiles();
  };

  return (
    <main style={{ padding: "40px", color: "#fff", background: "#000" }}>
      <h1>Admin Spotlight</h1>

      {/* CREATE FORM */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Create New Profile</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Slug (example: franchesca)"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          name="alias"
          placeholder="Alias"
          value={form.alias}
          onChange={handleChange}
        />

        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
        />

        <input
          name="profile_image_url"
          placeholder="Profile Image URL"
          value={form.profile_image_url}
          onChange={handleChange}
        />

        <textarea
          name="aset_statement"
          placeholder="Aset Statement"
          value={form.aset_statement}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button onClick={handleCreate}>Create Profile</button>
      </section>

      {/* LIST */}
      <section>
        <h2>All Profiles</h2>

        {loading ? (
          <p>Loading...</p>
        ) : profiles.length === 0 ? (
          <p>No profiles found</p>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                border: "1px solid #333",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{profile.name}</h3>
              <p>{profile.alias}</p>
              <p>Status: {profile.status}</p>

              <button
                onClick={() =>
                  togglePublish(profile.id, profile.status)
                }
              >
                {profile.status === "published"
                  ? "Unpublish"
                  : "Publish"}
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}