import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const SPOTLIGHT_BUCKET = "spotlight-media";

export default function AdminSpotlight() {
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
    awards: [],
    gallery: [],
    filmography: [],
    discography: [],
    bibliography: [],
    fan_club: {},
    representation: {
      official_presence: {
        instagram_url: "",
        youtube_url: "",
        label: "Verified Official Presence",
      },
    },
    status: "draft",
    featured: false,
  };

  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const normalizeProfile = (profile) => ({
    ...emptyForm,
    ...profile,
    awards: Array.isArray(profile.awards) ? profile.awards : [],
    gallery: Array.isArray(profile.gallery) ? profile.gallery : [],
    filmography: Array.isArray(profile.filmography) ? profile.filmography : [],
    discography: Array.isArray(profile.discography) ? profile.discography : [],
    bibliography: Array.isArray(profile.bibliography) ? profile.bibliography : [],
    fan_club: profile.fan_club || {},
    representation: {
      ...(profile.representation || {}),
      official_presence: {
        instagram_url:
          profile.representation?.official_presence?.instagram_url || "",
        youtube_url:
          profile.representation?.official_presence?.youtube_url || "",
        label:
          profile.representation?.official_presence?.label ||
          "Verified Official Presence",
      },
    },
  });

  const handleChange = (e, mode = "create") => {
    const { name, value, type, checked } = e.target;
    const setter = mode === "edit" ? setEditForm : setForm;

    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateOfficialPresence = (field, value, mode = "create") => {
    const setter = mode === "edit" ? setEditForm : setForm;

    setter((prev) => ({
      ...prev,
      representation: {
        ...(prev.representation || {}),
        official_presence: {
          ...(prev.representation?.official_presence || {}),
          [field]: value,
        },
      },
    }));
  };

  const uploadFile = async (file, slug, folder) => {
    if (!file || !slug) return null;

    const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `${slug}/${folder}/${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from(SPOTLIGHT_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from(SPOTLIGHT_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
      type: file.type.startsWith("video") ? "video" : "image",
      caption: "",
    };
  };

  const uploadProfileImage = async (e, mode = "create") => {
    const file = e.target.files?.[0];
    const activeForm = mode === "edit" ? editForm : form;

    if (!activeForm.slug) {
      alert("Add a slug before uploading.");
      return;
    }

    const uploaded = await uploadFile(file, activeForm.slug, "profile-image");
    if (!uploaded) return;

    const setter = mode === "edit" ? setEditForm : setForm;
    setter((prev) => ({
      ...prev,
      profile_image_url: uploaded.url,
    }));
  };

  const uploadFeaturedVideo = async (e, mode = "create") => {
    const file = e.target.files?.[0];
    const activeForm = mode === "edit" ? editForm : form;

    if (!activeForm.slug) {
      alert("Add a slug before uploading.");
      return;
    }

    const uploaded = await uploadFile(file, activeForm.slug, "featured-video");
    if (!uploaded) return;

    const setter = mode === "edit" ? setEditForm : setForm;
    setter((prev) => ({
      ...prev,
      featured_video_url: uploaded.url,
      featured_video_title:
        prev.featured_video_title ||
        `${prev.alias || prev.name} — Featured Screening`,
    }));
  };

  const uploadGalleryFiles = async (e, mode = "create") => {
    const files = Array.from(e.target.files || []);
    const activeForm = mode === "edit" ? editForm : form;

    if (!activeForm.slug) {
      alert("Add a slug before uploading.");
      return;
    }

    if (files.length === 0) return;

    const uploads = [];

    for (const file of files) {
      const uploaded = await uploadFile(file, activeForm.slug, "gallery");
      if (uploaded) uploads.push(uploaded);
    }

    const setter = mode === "edit" ? setEditForm : setForm;

    setter((prev) => ({
      ...prev,
      gallery: [...(Array.isArray(prev.gallery) ? prev.gallery : []), ...uploads],
    }));
  };

  const updateGalleryCaption = (index, caption, mode = "create") => {
    const setter = mode === "edit" ? setEditForm : setForm;

    setter((prev) => {
      const nextGallery = [...(Array.isArray(prev.gallery) ? prev.gallery : [])];

      nextGallery[index] = {
        ...nextGallery[index],
        caption,
      };

      return {
        ...prev,
        gallery: nextGallery,
      };
    });
  };

  const removeGalleryItem = (index, mode = "create") => {
    const setter = mode === "edit" ? setEditForm : setForm;

    setter((prev) => ({
      ...prev,
      gallery: (Array.isArray(prev.gallery) ? prev.gallery : []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug.trim().toLowerCase(),
    };

    const { error } = await supabase.from("spotlight_profiles").insert([payload]);

    if (error) {
      console.error("Error creating profile:", error);
      alert("Error creating profile.");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setSaving(false);
    fetchProfiles();
  };

  const startEdit = (profile) => {
    setEditForm(normalizeProfile(profile));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm?.id) return;

    if (!editForm.name.trim() || !editForm.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: editForm.name,
      slug: editForm.slug.trim().toLowerCase(),
      alias: editForm.alias,
      role: editForm.role,
      bio: editForm.bio,
      aset_statement: editForm.aset_statement,
      profile_image_url: editForm.profile_image_url,
      featured_video_url: editForm.featured_video_url,
      featured_video_title: editForm.featured_video_title,
      featured_video_caption: editForm.featured_video_caption,
      awards: editForm.awards,
      gallery: editForm.gallery,
      filmography: editForm.filmography,
      discography: editForm.discography,
      bibliography: editForm.bibliography,
      fan_club: editForm.fan_club,
      representation: editForm.representation,
      status: editForm.status,
      featured: editForm.featured,
    };

    const { error } = await supabase
      .from("spotlight_profiles")
      .update(payload)
      .eq("id", editForm.id);

    if (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile.");
      setSaving(false);
      return;
    }

    setEditForm(null);
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

  const renderFormFields = (activeForm, mode) => (
    <>
      <div style={styles.grid}>
        <input
          style={styles.input}
          name="name"
          placeholder="Name"
          value={activeForm.name}
          onChange={(e) => handleChange(e, mode)}
        />

        <input
          style={styles.input}
          name="slug"
          placeholder="Slug example: franchesca"
          value={activeForm.slug}
          onChange={(e) => handleChange(e, mode)}
        />

        <input
          style={styles.input}
          name="alias"
          placeholder="Alias / Stage Name"
          value={activeForm.alias}
          onChange={(e) => handleChange(e, mode)}
        />

        <input
          style={styles.input}
          name="role"
          placeholder="Role"
          value={activeForm.role}
          onChange={(e) => handleChange(e, mode)}
        />

        <select
          style={styles.input}
          name="status"
          value={activeForm.status}
          onChange={(e) => handleChange(e, mode)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <h3 style={styles.subheading}>Profile Image</h3>

      <input
        style={styles.input}
        name="profile_image_url"
        placeholder="Profile Image URL"
        value={activeForm.profile_image_url}
        onChange={(e) => handleChange(e, mode)}
      />

      <input
        style={styles.fileInput}
        type="file"
        accept="image/*"
        onChange={(e) => uploadProfileImage(e, mode)}
      />

      {activeForm.profile_image_url && (
        <img
          src={activeForm.profile_image_url}
          alt="Profile preview"
          style={styles.previewImage}
        />
      )}

      <h3 style={styles.subheading}>Studio Statement</h3>

      <p style={styles.helpText}>
        Short statement shown near the top of the public Spotlight profile. Keep
        this sharp, cinematic, and positioning-focused.
      </p>

      <textarea
        style={styles.textarea}
        name="aset_statement"
        placeholder="A defining cinematic presence in authorship, visual storytelling, and controlled creative environments."
        value={activeForm.aset_statement}
        onChange={(e) => handleChange(e, mode)}
      />

      <h3 style={styles.subheading}>Full Profile Bio</h3>

      <p style={styles.helpText}>
        This is the full cinematic profile shown on the public Spotlight page.
        Write this as a complete entertainment biography including origin,
        experience, creative identity, current projects, and future direction.
        This appears inside the “Read Full Profile” section.
      </p>

      <textarea
        style={{ ...styles.textarea, minHeight: "220px" }}
        name="bio"
        placeholder="Paste full cinematic biography here..."
        value={activeForm.bio}
        onChange={(e) => handleChange(e, mode)}
      />

      <p style={styles.helpText}>
        Tip: Use paragraph breaks. The Spotlight page preserves spacing for a
        cinematic reading experience.
      </p>

      <h3 style={styles.subheading}>Verified Official Presence</h3>

      <p style={styles.helpText}>
        Add official external accounts for this Spotlight profile. These links
        help visitors avoid scam, fake, or imitation accounts.
      </p>

      <input
        style={styles.input}
        placeholder="Section Label example: Verified Official Presence"
        value={
          activeForm.representation?.official_presence?.label ||
          "Verified Official Presence"
        }
        onChange={(e) => updateOfficialPresence("label", e.target.value, mode)}
      />

      <div style={styles.grid}>
        <input
          style={styles.input}
          placeholder="Official Instagram URL"
          value={
            activeForm.representation?.official_presence?.instagram_url || ""
          }
          onChange={(e) =>
            updateOfficialPresence("instagram_url", e.target.value, mode)
          }
        />

        <input
          style={styles.input}
          placeholder="Official YouTube Channel URL"
          value={
            activeForm.representation?.official_presence?.youtube_url || ""
          }
          onChange={(e) =>
            updateOfficialPresence("youtube_url", e.target.value, mode)
          }
        />
      </div>

      <h3 style={styles.subheading}>Featured Screening</h3>

      <input
        style={styles.input}
        name="featured_video_url"
        placeholder="Featured Video URL"
        value={activeForm.featured_video_url}
        onChange={(e) => handleChange(e, mode)}
      />

      <input
        style={styles.fileInput}
        type="file"
        accept="video/*"
        onChange={(e) => uploadFeaturedVideo(e, mode)}
      />

      <input
        style={styles.input}
        name="featured_video_title"
        placeholder="Featured Video Title"
        value={activeForm.featured_video_title}
        onChange={(e) => handleChange(e, mode)}
      />

      <textarea
        style={styles.textarea}
        name="featured_video_caption"
        placeholder="Featured Video Caption"
        value={activeForm.featured_video_caption}
        onChange={(e) => handleChange(e, mode)}
      />

      {activeForm.featured_video_url && (
        <video
          src={activeForm.featured_video_url}
          controls
          playsInline
          style={styles.previewVideo}
        />
      )}

      <h3 style={styles.subheading}>Gallery Images & Videos</h3>

      <input
        style={styles.fileInput}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => uploadGalleryFiles(e, mode)}
      />

      {Array.isArray(activeForm.gallery) && activeForm.gallery.length > 0 && (
        <div style={styles.galleryGrid}>
          {activeForm.gallery.map((item, index) => (
            <div key={`${item.url}-${index}`} style={styles.galleryCard}>
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  playsInline
                  style={styles.galleryMedia}
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.caption || "Gallery item"}
                  style={styles.galleryMedia}
                />
              )}

              <input
                style={styles.input}
                placeholder="Caption"
                value={item.caption || ""}
                onChange={(e) =>
                  updateGalleryCaption(index, e.target.value, mode)
                }
              />

              <button
                style={styles.dangerButton}
                type="button"
                onClick={() => removeGalleryItem(index, mode)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          name="featured"
          checked={activeForm.featured}
          onChange={(e) => handleChange(e, mode)}
        />
        Mark as featured Spotlight profile
      </label>
    </>
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Admin Spotlight</h1>
      <p style={styles.subtitle}>
        Create, edit, publish, and control curated Aset Spotlight profiles.
      </p>

      {editForm && (
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Edit Profile</h2>

          {renderFormFields(editForm, "edit")}

          <div style={styles.buttonRow}>
            <button style={styles.button} onClick={saveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button style={styles.secondaryButton} onClick={cancelEdit}>
              Cancel Edit
            </button>
          </div>
        </section>
      )}

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Create New Profile</h2>

        {renderFormFields(form, "create")}

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
                {profile.alias && <p style={styles.profileAlias}>{profile.name}</p>}
                <p style={styles.muted}>Slug: {profile.slug}</p>
                <p style={styles.muted}>Status: {profile.status}</p>
                <p style={styles.muted}>
                  Featured Screening:{" "}
                  {profile.featured_video_url ? "Added" : "Not added"}
                </p>
                <p style={styles.muted}>
                  Gallery Items:{" "}
                  {Array.isArray(profile.gallery) ? profile.gallery.length : 0}
                </p>
                <p style={styles.muted}>
                  Verified Presence:{" "}
                  {profile.representation?.official_presence?.instagram_url ||
                  profile.representation?.official_presence?.youtube_url
                    ? "Added"
                    : "Not added"}
                </p>
              </div>

              <div style={styles.actions}>
                <button style={styles.smallButton} onClick={() => startEdit(profile)}>
                  Edit Profile
                </button>

                <button
                  style={styles.smallButton}
                  onClick={() => togglePublish(profile.id, profile.status)}
                >
                  {profile.status === "published" ? "Unpublish" : "Publish"}
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

  helpText: {
    color: "#b8aa96",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "860px",
    margin: "0 0 14px",
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
    marginBottom: "12px",
    background: "#090909",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
  },

  fileInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    background: "#090909",
    color: "#d9ccb8",
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

  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  button: {
    padding: "12px 18px",
    background: "#d7b46c",
    color: "#000",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 18px",
    background: "transparent",
    color: "#f5efe5",
    border: "1px solid rgba(255,255,255,0.25)",
    fontWeight: 800,
    cursor: "pointer",
  },

  dangerButton: {
    padding: "10px 12px",
    background: "transparent",
    color: "#ffb4a8",
    border: "1px solid rgba(255,120,100,0.45)",
    cursor: "pointer",
  },

  previewImage: {
    width: "220px",
    maxWidth: "100%",
    display: "block",
    margin: "12px 0 20px",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  previewVideo: {
    width: "100%",
    maxHeight: "420px",
    margin: "12px 0 20px",
    background: "#000",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    margin: "16px 0",
  },

  galleryCard: {
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "14px",
    background: "rgba(0,0,0,0.35)",
  },

  galleryMedia: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
    marginBottom: "12px",
    background: "#000",
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