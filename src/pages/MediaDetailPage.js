import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CommentsPanel from "../components/CommentsPanel";
import AgeVerificationModal from "../components/AgeVerificationModal";
import {
  getAgeVerified,
  setAgeVerified as setAgeVerifiedLocal,
} from "../utils/ageGate";

const SIGNED_URL_TTL_SECONDS = 600;
const WATCH_SAVE_INTERVAL_SECONDS = 10;
const RESUME_MINIMUM_SECONDS = 2;
const COMPLETION_PERCENTAGE = 0.95;

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function normalizeStoragePath(input) {
  return clean(input).replace(/^\/+/, "");
}

function isVideoPath(path) {
  const value = norm(path);

  return (
    value.endsWith(".mp4") ||
    value.endsWith(".mov") ||
    value.endsWith(".webm") ||
    value.endsWith(".m4v")
  );
}

function isImagePath(path) {
  const value = norm(path);

  return (
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".png") ||
    value.endsWith(".webp") ||
    value.endsWith(".gif")
  );
}

function normalizeItem(item) {
  const filePath = clean(item?.file_path);
  const watermarkedPath = clean(item?.watermarked_path);
  const storedType = norm(item?.type || item?.media_type || "");

  let resolvedType = storedType;

  if (!resolvedType || !["video", "image"].includes(resolvedType)) {
    if (isVideoPath(filePath) || isVideoPath(watermarkedPath)) {
      resolvedType = "video";
    } else if (isImagePath(filePath) || isImagePath(watermarkedPath)) {
      resolvedType = "image";
    } else {
      resolvedType = "image";
    }
  }

  return {
    ...item,
    access_level: norm(item?.access_level),
    status: norm(item?.status || "published"),
    hidden: Boolean(item?.hidden || item?.is_hidden),
    type: resolvedType,
    owner_id: item?.owner_id || null,
    slug: clean(item?.slug),
    category: clean(item?.category),
    file_path: filePath,
    watermarked_path: watermarkedPath,
  };
}

function displayTitle(item) {
  const title = clean(item?.title);
  if (title) return title;

  const tagline = clean(item?.tagline);
  if (tagline) return tagline;

  const quote = clean(item?.quote);
  if (quote) return quote;

  return item?.type === "video"
    ? "Aset Cinema Presentation"
    : "Media Item";
}

function displayCategory(category) {
  const value = clean(category || "Aset Cinema");
  return value.replaceAll("_", " ");
}

function getPlaybackPath(item, isSupremeUser) {
  if (!item) return "";

  if (item.type === "video") {
    return item.file_path || item.watermarked_path || "";
  }

  if (isSupremeUser) {
    return item.file_path || item.watermarked_path || "";
  }

  return item.watermarked_path || item.file_path || "";
}

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds))
    ? Math.max(0, Math.floor(Number(seconds)))
    : 0;

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes,
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

function getProgressPercentage(progress, duration) {
  const safeProgress = Number(progress) || 0;
  const safeDuration = Number(duration) || 0;

  if (safeDuration <= 0) return 0;

  return Math.min(
    100,
    Math.max(0, (safeProgress / safeDuration) * 100)
  );
}

