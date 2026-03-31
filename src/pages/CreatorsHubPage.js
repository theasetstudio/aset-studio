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
    const signedAvatarUrl = await getSignedProfileImageUrl(profileRecord?.avatar_url);
    const signedBannerUrl = await getSignedProfileImageUrl(profileRecord?.banner_url);

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
        isAvatar ? "Profile photo updated successfully." : "Banner image updated successfully."
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

      const mappedUploads = await Promise.all(
        (data || []).map(async (item) => {
          let previewUrl = null;

          if (item.file_path) {
            const cleanPath = String(item.file_path).replace(/^\/+/, "");

            const { data: signed, error: signedError } = await supabase.storage
              .from("media")
              .createSignedUrl(cleanPath, 3600);

            if (signedError) {
              console.error("Signed URL error:", item.id, signedError);
            } else {
              previewUrl = signed?.signedUrl || null;
            }
          }

          return {
            ...item,
            previewUrl,
          };
        })
      );

      setUploads(mappedUploads);
    } catch (err) {
      console.error("Fetch uploads error:", err);
      setError(err.message || "Failed to load uploads.");
    } finally {
      setLoadingUploads(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      setLoadingProfile(true);
      setLoadingUploads(true);

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

      const signedAvatarUrl = await getSignedProfileImageUrl(nextProfile?.avatar_url);
      const signedBannerUrl = await getSignedProfileImageUrl(nextProfile?.banner_url);

      setProfileForm({
        display_name: nextProfile?.display_name || "",
        username: nextProfile?.username || "",
        portfolio_tagline: nextProfile?.portfolio_tagline || "",
        bio: nextProfile?.bio || "",
        location: nextProfile?.location || "",
        quote: nextProfile?.quote || "",
        avatar_url: signedAvatarUrl || "",
        banner_url: signedBannerUrl || "",
      });

      await fetchUploads(user.id);
    } catch (err) {
      console.error("Load creator hub error:", err);
      setError(err.message || "Failed to load Creator Hub.");
    } finally {
      setLoadingProfile(false);
      setLoadingUploads(false);
    }
  }, [fetchUploads]);

  useEffect(() => {
    loadDashboard();
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

      const refreshedAvatarUrl = await getSignedProfileImageUrl(data?.avatar_url);
      const refreshedBannerUrl = await getSignedProfileImageUrl(data?.banner_url);

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
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "40px",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Edit Creator Profile</h2>
        <p style={{ marginTop: 0, opacity: 0.75 }}>
          Update the public profile details shown on your creator page.
        </p>

        <form
          onSubmit={handleSaveProfile}
          style={{
            display: "grid",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Profile Images</h3>

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
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <div>
                <p style={{ margin: "0 0 10px 0", fontWeight: "600" }}>
                  Profile Picture
                </p>

                <div
                  style={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                  }}
                >
                  {profileForm.avatar_url ? (
                    <img
                      src={profileForm.avatar_url}
                      alt="Profile avatar"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "999px",
                        border: "1px solid #ddd",
                        display: "block",
                        backgroundColor: "#f7f7f7",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "999px",
                        border: "1px dashed #bbb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#777",
                        fontSize: "14px",
                        backgroundColor: "#fafafa",
                        textAlign: "center",
                        padding: "12px",
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
                      marginTop: "12px",
                      width: "120px",
                      padding: "10px 12px",
                      borderRadius: "999px",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      cursor: uploadingAvatar ? "default" : "pointer",
                      fontSize: "13px",
                      opacity: uploadingAvatar ? 0.7 : 1,
                    }}
                  >
                    {uploadingAvatar ? "Uploading..." : "Change Photo"}
                  </button>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "600" }}>Banner Image</p>

                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "999px",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      cursor: uploadingBanner ? "default" : "pointer",
                      fontSize: "13px",
                      opacity: uploadingBanner ? 0.7 : 1,
                    }}
                  >
                    {uploadingBanner ? "Uploading..." : "Change Banner"}
                  </button>
                </div>

                {profileForm.banner_url ? (
                  <img
                    src={profileForm.banner_url}
                    alt="Profile banner"
                    style={{
                      width: "100%",
                      maxWidth: "520px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "14px",
                      border: "1px solid #ddd",
                      display: "block",
                      backgroundColor: "#f7f7f7",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "520px",
                      height: "180px",
                      borderRadius: "14px",
                      border: "1px dashed #bbb",
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
              </div>
            </div>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                fontSize: "13px",
                opacity: 0.7,
              }}
            >
              Click the profile photo or banner buttons to upload new images.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Profile Details</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
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
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
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
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
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
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Quote / Signature Line
              </label>
              <input
                value={profileForm.quote}
                onChange={(e) => handleProfileFieldChange("quote", e.target.value)}
                placeholder="A favorite quote, signature line, or brand statement"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                placeholder="Tell people about yourself"
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
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
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingProfile}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#111",
                color: "#fff",
                cursor: "pointer",
                opacity: savingProfile ? 0.7 : 1,
              }}
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
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
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr",
                      gap: "16px",
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
                            borderRadius: "12px",
                            border: "1px solid #ddd",
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
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                            opacity: 0.7,
                          }}
                        >
                          No preview
                        </div>
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            borderRadius: "999px",
                            padding: "4px 10px",
                            fontSize: "14px",
                            fontWeight: "600",
                            ...statusBadge.style,
                          }}
                        >
                          {statusBadge.label}
                        </span>

                        <span
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "999px",
                            padding: "4px 10px",
                            fontSize: "14px",
                          }}
                        >
                          Access: {item.access_level || "public"}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 12px 0", opacity: 0.7 }}>
                        Uploaded {new Date(item.created_at).toLocaleString()}
                      </p>

                      {item.title && (
                        <p style={{ margin: "0 0 8px 0" }}>
                          <strong>Title:</strong> {item.title}
                        </p>
                      )}

                      {item.tagline && (
                        <p style={{ margin: "0 0 8px 0" }}>
                          <strong>Tagline:</strong> {item.tagline}
                        </p>
                      )}

                      {item.quote && (
                        <p style={{ margin: "0 0 8px 0" }}>
                          <strong>Quote:</strong> {item.quote}
                        </p>
                      )}

                      {item.category && (
                        <p style={{ margin: "0 0 8px 0" }}>
                          <strong>Category:</strong> {item.category}
                        </p>
                      )}

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <p style={{ margin: "0" }}>
                          <strong>Tags:</strong> {item.tags.join(", ")}
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