import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "media";
const SIGNED_URL_SECONDS = 60 * 30;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function AdminPhotographyPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [photographs, setPhotographs] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const createSignedUrl = useCallback(async (filePath) => {
    if (!filePath) return null;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, SIGNED_URL_SECONDS);

    if (error) {
      console.error("Photography signed URL error:", error);
      return null;
    }

    return data?.signedUrl || null;
  }, []);

  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true);

    try {
      const { data, error } = await supabase
        .from("photography_portfolio")
        .select("id, title, file_path, is_published, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rowsWithUrls = await Promise.all(
        (data || []).map(async (item) => ({
          ...item,
          signed_url: await createSignedUrl(item.file_path),
        }))
      );

      setPhotographs(rowsWithUrls);
    } catch (error) {
      console.error("Photography portfolio load error:", error);
      showMessage(
        error?.message || "The photography portfolio could not be loaded.",
        "error"
      );
    } finally {
      setLoadingPortfolio(false);
    }
  }, [createSignedUrl, showMessage]);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
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

    return `photography/${uniqueId}-${
      safeBaseName || "photograph"
    }.${extension}`;
  }

  async function handleUpload(event) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      showMessage("Enter a title for the photograph.", "error");
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
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("You must be signed in to upload photographs.");
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
        .from("photography_portfolio")
        .insert({
          title: cleanTitle,
          file_path: uploadedPath,
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
        "photography-file-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      showMessage("Photograph uploaded successfully.");
      await loadPortfolio();
    } catch (error) {
      console.error("Photography upload error:", error);

      showMessage(
        error?.message || "The photograph could not be uploaded.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  }

  function beginEditing(item) {
    setEditingId(item.id);
    setEditingTitle(item.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveTitle(itemId) {
    const cleanTitle = editingTitle.trim();

    if (!cleanTitle) {
      showMessage("The photograph must have a title.", "error");
      return;
    }

    setBusyId(itemId);

    try {
      const { error } = await supabase
        .from("photography_portfolio")
        .update({ title: cleanTitle })
        .eq("id", itemId);

      if (error) throw error;

      setPhotographs((current) =>
        current.map((item) =>
          item.id === itemId
            ? { ...item, title: cleanTitle }
            : item
        )
      );

      cancelEditing();
      showMessage("Title updated.");
    } catch (error) {
      console.error("Photography title update error:", error);

      showMessage(
        error?.message || "The title could not be updated.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublished(item) {
    setBusyId(item.id);

    try {
      const nextPublished = !item.is_published;

      const { error } = await supabase
        .from("photography_portfolio")
        .update({ is_published: nextPublished })
        .eq("id", item.id);

      if (error) throw error;

      setPhotographs((current) =>
        current.map((photo) =>
          photo.id === item.id
            ? { ...photo, is_published: nextPublished }
            : photo
        )
      );

      showMessage(
        nextPublished
          ? "Photograph published."
          : "Photograph hidden from the public studio."
      );
    } catch (error) {
      console.error("Photography publish update error:", error);

      showMessage(
        error?.message || "The publish status could not be changed.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deletePhotograph(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    );

    if (!confirmed) return;

    setBusyId(item.id);

    try {
      const { error: deleteRowError } = await supabase
        .from("photography_portfolio")
        .delete()
        .eq("id", item.id);

      if (deleteRowError) throw deleteRowError;

      const { error: storageDeleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.file_path]);

      if (storageDeleteError) {
        console.error(
          "Photography storage deletion warning:",
          storageDeleteError
        );
      }

      setPhotographs((current) =>
        current.filter((photo) => photo.id !== item.id)
      );

      showMessage("Photograph deleted.");
    } catch (error) {
      console.error("Photography deletion error:", error);

      showMessage(
        error?.message || "The photograph could not be deleted.",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="photography-admin-page">
      <style>{`
        .photography-admin-page {
          min-height: 100vh;
          padding: 72px 24px 110px;
          box-sizing: border-box;
          background:
            radial-gradient(
              circle at top,
              rgba(190, 145, 76, 0.12),
              transparent 34%
            ),
            #050505;
          color: #f5f1e8;
          font-family: Arial, sans-serif;
        }

        .photography-admin-shell {
          width: min(100%, 1180px);
          margin: 0 auto;
        }

        .photography-admin-eyebrow {
          margin: 0 0 14px;
          color: #d8af6a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .photography-admin-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3rem, 8vw, 5.8rem);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .photography-admin-subtitle {
          max-width: 620px;
          margin: 20px 0 0;
          color: #aaa49b;
          font-size: 15px;
          line-height: 1.8;
        }

        .photography-admin-layout {
          margin-top: 46px;
          display: grid;
          grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.35fr);
          gap: 32px;
          align-items: start;
        }

        .photography-admin-panel {
          padding: 28px;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .photography-upload-panel {
          position: sticky;
          top: 96px;
        }

        .photography-panel-title {
          margin: 0 0 24px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 500;
        }

        .photography-upload-form {
          display: grid;
          gap: 20px;
        }

        .photography-field {
          display: grid;
          gap: 9px;
        }

        .photography-label {
          color: #eee8de;
          font-size: 12px;
          font-weight: 800;
        }

        .photography-input {
          width: 100%;
          min-height: 50px;
          padding: 0 14px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 4px;
          outline: none;
          background: #171717;
          color: #ffffff;
          font-size: 15px;
        }

        .photography-file-area {
          min-height: 170px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          cursor: pointer;
          border: 1px dashed rgba(216, 175, 106, 0.5);
          background: rgba(216, 175, 106, 0.05);
        }

        .photography-file-plus {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(216, 175, 106, 0.45);
          color: #d8af6a;
          font-size: 26px;
        }

        .photography-file-title {
          color: #f6f1e8;
          font-size: 14px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .photography-file-note {
          color: #8e887f;
          font-size: 11px;
          line-height: 1.6;
        }

        .photography-hidden-input {
          display: none;
        }

        .photography-preview {
          width: 100%;
          max-height: 430px;
          display: block;
          object-fit: contain;
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .photography-primary-button,
        .photography-small-button {
          border: none;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-weight: 800;
        }

        .photography-primary-button {
          min-height: 52px;
          padding: 0 20px;
          background: #d8af6a;
          color: #090807;
          border-radius: 4px;
        }

        .photography-primary-button:disabled,
        .photography-small-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .photography-message {
          margin-bottom: 28px;
          padding: 14px 16px;
          font-size: 13px;
          line-height: 1.6;
          border-radius: 4px;
        }

        .photography-message-success {
          color: #cde9d4;
          background: rgba(39, 120, 63, 0.16);
          border: 1px solid rgba(88, 184, 112, 0.35);
        }

        .photography-message-error {
          color: #f0c5c5;
          background: rgba(150, 46, 46, 0.16);
          border: 1px solid rgba(205, 86, 86, 0.35);
        }

        .photography-portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .photography-admin-card {
          overflow: hidden;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .photography-admin-image-wrap {
          position: relative;
          aspect-ratio: 4 / 5;
          background: #080808;
        }

        .photography-admin-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .photography-status {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .photography-status-published {
          color: #d8f0de;
          background: rgba(24, 91, 45, 0.8);
        }

        .photography-status-hidden {
          color: #ead9c0;
          background: rgba(83, 61, 28, 0.85);
        }

        .photography-card-body {
          padding: 16px;
        }

        .photography-card-title {
          margin: 0 0 15px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 500;
          overflow-wrap: anywhere;
        }

        .photography-edit-row {
          display: grid;
          gap: 10px;
          margin-bottom: 14px;
        }

        .photography-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .photography-small-button {
          min-height: 34px;
          padding: 0 12px;
          border-radius: 4px;
          background: #1a1a1a;
          color: #e8e2d8;
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 11px;
        }

        .photography-small-button-gold {
          background: #d8af6a;
          color: #090807;
          border-color: #d8af6a;
        }

        .photography-small-button-danger {
          color: #efc7c7;
          border-color: rgba(205, 86, 86, 0.35);
        }

        .photography-empty,
        .photography-loading {
          padding: 70px 22px;
          text-align: center;
          color: #99938b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0b0b0b;
        }

        @media (max-width: 850px) {
          .photography-admin-layout {
            grid-template-columns: 1fr;
          }

          .photography-upload-panel {
            position: static;
          }
        }

        @media (max-width: 560px) {
          .photography-admin-page {
            padding-left: 14px;
            padding-right: 14px;
          }

          .photography-portfolio-grid {
            grid-template-columns: 1fr;
          }

          .photography-admin-panel {
            padding: 20px;
          }
        }
      `}</style>

      <section className="photography-admin-shell">
        <header>
          <p className="photography-admin-eyebrow">
            THE ASET STUDIO ADMIN
          </p>

          <h1 className="photography-admin-title">
            Photography Studio
          </h1>

          <p className="photography-admin-subtitle">
            Upload and manage photoshoot-level images. Each entry needs
            only an image and a title.
          </p>
        </header>

        <div className="photography-admin-layout">
          <section className="photography-admin-panel photography-upload-panel">
            <h2 className="photography-panel-title">
              Upload Photograph
            </h2>

            <form
              className="photography-upload-form"
              onSubmit={handleUpload}
            >
              <div className="photography-field">
                <label
                  className="photography-label"
                  htmlFor="photography-title"
                >
                  Title
                </label>

                <input
                  id="photography-title"
                  className="photography-input"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter photograph title"
                  maxLength={120}
                  disabled={uploading}
                />
              </div>

              <div className="photography-field">
                <span className="photography-label">Image</span>

                <label
                  className="photography-file-area"
                  htmlFor="photography-file-input"
                >
                  <span className="photography-file-plus">＋</span>

                  <span className="photography-file-title">
                    {file ? file.name : "Choose a photograph"}
                  </span>

                  <span className="photography-file-note">
                    Image files only · Maximum 15 MB
                  </span>
                </label>

                <input
                  id="photography-file-input"
                  className="photography-hidden-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {previewUrl ? (
                <img
                  className="photography-preview"
                  src={previewUrl}
                  alt="Selected photograph preview"
                />
              ) : null}

              <button
                className="photography-primary-button"
                type="submit"
                disabled={uploading}
              >
                {uploading
                  ? "Uploading Photograph…"
                  : "Upload Photograph"}
              </button>
            </form>
          </section>

          <section className="photography-admin-panel">
            {message ? (
              <div
                className={`photography-message ${
                  messageType === "error"
                    ? "photography-message-error"
                    : "photography-message-success"
                }`}
              >
                {message}
              </div>
            ) : null}

            <h2 className="photography-panel-title">
              Photography Portfolio
            </h2>

            {loadingPortfolio ? (
              <div className="photography-loading">
                Loading photographs…
              </div>
            ) : photographs.length === 0 ? (
              <div className="photography-empty">
                No photographs have been uploaded yet.
              </div>
            ) : (
              <div className="photography-portfolio-grid">
                {photographs.map((item) => {
                  const isEditing = editingId === item.id;
                  const isBusy = busyId === item.id;

                  return (
                    <article
                      className="photography-admin-card"
                      key={item.id}
                    >
                      <div className="photography-admin-image-wrap">
                        {item.signed_url ? (
                          <img
                            className="photography-admin-image"
                            src={item.signed_url}
                            alt={item.title}
                          />
                        ) : null}

                        <span
                          className={`photography-status ${
                            item.is_published
                              ? "photography-status-published"
                              : "photography-status-hidden"
                          }`}
                        >
                          {item.is_published
                            ? "PUBLISHED"
                            : "HIDDEN"}
                        </span>
                      </div>

                      <div className="photography-card-body">
                        {isEditing ? (
                          <div className="photography-edit-row">
                            <input
                              className="photography-input"
                              type="text"
                              value={editingTitle}
                              onChange={(event) =>
                                setEditingTitle(event.target.value)
                              }
                              maxLength={120}
                              disabled={isBusy}
                            />

                            <div className="photography-card-actions">
                              <button
                                className="photography-small-button photography-small-button-gold"
                                type="button"
                                onClick={() => saveTitle(item.id)}
                                disabled={isBusy}
                              >
                                Save
                              </button>

                              <button
                                className="photography-small-button"
                                type="button"
                                onClick={cancelEditing}
                                disabled={isBusy}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="photography-card-title">
                              {item.title}
                            </h3>

                            <div className="photography-card-actions">
                              <button
                                className="photography-small-button"
                                type="button"
                                onClick={() => beginEditing(item)}
                                disabled={isBusy}
                              >
                                Edit Title
                              </button>

                              <button
                                className="photography-small-button"
                                type="button"
                                onClick={() => togglePublished(item)}
                                disabled={isBusy}
                              >
                                {item.is_published
                                  ? "Unpublish"
                                  : "Publish"}
                              </button>

                              <button
                                className="photography-small-button photography-small-button-danger"
                                type="button"
                                onClick={() => deletePhotograph(item)}
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