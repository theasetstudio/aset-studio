import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "After Dark";
const SIGNED_URL_SECONDS = 60 * 30;

export default function AdminAfterDarkPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createSignedUrl = useCallback(async (imagePath) => {
    if (!imagePath) return null;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(imagePath, SIGNED_URL_SECONDS);

    if (error) {
      console.error("After Dark signed URL error:", error);
      return null;
    }

    return data?.signedUrl ?? null;
  }, []);

  const loadItems = useCallback(async () => {
    setLoadingItems(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("after_dark_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const rowsWithUrls = await Promise.all(
        (data ?? []).map(async (item) => ({
          ...item,
          signed_url: await createSignedUrl(item.image_path),
        }))
      );

      setItems(rowsWithUrls);
    } catch (error) {
      console.error("Load After Dark admin items failed:", error);

      setErrorMessage(
        error?.message || "Could not load After Dark images."
      );
    } finally {
      setLoadingItems(false);
    }
  }, [createSignedUrl]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setErrorMessage("Please add a title.");
      return;
    }

    if (!file) {
      setErrorMessage("Please choose an image.");
      return;
    }

    setUploading(true);

    let uploadedPath = "";

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeExtension = extension.replace(
        /[^a-z0-9]/g,
        ""
      );

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;

      uploadedPath = `gallery/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(uploadedPath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertError } = await supabase
        .from("after_dark_items")
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

      const fileInput =
        document.getElementById("after-dark-image-input");

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage("After Dark image published.");

      await loadItems();
    } catch (error) {
      console.error("After Dark upload failed:", error);

      setErrorMessage(
        error?.message || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}" from After Dark?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage("");
    setErrorMessage("");

    try {
      const { error: deleteRowError } =
        await supabase
          .from("after_dark_items")
          .delete()
          .eq("id", item.id);

      if (deleteRowError) {
        throw deleteRowError;
      }

      if (item.image_path) {
        const { error: storageError } =
          await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([item.image_path]);

        if (storageError) {
          console.warn(
            "Database row deleted, but storage cleanup failed:",
            storageError
          );
        }
      }

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.id !== item.id
        )
      );

      setMessage("After Dark image deleted.");
    } catch (error) {
      console.error("After Dark delete failed:", error);

      setErrorMessage(
        error?.message || "Delete failed."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <p style={styles.brand}>
          THE ASET STUDIO
        </p>

        <h1 style={styles.title}>
          AFTER DARK ADMIN
        </h1>

        <p style={styles.subtitle}>
          Upload and manage mature photography for the
          After Dark gallery.
        </p>
      </section>

      <section style={styles.container}>
        <form
          onSubmit={handleUpload}
          style={styles.uploadCard}
        >
          <p style={styles.sectionEyebrow}>
            NEW IMAGE
          </p>

          <h2 style={styles.sectionTitle}>
            Publish to After Dark
          </h2>

          <label style={styles.label}>
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Image title"
            style={styles.input}
            disabled={uploading}
          />

          <label style={styles.label}>
            Image
          </label>

          <input
            id="after-dark-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={uploading}
          />

          {file && (
            <div style={styles.selectedFile}>
              Selected: {file.name}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              ...(uploading
                ? styles.disabledButton
                : {}),
            }}
            disabled={uploading}
          >
            {uploading
              ? "UPLOADING..."
              : "PUBLISH IMAGE"}
          </button>

          {message && (
            <p style={styles.successMessage}>
              {message}
            </p>
          )}

          {errorMessage && (
            <p style={styles.errorMessage}>
              {errorMessage}
            </p>
          )}
        </form>

        <section style={styles.librarySection}>
          <div style={styles.libraryHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                GALLERY MANAGEMENT
              </p>

              <h2 style={styles.sectionTitle}>
                Published Images
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void loadItems()}
              style={styles.refreshButton}
            >
              REFRESH
            </button>
          </div>

          {loadingItems ? (
            <p style={styles.status}>
              Loading After Dark images...
            </p>
          ) : items.length === 0 ? (
            <p style={styles.status}>
              No After Dark images have been uploaded yet.
            </p>
          ) : (
            <div style={styles.grid}>
              {items.map((item) => (
                <article
                  key={item.id}
                  style={styles.card}
                >
                  <div style={styles.imageFrame}>
                    {item.signed_url ? (
                      <img
                        src={item.signed_url}
                        alt={item.title}
                        style={styles.image}
                      />
                    ) : (
                      <div style={styles.imageFallback}>
                        Preview unavailable
                      </div>
                    )}
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>
                      {item.title}
                    </h3>

                    <p style={styles.dateText}>
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : ""}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDelete(item)
                      }
                      disabled={
                        deletingId === item.id
                      }
                      style={{
                        ...styles.deleteButton,
                        ...(deletingId === item.id
                          ? styles.disabledButton
                          : {}),
                      }}
                    >
                      {deletingId === item.id
                        ? "DELETING..."
                        : "DELETE"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "120px 22px 80px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at 50% 0%, #252525 0%, #141414 34%, #090909 70%, #050505 100%)",
    color: "#f4f4f4",
  },

  header: {
    width: "min(1180px, 100%)",
    margin: "0 auto 44px",
  },

  brand: {
    margin: "0 0 10px",
    fontSize: 11,
    letterSpacing: "0.34em",
    color: "#9f9f9f",
    fontWeight: 800,
  },

  title: {
    margin: 0,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(2.4rem, 6vw, 5rem)",
    fontWeight: 400,
    letterSpacing: "0.08em",
  },

  subtitle: {
    maxWidth: 650,
    margin: "18px 0 0",
    color: "#aaa",
    lineHeight: 1.7,
  },

  container: {
    width: "min(1180px, 100%)",
    margin: "0 auto",
  },

  uploadCard: {
    padding: "30px",
    marginBottom: "52px",
    background: "#111",
    border: "1px solid #303030",
  },

  sectionEyebrow: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: "0.24em",
    color: "#858585",
    fontWeight: 800,
  },

  sectionTitle: {
    margin: "0 0 24px",
    fontSize: 28,
    fontWeight: 500,
  },

  label: {
    display: "block",
    margin: "18px 0 8px",
    fontSize: 12,
    letterSpacing: "0.08em",
    color: "#c6c6c6",
  },

  input: {
    width: "100%",
    minHeight: 48,
    padding: "0 14px",
    boxSizing: "border-box",
    border: "1px solid #3a3a3a",
    background: "#090909",
    color: "#fff",
    outline: "none",
    fontSize: 15,
  },

  fileInput: {
    display: "block",
    width: "100%",
    padding: "16px",
    boxSizing: "border-box",
    border: "1px solid #3a3a3a",
    background: "#090909",
    color: "#ccc",
  },

  selectedFile: {
    marginTop: 10,
    color: "#8f8f8f",
    fontSize: 12,
  },

  primaryButton: {
    marginTop: 24,
    minHeight: 50,
    padding: "0 22px",
    border: "1px solid #efefef",
    background: "#efefef",
    color: "#080808",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.12em",
  },

  disabledButton: {
    opacity: 0.45,
    cursor: "default",
  },

  successMessage: {
    margin: "18px 0 0",
    color: "#b9dab9",
  },

  errorMessage: {
    margin: "18px 0 0",
    color: "#e2aaaa",
  },

  librarySection: {
    paddingTop: 10,
  },

  libraryHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },

  refreshButton: {
    minHeight: 40,
    padding: "0 16px",
    border: "1px solid #3b3b3b",
    background: "transparent",
    color: "#aaa",
    cursor: "pointer",
    fontSize: 11,
    letterSpacing: "0.1em",
  },

  status: {
    padding: "36px 0",
    color: "#888",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },

  card: {
    overflow: "hidden",
    border: "1px solid #292929",
    background: "#0e0e0e",
  },

  imageFrame: {
    aspectRatio: "4 / 5",
    background: "#080808",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },

  imageFallback: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#6f6f6f",
    fontSize: 12,
  },

  cardBody: {
    padding: 16,
  },

  cardTitle: {
    margin: "0 0 8px",
    fontSize: 16,
    fontWeight: 500,
  },

  dateText: {
    margin: "0 0 16px",
    color: "#777",
    fontSize: 11,
  },

  deleteButton: {
    minHeight: 38,
    padding: "0 14px",
    border: "1px solid #573535",
    background: "transparent",
    color: "#d9a7a7",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.1em",
  },
};