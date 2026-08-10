import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

const MEDIA_BUCKET = "media";

export default function CreatorUploadPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [quote, setQuote] = useState("");
  const [category, setCategory] = useState("videos");
  const [accessLevel, setAccessLevel] = useState("public");
  const [status, setStatus] = useState("published");
  const [hidden, setHidden] = useState(false);
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAuth() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!alive) return;

        const currentSession = data?.session ?? null;
        setSession(currentSession);

        if (!currentSession?.user?.id) return;

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, role, display_name")
            .eq("id", currentSession.user.id)
            .single();

        if (profileError) {
          console.warn("Profile fetch warning:", profileError);
          return;
        }

        if (alive) {
          setProfile(profileData ?? null);
        }
      } catch (error) {
        console.error("Auth load error:", error);
      }
    }

    loadAuth();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        async (_event, nextSession) => {
          setSession(nextSession);

          if (!nextSession?.user?.id) {
            setProfile(null);
            return;
          }

          const { data: profileData } =
            await supabase
              .from("profiles")
              .select("id, role, display_name")
              .eq("id", nextSession.user.id)
              .single();

          setProfile(profileData ?? null);
        }
      );

    return () => {
      alive = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const previewUrl = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  function slugify(value) {
    return String(value || "aset-upload")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function getMediaType(selectedFile) {
    if (!selectedFile?.type) return "file";

    if (selectedFile.type.startsWith("video/")) {
      return "video";
    }

    if (selectedFile.type.startsWith("image/")) {
      return "image";
    }

    return "file";
  }

  function resetForm() {
    setTitle("");
    setTagline("");
    setQuote("");
    setCategory("videos");
    setAccessLevel("public");
    setStatus("published");
    setHidden(false);
    setTags("");
    setFile(null);
  }

  async function handleUpload(e) {
    e.preventDefault();

    setMessage("");
    setDebugInfo("");

    if (!file) {
      setMessage("Choose a video or image first.");
      return;
    }

    if (!title.trim()) {
      setMessage("Add a title first.");
      return;
    }

    setUploading(true);

    try {
      setMessage("Step 1: Preparing upload...");

      const userId =
        session?.user?.id || "aset-studio";

      const cleanTitle = slugify(title);

      const extension = file.name.includes(".")
        ? file.name.split(".").pop()
        : "file";

      const mediaType = getMediaType(file);

      const filePath =
        `${userId}/${mediaType}/${Date.now()}-${cleanTitle}.${extension}`;

      setDebugInfo(`File path: ${filePath}`);

      setMessage(
        "Step 2: Uploading file to Supabase Storage..."
      );

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type ||
            "application/octet-stream",
        });

      console.log("UPLOAD RESULT:", {
        uploadData,
        uploadError,
      });

      if (uploadError) {
        throw new Error(
          `Storage upload failed: ${uploadError.message}`
        );
      }

      setMessage(
        "Step 3: File uploaded. Saving media record..."
      );

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const mediaRecord = {
        title: title.trim(),
        tagline:
          tagline.trim() || null,
        quote:
          quote.trim() || null,
        category,
        tags: tagArray,
        access_level: accessLevel,
        status,
        hidden,
        file_path: filePath,
        watermarked_path: null,
        owner_id:
          session?.user?.id || null,
      };

      console.log(
        "MEDIA RECORD:",
        mediaRecord
      );

      const {
        data: insertData,
        error: insertError,
      } = await supabase
        .from("media_items")
        .insert(mediaRecord)
        .select();

      console.log("INSERT RESULT:", {
        insertData,
        insertError,
      });

      if (insertError) {
        throw new Error(
          `Database insert failed: ${insertError.message}`
        );
      }

      setMessage(
        "Upload complete. Check Gallery and Videos."
      );

      setDebugInfo(
        `Saved media ID: ${
          insertData?.[0]?.id ||
          "created"
        }`
      );

      resetForm();
    } catch (error) {
      console.error(
        "UPLOAD FAILED:",
        error
      );

      setMessage(
        error.message ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="creator-upload-page">
      <style>
        {`
          .creator-upload-page {
            min-height: 100vh;
            padding: 48px 20px;
            background:
              radial-gradient(
                circle at top left,
                rgba(212, 175, 55, 0.14),
                transparent 32%
              ),
              linear-gradient(
                135deg,
                #070707,
                #161616 55%,
                #050505
              );
            color: #fff;
          }

          .upload-shell {
            max-width: 920px;
            margin: 0 auto;
          }

          .upload-hero {
            margin-bottom: 28px;
          }

          .upload-kicker {
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #d4af37;
            font-size: 12px;
            margin-bottom: 10px;
          }

          .upload-title {
            font-size: clamp(
              34px,
              6vw,
              64px
            );
            line-height: 0.95;
            margin: 0;
          }

          .upload-subtitle {
            max-width: 680px;
            opacity: 0.78;
            margin-top: 14px;
            font-size: 16px;
          }

          .upload-card {
            background:
              rgba(255, 255, 255, 0.07);
            border:
              1px solid
              rgba(255, 255, 255, 0.12);
            border-radius: 24px;
            padding: 24px;
            box-shadow:
              0 24px 80px
              rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(18px);
          }

          .upload-grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 16px;
          }

          .field {
            display: grid;
            gap: 8px;
          }

          .field.full {
            grid-column: 1 / -1;
          }

          label {
            font-size: 13px;
            opacity: 0.82;
          }

          input,
          select,
          textarea {
            width: 100%;
            box-sizing: border-box;
            border-radius: 14px;
            border:
              1px solid
              rgba(255, 255, 255, 0.14);
            background:
              rgba(0, 0, 0, 0.38);
            color: #fff;
            padding: 13px 14px;
            outline: none;
          }

          textarea {
            min-height: 90px;
            resize: vertical;
          }

          input[type="file"] {
            padding: 14px;
          }

          .upload-preview {
            margin-top: 18px;
            border-radius: 18px;
            overflow: hidden;
            background:
              rgba(0, 0, 0, 0.35);
            border:
              1px solid
              rgba(255, 255, 255, 0.1);
          }

          .upload-preview img,
          .upload-preview video {
            width: 100%;
            display: block;
            max-height: 420px;
            object-fit: contain;
          }

          .upload-actions {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-top: 22px;
            flex-wrap: wrap;
          }

          .upload-btn {
            border: none;
            border-radius: 999px;
            padding: 14px 22px;
            cursor: pointer;
            background: #d4af37;
            color: #111;
            font-weight: 800;
          }

          .upload-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .upload-message {
            margin-top: 16px;
            padding: 14px 16px;
            border-radius: 14px;
            background:
              rgba(255, 255, 255, 0.08);
          }

          .upload-debug {
            margin-top: 10px;
            padding: 12px 14px;
            border-radius: 14px;
            background:
              rgba(0, 0, 0, 0.35);
            font-size: 13px;
            opacity: 0.8;
            word-break: break-word;
          }

          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
          }

          .checkbox-row input {
            width: auto;
          }

          @media (max-width: 720px) {
            .upload-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="upload-shell">
        <div className="upload-hero">
          <div className="upload-kicker">
            The Aset Studio
          </div>

          <h1 className="upload-title">
            Creator Upload
          </h1>

          <p className="upload-subtitle">
            Upload videos and images into
            the Aset media library.
            Published items feed the
            Gallery, Videos page, and
            media detail pages.
          </p>
        </div>

        <form
          className="upload-card"
          onSubmit={handleUpload}
        >
          <div className="upload-grid">
            <div className="field full">
              <label>Title</label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Example: Aset Cinema Teaser"
                required
              />
            </div>

            <div className="field full">
              <label>Tagline</label>

              <input
                value={tagline}
                onChange={(e) =>
                  setTagline(e.target.value)
                }
                placeholder="Short description for the card"
              />
            </div>

            <div className="field full">
              <label>
                Quote / Caption
              </label>

              <textarea
                value={quote}
                onChange={(e) =>
                  setQuote(e.target.value)
                }
                placeholder="Optional caption, quote, or content note"
              />
            </div>

            <div className="field">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >
                <option value="videos">
                  Videos
                </option>

                <option value="gallery">
                  Gallery
                </option>

                <option value="featured">
                  Featured
                </option>

                <option value="spotlight">
                  Spotlight
                </option>

                <option value="aset-cinema">
                  Aset Cinema
                </option>
              </select>
            </div>

            <div className="field">
              <label>
                Access Level
              </label>

              <select
                value={accessLevel}
                onChange={(e) =>
                  setAccessLevel(
                    e.target.value
                  )
                }
              >
                <option value="public">
                  Public
                </option>

                <option value="supreme">
                  Supreme Access
                </option>

                <option value="boudoir">
                  Age Verified
                </option>
              </select>
            </div>

            <div className="field">
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="pending">
                  Pending
                </option>
              </select>
            </div>

            <div className="field">
              <label>Tags</label>

              <input
                value={tags}
                onChange={(e) =>
                  setTags(e.target.value)
                }
                placeholder="trailer, promo, interview"
              />
            </div>

            <div className="field full">
              <label>
                Upload File
              </label>

              <input
                type="file"
                accept="image/*,video/*"
                disabled={uploading}
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ??
                      null
                  )
                }
              />
            </div>

            <div className="field full">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={hidden}
                  disabled={uploading}
                  onChange={(e) =>
                    setHidden(
                      e.target.checked
                    )
                  }
                />

                Hide this item from
                public galleries
              </label>
            </div>
          </div>

          {file && previewUrl && (
            <div className="upload-preview">
              {file.type.startsWith(
                "video/"
              ) ? (
                <video
                  src={previewUrl}
                  controls
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Upload preview"
                />
              )}
            </div>
          )}

          <div className="upload-actions">
            <button
              className="upload-btn"
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Content"}
            </button>

            <span
              style={{ opacity: 0.7 }}
            >
              {profile?.display_name
                ? `Signed in as ${profile.display_name}`
                : session?.user?.email ||
                  "Uploading as The Aset Studio"}
            </span>
          </div>

          {message && (
            <div className="upload-message">
              {message}
            </div>
          )}

          {debugInfo && (
            <div className="upload-debug">
              {debugInfo}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}