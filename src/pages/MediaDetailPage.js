import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CommentsPanel from "../components/CommentsPanel";
import AgeVerificationModal from "../components/AgeVerificationModal";
import { getAgeVerified, setAgeVerified as setAgeVerifiedLocal } from "../utils/ageGate";

const SIGNED_URL_TTL_SECONDS = 600;

function clean(value) {
  return String(value || "").trim();
}

function norm(value) {
  return clean(value).toLowerCase();
}

function normalizeStoragePath(input) {
  return clean(input);
}

function isValidMediaType(type) {
  return type === "video" || type === "image";
}

function normalizeItem(item) {
  return {
    ...item,
    access_level: norm(item?.access_level),
    status: norm(item?.status),
    hidden: Boolean(item?.hidden),
    type: norm(item?.type || "image"),
    owner_id: item?.owner_id || null,
    slug: clean(item?.slug),
    category: clean(item?.category),
  };
}

function displayTitle(item) {
  const title = clean(item?.title);
  if (title) return title;

  const tagline = clean(item?.tagline);
  if (tagline) return tagline;

  const quote = clean(item?.quote);
  if (quote) return quote;

  return item?.type === "video" ? "Aset Cinema Presentation" : "Media Item";
}

function displayCategory(category) {
  const value = clean(category || "Aset Cinema");
  return value.replaceAll("_", " ");
}

