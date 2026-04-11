 import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getOrCreateConversation } from "../utils/messaging";

export default function CreatorsHubPage() {
  const navigate = useNavigate();

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [uploads, setUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [profileForm, setProfileForm] = useState({
    display_name: "",
    username: "",
    portfolio_tagline: "",
    bio: "",
    location: "",
    quote: "",
    avatar_url: "",
    banner_url: "",
  });

  const TEST_TARGET_USER_ID = "2874d856-eced-4bb3-919f-ddf36c6beb83";

  function handleProfileFieldChange(field, value) {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function getFileExtension(fileName = "") {
    const parts = String(fileName).split(".");
    if (parts.length < 2) return "jpg";
    return parts[parts.length - 1].toLowerCase();
  }

  function getInputHandlers() {
    return {
      onFocus: (e) => {
        e.target.style.border = "1px solid #111";
      },
      onBlur: (e) => {
        e.target.style.border = "1px solid #cfcfcf";
      },
    };
  }

  async function getSignedProfileImageUrl(pathOrUrl) {
    if (!pathOrUrl) return "";

    const value = String(pathOrUrl).trim();
    if (!value) return "";

    if (value.startsWith("http://") || value.startsWith("https://")) {
      const marker = "/storage/v1/object/sign/media/";
      const markerIndex = value.indexOf(marker);

      if (markerIndex === -1) {
        return value;
      }

      const pathPart = value.slice(markerIndex + marker.length).split("?")[0];
      if (!pathPart) return value;

      const decodedPath = decodeURIComponent(pathPart);

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(decodedPath, 3600);

      if (error) {
        console.error("Error creating signed profile image URL:", decodedPath, error);
        return "";
      }

      return data?.signedUrl || "";
    }

    const cleanPath = value.replace(/^\/+/, "");

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(cleanPath, 3600);

    if (error) {
      console.error("Error creating signed profile image URL:", cleanPath, error);
      return "";
    }

    return data?.signedUrl || "";
  }

  async function refreshProfileImages(profileRecord) {
    const [signedAvatarUrl, signedBannerUrl] = await Promise.all([
      getSignedProfileImageUrl(profileRecord?.avatar_url),
      getSignedProfileImageUrl(profileRecord?.banner_url),
    ]);

    setProfile(profileRecord || null);
    setProfileForm((prev) => ({
      ...prev,
      display_name: profileRecord?.display_name || "",
      username: profileRecord?.username || "",
      portfolio_tagline: profileRecord?.portfolio_tagline || "",
      bio: profileRecord?.bio || "",
      location: profileRecord?.location || "",
      quote: profileRecord?.quote || "",
      avatar_url: signedAvatarUrl || "",
      banner_url: signedBannerUrl || "",
    }));
  }

  async function uploadProfileImage(file, type) {
    if (!currentUser?.id) {
      setError("You must be signed in.");
      return;
    }

    if (!file) return;

    const isAvatar = type === "avatar";
    const setUploadingState = isAvatar ? setUploadingAvatar : setUploadingBanner;
    const dbColumn = isAvatar ? "avatar_url" : "banner_url";
    const fileExtension = getFileExtension(file.name);
    const filePath = `profiles/${currentUser.id}/${type}-${Date.now()}.${fileExtension}`;

    try {
      setError("");
      setSuccessMessage("");
      setUploadingState(true);

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({ [dbColumn]: filePath })
        .eq("id", currentUser.id)
        .select(
          "id, role, display_name, username, is_age_verified, portfolio_tagline, bio, location, quote, avatar_url, banner_url"
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      await refreshProfileImages(data);
      setSuccessMessage(
        isAvatar
          ? "Profile photo updated successfully."
          : "Banner image updated successfully."
      );
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(err.message || `Failed to upload ${type}.`);
    } finally {
      setUploadingState(false);
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    await uploadProfileImage(file, "avatar");
    e.target.value = "";
  }

  async function handleBannerUpload(e) {
    const file = e.target.files?.[0];
    await uploadProfileImage(file, "banner");
    e.target.value = "";
  }

  async function handleStartConversation(targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!targetUserId) {
      setError("No target user was provided.");
      return;
    }

    if (user.id === targetUserId) {
      setError("You cannot message yourself. Use a different test user.");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const conversationId = await getOrCreateConversation(user.id, targetUserId);
      navigate(`/messages?conversation=${conversationId}`);
    } catch (err) {
      console.error("Error starting conversation:", err);
      setError(err.message || "Failed to start conversation.");
    }
  }

  function getStatusBadge(item) {
    if (item.hidden) {
      return {
        label: "Hidden by Admin",
        style: {
          backgroundColor: "#f5f5f5",
          border: "1px solid #cfcfcf",
          color: "#444",
        },
      };
    }

    if (item.status === "approved" || item.status === "published") {
      return {
        label: item.status === "published" ? "Published" : "Approved",
        style: {
          backgroundColor: "#eef9f0",
          border: "1px solid #b7dfbf",
          color: "#1f6b2a",
        },
      };
    }

    if (item.status === "pending") {
      return {
        label: "Pending Review",
        style: {
          backgroundColor: "#fff8e8",
          border: "1px solid #e7cf8a",
          color: "#8a6700",
        },
      };
    }

    return {
      label: item.status || "Unknown",
      style: {
        backgroundColor: "#f4f4f4",
        border: "1px solid #d8d8d8",
        color: "#555",
      },
    };
  }

  const fetchUploads = useCallback(async (userId) => {
    let cancelled = false;

    const run = async () => {
      try {
        setError("");
        setLoadingUploads(true);

        if (!userId) {
          setUploads([]);
          return;
        }

        const { data, error: uploadsError } = await supabase
          .from("media_items")
          .select(
            "id, created_at, title, tagline, quote, category, tags, status, hidden, access_level, file_path, owner_id"
          )
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });

        if (uploadsError) {
          throw uploadsError;
        }

        const baseUploads = (data || []).map((item) => ({
          ...item,
          previewUrl: null,
        }));

        if (cancelled) return;

        setUploads(baseUploads);
        setLoadingUploads(false);

        for (const item of baseUploads) {
          if (cancelled) return;
          if (!item.file_path) continue;

          const cleanPath = String(item.file_path).replace(/^\/+/, "");

          const { data: signed, error: signedError } = await supabase.storage
            .from("media")
            .createSignedUrl(cleanPath, 3600);

          if (cancelled) return;

          if (signedError) {
            console.error("Signed URL error:", item.id, signedError);
            continue;
          }

          const previewUrl = signed?.signedUrl || null;

          setUploads((prev) =>
            prev.map((upload) =>
              upload.id === item.id
                ? {
                    ...upload,
                    previewUrl,
                  }
                : upload
            )
          );
        }
      } catch (err) {
        console.error("Fetch uploads error:", err);
        setError(err.message || "Failed to load uploads.");
        setLoadingUploads(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadDashboard = useCallback(async () => {
    let uploadsCleanup = null;

    try {
      setError("");
      setLoadingProfile(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      setCurrentUser(user || null);

      if (!user) {
        setProfile(null);
        setUploads([]);
        setLoadingUploads(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, role, display_name, username, is_age_verified, portfolio_tagline, bio, location, quote, avatar_url, banner_url"
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const nextProfile = profileData || null;

      setProfile(nextProfile);

      setProfileForm({
        display_name: nextProfile?.display_name || "",
        username: nextProfile?.username || "",
        portfolio_tagline: nextProfile?.portfolio_tagline || "",
        bio: nextProfile?.bio || "",
        location: nextProfile?.location || "",
        quote: nextProfile?.quote || "",
        avatar_url: "",
        banner_url: "",
      });

      const [signedAvatarUrl, signedBannerUrl] = await Promise.all([
        getSignedProfileImageUrl(nextProfile?.avatar_url),
        getSignedProfileImageUrl(nextProfile?.banner_url),
      ]);

      setProfileForm((prev) => ({
        ...prev,
        avatar_url: signedAvatarUrl || "",
        banner_url: signedBannerUrl || "",
      }));

      setLoadingProfile(false);

      uploadsCleanup = fetchUploads(user.id);
    } catch (err) {
      console.error("Load creator hub error:", err);
      setError(err.message || "Failed to load Creator Hub.");
      setLoadingUploads(false);
      setLoadingProfile(false);
    }

    return () => {
      if (typeof uploadsCleanup === "function") {
        uploadsCleanup();
      }
    };
  }, [fetchUploads]);

  useEffect(() => {
    let cleanup;

    async function runLoad() {
      cleanup = await loadDashboard();
    }

    runLoad();

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [loadDashboard]);

  useEffect(() => {
    function handleRefreshOnReturn() {
      loadDashboard();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    }

    window.addEventListener("focus", handleRefreshOnReturn);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleRefreshOnReturn);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadDashboard]);

  const filteredUploads = useMemo(() => {
    if (statusFilter === "all") return uploads;

    if (statusFilter === "hidden") {
      return uploads.filter((item) => item.hidden === true);
    }

    return uploads.filter(
      (item) => item.hidden !== true && item.status === statusFilter
    );
  }, [uploads, statusFilter]);

  const role = String(profile?.role || "").toLowerCase();
  const canUseCreatorHub = role === "creator" || role === "admin";

  async function handleSaveProfile(e) {
    e.preventDefault();

    if (!currentUser?.id) {
      setError("You must be signed in.");
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        display_name: profileForm.display_name.trim() || null,
        username: profileForm.username.trim() || null,
        portfolio_tagline: profileForm.portfolio_tagline.trim() || null,
        bio: profileForm.bio.trim() || null,
        location: profileForm.location.trim() || null,
        quote: profileForm.quote.trim() || null,
        avatar_url: profile?.avatar_url || null,
        banner_url: profile?.banner_url || null,
      };

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", currentUser.id)
        .select(
          "id, role, display_name, username, is_age_verified, portfolio_tagline, bio, location, quote, avatar_url, banner_url"
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      const [refreshedAvatarUrl, refreshedBannerUrl] = await Promise.all([
        getSignedProfileImageUrl(data?.avatar_url),
        getSignedProfileImageUrl(data?.banner_url),
      ]);

      setProfile(data || null);
      setProfileForm((prev) => ({
        ...prev,
        display_name: data?.display_name || "",
        username: data?.username || "",
        portfolio_tagline: data?.portfolio_tagline || "",
        bio: data?.bio || "",
        location: data?.location || "",
        quote: data?.quote || "",
        avatar_url: refreshedAvatarUrl || "",
        banner_url: refreshedBannerUrl || "",
      }));

      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  if (loadingProfile) {
    return <div style={{ padding: "40px" }}>Loading Creator Hub...</div>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Creator Hub</h1>
        <p>Please sign in to access your creator workspace.</p>
      </div>
    );
  }

  if (!canUseCreatorHub) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Creator Hub</h1>
        <p>This area is available to creators and admins only.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Creator Hub</h1>
      <p>Welcome to your creator workspace.</p>

      {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}

      {successMessage && (
        <p style={{ color: "green", marginTop: "16px" }}>{successMessage}</p>
      )}

      <div
        style={{
          marginTop: "24px",
          marginBottom: "40px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/upload"
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            textDecoration: "none",
            color: "#111",
            backgroundColor: "#fff",
          }}
        >
          Open Upload Portal
        </Link>

        <button
          type="button"
          onClick={() => handleStartConversation(TEST_TARGET_USER_ID)}
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          Test Start Conversation
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "20px",
          marginBottom: "40px",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px 24px 0 24px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Edit Creator Profile</h2>
          <p style={{ marginTop: 0, marginBottom: "24px", opacity: 0.75 }}>
            Update the public profile details shown on your creator page.
          </p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            style={{ display: "none" }}
          />

          <div
            style={{
              position: "relative",
              padding: "0 24px 24px 24px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "260px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid #e5e5e5",
                background: "linear-gradient(135deg, #f7f7f7 0%, #efefef 100%)",
              }}
            >
              {profileForm.banner_url ? (
                <img
                  src={profileForm.banner_url}
                  alt="Profile banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: "14px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  No banner image
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.08), rgba(0,0,0,0))",
                }}
              />

              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.55)",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: "#111",
                  cursor: uploadingBanner ? "default" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: uploadingBanner ? 0.7 : 1,
                }}
              >
                {uploadingBanner ? "Uploading..." : "Change Banner"}
              </button>
            </div>

            <div
              style={{
                position: "relative",
                marginTop: "-82px",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "138px",
                      height: "138px",
                      borderRadius: "999px",
                      overflow: "hidden",
                      border: "4px solid #fff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    {profileForm.avatar_url ? (
                      <img
                        src={profileForm.avatar_url}
                        alt="Profile avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#777",
                          fontSize: "14px",
                          textAlign: "center",
                          padding: "12px",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        No image
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      style={{
                        position: "absolute",
                        right: "8px",
                        bottom: "8px",
                        padding: "7px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.65)",
                        backgroundColor: "rgba(255,255,255,0.94)",
                        color: "#111",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: uploadingAvatar ? "default" : "pointer",
                        opacity: uploadingAvatar ? 0.7 : 1,
                      }}
                    >
                      {uploadingAvatar ? "..." : "Edit"}
                    </button>
                  </div>

                  <div style={{ paddingBottom: "16px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#666",
                        fontWeight: "700",
                      }}
                    >
                      Creator profile
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: "14px",
                        color: "#444",
                        lineHeight: 1.5,
                        maxWidth: "420px",
                      }}
                    >
                      Upload your banner and profile image, then update your public
                      details below.
                    </p>
                  </div>
                </div>

                <div style={{ paddingBottom: "16px" }}>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{
                      padding: "14px 22px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#111",
                      color: "#fff",
                      cursor: savingProfile ? "default" : "pointer",
                      opacity: savingProfile ? 0.7 : 1,
                      fontWeight: "600",
                      minWidth: "150px",
                    }}
                  >
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 24px 24px 24px" }}>
            <div
              style={{
                border: "1px solid #ececec",
                borderRadius: "18px",
                padding: "20px 24px 24px 24px",
                backgroundColor: "#fcfcfc",
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "18px" }}>
                  Basic Identity
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  These details shape how your creator profile appears publicly.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Display Name
                  </label>
                  <input
                    value={profileForm.display_name}
                    onChange={(e) =>
                      handleProfileFieldChange("display_name", e.target.value)
                    }
                    placeholder="Your public name"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cfcfcf",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                    }}
                    {...getInputHandlers()}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Username
                  </label>
                  <input
                    value={profileForm.username}
                    onChange={(e) =>
                      handleProfileFieldChange("username", e.target.value)
                    }
                    placeholder="username"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cfcfcf",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                    }}
                    {...getInputHandlers()}
                  />
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "18px" }}>
                  Creator Details
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  Add your role, identity, and signature voice.
                </p>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Portfolio Tagline
                </label>
                <input
                  value={profileForm.portfolio_tagline}
                  onChange={(e) =>
                    handleProfileFieldChange("portfolio_tagline", e.target.value)
                  }
                  placeholder="A short line under your name"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cfcfcf",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  {...getInputHandlers()}
                />
              </div>

              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Quote / Signature Line
                </label>
                <input
                  value={profileForm.quote}
                  onChange={(e) => handleProfileFieldChange("quote", e.target.value)}
                  placeholder="A favorite quote, signature line, or brand statement"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cfcfcf",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  {...getInputHandlers()}
                />
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "18px" }}>
                  Bio & Location
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  Let visitors know who you are and where your work is rooted.
                </p>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Bio
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                  placeholder="Tell people about yourself"
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cfcfcf",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    resize: "vertical",
                    transition: "all 0.2s ease",
                  }}
                  {...getInputHandlers()}
                />
              </div>

              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Location
                </label>
                <input
                  value={profileForm.location}
                  onChange={(e) =>
                    handleProfileFieldChange("location", e.target.value)
                  }
                  placeholder="City, State or region"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cfcfcf",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  {...getInputHandlers()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>My Uploads</h2>
        <p>View your uploaded media details.</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "16px",
            marginBottom: "20px",
          }}
        >
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "hidden", label: "Hidden" },
            { value: "published", label: "Published" },
          ].map((filter) => {
            const isActive = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #ccc",
                  backgroundColor: isActive ? "#111" : "#fff",
                  color: isActive ? "#fff" : "#111",
                  cursor: "pointer",
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {loadingUploads ? (
          <p>Loading uploads...</p>
        ) : filteredUploads.length === 0 ? (
          <p>No uploads found for this filter.</p>
        ) : (
          <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
            {filteredUploads.map((item) => {
              const statusBadge = getStatusBadge(item);

              return (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "linear-gradient(145deg, #0c0c0c, #111)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr",
                      gap: "18px",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.title || "Uploaded media"}
                          style={{
                            width: "100%",
                            maxWidth: "220px",
                            height: "220px",
                            objectFit: "cover",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "220px",
                            height: "220px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            opacity: 0.7,
                            color: "#bbb",
                            backgroundColor: "#111",
                          }}
                        >
                          No preview
                        </div>
                      )}
                    </div>

                    <div style={{ color: "#fff" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            borderRadius: "999px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            ...statusBadge.style,
                          }}
                        >
                          {statusBadge.label}
                        </span>

                        <span
                          style={{
                            border: "1px solid rgba(255,255,255,0.14)",
                            borderRadius: "999px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            color: "#f5f5f5",
                            backgroundColor: "rgba(255,255,255,0.03)",
                          }}
                        >
                          Access: {item.access_level || "public"}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "0 0 8px 0",
                          opacity: 0.6,
                          fontSize: "13px",
                        }}
                      >
                        Uploaded {new Date(item.created_at).toLocaleString()}
                      </p>

                      {item.title && (
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          {item.title}
                        </p>
                      )}

                      {item.tagline && (
                        <p style={{ margin: "0 0 8px 0", color: "#d6d6d6" }}>
                          <strong style={{ color: "#fff" }}>Tagline:</strong> {item.tagline}
                        </p>
                      )}

                      {item.quote && (
                        <p style={{ margin: "0 0 8px 0", color: "#d6d6d6" }}>
                          <strong style={{ color: "#fff" }}>Quote:</strong> {item.quote}
                        </p>
                      )}

                      {item.category && (
                        <p style={{ margin: "0 0 8px 0", color: "#d6d6d6" }}>
                          <strong style={{ color: "#fff" }}>Category:</strong> {item.category}
                        </p>
                      )}

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <p style={{ margin: 0, color: "#d6d6d6" }}>
                          <strong style={{ color: "#fff" }}>Tags:</strong> {item.tags.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}