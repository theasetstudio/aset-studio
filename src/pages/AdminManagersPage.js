import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const MANAGER_BUCKET = "manager-media";

const emptyForm = {
  name: "",
  slug: "",
  title: "",
  company: "",
  category: "",
  hero_image_url: "",
  logo_url: "",
  welcome_video_url: "",
  aset_statement: "",
  bio: "",
  feature_interview: "",
  legacy_impact: "",
  words_of_wisdom: "",
  aset_honors: "",
  contact_preferences: "",
  availability_status: "Not Currently Accepting New Clients",
  featured: false,
  status: "draft",
  career_highlights: [],
  current_projects: [],
  professional_services: [],
  represented_talent: [],
  gallery: [],
  testimonials: [],
  media_press: [],
};

export default function AdminManagersPage() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeForm = editForm || form;
  const setActiveForm = editForm ? setEditForm : setForm;
  const mode = editForm ? "edit" : "create";

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("manager_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setProfiles([]);
    } else {
      setProfiles(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const normalizeProfile = (profile) => ({
    ...emptyForm,
    ...profile,
    career_highlights: Array.isArray(profile.career_highlights) ? profile.career_highlights : [],
    current_projects: Array.isArray(profile.current_projects) ? profile.current_projects : [],
    professional_services: Array.isArray(profile.professional_services) ? profile.professional_services : [],
    represented_talent: Array.isArray(profile.represented_talent) ? profile.represented_talent : [],
    gallery: Array.isArray(profile.gallery) ? profile.gallery : [],
    testimonials: Array.isArray(profile.testimonials) ? profile.testimonials : [],
    media_press: Array.isArray(profile.media_press) ? profile.media_press : [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadFile = async (file, slug, folder) => {
    if (!file || !slug) {
      alert("Add a slug before uploading.");
      return null;
    }

    const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `${slug}/${folder}/${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from(MANAGER_BUCKET)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      alert(`Upload failed: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage.from(MANAGER_BUCKET).getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
      type: file.type.startsWith("video") ? "video" : "image",
      caption: "",
    };
  };

  const uploadSingle = async (e, field, folder) => {
    const file = e.target.files?.[0];
    const uploaded = await uploadFile(file, activeForm.slug, folder);
    if (!uploaded) return;

    setActiveForm((prev) => ({
      ...prev,
      [field]: uploaded.url,
    }));
  };

  const uploadGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    const uploads = [];

    for (const file of files) {
      const uploaded = await uploadFile(file, activeForm.slug, "gallery");
      if (uploaded) uploads.push(uploaded);
    }

    setActiveForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...uploads],
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setActiveForm((prev) => {
      const next = [...prev[field]];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [field]: next };
    });
  };

  const addArrayItem = (field, item) => {
    setActiveForm((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const removeArrayItem = (field, index) => {
    setActiveForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    if (!activeForm.name.trim() || !activeForm.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      ...activeForm,
      slug: activeForm.slug.trim().toLowerCase(),
    };

    delete payload.id;
    delete payload.created_at;

    const query = editForm?.id
      ? supabase.from("manager_profiles").update(payload).eq("id", editForm.id)
      : supabase.from("manager_profiles").insert([payload]);

    const { error } = await query;

    if (error) {
      alert(`Save failed: ${error.message}`);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditForm(null);
    setSaving(false);
    fetchProfiles();
  };

  const startEdit = (profile) => {
    setEditForm(normalizeProfile(profile));
    setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditForm(null);
    setActiveTab("basic");
  };

  const tabs = [
    ["basic", "Basic"],
    ["media", "Media"],
    ["bio", "Bio"],
    ["work", "Work"],
    ["talent", "Talent"],
    ["press", "Press"],
    ["honors", "Honors"],
    ["contact", "Contact"],
  ];

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Admin Managers</h1>
      <p style={styles.subtitle}>
        Create and manage curated executive profiles for The Aset Studio Managers Door.
      </p>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>{mode === "edit" ? "Edit Manager Profile" : "Create Manager Profile"}</h2>

        <div style={styles.tabs}>
          {tabs.map(([id, label]) => (
            <button
              key={id}
              style={activeTab === id ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(id)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "basic" && (
          <>
            <div style={styles.grid}>
              <input style={styles.input} name="name" placeholder="Manager Name" value={activeForm.name} onChange={handleChange} />
              <input style={styles.input} name="slug" placeholder="Slug example: jane-smith" value={activeForm.slug} onChange={handleChange} />
              <input style={styles.input} name="title" placeholder="Title example: Talent Manager" value={activeForm.title} onChange={handleChange} />
              <input style={styles.input} name="company" placeholder="Company / Agency" value={activeForm.company} onChange={handleChange} />
              <select style={styles.input} name="category" value={activeForm.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option>Talent Manager</option>
                <option>Music Manager</option>
                <option>Literary Manager</option>
                <option>Comedy Manager</option>
                <option>Influencer Manager</option>
                <option>Modeling Manager</option>
                <option>Production Executive</option>
              </select>
              <select style={styles.input} name="status" value={activeForm.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <textarea style={styles.textarea} name="aset_statement" placeholder="Aset Statement" value={activeForm.aset_statement} onChange={handleChange} />

            <label style={styles.checkboxRow}>
              <input type="checkbox" name="featured" checked={activeForm.featured} onChange={handleChange} />
              Featured Manager
            </label>
          </>
        )}

        {activeTab === "media" && (
          <>
            <h3 style={styles.subheading}>Hero Portrait</h3>
            <input style={styles.input} name="hero_image_url" placeholder="Hero Image URL" value={activeForm.hero_image_url} onChange={handleChange} />
            <input style={styles.fileInput} type="file" accept="image/*" onChange={(e) => uploadSingle(e, "hero_image_url", "hero")} />
            {activeForm.hero_image_url && <img src={activeForm.hero_image_url} alt="" style={styles.previewImage} />}

            <h3 style={styles.subheading}>Company Logo</h3>
            <input style={styles.input} name="logo_url" placeholder="Logo URL" value={activeForm.logo_url} onChange={handleChange} />
            <input style={styles.fileInput} type="file" accept="image/*" onChange={(e) => uploadSingle(e, "logo_url", "logo")} />
            {activeForm.logo_url && <img src={activeForm.logo_url} alt="" style={styles.logoPreview} />}

            <h3 style={styles.subheading}>Welcome Video</h3>
            <input style={styles.input} name="welcome_video_url" placeholder="Welcome Video URL" value={activeForm.welcome_video_url} onChange={handleChange} />
            <input style={styles.fileInput} type="file" accept="video/*" onChange={(e) => uploadSingle(e, "welcome_video_url", "welcome-video")} />
            {activeForm.welcome_video_url && <video src={activeForm.welcome_video_url} controls style={styles.previewVideo} />}

            <h3 style={styles.subheading}>Gallery</h3>
            <input style={styles.fileInput} type="file" accept="image/*,video/*" multiple onChange={uploadGallery} />
            <GalleryList form={activeForm} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
          </>
        )}

        {activeTab === "bio" && (
          <>
            <textarea style={{ ...styles.textarea, minHeight: 220 }} name="bio" placeholder="Biography" value={activeForm.bio} onChange={handleChange} />
            <textarea style={styles.textarea} name="feature_interview" placeholder="Feature Interview" value={activeForm.feature_interview} onChange={handleChange} />
            <textarea style={styles.textarea} name="legacy_impact" placeholder="Legacy & Impact" value={activeForm.legacy_impact} onChange={handleChange} />
            <textarea style={styles.textarea} name="words_of_wisdom" placeholder="Words of Wisdom" value={activeForm.words_of_wisdom} onChange={handleChange} />
          </>
        )}

        {activeTab === "work" && (
          <>
            <SimpleList title="Career Highlights" field="career_highlights" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
            <SimpleList title="Current Projects" field="current_projects" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
            <SimpleList title="Professional Services" field="professional_services" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
          </>
        )}

        {activeTab === "talent" && (
          <CardList title="Represented Talent" field="represented_talent" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
        )}

        {activeTab === "press" && (
          <>
            <CardList title="Media & Press" field="media_press" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
            <CardList title="Testimonials" field="testimonials" form={activeForm} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
          </>
        )}

        {activeTab === "honors" && (
          <textarea style={{ ...styles.textarea, minHeight: 220 }} name="aset_honors" placeholder="Aset Studio Honors" value={activeForm.aset_honors} onChange={handleChange} />
        )}

        {activeTab === "contact" && (
          <>
            <select style={styles.input} name="availability_status" value={activeForm.availability_status} onChange={handleChange}>
              <option>Currently Accepting New Clients</option>
              <option>Accepting by Referral Only</option>
              <option>Not Currently Accepting New Clients</option>
            </select>
            <textarea style={styles.textarea} name="contact_preferences" placeholder="How this manager wants to be contacted" value={activeForm.contact_preferences} onChange={handleChange} />
          </>
        )}

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Manager Profile"}
          </button>
          {editForm && <button style={styles.secondaryButton} onClick={cancelEdit}>Cancel Edit</button>}
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>All Manager Profiles</h2>

        {loading ? <p style={styles.muted}>Loading...</p> : profiles.map((profile) => (
          <article key={profile.id} style={styles.profileCard}>
            <div>
              <p style={styles.kicker}>Managers Door</p>
              <h3 style={styles.profileName}>{profile.name}</h3>
              <p style={styles.muted}>{profile.title} {profile.company ? `• ${profile.company}` : ""}</p>
              <p style={styles.muted}>Slug: {profile.slug}</p>
              <p style={styles.muted}>Status: {profile.status}</p>
              <p style={styles.muted}>Featured: {profile.featured ? "Yes" : "No"}</p>
            </div>
            <button style={styles.smallButton} onClick={() => startEdit(profile)}>Edit Profile</button>
          </article>
        ))}
      </section>
    </main>
  );
}

function SimpleList({ title, field, form, addArrayItem, updateArrayItem, removeArrayItem }) {
  return (
    <>
      <h3 style={styles.subheading}>{title}</h3>
      {form[field].map((item, index) => (
        <div key={`${field}-${index}`} style={styles.filmCard}>
          <input style={styles.input} placeholder="Title" value={item.title || ""} onChange={(e) => updateArrayItem(field, index, "title", e.target.value)} />
          <textarea style={styles.textarea} placeholder="Description" value={item.description || ""} onChange={(e) => updateArrayItem(field, index, "description", e.target.value)} />
          <button style={styles.dangerButton} onClick={() => removeArrayItem(field, index)}>Remove</button>
        </div>
      ))}
      <button style={styles.secondaryButton} onClick={() => addArrayItem(field, { title: "", description: "" })}>+ Add {title}</button>
    </>
  );
}

function CardList({ title, field, form, addArrayItem, updateArrayItem, removeArrayItem }) {
  return (
    <>
      <h3 style={styles.subheading}>{title}</h3>
      {form[field].map((item, index) => (
        <div key={`${field}-${index}`} style={styles.filmCard}>
          <input style={styles.input} placeholder="Name / Title" value={item.name || ""} onChange={(e) => updateArrayItem(field, index, "name", e.target.value)} />
          <input style={styles.input} placeholder="Role / Outlet / Profession" value={item.role || ""} onChange={(e) => updateArrayItem(field, index, "role", e.target.value)} />
          <input style={styles.input} placeholder="Image URL or Link" value={item.url || ""} onChange={(e) => updateArrayItem(field, index, "url", e.target.value)} />
          <textarea style={styles.textarea} placeholder="Description / Quote" value={item.description || ""} onChange={(e) => updateArrayItem(field, index, "description", e.target.value)} />
          <button style={styles.dangerButton} onClick={() => removeArrayItem(field, index)}>Remove</button>
        </div>
      ))}
      <button style={styles.secondaryButton} onClick={() => addArrayItem(field, { name: "", role: "", url: "", description: "" })}>+ Add {title}</button>
    </>
  );
}

function GalleryList({ form, updateArrayItem, removeArrayItem }) {
  return (
    <div style={styles.galleryGrid}>
      {form.gallery.map((item, index) => (
        <div key={`${item.url}-${index}`} style={styles.galleryCard}>
          {item.type === "video" ? (
            <video src={item.url} controls style={styles.galleryMedia} />
          ) : (
            <img src={item.url} alt="" style={styles.galleryMedia} />
          )}
          <input style={styles.input} placeholder="Caption" value={item.caption || ""} onChange={(e) => updateArrayItem("gallery", index, "caption", e.target.value)} />
          <button style={styles.dangerButton} onClick={() => removeArrayItem("gallery", index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "110px 6vw 70px", background: "radial-gradient(circle at top left, rgba(169,112,42,0.16), transparent 34%), #000", color: "#f5efe5" },
  title: { fontSize: "42px", margin: "0 0 8px" },
  subtitle: { color: "#b8aa96", marginBottom: "34px" },
  panel: { border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.035)", padding: "28px", marginBottom: "32px" },
  sectionTitle: { fontSize: "28px", marginTop: 0 },
  subheading: { color: "#d7b46c", fontSize: "16px", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "26px" },
  tabs: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" },
  tab: { padding: "10px 14px", background: "transparent", color: "#d9ccb8", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" },
  activeTab: { padding: "10px 14px", background: "#d7b46c", color: "#000", border: "1px solid #d7b46c", fontWeight: 800, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" },
  input: { width: "100%", padding: "12px", marginBottom: "12px", background: "#090909", color: "#fff", border: "1px solid rgba(255,255,255,0.16)" },
  fileInput: { width: "100%", padding: "12px", marginBottom: "12px", background: "#090909", color: "#d9ccb8", border: "1px solid rgba(255,255,255,0.16)" },
  textarea: { width: "100%", minHeight: "130px", padding: "12px", marginBottom: "12px", background: "#090909", color: "#fff", border: "1px solid rgba(255,255,255,0.16)", resize: "vertical" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", color: "#d9ccb8", margin: "14px 0 20px" },
  buttonRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" },
  button: { padding: "12px 18px", background: "#d7b46c", color: "#000", border: "none", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { padding: "12px 18px", background: "transparent", color: "#f5efe5", border: "1px solid rgba(255,255,255,0.25)", fontWeight: 800, cursor: "pointer", marginBottom: "18px" },
  dangerButton: { padding: "10px 12px", background: "transparent", color: "#ffb4a8", border: "1px solid rgba(255,120,100,0.45)", cursor: "pointer" },
  previewImage: { width: "240px", maxWidth: "100%", display: "block", margin: "12px 0 20px", border: "1px solid rgba(255,255,255,0.12)" },
  logoPreview: { width: "180px", maxWidth: "100%", background: "#fff", padding: "10px", display: "block", margin: "12px 0 20px" },
  previewVideo: { width: "100%", maxHeight: "420px", margin: "12px 0 20px", background: "#000", border: "1px solid rgba(255,255,255,0.12)" },
  filmCard: { border: "1px solid rgba(255,255,255,0.1)", padding: "16px", marginBottom: "14px", background: "rgba(0,0,0,0.35)" },
  galleryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: "16px 0" },
  galleryCard: { border: "1px solid rgba(255,255,255,0.1)", padding: "14px", background: "rgba(0,0,0,0.35)" },
  galleryMedia: { width: "100%", height: "220px", objectFit: "cover", display: "block", marginBottom: "12px", background: "#000" },
  profileCard: { display: "flex", justifyContent: "space-between", gap: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)", padding: "20px", marginBottom: "16px" },
  kicker: { color: "#d7b46c", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 8px" },
  profileName: { fontSize: "24px", margin: "0 0 8px" },
  muted: { color: "#b8aa96", margin: "6px 0" },
  smallButton: { padding: "10px 12px", background: "transparent", color: "#f5efe5", border: "1px solid rgba(215,180,108,0.5)", cursor: "pointer", height: "42px" },
};