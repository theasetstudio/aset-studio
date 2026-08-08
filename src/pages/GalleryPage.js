import React, { useCallback, useEffect, useState } from "react";

import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "media";
const SIGNED_URL_SECONDS = 60 * 30;

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [session, setSession] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();

      if (active) {
        setSession(data?.session ?? null);
      }
    }

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      active = false;
      listener?.subscription?.unsubscribe?.();
    };
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

    return data?.signedUrl ?? null;
  }, []);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select(
          "id, title, image_path, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rowsWithUrls = await Promise.all(
        (data ?? []).map(async (item) => ({
          ...item,
          signed_url: await createSignedUrl(item.image_path),
        }))
      );

      setItems(
        rowsWithUrls.filter((item) => Boolean(item.signed_url))
      );
    } catch (error) {
      console.error("Gallery load error:", error);

      setPageError(
        error?.message || "The Gallery could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }, [createSignedUrl]);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  async function loadComments(galleryItemId) {
    if (!galleryItemId) return;

    setCommentsLoading(true);
    setCommentError("");

    try {
      const { data, error } = await supabase
        .from("gallery_comments")
        .select(
          "id, gallery_item_id, user_id, comment, created_at"
        )
        .eq("gallery_item_id", galleryItemId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setComments(data ?? []);
    } catch (error) {
      console.error("Gallery comments load error:", error);

      setCommentError(
        error?.message || "Comments could not be loaded."
      );
    } finally {
      setCommentsLoading(false);
    }
  }

  function openItem(item) {
    setSelectedItem(item);
    setComments([]);
    setCommentText("");
    setCommentError("");
    setShareMessage("");

    void loadComments(item.id);
  }

  function closeItem() {
    setSelectedItem(null);
    setComments([]);
    setCommentText("");
    setCommentError("");
    setShareMessage("");
  }

  async function submitComment(event) {
    event.preventDefault();

    if (!selectedItem?.id) return;

    if (!session?.user?.id) {
      window.location.href = "/auth";
      return;
    }

    const cleanComment = commentText.trim();

    if (!cleanComment) {
      setCommentError("Enter a comment first.");
      return;
    }

    if (cleanComment.length > 600) {
      setCommentError(
        "Comments must be 600 characters or fewer."
      );
      return;
    }

    setCommentSubmitting(true);
    setCommentError("");

    try {
      const { data, error } = await supabase
        .from("gallery_comments")
        .insert({
          gallery_item_id: selectedItem.id,
          user_id: session.user.id,
          comment: cleanComment,
        })
        .select(
          "id, gallery_item_id, user_id, comment, created_at"
        )
        .single();

      if (error) throw error;

      setComments((current) => [...current, data]);
      setCommentText("");
    } catch (error) {
      console.error("Gallery comment error:", error);

      setCommentError(
        error?.message || "Your comment could not be posted."
      );
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function shareItem(item) {
    if (!item) return;

    const shareUrl = `${window.location.origin}/gallery?item=${item.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title || "The Aset Studio Gallery",
          text: "View this artwork in The Aset Studio Gallery.",
          url: shareUrl,
        });

        setShareMessage("Shared.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Gallery link copied.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Gallery share error:", error);
        setShareMessage("The link could not be copied.");
      }
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue));
  }

  return (
    <main className="aset-gallery-page">
      <style>{galleryStyles}</style>

      <section className="aset-gallery-hero">
        <div className="aset-gallery-hero-inner">
          <p className="aset-gallery-eyebrow">
            THE ASET STUDIO
          </p>

          <h1 className="aset-gallery-title">
            Gallery
          </h1>

          <p className="aset-gallery-intro">
            A curated exhibition of original visual work from
            The Aset Studio.
          </p>
        </div>
      </section>

      <section className="aset-gallery-content">
        {loading ? (
          <div className="aset-gallery-state">
            Preparing the Gallery...
          </div>
        ) : pageError ? (
          <div className="aset-gallery-state aset-gallery-error">
            {pageError}
          </div>
        ) : items.length === 0 ? (
          <div className="aset-gallery-empty">
            <p className="aset-gallery-eyebrow">
              CURRENTLY CURATING
            </p>

            <h2 className="aset-gallery-empty-title">
              The next exhibition is in preparation.
            </h2>

            <p className="aset-gallery-empty-text">
              New works will appear here as they are added to
              The Aset Studio Gallery.
            </p>
          </div>
        ) : (
          <div className="aset-gallery-grid">
            {items.map((item) => (
              <article
                className="aset-gallery-card"
                key={item.id}
              >
                <button
                  className="aset-gallery-image-button"
                  type="button"
                  onClick={() => openItem(item)}
                  aria-label={`Open ${item.title}`}
                >
                  <img
                    className="aset-gallery-image"
                    src={item.signed_url}
                    alt={item.title}
                    loading="lazy"
                  />
                </button>

                <div className="aset-gallery-card-body">
                  <h2 className="aset-gallery-card-title">
                    {item.title}
                  </h2>

                  <div className="aset-gallery-card-actions">
                    <button
                      className="aset-gallery-action-button"
                      type="button"
                      onClick={() => openItem(item)}
                    >
                      Comments
                    </button>

                    <button
                      className="aset-gallery-action-button"
                      type="button"
                      onClick={() => shareItem(item)}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedItem ? (
        <div
          className="aset-gallery-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeItem();
            }
          }}
        >
          <section
            className="aset-gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <div className="aset-gallery-modal-image-wrap">
              <img
                className="aset-gallery-modal-image"
                src={selectedItem.signed_url}
                alt={selectedItem.title}
              />
            </div>

            <aside className="aset-gallery-modal-sidebar">
              <button
                className="aset-gallery-close"
                type="button"
                onClick={closeItem}
                aria-label="Close artwork"
              >
                ×
              </button>

              <p className="aset-gallery-modal-eyebrow">
                THE ASET STUDIO GALLERY
              </p>

              <h2 className="aset-gallery-modal-title">
                {selectedItem.title}
              </h2>

              <div className="aset-gallery-share-row">
                <button
                  className="aset-gallery-action-button"
                  type="button"
                  onClick={() => shareItem(selectedItem)}
                >
                  Share Artwork
                </button>

                {shareMessage ? (
                  <span className="aset-gallery-share-message">
                    {shareMessage}
                  </span>
                ) : null}
              </div>

              <section className="aset-gallery-comments">
                <h3 className="aset-gallery-comments-title">
                  Comments
                </h3>

                {commentsLoading ? (
                  <p className="aset-gallery-muted">
                    Loading comments...
                  </p>
                ) : comments.length === 0 ? (
                  <p className="aset-gallery-muted">
                    No comments yet.
                  </p>
                ) : (
                  <div className="aset-gallery-comment-list">
                    {comments.map((comment) => (
                      <article
                        className="aset-gallery-comment"
                        key={comment.id}
                      >
                        <p className="aset-gallery-comment-text">
                          {comment.comment}
                        </p>

                        <div className="aset-gallery-comment-date">
                          Studio Member ·{" "}
                          {formatDate(comment.created_at)}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <form
                  className="aset-gallery-comment-form"
                  onSubmit={submitComment}
                >
                  <textarea
                    className="aset-gallery-comment-input"
                    value={commentText}
                    onChange={(event) =>
                      setCommentText(event.target.value)
                    }
                    placeholder={
                      session?.user
                        ? "Write a comment..."
                        : "Sign in to leave a comment..."
                    }
                    maxLength={600}
                    disabled={commentSubmitting}
                  />

                  {commentError ? (
                    <div className="aset-gallery-comment-error">
                      {commentError}
                    </div>
                  ) : null}

                  <button
                    className="aset-gallery-submit-comment"
                    type="submit"
                    disabled={commentSubmitting}
                  >
                    {session?.user
                      ? commentSubmitting
                        ? "Posting..."
                        : "Post Comment"
                      : "Sign In to Comment"}
                  </button>
                </form>
              </section>
            </aside>
          </section>
        </div>
      ) : null}
    </main>
  );
}

const galleryStyles = `
  .aset-gallery-page {
    min-height: 100vh;
    padding-bottom: 110px;
    background: #050505;
    color: #f4efe6;
    font-family: Arial, sans-serif;
  }

  .aset-gallery-hero {
    min-height: 52vh;
    padding: 90px 7vw 68px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    background:
      radial-gradient(
        circle at 72% 20%,
        rgba(194, 149, 76, 0.16),
        transparent 34%
      ),
      linear-gradient(135deg, #080808, #040404);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .aset-gallery-hero-inner {
    width: min(100%, 1180px);
    margin: 0 auto;
  }

  .aset-gallery-eyebrow,
  .aset-gallery-modal-eyebrow {
    margin: 0 0 15px;
    color: #d8af6a;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.24em;
  }

  .aset-gallery-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(4rem, 12vw, 9rem);
    font-weight: 500;
    line-height: 0.88;
    letter-spacing: -0.065em;
  }

  .aset-gallery-intro {
    max-width: 590px;
    margin: 28px 0 0;
    color: #aaa39a;
    font-size: 15px;
    line-height: 1.85;
  }

  .aset-gallery-content {
    width: min(100%, 1600px);
    margin: 0 auto;
    padding: 70px 60px 0;
    box-sizing: border-box;
  }

  .aset-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
    align-items: start;
  }

  .aset-gallery-card {
    width: 100%;
    overflow: hidden;
    background: #0d0d0d;
    border: 1px solid rgba(255,255,255,0.09);
    transition:
      transform 250ms ease,
      border-color 250ms ease,
      box-shadow 250ms ease;
  }

  .aset-gallery-card:hover {
    transform: translateY(-6px);
    border-color: rgba(216,175,106,0.4);
    box-shadow: 0 20px 55px rgba(0,0,0,0.42);
  }

  .aset-gallery-image-button {
    width: 100%;
    padding: 0;
    display: block;
    overflow: hidden;
    border: none;
    background: #090909;
    cursor: pointer;
  }

  .aset-gallery-image {
    width: 100%;
    aspect-ratio: 4 / 5;
    display: block;
    object-fit: cover;
    transition: transform 400ms ease;
  }

  .aset-gallery-image-button:hover .aset-gallery-image {
    transform: scale(1.03);
  }

  .aset-gallery-card-body {
    padding: 20px;
  }

  .aset-gallery-card-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.15;
  }

  .aset-gallery-card-actions {
    margin-top: 17px;
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
  }

  .aset-gallery-action-button {
    min-height: 37px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.13);
    background: #151515;
    color: #eae4db;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    transition:
      border-color 180ms ease,
      color 180ms ease,
      background 180ms ease;
  }

  .aset-gallery-action-button:hover {
    border-color: rgba(216,175,106,0.5);
    color: #e2bd7b;
    background: #191919;
  }

  .aset-gallery-state,
  .aset-gallery-empty {
    padding: 100px 24px;
    text-align: center;
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .aset-gallery-error {
    color: #efc5c5;
  }

  .aset-gallery-empty-title {
    max-width: 850px;
    margin: 0 auto;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.6rem, 7vw, 5.5rem);
    font-weight: 500;
    line-height: 1;
  }

  .aset-gallery-empty-text {
    max-width: 560px;
    margin: 20px auto 0;
    color: #918b83;
    font-size: 14px;
    line-height: 1.8;
  }

  .aset-gallery-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 5000;
    padding: 24px;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    overflow-y: auto;
    background: rgba(0,0,0,0.93);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .aset-gallery-modal {
    width: min(100%, 1280px);
    max-height: calc(100vh - 48px);
    display: grid;
    grid-template-columns:
      minmax(0, 1.45fr)
      minmax(330px, 0.7fr);
    overflow: hidden;
    background: #0b0b0b;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 40px 120px rgba(0,0,0,0.65);
  }

  .aset-gallery-modal-image-wrap {
    min-height: 640px;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #030303;
  }

  .aset-gallery-modal-image {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 48px);
    display: block;
    object-fit: contain;
  }

  .aset-gallery-modal-sidebar {
    max-height: calc(100vh - 48px);
    padding: 28px;
    box-sizing: border-box;
    overflow-y: auto;
    border-left: 1px solid rgba(255,255,255,0.09);
  }

  .aset-gallery-close {
    width: 42px;
    height: 42px;
    margin-left: auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.14);
    background: #151515;
    color: white;
    cursor: pointer;
    font-size: 18px;
  }

  .aset-gallery-modal-eyebrow {
    margin-top: 28px;
  }

  .aset-gallery-modal-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.3rem, 4vw, 4.3rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .aset-gallery-share-row {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .aset-gallery-share-message {
    color: #d8af6a;
    font-size: 11px;
  }

  .aset-gallery-comments {
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .aset-gallery-comments-title {
    margin: 0 0 18px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 25px;
    font-weight: 500;
  }

  .aset-gallery-muted {
    color: #918b83;
    font-size: 13px;
  }

  .aset-gallery-comment-list {
    display: grid;
    gap: 12px;
  }

  .aset-gallery-comment {
    padding: 14px;
    background: #141414;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .aset-gallery-comment-text {
    margin: 0;
    color: #ddd7ce;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .aset-gallery-comment-date {
    margin-top: 9px;
    color: #736e67;
    font-size: 10px;
  }

  .aset-gallery-comment-form {
    margin-top: 20px;
    display: grid;
    gap: 10px;
  }

  .aset-gallery-comment-input {
    width: 100%;
    min-height: 110px;
    padding: 13px;
    box-sizing: border-box;
    resize: vertical;
    outline: none;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.13);
    background: #151515;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 13px;
  }

  .aset-gallery-comment-error {
    color: #efbcbc;
    font-size: 11px;
  }

  .aset-gallery-submit-comment {
    min-height: 43px;
    border: none;
    border-radius: 4px;
    background: #d8af6a;
    color: #090807;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
  }

  .aset-gallery-submit-comment:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 1200px) {
    .aset-gallery-content {
      padding-left: 32px;
      padding-right: 32px;
    }

    .aset-gallery-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 26px;
    }
  }

  @media (max-width: 900px) {
    .aset-gallery-modal {
      grid-template-columns: 1fr;
      max-height: none;
    }

    .aset-gallery-modal-image-wrap {
      min-height: auto;
    }

    .aset-gallery-modal-image {
      max-height: 72vh;
    }

    .aset-gallery-modal-sidebar {
      max-height: none;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.09);
    }
  }

  @media (max-width: 768px) {
    .aset-gallery-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .aset-gallery-content {
      padding: 40px 20px 0;
    }
  }

  @media (max-width: 600px) {
    .aset-gallery-hero {
      min-height: 44vh;
      padding-left: 24px;
      padding-right: 24px;
    }

    .aset-gallery-card-title {
      font-size: 24px;
    }

    .aset-gallery-modal-backdrop {
      padding: 0;
      display: block;
    }

    .aset-gallery-modal {
      width: 100%;
      min-height: 100vh;
      border: none;
    }
  }
`;