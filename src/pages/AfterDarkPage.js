import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabaseClient";

const STORAGE_BUCKET = "After Dark";
const SIGNED_URL_SECONDS = 60 * 30;
const PAGE_SIZE = 12;

function getVisitorId() {
  const storageKey = "aset_after_dark_visitor_id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
}

export default function AfterDarkPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [ageConfirmed, setAgeConfirmed] =
    useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [likesByItem, setLikesByItem] =
    useState({});

  const [likedByVisitor, setLikedByVisitor] =
    useState({});

  const [comments, setComments] =
    useState([]);

  const [commentText, setCommentText] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [saveLoading, setSaveLoading] =
    useState(false);

  const [savedByUser, setSavedByUser] =
    useState(false);

  const [shareMessage, setShareMessage] =
    useState("");

  const visitorId = useMemo(
    () => getVisitorId(),
    []
  );

  const sharedImageId = useMemo(() => {
    const params = new URLSearchParams(
      location.search
    );

    return params.get("image");
  }, [location.search]);

  const createSignedUrl = useCallback(
    async (imagePath) => {
      if (!imagePath) return null;

      const { data, error } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(
            imagePath,
            SIGNED_URL_SECONDS
          );

      if (error) {
        console.error(
          "After Dark signed URL error:",
          error
        );

        return null;
      }

      return data?.signedUrl ?? null;
    },
    []
  );

  const loadLikes = useCallback(
    async (galleryItems) => {
      if (!galleryItems?.length) {
        setLikesByItem({});
        setLikedByVisitor({});
        return;
      }

      const itemIds = galleryItems.map(
        (item) => item.id
      );

      const { data, error } = await supabase
        .from("after_dark_likes")
        .select(
          "after_dark_item_id, visitor_id"
        )
        .in(
          "after_dark_item_id",
          itemIds
        );

      if (error) {
        console.error(
          "After Dark likes load error:",
          error
        );

        return;
      }

      const counts = {};
      const likedMap = {};

      (data ?? []).forEach((like) => {
        const itemId =
          like.after_dark_item_id;

        counts[itemId] =
          (counts[itemId] || 0) + 1;

        if (
          like.visitor_id === visitorId
        ) {
          likedMap[itemId] = true;
        }
      });

      setLikesByItem(counts);
      setLikedByVisitor(likedMap);
    },
    [visitorId]
  );

  const loadAfterDark =
    useCallback(async () => {
      setLoading(true);
      setPageError("");

      try {
        const { data, error } =
          await supabase
            .from("after_dark_items")
            .select(
              "id, title, image_path, is_published, created_at"
            )
            .eq("is_published", true)
            .order("created_at", {
              ascending: false,
            });

        if (error) {
          throw error;
        }

        const rowsWithUrls =
          await Promise.all(
            (data ?? []).map(
              async (item) => ({
                ...item,
                signed_url:
                  await createSignedUrl(
                    item.image_path
                  ),
              })
            )
          );

        const validItems =
          rowsWithUrls.filter(
            (item) =>
              Boolean(item.signed_url)
          );

        setItems(validItems);

        await loadLikes(validItems);

        if (sharedImageId) {
          const sharedItem =
            validItems.find(
              (item) =>
                item.id === sharedImageId
            );

          if (sharedItem) {
            setSelectedItem(sharedItem);

            const itemIndex =
              validItems.findIndex(
                (item) =>
                  item.id ===
                  sharedImageId
              );

            if (itemIndex >= 0) {
              setCurrentPage(
                Math.floor(
                  itemIndex / PAGE_SIZE
                ) + 1
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "After Dark load error:",
          error
        );

        setPageError(
          error?.message ||
            "After Dark could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, [
      createSignedUrl,
      loadLikes,
      sharedImageId,
    ]);

  useEffect(() => {
    if (!ageConfirmed) return;

    void loadAfterDark();
  }, [
    ageConfirmed,
    loadAfterDark,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / PAGE_SIZE)
  );

  const visibleItems = useMemo(() => {
    const start =
      (currentPage - 1) * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    return items.slice(start, end);
  }, [items, currentPage]);

  function handleEnter() {
    setAgeConfirmed(true);
  }

  function handleExit() {
    navigate("/");
  }

  function goToPage(pageNumber) {
    const safePage = Math.min(
      Math.max(pageNumber, 1),
      totalPages
    );

    setCurrentPage(safePage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function openLightbox(item) {
    setSelectedItem(item);
    setCommentText("");
    setShareMessage("");
    setSavedByUser(false);

    navigate(
      `/after-dark?image=${encodeURIComponent(
        item.id
      )}`,
      {
        replace: true,
      }
    );

    await Promise.all([
      loadComments(item.id),
      checkSavedStatus(item.id),
    ]);
  }

  function closeLightbox() {
    setSelectedItem(null);
    setComments([]);
    setCommentText("");
    setShareMessage("");

    navigate("/after-dark", {
      replace: true,
    });
  }

  async function loadComments(itemId) {
    if (!itemId) return;

    const { data, error } = await supabase
      .from("after_dark_comments")
      .select(
        "id, comment, created_at, visitor_id"
      )
      .eq(
        "after_dark_item_id",
        itemId
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "After Dark comments load error:",
        error
      );

      return;
    }

    setComments(data ?? []);
  }

  async function handleCommentSubmit(
    event
  ) {
    event.preventDefault();

    if (!selectedItem) return;

    const cleanComment =
      commentText.trim();

    if (!cleanComment) return;

    setCommentLoading(true);

    try {
      const { error } = await supabase
        .from("after_dark_comments")
        .insert({
          after_dark_item_id:
            selectedItem.id,
          visitor_id: visitorId,
          comment: cleanComment,
        });

      if (error) {
        throw error;
      }

      setCommentText("");

      await loadComments(
        selectedItem.id
      );
    } catch (error) {
      console.error(
        "After Dark comment error:",
        error
      );

      alert(
        error?.message ||
          "Comment could not be posted."
      );
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleLike(itemId) {
    const alreadyLiked =
      Boolean(
        likedByVisitor[itemId]
      );

    try {
      if (alreadyLiked) {
        const { error } = await supabase
          .from("after_dark_likes")
          .delete()
          .eq(
            "after_dark_item_id",
            itemId
          )
          .eq(
            "visitor_id",
            visitorId
          );

        if (error) {
          throw error;
        }

        setLikedByVisitor(
          (current) => ({
            ...current,
            [itemId]: false,
          })
        );

        setLikesByItem(
          (current) => ({
            ...current,
            [itemId]: Math.max(
              (current[itemId] || 1) - 1,
              0
            ),
          })
        );

        return;
      }

      const { error } = await supabase
        .from("after_dark_likes")
        .insert({
          after_dark_item_id: itemId,
          visitor_id: visitorId,
        });

      if (error) {
        throw error;
      }

      setLikedByVisitor(
        (current) => ({
          ...current,
          [itemId]: true,
        })
      );

      setLikesByItem(
        (current) => ({
          ...current,
          [itemId]:
            (current[itemId] || 0) + 1,
        })
      );
    } catch (error) {
      console.error(
        "After Dark like error:",
        error
      );

      alert(
        error?.message ||
          "Like could not be updated."
      );
    }
  }

  async function checkSavedStatus(
    itemId
  ) {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.user?.id) {
      setSavedByUser(false);
      return;
    }

    const { data, error } = await supabase
      .from("after_dark_saves")
      .select("id")
      .eq(
        "after_dark_item_id",
        itemId
      )
      .eq(
        "user_id",
        session.user.id
      )
      .maybeSingle();

    if (error) {
      console.error(
        "After Dark save check error:",
        error
      );

      return;
    }

    setSavedByUser(Boolean(data));
  }

  async function handleSave() {
    if (!selectedItem) return;

    setSaveLoading(true);

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session?.user?.id) {
        navigate(
          `/auth?returnTo=${encodeURIComponent(
            `/after-dark?image=${selectedItem.id}`
          )}`
        );

        return;
      }

      if (savedByUser) {
        const { error } = await supabase
          .from("after_dark_saves")
          .delete()
          .eq(
            "after_dark_item_id",
            selectedItem.id
          )
          .eq(
            "user_id",
            session.user.id
          );

        if (error) {
          throw error;
        }

        setSavedByUser(false);

        return;
      }

      const { error } = await supabase
        .from("after_dark_saves")
        .insert({
          after_dark_item_id:
            selectedItem.id,
          user_id:
            session.user.id,
        });

      if (error) {
        throw error;
      }

      setSavedByUser(true);
    } catch (error) {
      console.error(
        "After Dark save error:",
        error
      );

      alert(
        error?.message ||
          "Image could not be saved."
      );
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleShare() {
    if (!selectedItem) return;

    const shareUrl =
      `${window.location.origin}` +
      `/after-dark?image=` +
      encodeURIComponent(
        selectedItem.id
      );

    const shareData = {
      title: selectedItem.title,
      text:
        "View this Aset Studio After Dark photography concept.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      setShareMessage(
        "Link copied."
      );
    } catch (error) {
      if (
        error?.name !== "AbortError"
      ) {
        console.error(
          "After Dark share error:",
          error
        );
      }
    }
  }

  function handleBookThisLook() {
    if (!selectedItem) return;

    const params =
      new URLSearchParams({
        source: "after-dark",
        imageId: selectedItem.id,
        imageTitle:
          selectedItem.title,
      });

    navigate(
      `/photography-studio?${params.toString()}#booking`
    );
  }

  if (!ageConfirmed) {
    return (
      <main className="after-dark-age-gate">
        <style>{afterDarkStyles}</style>

        <section className="after-dark-gate-card">
          <p className="after-dark-brand">
            THE ASET STUDIO
          </p>

          <h1>AFTER DARK</h1>

          <div className="after-dark-divider" />

          <p className="after-dark-gate-copy">
            This gallery contains mature
            artistic photography.
          </p>

          <div className="after-dark-gate-actions">
            <button
              type="button"
              className="after-dark-primary-button"
              onClick={handleEnter}
            >
              I AM 18 OR OLDER
            </button>

            <button
              type="button"
              className="after-dark-secondary-button"
              onClick={handleExit}
            >
              EXIT AFTER DARK
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="after-dark-page">
      <style>{afterDarkStyles}</style>

      <section className="after-dark-header">
        <p className="after-dark-brand">
          THE ASET STUDIO
        </p>

        <h1>AFTER DARK</h1>
      </section>

      <section className="after-dark-gallery-shell">
        {loading && (
          <p className="after-dark-status">
            Opening After Dark...
          </p>
        )}

        {!loading &&
          pageError && (
            <p className="after-dark-status after-dark-error">
              {pageError}
            </p>
          )}

        {!loading &&
          !pageError &&
          visibleItems.length === 0 && (
            <p className="after-dark-status">
              After Dark photography is
              coming soon.
            </p>
          )}

        {!loading &&
          !pageError &&
          visibleItems.length > 0 && (
            <>
              <section className="after-dark-grid">
                {visibleItems.map(
                  (item) => (
                    <article
                      className="after-dark-card"
                      key={item.id}
                    >
                      <button
                        type="button"
                        className="after-dark-image-button"
                        aria-label={`Open ${item.title}`}
                        onClick={() =>
                          void openLightbox(
                            item
                          )
                        }
                      >
                        <img
                          src={
                            item.signed_url
                          }
                          alt={
                            item.title
                          }
                          className="after-dark-image"
                        />
                      </button>

                      <h2>
                        {item.title}
                      </h2>
                    </article>
                  )
                )}
              </section>

              {totalPages > 1 && (
                <nav
                  className="after-dark-pagination"
                  aria-label="After Dark gallery pages"
                >
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                  >
                    ← Previous
                  </button>

                  <div className="after-dark-page-numbers">
                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) => {
                        const pageNumber =
                          index + 1;

                        return (
                          <button
                            type="button"
                            key={
                              pageNumber
                            }
                            className={
                              currentPage ===
                              pageNumber
                                ? "is-active"
                                : ""
                            }
                            onClick={() =>
                              goToPage(
                                pageNumber
                              )
                            }
                          >
                            {
                              pageNumber
                            }
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
      </section>

      {selectedItem && (
        <div
          className="after-dark-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedItem.title
          }
        >
          <button
            type="button"
            className="after-dark-lightbox-backdrop"
            aria-label="Close image"
            onClick={closeLightbox}
          />

          <section className="after-dark-lightbox-panel">
            <button
              type="button"
              className="after-dark-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>

            <div className="after-dark-lightbox-image-wrap">
              <img
                src={
                  selectedItem.signed_url
                }
                alt={
                  selectedItem.title
                }
                className="after-dark-lightbox-image"
              />
            </div>

            <div className="after-dark-lightbox-info">
              <p className="after-dark-lightbox-brand">
                THE ASET STUDIO
              </p>

              <h2>
                {selectedItem.title}
              </h2>

              <div className="after-dark-actions">
                <button
                  type="button"
                  onClick={() =>
                    void handleLike(
                      selectedItem.id
                    )
                  }
                  className={
                    likedByVisitor[
                      selectedItem.id
                    ]
                      ? "is-active"
                      : ""
                  }
                >
                  ♥{" "}
                  {likesByItem[
                    selectedItem.id
                  ] || 0}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const commentsBox =
                      document.getElementById(
                        "after-dark-comments"
                      );

                    commentsBox?.scrollIntoView(
                      {
                        behavior:
                          "smooth",
                      }
                    );
                  }}
                >
                  Comments
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleSave()
                  }
                  disabled={
                    saveLoading
                  }
                >
                  {savedByUser
                    ? "Saved"
                    : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleShare()
                  }
                >
                  Share
                </button>
              </div>

              {shareMessage && (
                <p className="after-dark-share-message">
                  {shareMessage}
                </p>
              )}

              <button
                type="button"
                className="after-dark-book-button"
                onClick={
                  handleBookThisLook
                }
              >
                BOOK THIS LOOK
              </button>

              <p className="after-dark-book-note">
                Choose to recreate the
                concept or use it as
                inspiration when booking.
              </p>

              <section
                id="after-dark-comments"
                className="after-dark-comments"
              >
                <h3>Comments</h3>

                {comments.length === 0 ? (
                  <p className="after-dark-no-comments">
                    Be the first to
                    comment.
                  </p>
                ) : (
                  <div className="after-dark-comment-list">
                    {comments.map(
                      (comment) => (
                        <article
                          key={
                            comment.id
                          }
                          className="after-dark-comment"
                        >
                          <p>
                            {
                              comment.comment
                            }
                          </p>

                          <span>
                            {new Date(
                              comment.created_at
                            ).toLocaleDateString()}
                          </span>
                        </article>
                      )
                    )}
                  </div>
                )}

                <form
                  className="after-dark-comment-form"
                  onSubmit={
                    handleCommentSubmit
                  }
                >
                  <textarea
                    value={
                      commentText
                    }
                    onChange={(
                      event
                    ) =>
                      setCommentText(
                        event.target
                          .value
                      )
                    }
                    maxLength={600}
                    placeholder="Add a comment..."
                    disabled={
                      commentLoading
                    }
                  />

                  <button
                    type="submit"
                    disabled={
                      commentLoading ||
                      !commentText.trim()
                    }
                  >
                    {commentLoading
                      ? "POSTING..."
                      : "POST COMMENT"}
                  </button>
                </form>
              </section>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const afterDarkStyles = `
  .after-dark-age-gate,
  .after-dark-page {
    min-height: 100vh;
    box-sizing: border-box;
    background:
      radial-gradient(
        circle at 50% 15%,
        #262626 0%,
        #171717 34%,
        #0b0b0b 68%,
        #050505 100%
      );
    color: #f5f5f5;
  }

  .after-dark-age-gate {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 110px 24px 70px;
  }

  .after-dark-gate-card {
    width: min(620px, 100%);
    padding: 60px 34px;
    box-sizing: border-box;
    text-align: center;
    background: rgba(10, 10, 10, 0.88);
    border: 1px solid #353535;
    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.45);
  }

  .after-dark-brand {
    margin: 0 0 14px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.34em;
    color: #b8b8b8;
  }

  .after-dark-gate-card h1,
  .after-dark-header h1 {
    margin: 0;
    font-family:
      Georgia,
      "Times New Roman",
      serif;
    font-weight: 400;
    letter-spacing: 0.12em;
  }

  .after-dark-gate-card h1 {
    font-size:
      clamp(2.7rem, 8vw, 5rem);
  }

  .after-dark-divider {
    width: 52px;
    height: 1px;
    margin: 30px auto;
    background: #686868;
  }

  .after-dark-gate-copy {
    margin: 0 auto;
    max-width: 420px;
    color: #bcbcbc;
    font-size: 15px;
    line-height: 1.8;
  }

  .after-dark-gate-actions {
    display: grid;
    gap: 12px;
    width: min(360px, 100%);
    margin: 38px auto 0;
  }

  .after-dark-primary-button,
  .after-dark-secondary-button {
    min-height: 52px;
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .after-dark-primary-button {
    border: 1px solid #f1f1f1;
    background: #f1f1f1;
    color: #080808;
  }

  .after-dark-secondary-button {
    border: 1px solid #444;
    background: transparent;
    color: #b8b8b8;
  }

  .after-dark-page {
    padding: 115px 22px 80px;
  }

  .after-dark-header {
    text-align: center;
    margin: 0 auto 54px;
  }

  .after-dark-header h1 {
    font-size:
      clamp(2.3rem, 6vw, 4.5rem);
  }

  .after-dark-gallery-shell {
    width: min(1450px, 100%);
    margin: 0 auto;
  }

  .after-dark-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .after-dark-card {
    min-width: 0;
  }

  .after-dark-image-button {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: #111;
    cursor: pointer;
    overflow: hidden;
    aspect-ratio: 4 / 5;
  }

  .after-dark-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 220ms ease;
  }

  .after-dark-image-button:hover
    .after-dark-image {
    transform: scale(1.015);
  }

  .after-dark-card h2 {
    margin: 10px 2px 0;
    color: #dedede;
    font-size:
      clamp(0.68rem, 1.2vw, 0.95rem);
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0.03em;
  }

  .after-dark-status {
    margin: 80px auto;
    text-align: center;
    color: #a5a5a5;
  }

  .after-dark-error {
    color: #d9b4b4;
  }

  .after-dark-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 58px;
  }

  .after-dark-pagination button {
    border: 0;
    background: transparent;
    color: #9b9b9b;
    cursor: pointer;
  }

  .after-dark-pagination button:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .after-dark-page-numbers {
    display: flex;
    gap: 6px;
  }

  .after-dark-page-numbers button {
    width: 34px;
    height: 34px;
    border: 1px solid transparent;
  }

  .after-dark-page-numbers
    button.is-active {
    border-color: #5b5b5b;
    color: #fff;
  }

  .after-dark-lightbox {
    position: fixed;
    inset: 0;
    z-index: 5000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 28px;
    box-sizing: border-box;
  }

  .after-dark-lightbox-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background:
      rgba(0, 0, 0, 0.9);
    cursor: pointer;
  }

  .after-dark-lightbox-panel {
    position: relative;
    z-index: 2;
    width: min(1200px, 100%);
    max-height: 92vh;
    overflow: auto;
    display: grid;
    grid-template-columns:
      minmax(0, 1.25fr)
      minmax(320px, 0.75fr);
    background: #0b0b0b;
    border: 1px solid #2d2d2d;
    box-shadow:
      0 40px 140px
      rgba(0, 0, 0, 0.8);
  }

  .after-dark-close {
    position: absolute;
    top: 14px;
    right: 16px;
    z-index: 4;
    width: 38px;
    height: 38px;
    border: 1px solid #444;
    background:
      rgba(0, 0, 0, 0.75);
    color: #fff;
    cursor: pointer;
    font-size: 25px;
  }

  .after-dark-lightbox-image-wrap {
    min-height: 620px;
    background: #050505;
    display: grid;
    place-items: center;
  }

  .after-dark-lightbox-image {
    width: 100%;
    height: 100%;
    max-height: 90vh;
    object-fit: contain;
    display: block;
  }

  .after-dark-lightbox-info {
    padding: 46px 30px 34px;
    box-sizing: border-box;
    overflow: auto;
  }

  .after-dark-lightbox-brand {
    margin: 0 0 10px;
    color: #777;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.25em;
  }

  .after-dark-lightbox-info h2 {
    margin: 0 0 25px;
    font-family:
      Georgia,
      "Times New Roman",
      serif;
    font-size: 32px;
    font-weight: 400;
  }

  .after-dark-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .after-dark-actions button {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #393939;
    background: #111;
    color: #bbb;
    cursor: pointer;
  }

  .after-dark-actions
    button.is-active {
    color: #fff;
    border-color: #777;
  }

  .after-dark-actions button:disabled {
    opacity: 0.45;
  }

  .after-dark-share-message {
    margin: 10px 0 0;
    color: #aaa;
    font-size: 12px;
  }

  .after-dark-book-button {
    width: 100%;
    min-height: 54px;
    margin-top: 28px;
    border: 1px solid #eee;
    background: #eee;
    color: #090909;
    cursor: pointer;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .after-dark-book-note {
    margin: 10px 0 28px;
    color: #777;
    font-size: 11px;
    line-height: 1.6;
  }

  .after-dark-comments {
    border-top: 1px solid #292929;
    padding-top: 25px;
  }

  .after-dark-comments h3 {
    margin: 0 0 18px;
    font-size: 16px;
    font-weight: 600;
  }

  .after-dark-no-comments {
    color: #777;
    font-size: 13px;
  }

  .after-dark-comment-list {
    display: grid;
    gap: 12px;
    margin-bottom: 18px;
  }

  .after-dark-comment {
    padding: 12px;
    background: #111;
    border: 1px solid #242424;
  }

  .after-dark-comment p {
    margin: 0 0 7px;
    color: #d0d0d0;
    font-size: 13px;
    line-height: 1.6;
  }

  .after-dark-comment span {
    color: #666;
    font-size: 10px;
  }

  .after-dark-comment-form {
    display: grid;
    gap: 10px;
  }

  .after-dark-comment-form textarea {
    width: 100%;
    min-height: 95px;
    padding: 12px;
    box-sizing: border-box;
    resize: vertical;
    border: 1px solid #333;
    background: #080808;
    color: #fff;
    outline: none;
    font-family: inherit;
  }

  .after-dark-comment-form button {
    min-height: 42px;
    border: 1px solid #3b3b3b;
    background: #151515;
    color: #ddd;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .after-dark-comment-form button:disabled {
    opacity: 0.4;
  }

  @media (max-width: 820px) {
    .after-dark-lightbox {
      padding: 10px;
    }

    .after-dark-lightbox-panel {
      grid-template-columns: 1fr;
    }

    .after-dark-lightbox-image-wrap {
      min-height: 0;
      max-height: 58vh;
    }

    .after-dark-lightbox-image {
      max-height: 58vh;
    }
  }

  @media (max-width: 700px) {
    .after-dark-page {
      padding-left: 8px;
      padding-right: 8px;
    }

    .after-dark-grid {
      grid-template-columns:
        repeat(3, minmax(0, 1fr));
      gap: 6px;
    }

    .after-dark-card h2 {
      margin-top: 7px;
      font-size: 10px;
    }

    .after-dark-pagination {
      gap: 8px;
      flex-wrap: wrap;
    }

    .after-dark-lightbox-info {
      padding:
        34px 18px 26px;
    }
  }
`;