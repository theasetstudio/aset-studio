// src/pages/CreatorProfileEditorPage.js

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CREATOR_TYPE_OPTIONS = [
  "Visual Artist",
  "Virtual Photographer",
  "Boudoir Photographer",
  "Film Creator",
  "Music Creator",
  "Writer",
  "Scriptwriter",
  "Creative Director",
  "Visual Alchemist",
  "Speaker",
  "Actor",
  "Model",
  "DJ",
];

const SIGNED_URL_TTL_SECONDS = 600;

function normalizeStoragePath(input) {
  if (!input) return "";

  const value = String(input).trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return "";
  }

  let p = value;

  while (p.startsWith("/")) {
    p = p.slice(1);
  }

  if (p.toLowerCase().startsWith("media/")) {
    p = p.slice(6);
  }

  if (p.toLowerCase().startsWith("public/")) {
    p = p.slice(7);
  }

  while (p.includes("//")) {
    p = p.replace("//", "/");
  }

  return p;
}

async function getSignedUrl(path) {
  const cleanPath = normalizeStoragePath(path);
  if (!cleanPath) return "";

  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error("Signed URL error:", error);
    return "";
  }

  return data?.signedUrl || "";
}

export default function CreatorProfileEditorPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const [profile, setProfile] = useState({
    display_name: "",
    username: "",
    portfolio_tagline: "",
    quote: "",
    location: "",
    bio: "",
    is_available_for_collab: false,
    is_available_for_client_work: false,
    creator_types: [],
    custom_creator_types: [],
    avatar_url: "",
    banner_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");

  const [newCustomBadge, setNewCustomBadge] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/auth");
          return;
        }

        if (!alive) return;

        setUserId(user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select(`
            display_name,
            username,
            portfolio_tagline,
            quote,
            location,
            bio,
            is_available_for_collab,
            is_available_for_client_work,
            creator_types,
            custom_creator_type,
            avatar_url,
            banner_url
          `)
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Profile load error:", error);
          return;
        }

        if (!alive) return;

        const nextProfile = {
          display_name: data.display_name || "",
          username: data.username || "",
          portfolio_tagline: data.portfolio_tagline || "",
          quote: data.quote || "",
          location: data.location || "",
          bio: data.bio || "",
          is_available_for_collab: !!data.is_available_for_collab,
          is_available_for_client_work: !!data.is_available_for_client_work,
          creator_types: Array.isArray(data.creator_types) ? data.creator_types : [],
          custom_creator_types: data.custom_creator_type
            ? [data.custom_creator_type]
            : [],
          avatar_url: data.avatar_url || "",
          banner_url: data.banner_url || "",
        };

        setProfile(nextProfile);

        const avatarSigned = nextProfile.avatar_url
          ? await getSignedUrl(nextProfile.avatar_url)
          : "";

        const bannerSigned = nextProfile.banner_url
          ? await getSignedUrl(nextProfile.banner_url)
          : "";

        if (!alive) return;

        setAvatarPreviewUrl(avatarSigned);
        setBannerPreviewUrl(bannerSigned);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      alive = false;
    };
  }, [navigate]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFileChange(e, type) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarPreviewUrl(objectUrl);
      return;
    }

    if (type === "banner") {
      setBannerFile(file);
      setBannerPreviewUrl(objectUrl);
    }
  }

  function handleCreatorTypeToggle(typeValue) {
    setProfile((prev) => {
      const exists = prev.creator_types.includes(typeValue);

      return {
        ...prev,
        creator_types: exists
          ? prev.creator_types.filter((t) => t !== typeValue)
          : [...prev.creator_types, typeValue],
      };
    });
  }

  function handleAddCustomBadge() {
    const trimmed = newCustomBadge.trim();
    if (!trimmed) return;

    const exists = profile.custom_creator_types.some(
      (badge) => badge.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setNewCustomBadge("");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      custom_creator_types: [...prev.custom_creator_types, trimmed],
    }));

    setNewCustomBadge("");
  }

  function handleRemoveCustomBadge(badgeToRemove) {
    setProfile((prev) => ({
      ...prev,
      custom_creator_types: prev.custom_creator_types.filter(
        (badge) => badge !== badgeToRemove
      ),
    }));
  }

  async function uploadFile(file, path) {
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });

    if (error) throw error;

    return path;
  }

  async function handleSave() {
    if (!userId) return;

    try {
      setSaving(true);

      let avatarPath = profile.avatar_url;
      let bannerPath = profile.banner_url;

      if (avatarFile) {
        avatarPath = `profiles/avatars/${userId}-${Date.now()}-${avatarFile.name}`;
        avatarPath = await uploadFile(avatarFile, avatarPath);
      }

      if (bannerFile) {
        bannerPath = `profiles/banners/${userId}-${Date.now()}-${bannerFile.name}`;
        bannerPath = await uploadFile(bannerFile, bannerPath);
      }

      const payload = {
        display_name: profile.display_name.trim(),
        username: profile.username.trim().toLowerCase(),
        portfolio_tagline: profile.portfolio_tagline.trim(),
        quote: profile.quote.trim(),
        location: profile.location.trim(),
        bio: profile.bio.trim(),
        is_available_for_collab: profile.is_available_for_collab,
        is_available_for_client_work: profile.is_available_for_client_work,
        creator_types: profile.creator_types,
        custom_creator_type: profile.custom_creator_types[0] || null,
        avatar_url: avatarPath,
        banner_url: bannerPath,
      };

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId);

      if (error) throw error;

      navigate(`/creator/${userId}`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading creator profile…</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 760, margin: "0 auto", color: "#fff" }}>
      <h1>Edit Creator Profile</h1>

      <label style={{ display: "block", marginBottom: 16 }}>
        Display Name
        <input
          type="text"
          name="display_name"
          value={profile.display_name}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 6, padding: 10 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Username
        <input
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 6, padding: 10 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Portfolio Tagline
        <input
          type="text"
          name="portfolio_tagline"
          value={profile.portfolio_tagline}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 6, padding: 10 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Quote
        <textarea
          name="quote"
          value={profile.quote}
          onChange={handleChange}
          rows={3}
          maxLength={220}
          placeholder="Add a favorite quote, mantra, or line that represents you"
          style={{ width: "100%", marginTop: 6, padding: 10, resize: "vertical" }}
        />
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
          {profile.quote.length}/220
        </div>
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Location
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 6, padding: 10 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Bio
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={6}
          style={{ width: "100%", marginTop: 6, padding: 10 }}
        />
      </label>

      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Creator Types</div>

        <div style={{ display: "grid", gap: 10 }}>
          {CREATOR_TYPE_OPTIONS.map((typeValue) => (
            <label key={typeValue} style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={profile.creator_types.includes(typeValue)}
                onChange={() => handleCreatorTypeToggle(typeValue)}
              />
              {typeValue}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Custom Types</div>

        {profile.custom_creator_types.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {profile.custom_creator_types.map((badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <span>{badge}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBadge(badge)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            value={newCustomBadge}
            onChange={(e) => setNewCustomBadge(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomBadge();
              }
            }}
            placeholder="Add custom type"
            style={{ flex: 1, padding: 10 }}
          />
          <button
            type="button"
            onClick={handleAddCustomBadge}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#fff",
              color: "#111",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Avatar</div>

        {avatarPreviewUrl ? (
          <img
            src={avatarPreviewUrl}
            alt="Avatar preview"
            style={{
              width: 110,
              height: 110,
              objectFit: "cover",
              borderRadius: "50%",
              display: "block",
              marginBottom: 10,
            }}
          />
        ) : null}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "avatar")}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Banner</div>

        {bannerPreviewUrl ? (
          <img
            src={bannerPreviewUrl}
            alt="Banner preview"
            style={{
              width: "100%",
              maxWidth: 500,
              height: 140,
              objectFit: "cover",
              display: "block",
              marginBottom: 10,
              borderRadius: 12,
            }}
          />
        ) : null}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "banner")}
        />
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          type="checkbox"
          name="is_available_for_collab"
          checked={profile.is_available_for_collab}
          onChange={handleChange}
        />
        Available for Collaboration
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
        <input
          type="checkbox"
          name="is_available_for_client_work"
          checked={profile.is_available_for_client_work}
          onChange={handleChange}
        />
        Available for Client Work
      </label>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "#fff",
            color: "#111",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 700,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