export default function MediaDetailPage() {
  const params = useParams();
  const slugOrId = params.slug || params.id;

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

  const userId = session?.user?.id || null;
  const isVideo = item?.type === "video";

  const backPath = isVideo ? "/videos" : "/gallery";
  const backLabel = isVideo ? "Back to Aset Cinema" : "Back to Gallery";

  const isSupremeUser = useMemo(() => {
    return (profile?.role || "").toLowerCase() === "supreme" || isAdmin;
  }, [profile, isAdmin]);

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
            .single();

          if (!mounted) return;

          setProfile(profileData || null);
          setIsAdmin((profileData?.role || "").toLowerCase() === "admin");

          const verified = profileData?.is_age_verified || getAgeVerified();
          setAgeVerified(verified);

          if (profileData?.is_age_verified) {
            setAgeVerifiedLocal(true);
          }
        }
      } catch (error) {
        console.error("Boot error:", error);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function createSignedUrl(filePath) {
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
    }

    async function loadItem() {
      setLoading(true);
      setItem(null);
      setMediaUrl("");
      setMediaError("");
      setRelatedItems([]);
      setRelatedUrls({});

      if (!slugOrId) {
        setMediaError("Missing media item.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from("media_items")
          .select(`
            id,
            slug,
            title,
            tagline,
            quote,
            description,
            category,
            type,
            access_level,
            status,
            hidden,
            file_path,
            watermarked_path,
            owner_id,
            created_at
          `);

        const slugValue = clean(slugOrId);

        if (/^[0-9a-fA-F-]{20,}$/.test(slugValue)) {
          query = query.eq("id", slugValue);
        } else {
          query = query.eq("slug", slugValue);
        }

        const { data, error } = await query.maybeSingle();

        if (!mounted) return;

        if (error || !data) {
          setMediaError("This screening could not be found.");
          setLoading(false);
          return;
        }

        const normalized = normalizeItem(data);

        if (!isValidMediaType(normalized.type)) {
          setMediaError("Unsupported media type.");
          setLoading(false);
          return;
        }

        if ((normalized.hidden || normalized.status !== "published") && !isAdmin) {
          setMediaError("This content is unavailable.");
          setLoading(false);
          return;
        }

        const rawPath = isSupremeUser
          ? normalized.file_path || normalized.watermarked_path || ""
          : normalized.watermarked_path || normalized.file_path || "";

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
        console.error("Failed to load media detail:", error);

        if (!mounted) return;

        setMediaError("Failed to load item.");
        setLoading(false);
      }
    }

    loadItem();

    return () => {
      mounted = false;
    };
  }, [slugOrId, isAdmin, isSupremeUser, ageVerified]);

  useEffect(() => {
    let mounted = true;

    async function createSignedUrl(filePath) {
      const cleanPath = normalizeStoragePath(filePath);
      if (!cleanPath) return "";

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

      if (error || !data?.signedUrl) return "";
      return data.signedUrl;
    }

    async function loadRelatedVideos() {
      if (!item || item.type !== "video") return;

      setLoadingRelated(true);

      try {
        let query = supabase
          .from("media_items")
          .select(`
            id,
            slug,
            title,
            description,
            category,
            type,
            status,
            hidden,
            file_path,
            watermarked_path,
            created_at
          `)
          .eq("type", "video")
          .eq("status", "published")
          .eq("hidden", false)
          .neq("id", item.id)
          .order("created_at", { ascending: false })
          .limit(8);

        if (item.category) {
          query = query.eq("category", item.category);
        }

        const { data, error } = await query;

        if (!mounted) return;

        if (error) {
          console.error("Failed to load related videos:", error);
          setRelatedItems([]);
          setRelatedUrls({});
          setLoadingRelated(false);
          return;
        }

        const safeRelated = Array.isArray(data)
          ? data.map(normalizeItem).filter((video) => video.slug)
          : [];

        const urlEntries = await Promise.all(
          safeRelated.map(async (video) => {
            const path =
              video.watermarked_path || video.file_path || "";

            const signedUrl = await createSignedUrl(path);
            return [video.id, signedUrl];
          })
        );

        if (!mounted) return;

        setRelatedItems(safeRelated);
        setRelatedUrls(Object.fromEntries(urlEntries));
        setLoadingRelated(false);
      } catch (error) {
        console.error("Related videos error:", error);

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
  }, [item]);

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
          <div style={styles.stateCard}>Loading screening...</div>
        ) : !item ? (
          <div style={styles.stateCard}>
            <p style={styles.stateText}>{mediaError || "Not found."}</p>
            <Link to={backPath} style={styles.stateButton}>
              {backLabel}
            </Link>
          </div>
        ) : (
          <>
            <section style={styles.hero}>
              <div style={styles.mediaFrame}>
                {mediaUrl ? (
                  isVideo ? (
                    <video
                      src={mediaUrl}
                      controls
                      playsInline
                      preload="metadata"
                      style={styles.video}
                    />
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
                  {isVideo ? "ASET CINEMA" : "THE ASET STUDIO"}
                </p>

                <h1 style={styles.title}>{displayTitle(item)}</h1>

                <div style={styles.metaRow}>
                  <span style={styles.categoryPill}>
                    {displayCategory(item.category)}
                  </span>

                  {item.access_level && (
                    <span style={styles.categoryPill}>
                      {displayCategory(item.access_level)}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p style={styles.description}>{item.description}</p>
                )}
              </div>
            </section>

            <section style={styles.commentsSection}>
              <div style={styles.sectionHeader}>
                <p style={styles.eyebrow}>VIEWER NOTES</p>
                <h2 style={styles.sectionTitle}>Comments</h2>
              </div>

              <CommentsPanel mediaId={item?.id || slugOrId} disabled={false} />
            </section>

            {isVideo && (
              <section style={styles.relatedSection}>
                <div style={styles.sectionHeader}>
                  <p style={styles.eyebrow}>MORE LIKE THIS</p>
                  <h2 style={styles.sectionTitle}>
                    More from {displayCategory(item.category)}
                  </h2>
                </div>

                {loadingRelated ? (
                  <div style={styles.stateCard}>Preparing more screenings...</div>
                ) : relatedItems.length === 0 ? (
                  <div style={styles.stateCard}>
                    More screenings are being prepared.
                  </div>
                ) : (
                  <div style={styles.relatedGrid}>
                    {relatedItems.map((related) => {
                      const relatedUrl = relatedUrls[related.id] || "";

                      return (
                        <Link
                          key={related.id}
                          to={`/video/${related.slug}`}
                          style={styles.relatedCard}
                        >
                          <div style={styles.relatedMediaWrap}>
                            {relatedUrl ? (
                              <video
                                src={relatedUrl}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                style={styles.relatedMedia}
                                onMouseEnter={(e) => {
                                  e.currentTarget.play().catch(() => {});
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.pause();
                                  e.currentTarget.currentTime = 0;
                                }}
                              />
                            ) : (
                              <div style={styles.relatedFallback}>
                                Preview unavailable
                              </div>
                            )}
                            <div style={styles.relatedOverlay} />
                          </div>

                          <div style={styles.relatedBody}>
                            <p style={styles.relatedCategory}>
                              {displayCategory(related.category)}
                            </p>
                            <h3 style={styles.relatedTitle}>
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

            {item.access_level === "boudoir" && !ageVerified && (
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
    gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, 0.55fr)",
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

  description: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.78,
    color: "rgba(245,241,235,0.76)",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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