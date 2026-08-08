import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "media";
const SIGNED_URL_SECONDS = 60 * 30;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function AdminGalleryPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const createSignedUrl = useCallback(async (imagePath) => {
    if (!imagePath) return null;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(imagePath, SIGNED_URL_SECONDS);

    if (error) {
      console.error("Gallery signed URL error:", error);
      return null;
    }

    return data?.signedUrl || null;
  }, []);

  const loadGallery = useCallback(async () => {
    setLoadingGallery(true);

    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id, title, image_path, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rowsWithUrls = await Promise.all(
        (data || []).map(async (item) => ({
          ...item,
          signed_url: await createSignedUrl(item.image_path),
        }))
      );

      setGalleryItems(rowsWithUrls);
    } catch (error) {
      console.error("Gallery admin load error:", error);

      showMessage(
        error?.message || "The Gallery could not be loaded.",
        "error"
      );
    } finally {
      setLoadingGallery(false);
    }
  }, [createSignedUrl, showMessage]);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] || null;

    setMessage("");
    setMessageType("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFile(null);
      showMessage("Please choose an image file.", "error");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      showMessage("The image must be smaller than 15 MB.", "error");
      return;
    }

    setFile(selectedFile);
  }

  function createStoragePath(originalName) {
    const extension =
      originalName.split(".").pop()?.toLowerCase() || "jpg";

    const safeBaseName = originalName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `gallery/${uniqueId}-${
      safeBaseName || "artwork"
    }.${extension}`;
  }

  async function handleUpload(event) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      showMessage("Enter a title for the artwork.", "error");
      return;
    }

    if (!file) {
      showMessage("Choose an image to upload.", "error");
      return;
    }

    setUploading(true);
    setMessage("");
    setMessageType("");

    let uploadedPath = "";

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error(
          "You must be signed in to upload Gallery artwork."
        );
      }

      uploadedPath = createStoragePath(file.name);

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(uploadedPath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("gallery_items")
        .insert({
          title: cleanTitle,
          image_path: uploadedPath,
          is_published: true,
        });

      if (insertError) {
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([uploadedPath]);

        throw insertError;
      }

      setTitle("");
      setFile(null);
      setPreviewUrl("");

      const fileInput = document.getElementById(
        "gallery-file-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      showMessage("Artwork published successfully.");
      await loadGallery();
    } catch (error) {
      console.error("Gallery upload error:", error);

      showMessage(
        error?.message || "The artwork could not be uploaded.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  }

  function beginEditing(item) {
    setEditingId(item.id);
    setEditingTitle(item.title || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveTitle(itemId) {
    const cleanTitle = editingTitle.trim();

    if (!cleanTitle) {
      showMessage("The artwork must have a title.", "error");
      return;
    }

    setBusyId(itemId);

    try {
      const { error } = await supabase
        .from("gallery_items")
        .update({
          title: cleanTitle,
        })
        .eq("id", itemId);

      if (error) throw error;

      setGalleryItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? {
                ...item,
                title: cleanTitle,
              }
            : item
        )
      );

      cancelEditing();
      showMessage("Title updated.");
    } catch (error) {
      console.error("Gallery title edit error:", error);

      showMessage(
        error?.message || "The title could not be updated.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteArtwork(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    );

    if (!confirmed) return;

    setBusyId(item.id);

    try {
      const { error: deleteRowError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", item.id);

      if (deleteRowError) throw deleteRowError;

      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.image_path]);

      if (storageError) {
        console.warn(
          "Gallery storage cleanup warning:",
          storageError
        );
      }

      setGalleryItems((current) =>
        current.filter(
          (galleryItem) => galleryItem.id !== item.id
        )
      );

      showMessage("Artwork deleted.");
    } catch (error) {
      console.error("Gallery deletion error:", error);

      showMessage(
        error?.message || "The artwork could not be deleted.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="gallery-admin-page">
      <style>{galleryAdminStyles}</style>

      <header className="gallery-admin-bar">
        <button
          type="button"
          className="gallery-admin-brand"
          onClick={() => navigate("/admin")}
        >
          THE ASET STUDIO ADMIN
        </button>

        <div className="gallery-admin-bar-actions">
          <button
            type="button"
            className="gallery-admin-bar-button"
            onClick={() => navigate("/gallery")}
          >
            View Gallery
          </button>

          <button
            type="button"
            className="gallery-admin-bar-button"
            onClick={() => navigate("/admin")}
          >
            Control Room
          </button>
        </div>
      </header>

      <section className="gallery-admin-shell">
        <header className="gallery-admin-hero">
          <p className="gallery-admin-eyebrow">
            THE ASET STUDIO ADMIN
          </p>

          <h1 className="gallery-admin-title">
            Gallery
          </h1>

          <p className="gallery-admin-intro">
            Upload artwork with only an image and title.
          </p>
        </header>

        <div className="gallery-admin-workspace">
          <section className="gallery-upload-section">
            <h2 className="gallery-admin-panel-title">
              Upload Artwork
            </h2>

            <form
              className="gallery-upload-form"
              onSubmit={handleUpload}
            >
              <div className="gallery-admin-field">
                <label
                  className="gallery-admin-label"
                  htmlFor="gallery-title"
                >
                  Title
                </label>

                <input
                  id="gallery-title"
                  className="gallery-admin-input"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter artwork title"
                  maxLength={140}
                  disabled={uploading}
                />
              </div>

              <div className="gallery-admin-field">
                <span className="gallery-admin-label">
                  Image
                </span>

                <label
                  className="gallery-file-area"
                  htmlFor="gallery-file-input"
                >
                  <span className="gallery-file-plus">
                    ＋
                  </span>

                  <span className="gallery-file-title">
                    {file
                      ? file.name
                      : "Choose artwork"}
                  </span>

                  <span className="gallery-file-note">
                    Image files only · Maximum 15 MB
                  </span>
                </label>

                <input
                  id="gallery-file-input"
                  className="gallery-hidden-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {previewUrl ? (
                <img
                  className="gallery-upload-preview"
                  src={previewUrl}
                  alt="Selected artwork preview"
                />
              ) : null}

              <button
                className="gallery-primary-button"
                type="submit"
                disabled={uploading}
              >
                {uploading
                  ? "Publishing Artwork…"
                  : "Publish Artwork"}
              </button>
            </form>
          </section>

          <section className="gallery-collection-section">
            <div className="gallery-collection-heading">
              <div>
                <p className="gallery-admin-eyebrow">
                  COLLECTION
                </p>

                <h2 className="gallery-collection-title">
                  Gallery Collection
                </h2>
              </div>

              <span className="gallery-collection-count">
                Collection · {galleryItems.length}{" "}
                {galleryItems.length === 1
                  ? "Artwork"
                  : "Artworks"}
              </span>
            </div>

            {message ? (
              <div
                className={`gallery-admin-message ${
                  messageType === "error"
                    ? "gallery-admin-message-error"
                    : "gallery-admin-message-success"
                }`}
              >
                {message}
              </div>
            ) : null}

            {loadingGallery ? (
              <div className="gallery-admin-state">
                Loading artwork…
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="gallery-admin-state">
                No Gallery artwork has been uploaded yet.
              </div>
            ) : (
              <div className="gallery-admin-grid">
                {galleryItems.map((item) => {
                  const isEditing =
                    editingId === item.id;

                  const isBusy =
                    busyId === item.id;

                  return (
                    <article
                      className="gallery-admin-card"
                      key={item.id}
                    >
                      <div className="gallery-admin-image-wrap">
                        {item.signed_url ? (
                          <img
                            className="gallery-admin-image"
                            src={item.signed_url}
                            alt={item.title}
                          />
                        ) : (
                          <div className="gallery-admin-image-fallback">
                            Preview unavailable
                          </div>
                        )}
                      </div>

                      <div className="gallery-admin-card-body">
                        {isEditing ? (
                          <>
                            <input
                              className="gallery-admin-input"
                              type="text"
                              value={editingTitle}
                              onChange={(event) =>
                                setEditingTitle(
                                  event.target.value
                                )
                              }
                              maxLength={140}
                              disabled={isBusy}
                            />

                            <div className="gallery-admin-actions">
                              <button
                                className="gallery-small-button gallery-small-button-gold"
                                type="button"
                                onClick={() =>
                                  saveTitle(item.id)
                                }
                                disabled={isBusy}
                              >
                                Save
                              </button>

                              <button
                                className="gallery-small-button"
                                type="button"
                                onClick={cancelEditing}
                                disabled={isBusy}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="gallery-admin-card-title">
                              {item.title}
                            </h3>

                            <div className="gallery-admin-actions">
                              <button
                                className="gallery-small-button"
                                type="button"
                                onClick={() =>
                                  beginEditing(item)
                                }
                                disabled={isBusy}
                              >
                                Edit Title
                              </button>

                              <button
                                className="gallery-small-button gallery-small-button-danger"
                                type="button"
                                onClick={() =>
                                  deleteArtwork(item)
                                }
                                disabled={isBusy}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

const galleryAdminStyles = `
  .gallery-admin-page {
    min-height: 100vh;
    background:
      radial-gradient(
        circle at 15% 8%,
        rgba(202, 154, 84, 0.13),
        transparent 29%
      ),
      #050505;
    color: #f4efe6;
    font-family: Arial, sans-serif;
  }

  .gallery-admin-bar {
    min-height: 70px;
    padding: 0 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    position: sticky;
    top: 0;
    z-index: 2000;
    box-sizing: border-box;
    background: rgba(5, 5, 5, 0.93);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .gallery-admin-brand {
    padding: 0;
    border: none;
    background: transparent;
    color: #f3eee7;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
  }

  .gallery-admin-bar-actions {
    display: flex;
    gap: 9px;
  }

  .gallery-admin-bar-button {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #111;
    color: #e5dfd7;
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
  }

  .gallery-admin-shell {
    width: min(100%, 1400px);
    margin: 0 auto;
    padding: 68px 24px 110px;
    box-sizing: border-box;
  }

  .gallery-admin-hero {
    max-width: 680px;
    margin-bottom: 38px;
  }

  .gallery-admin-eyebrow {
    margin: 0 0 13px;
    color: #d8af6a;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.23em;
  }

  .gallery-admin-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3.7rem, 8vw, 6.7rem);
    font-weight: 500;
    line-height: 0.9;
    letter-spacing: -0.06em;
  }

  .gallery-admin-intro {
    margin: 20px 0 0;
    color: #a59f97;
    font-size: 13px;
  }

  .gallery-admin-workspace {
    display: grid;
    grid-template-columns:
      minmax(300px, 0.72fr)
      minmax(0, 1.7fr);
    gap: 34px;
    align-items: start;
  }

  .gallery-upload-section {
    padding: 26px;
    position: sticky;
    top: 94px;
    background: #0d0d0d;
    border: 1px solid rgba(255,255,255,0.09);
  }

  .gallery-admin-panel-title,
  .gallery-collection-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 500;
  }

  .gallery-admin-panel-title {
    margin-bottom: 22px;
    font-size: 28px;
  }

  .gallery-upload-form {
    display: grid;
    gap: 17px;
  }

  .gallery-admin-field {
    display: grid;
    gap: 8px;
  }

  .gallery-admin-label {
    color: #eee7de;
    font-size: 11px;
    font-weight: 800;
  }

  .gallery-admin-input {
    width: 100%;
    min-height: 48px;
    box-sizing: border-box;
    padding: 12px 13px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.13);
    outline: none;
    background: #171717;
    color: white;
    font-size: 14px;
  }

  .gallery-file-area {
    min-height: 158px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    text-align: center;
    cursor: pointer;
    background: rgba(216,175,106,0.05);
    border: 1px dashed rgba(216,175,106,0.48);
  }

  .gallery-file-plus {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #d8af6a;
    border: 1px solid rgba(216,175,106,0.42);
    font-size: 25px;
  }

  .gallery-file-title {
    color: #f4efe6;
    font-size: 13px;
    font-weight: 800;
  }

  .gallery-file-note {
    color: #89837c;
    font-size: 10px;
  }

  .gallery-hidden-input {
    display: none;
  }

  .gallery-upload-preview {
    width: 100%;
    max-height: 390px;
    display: block;
    object-fit: contain;
    background: #050505;
  }

  .gallery-primary-button {
    min-height: 50px;
    border: none;
    border-radius: 4px;
    background: #d8af6a;
    color: #090807;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
  }

  .gallery-primary-button:disabled,
  .gallery-small-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .gallery-collection-section {
    min-width: 0;
  }

  .gallery-collection-heading {
    margin-bottom: 22px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
  }

  .gallery-collection-title {
    font-size: clamp(2.7rem, 5vw, 4.5rem);
    line-height: 0.95;
  }

  .gallery-collection-count {
    color: #8f8982;
    font-size: 11px;
    white-space: nowrap;
  }

  .gallery-admin-message {
    margin-bottom: 22px;
    padding: 13px 15px;
    font-size: 12px;
  }

  .gallery-admin-message-success {
    color: #cde9d4;
    background: rgba(39,120,63,0.16);
    border: 1px solid rgba(88,184,112,0.35);
  }

  .gallery-admin-message-error {
    color: #efc4c4;
    background: rgba(150,46,46,0.16);
    border: 1px solid rgba(205,86,86,0.35);
  }

  .gallery-admin-state {
    padding: 80px 24px;
    text-align: center;
    color: #928c84;
    background: #090909;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .gallery-admin-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .gallery-admin-card {
    overflow: hidden;
    background: #111;
    border: 1px solid rgba(255,255,255,0.09);
  }

  .gallery-admin-image-wrap {
    aspect-ratio: 4 / 5;
    background: #080808;
  }

  .gallery-admin-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .gallery-admin-image-fallback {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: #777;
    font-size: 11px;
  }

  .gallery-admin-card-body {
    padding: 16px;
  }

  .gallery-admin-card-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.2;
  }

  .gallery-admin-actions {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .gallery-small-button {
    min-height: 34px;
    padding: 0 12px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #191919;
    color: #e6e0d8;
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
  }

  .gallery-small-button-gold {
    background: #d8af6a;
    color: #090807;
    border-color: #d8af6a;
  }

  .gallery-small-button-danger {
    color: #efc4c4;
    border-color: rgba(205,86,86,0.35);
  }

  @media (max-width: 1100px) {
    .gallery-admin-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 850px) {
    .gallery-admin-workspace {
      grid-template-columns: 1fr;
    }

    .gallery-upload-section {
      position: static;
      max-width: 520px;
    }
  }

  @media (max-width: 580px) {
    .gallery-admin-bar {
      padding: 10px 14px;
      flex-wrap: wrap;
    }

    .gallery-admin-shell {
      padding-left: 14px;
      padding-right: 14px;
    }

    .gallery-admin-grid {
      grid-template-columns: 1fr;
    }

    .gallery-upload-section {
      padding: 20px;
    }

    .gallery-collection-heading {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;