export default function MediaDetailPage() {
  const params = useParams();
  const slugOrId = params.slug || params.id;

  const videoRef = useRef(null);
  const lastSavedProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentDurationRef = useRef(0);
  const watchHistoryLoadedRef = useRef(false);
  const isUnmountingRef = useRef(false);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageVerified, setAgeVerified] = useState(getAgeVerified());

  const [item, setItem] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [loading, setLoading] = useState(true);

  const [relatedItems, setRelatedItems] = useState([]);
  const [relatedUrls, setRelatedUrls] = useState({});
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [watchProgress, setWatchProgress] = useState(0);
  const [watchDuration, setWatchDuration] = useState(0);
  const [savedProgress, setSavedProgress] = useState(0);
  const [watchCompleted, setWatchCompleted] = useState(false);
  const [loadingWatchHistory, setLoadingWatchHistory] =
    useState(false);
  const [resumePromptOpen, setResumePromptOpen] = useState(false);
  const [watchSaveStatus, setWatchSaveStatus] = useState("");

  const userId = session?.user?.id || null;
  const isVideo = item?.type === "video";

  const backPath = isVideo ? "/videos" : "/gallery";
  const backLabel = isVideo
    ? "Back to Aset Cinema"
    : "Back to Gallery";

  const isSupremeUser = useMemo(() => {
    return (
      (profile?.role || "").toLowerCase() === "supreme" ||
      isAdmin
    );
  }, [profile, isAdmin]);

  const progressPercentage = useMemo(() => {
    return getProgressPercentage(watchProgress, watchDuration);
  }, [watchProgress, watchDuration]);

  const remainingTime = useMemo(() => {
    return Math.max(0, watchDuration - watchProgress);
  }, [watchDuration, watchProgress]);

  const createSignedUrl = useCallback(async (filePath) => {
    const cleanPath = normalizeStoragePath(filePath);

    if (!cleanPath) return "";

    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      console.error("Signed URL failed:", error);
      return "";
    }

    return data.signedUrl;
  }, []);

  const saveWatchProgress = useCallback(
    async ({
      progress,
      duration,
      completed = false,
      silent = false,
    }) => {
      if (!userId || !item?.id || item.type !== "video") {
        return;
      }

      const safeDuration = Number.isFinite(Number(duration))
        ? Math.max(0, Number(duration))
        : 0;

      const safeProgress = Number.isFinite(Number(progress))
        ? Math.max(0, Number(progress))
        : 0;

      if (safeDuration <= 0) {
        return;
      }

      const completedByPercentage =
        safeDuration > 0 &&
        safeProgress / safeDuration >= COMPLETION_PERCENTAGE;

      const finalCompleted =
        Boolean(completed) || completedByPercentage;

      const finalProgress = finalCompleted
        ? safeDuration
        : Math.min(safeProgress, safeDuration);

      if (!silent) {
        setWatchSaveStatus("Saving progress...");
      }

      const { error } = await supabase
        .from("watch_history")
        .upsert(
          {
            user_id: userId,
            media_id: item.id,
            progress_seconds: finalProgress,
            duration_seconds: safeDuration,
            completed: finalCompleted,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,media_id",
          }
        );

      if (error) {
        console.error("Watch progress save failed:", error);

        if (!silent && !isUnmountingRef.current) {
          setWatchSaveStatus("Progress could not be saved.");
        }

        return;
      }

      lastSavedProgressRef.current = finalProgress;

      if (!isUnmountingRef.current) {
        setSavedProgress(finalProgress);
        setWatchCompleted(finalCompleted);

        if (!silent) {
          setWatchSaveStatus(
            finalCompleted ? "Marked as watched." : "Progress saved."
          );

          window.setTimeout(() => {
            if (!isUnmountingRef.current) {
              setWatchSaveStatus("");
            }
          }, 2200);
        }
      }
    },
    [item, userId]
  );

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession || null);

        if (currentSession?.user?.id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, role, is_age_verified")
            .eq("id", currentSession.user.id)
            .maybeSingle();

          if (!mounted) return;

          setProfile(profileData || null);
          setIsAdmin(
            (profileData?.role || "").toLowerCase() === "admin"
          );

          const verified =
            profileData?.is_age_verified || getAgeVerified();

          setAgeVerified(Boolean(verified));

          if (profileData?.is_age_verified) {
            setAgeVerifiedLocal(true);
          }
        }
      } catch (error) {
        console.error("Boot error:", error);
      }
    }

    boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession || null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadItem() {
      setLoading(true);
      setItem(null);
      setMediaUrl("");
      setMediaError("");
      setRelatedItems([]);
      setRelatedUrls({});

      setWatchProgress(0);
      setWatchDuration(0);
      setSavedProgress(0);
      setWatchCompleted(false);
      setResumePromptOpen(false);
      setWatchSaveStatus("");

      currentProgressRef.current = 0;
      currentDurationRef.current = 0;
      lastSavedProgressRef.current = 0;
      watchHistoryLoadedRef.current = false;

      if (!slugOrId) {
        setMediaError("Missing media item.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from("media_items").select("*");

        const slugValue = clean(slugOrId);

        if (/^[0-9a-fA-F-]{20,}$/.test(slugValue)) {
          query = query.eq("id", slugValue);
        } else {
          query = query.eq("slug", slugValue);
        }

        const { data, error } = await query.maybeSingle();

        if (!mounted) return;

        if (error || !data) {
          setMediaError(
            "This screening could not be found."
          );
          setLoading(false);
          return;
        }

        const normalized = normalizeItem(data);

        if (!["video", "image"].includes(normalized.type)) {
          setMediaError("Unsupported media type.");
          setLoading(false);
          return;
        }

        if (
          (normalized.hidden ||
            normalized.status !== "published") &&
          !isAdmin
        ) {
          setMediaError("This content is unavailable.");
          setLoading(false);
          return;
        }

        const rawPath = getPlaybackPath(
          normalized,
          isSupremeUser
        );

        const signedUrl = await createSignedUrl(rawPath);

        if (!mounted) return;

        if (!signedUrl) {
          setMediaError(
            normalized.type === "video"
              ? "Could not load video."
              : "Could not load image."
          );
          setLoading(false);
          return;
        }

        setItem(normalized);
        setMediaUrl(signedUrl);
        setLoading(false);
      } catch (error) {
        console.error(
          "Failed to load media detail:",
          error
        );

        if (!mounted) return;

        setMediaError("Failed to load item.");
        setLoading(false);
      }
    }

    loadItem();

    return () => {
      mounted = false;
    };
  }, [
    slugOrId,
    isAdmin,
    isSupremeUser,
    ageVerified,
    createSignedUrl,
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadWatchHistory() {
      if (!userId || !item?.id || item.type !== "video") {
        watchHistoryLoadedRef.current = true;
        return;
      }

      setLoadingWatchHistory(true);

      const { data, error } = await supabase
        .from("watch_history")
        .select(
          "progress_seconds, duration_seconds, completed, updated_at"
        )
        .eq("user_id", userId)
        .eq("media_id", item.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error(
          "Watch history load failed:",
          error
        );

        setLoadingWatchHistory(false);
        watchHistoryLoadedRef.current = true;
        return;
      }

      const progress = Number(data?.progress_seconds) || 0;
      const duration = Number(data?.duration_seconds) || 0;
      const completed = Boolean(data?.completed);

      setSavedProgress(progress);
      setWatchCompleted(completed);

      lastSavedProgressRef.current = progress;
      watchHistoryLoadedRef.current = true;

      if (
        progress >= RESUME_MINIMUM_SECONDS &&
        duration > 0 &&
        !completed &&
        progress / duration < COMPLETION_PERCENTAGE
      ) {
        setResumePromptOpen(true);
      }

      setLoadingWatchHistory(false);
    }

    loadWatchHistory();

    return () => {
      mounted = false;
    };
  }, [item, userId]);

  useEffect(() => {
    let mounted = true;

    async function loadRelatedVideos() {
      if (!item || item.type !== "video") return;

      setLoadingRelated(true);

      try {
        let query = supabase
          .from("media_items")
          .select("*")
          .eq("status", "published")
          .neq("id", item.id)
          .order("created_at", { ascending: false })
          .limit(8);

        if (item.category) {
          query = query.eq("category", item.category);
        }

        const { data, error } = await query;

        if (!mounted) return;

        if (error) {
          console.error(
            "Failed to load related videos:",
            error
          );

          setRelatedItems([]);
          setRelatedUrls({});
          setLoadingRelated(false);
          return;
        }

        const safeRelated = Array.isArray(data)
          ? data
              .map(normalizeItem)
              .filter(
                (video) =>
                  video.type === "video" &&
                  !video.hidden
              )
          : [];

        const urlEntries = await Promise.all(
          safeRelated.map(async (video) => {
            const path = getPlaybackPath(
              video,
              isSupremeUser
            );

            const signedUrl = await createSignedUrl(path);
            return [video.id, signedUrl];
          })
        );

        if (!mounted) return;

        setRelatedItems(safeRelated);
        setRelatedUrls(Object.fromEntries(urlEntries));
        setLoadingRelated(false);
      } catch (error) {
        console.error(
          "Related videos error:",
          error
        );

        if (!mounted) return;

        setRelatedItems([]);
        setRelatedUrls({});
        setLoadingRelated(false);
      }
    }

    loadRelatedVideos();

    return () => {
      mounted = false;
    };
  }, [item, isSupremeUser, createSignedUrl]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (
        document.visibilityState === "hidden" &&
        currentDurationRef.current > 0
      ) {
        saveWatchProgress({
          progress: currentProgressRef.current,
          duration: currentDurationRef.current,
          silent: true,
        });
      }
    }

    window.addEventListener(
      "pagehide",
      handleVisibilityChange
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        handleVisibilityChange
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [saveWatchProgress]);

  useEffect(() => {
    isUnmountingRef.current = false;

    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  function handleLoadedMetadata(event) {
    const video = event.currentTarget;
    const duration = Number(video.duration) || 0;

    currentDurationRef.current = duration;
    setWatchDuration(duration);

    if (savedProgress >= duration * COMPLETION_PERCENTAGE) {
      setWatchCompleted(true);
    }
  }

  function handleTimeUpdate(event) {
    const video = event.currentTarget;
    const progress = Number(video.currentTime) || 0;
    const duration = Number(video.duration) || 0;

    currentProgressRef.current = progress;
    currentDurationRef.current = duration;

    setWatchProgress(progress);
    setWatchDuration(duration);

    if (!userId || duration <= 0) return;

    const secondsSinceLastSave =
      Math.abs(progress - lastSavedProgressRef.current);

    if (
      secondsSinceLastSave >= WATCH_SAVE_INTERVAL_SECONDS
    ) {
      saveWatchProgress({
        progress,
        duration,
        silent: true,
      });
    }
  }

  function handlePause(event) {
    const video = event.currentTarget;

    if (video.ended) return;

    saveWatchProgress({
      progress: video.currentTime,
      duration: video.duration,
    });
  }

  function handleEnded(event) {
    const video = event.currentTarget;

    setWatchProgress(video.duration || 0);
    setWatchCompleted(true);
    setResumePromptOpen(false);

    saveWatchProgress({
      progress: video.duration,
      duration: video.duration,
      completed: true,
    });
  }

  function resumePlayback() {
    const video = videoRef.current;

    if (!video) return;

    const duration = Number(video.duration) || watchDuration;

    if (
      savedProgress > 0 &&
      (!duration || savedProgress < duration)
    ) {
      video.currentTime = savedProgress;
      setWatchProgress(savedProgress);
      currentProgressRef.current = savedProgress;
    }

    setResumePromptOpen(false);

    video.play().catch(() => {});
  }

  function startOver() {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;
    setWatchProgress(0);
    setSavedProgress(0);
    setWatchCompleted(false);
    setResumePromptOpen(false);

    currentProgressRef.current = 0;
    lastSavedProgressRef.current = 0;

    saveWatchProgress({
      progress: 0,
      duration: video.duration || watchDuration,
      completed: false,
      silent: true,
    });

    video.play().catch(() => {});
  }

  async function confirmAgeVerification() {
    setAgeVerifiedLocal(true);
    setAgeVerified(true);

    if (!userId) return;

    await supabase
      .from("profiles")
      .update({ is_age_verified: true })
      .eq("id", userId);
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <Link to={backPath} style={styles.backLink}>
          ← {backLabel}
        </Link>

        {loading ? (
          <div style={styles.stateCard}>
            Loading screening...
          </div>
        ) : !item ? (
          <div style={styles.stateCard}>
            <p style={styles.stateText}>
              {mediaError || "Not found."}
            </p>

            <Link
              to={backPath}
              style={styles.stateButton}
            >
              {backLabel}
            </Link>
          </div>
        ) : (
          <>
            <section style={styles.hero}>
              <div style={styles.mediaFrame}>
                {mediaUrl ? (
                  isVideo ? (
                    <div style={styles.videoContainer}>
                      <video
                        ref={videoRef}
                        src={mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={styles.video}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPause={handlePause}
                        onEnded={handleEnded}
                      />

                      {resumePromptOpen && (
                        <div style={styles.resumeOverlay}>
                          <div style={styles.resumeCard}>
                            <p style={styles.resumeEyebrow}>
                              CONTINUE WATCHING
                            </p>

                            <h2 style={styles.resumeTitle}>
                              Resume from{" "}
                              {formatTime(savedProgress)}?
                            </h2>

                            <p style={styles.resumeDescription}>
                              Pick up where you left off or
                              restart this screening.
                            </p>

                            <div style={styles.resumeActions}>
                              <button
                                type="button"
                                style={styles.resumeButton}
                                onClick={resumePlayback}
                              >
                                ▶ Resume
                              </button>

                              <button
                                type="button"
                                style={styles.startOverButton}
                                onClick={startOver}
                              >
                                Start Over
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={displayTitle(item)}
                      style={styles.image}
                    />
                  )
                ) : (
                  <div style={styles.mediaFallback}>
                    {mediaError || "Media unavailable."}
                  </div>
                )}
              </div>

              <div style={styles.metaPanel}>
                <p style={styles.eyebrow}>
                  {isVideo
                    ? "ASET CINEMA"
                    : "THE ASET STUDIO"}
                </p>

                <h1 style={styles.title}>
                  {displayTitle(item)}
                </h1>

                <div style={styles.metaRow}>
                  <span style={styles.categoryPill}>
                    {displayCategory(item.category)}
                  </span>

                  {item.access_level && (
                    <span style={styles.categoryPill}>
                      {displayCategory(
                        item.access_level
                      )}
                    </span>
                  )}

                  {isVideo && watchCompleted && (
                    <span style={styles.watchedPill}>
                      ✓ Watched
                    </span>
                  )}
                </div>

                {item.description && (
                  <p style={styles.description}>
                    {item.description}
                  </p>
                )}

                {isVideo && userId && (
                  <div style={styles.progressPanel}>
                    <div style={styles.progressHeader}>
                      <span>
                        {loadingWatchHistory
                          ? "Loading watch history..."
                          : watchCompleted
                            ? "Completed"
                            : `${formatTime(
                                remainingTime
                              )} remaining`}
                      </span>

                      <span>
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>

                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progressPercentage}%`,
                        }}
                      />
                    </div>

                    {watchSaveStatus && (
                      <span style={styles.saveStatus}>
                        {watchSaveStatus}
                      </span>
                    )}
                  </div>
                )}

                {isVideo && !userId && (
                  <p style={styles.signInNote}>
                    Sign in to save your viewing progress
                    across devices.
                  </p>
                )}
              </div>
            </section>

            <section style={styles.commentsSection}>
              <div style={styles.sectionHeader}>
                <p style={styles.eyebrow}>
                  VIEWER NOTES
                </p>

                <h2 style={styles.sectionTitle}>
                  Comments
                </h2>
              </div>

              <CommentsPanel
                mediaId={item?.id || slugOrId}
                disabled={false}
              />
            </section>

            {isVideo && (
              <section style={styles.relatedSection}>
                <div style={styles.sectionHeader}>
                  <p style={styles.eyebrow}>
                    MORE LIKE THIS
                  </p>

                  <h2 style={styles.sectionTitle}>
                    More from{" "}
                    {displayCategory(item.category)}
                  </h2>
                </div>

                {loadingRelated ? (
                  <div style={styles.stateCard}>
                    Preparing more screenings...
                  </div>
                ) : relatedItems.length === 0 ? (
                  <div style={styles.stateCard}>
                    More screenings are being prepared.
                  </div>
                ) : (
                  <div style={styles.relatedGrid}>
                    {relatedItems.map((related) => {
                      const relatedUrl =
                        relatedUrls[related.id] || "";

                      return (
                        <Link
                          key={related.id}
                          to={`/media/${related.id}`}
                          style={styles.relatedCard}
                        >
                          <div
                            style={styles.relatedMediaWrap}
                          >
                            {relatedUrl ? (
                              <video
                                src={relatedUrl}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                style={styles.relatedMedia}
                                onMouseEnter={(event) => {
                                  event.currentTarget
                                    .play()
                                    .catch(() => {});
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.pause();
                                  event.currentTarget.currentTime =
                                    0;
                                }}
                              />
                            ) : (
                              <div
                                style={
                                  styles.relatedFallback
                                }
                              >
                                Preview unavailable
                              </div>
                            )}

                            <div
                              style={styles.relatedOverlay}
                            />
                          </div>

                          <div style={styles.relatedBody}>
                            <p
                              style={
                                styles.relatedCategory
                              }
                            >
                              {displayCategory(
                                related.category
                              )}
                            </p>

                            <h3
                              style={styles.relatedTitle}
                            >
                              {displayTitle(related)}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {item.access_level === "boudoir" &&
              !ageVerified && (
                <AgeVerificationModal
                  open
                  onCancel={() => {}}
                  onConfirm={confirmAgeVerification}
                />
              )}
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(198,136,55,0.13), transparent 38%), linear-gradient(180deg, #050505 0%, #080706 48%, #050505 100%)",
    color: "#f5f1eb",
    padding: "110px 18px 80px",
  },

  shell: {
    maxWidth: 1180,
    margin: "0 auto",
  },

  backLink: {
    display: "inline-flex",
    marginBottom: 22,
    color: "rgba(245,241,235,0.72)",
    textDecoration: "none",
    fontSize: 14,
  },

  hero: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.45fr) minmax(280px, 0.55fr)",
    gap: 26,
    alignItems: "stretch",
  },

  mediaFrame: {
    width: "100%",
    minHeight: 420,
    borderRadius: 30,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(245,241,235,0.1)",
    boxShadow:
      "0 60px 170px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.035)",
  },

  videoContainer: {
    position: "relative",
    width: "100%",
    minHeight: 420,
  },

  video: {
    width: "100%",
    height: "100%",
    minHeight: 420,
    display: "block",
    objectFit: "cover",
    background: "#000",
  },

  image: {
    width: "100%",
    display: "block",
    objectFit: "cover",
    background: "#000",
  },

  mediaFallback: {
    minHeight: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.65)",
    background: "rgba(255,255,255,0.025)",
  },

  resumeOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.48), rgba(0,0,0,0.82))",
    backdropFilter: "blur(8px)",
  },

  resumeCard: {
    width: "min(440px, 100%)",
    padding: 30,
    borderRadius: 26,
    textAlign: "center",
    border: "1px solid rgba(213,179,117,0.3)",
    background:
      "linear-gradient(145deg, rgba(20,20,20,0.96), rgba(5,5,5,0.96))",
    boxShadow: "0 30px 100px rgba(0,0,0,0.65)",
  },

  resumeEyebrow: {
    margin: "0 0 10px",
    color: "#d5b375",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.24em",
  },

  resumeTitle: {
    margin: "0 0 12px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 34,
    lineHeight: 1,
  },

  resumeDescription: {
    margin: "0 0 22px",
    color: "rgba(245,241,235,0.66)",
    lineHeight: 1.6,
  },

  resumeActions: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },

  resumeButton: {
    minHeight: 44,
    padding: "0 18px",
    border: 0,
    borderRadius: 999,
    background:
      "linear-gradient(135deg, #e5c27f, #a7793f)",
    color: "#090909",
    fontWeight: 900,
    cursor: "pointer",
  },

  startOverButton: {
    minHeight: 44,
    padding: "0 18px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.18)",
    background: "rgba(255,255,255,0.05)",
    color: "#f5f1eb",
    fontWeight: 850,
    cursor: "pointer",
  },

  metaPanel: {
    borderRadius: 30,
    padding: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.018))",
    border: "1px solid rgba(245,241,235,0.1)",
    boxShadow: "0 34px 100px rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.52)",
  },

  title: {
    margin: "0 0 16px",
    fontSize: "clamp(34px, 4.2vw, 58px)",
    lineHeight: 0.95,
    letterSpacing: "-0.052em",
    fontWeight: 850,
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 18,
  },

  categoryPill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(245,241,235,0.13)",
    background: "rgba(255,255,255,0.035)",
    color: "rgba(245,241,235,0.76)",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  watchedPill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(213,179,117,0.35)",
    background: "rgba(213,179,117,0.12)",
    color: "#d5b375",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  description: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.76)",
  },

  progressPanel: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid rgba(245,241,235,0.08)",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 10,
    color: "rgba(245,241,235,0.62)",
    fontSize: 12,
  },

  progressTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: 999,
    background: "rgba(245,241,235,0.1)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, #9d713b, #e7c889)",
    transition: "width 200ms linear",
  },

  saveStatus: {
    display: "block",
    marginTop: 9,
    color: "rgba(213,179,117,0.78)",
    fontSize: 11,
  },

  signInNote: {
    margin: "22px 0 0",
    paddingTop: 18,
    borderTop: "1px solid rgba(245,241,235,0.08)",
    color: "rgba(245,241,235,0.48)",
    fontSize: 12,
    lineHeight: 1.6,
  },

  commentsSection: {
    marginTop: 34,
    borderRadius: 28,
    padding: 26,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.036), rgba(255,255,255,0.014))",
    border: "1px solid rgba(245,241,235,0.08)",
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(26px, 3vw, 38px)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  relatedSection: {
    marginTop: 42,
  },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  relatedCard: {
    display: "block",
    overflow: "hidden",
    borderRadius: 22,
    textDecoration: "none",
    color: "#f5f1eb",
    border: "1px solid rgba(245,241,235,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
    boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
  },

  relatedMediaWrap: {
    position: "relative",
    aspectRatio: "16 / 10",
    background: "#000",
    overflow: "hidden",
  },

  relatedMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  relatedOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.62))",
  },

  relatedFallback: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(245,241,235,0.55)",
  },

  relatedBody: {
    padding: 16,
  },

  relatedCategory: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(245,241,235,0.5)",
  },

  relatedTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.22,
    letterSpacing: "-0.02em",
  },

  stateCard: {
    borderRadius: 24,
    padding: "34px 24px",
    textAlign: "center",
    color: "rgba(245,241,235,0.7)",
    border: "1px solid rgba(245,241,235,0.08)",
    background: "rgba(255,255,255,0.025)",
  },

  stateText: {
    margin: "0 0 16px",
  },

  stateButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 999,
    background: "#f5f1eb",
    color: "#111",
    textDecoration: "none",
    fontWeight: 850,
  },
};