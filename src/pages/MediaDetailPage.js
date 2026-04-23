import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CommentsPanel from "../components/CommentsPanel";
import AgeVerificationModal from "../components/AgeVerificationModal";
import { getAgeVerified, setAgeVerified as setAgeVerifiedLocal } from "../utils/ageGate";

const SIGNED_URL_TTL_SECONDS = 600;

function normalizeStoragePath(input) {
  if (!input) return "";
  return String(input).trim();
}

function isValidMediaType(type) {
  return type === "video" || type === "image";
}

function normalizeItem(item) {
  return {
    ...item,
    access_level: String(item?.access_level || "").toLowerCase(),
    status: String(item?.status || "").toLowerCase(),
    hidden: Boolean(item?.hidden),
    type: String(item?.type || "image").toLowerCase(),
    owner_id: item?.owner_id || null,
  };
}

function displayTitle(item) {
  const t = String(item?.title || "").trim();
  if (t) return t;
  const tg = String(item?.tagline || "").trim();
  if (tg) return tg;
  const q = String(item?.quote || "").trim();
  if (q) return q;
  return "Media Item";
}

export default function MediaDetailPage() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageVerified, setAgeVerified] = useState(getAgeVerified());

  const [item, setItem] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id || null;

  useEffect(() => {
    async function boot() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession || null);

        if (currentSession?.user?.id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, role, is_age_verified")
            .eq("id", currentSession.user.id)
            .single();

          setProfile(profileData || null);
          setIsAdmin((profileData?.role || "").toLowerCase() === "admin");

          const verified = profileData?.is_age_verified || getAgeVerified();
          setAgeVerified(verified);

          if (profileData?.is_age_verified) {
            setAgeVerifiedLocal(true);
          }
        }
      } catch (e) {
        console.error("Boot error:", e);
      }
    }

    boot();
  }, []);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      setItem(null);
      setMediaUrl("");
      setMediaError("");

      if (!id) {
        setMediaError("Missing media id.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("media_items")
          .select(`
            id,
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
            owner_id
          `)
          .eq("id", id)
          .single();

        if (error || !data) {
          setMediaError("Failed to load item.");
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

        setItem(normalized);

        const isSupremeUser =
          (profile?.role || "").toLowerCase() === "supreme" || isAdmin;

        const rawPath = isSupremeUser
          ? normalized.file_path || normalized.watermarked_path || ""
          : normalized.watermarked_path || normalized.file_path || "";

        const cleanPath = normalizeStoragePath(rawPath);

        if (!cleanPath) {
          setMediaError(
            normalized.type === "video"
              ? "Video file is missing."
              : "Image file is missing."
          );
          setLoading(false);
          return;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

        if (signedError || !signedData?.signedUrl) {
          setMediaError(
            normalized.type === "video"
              ? "Could not load video."
              : "Could not load image."
          );
          setLoading(false);
          return;
        }

        setMediaUrl(signedData.signedUrl);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load media detail:", e);
        setMediaError("Failed to load item.");
        setLoading(false);
      }
    }

    loadItem();
  }, [id, profile, isAdmin, ageVerified]);

  async function confirmAgeVerification() {
    setAgeVerifiedLocal(true);
    setAgeVerified(true);

    if (!userId) return;

    await supabase
      .from("profiles")
      .update({ is_age_verified: true })
      .eq("id", userId);
  }

  const isVideo = item?.type === "video";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px 56px",
      }}
    >
      <div style={{ maxWidth: isVideo ? "720px" : "600px", width: "100%" }}>
        {loading ? (
          <p>Loading...</p>
        ) : !item ? (
          <div>
            <p style={{ opacity: 0.9 }}>{mediaError || "Not found."}</p>
            <Link to="/gallery" style={{ color: "#fff" }}>
              Back to Gallery
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                marginBottom: 28,
              }}
            >
              {mediaUrl ? (
                isVideo ? (
                  <video
                    src={mediaUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      borderRadius: 18,
                      boxShadow: "0 30px 120px rgba(0,0,0,0.85)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      const vid = e.currentTarget;
                      vid.pause();
                      vid.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={displayTitle(item)}
                    style={{
                      width: "100%",
                      borderRadius: 18,
                      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                    }}
                  />
                )
              ) : (
                <div
                  style={{
                    width: "100%",
                    padding: 32,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 18,
                    textAlign: "center",
                    opacity: 0.7,
                  }}
                >
                  {mediaError || "Media unavailable."}
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <h1 style={{ marginBottom: 6, fontSize: 28 }}>
                {displayTitle(item)}
              </h1>

              {item.description && (
                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                  {item.description}
                </p>
              )}
            </div>

            <div style={{ marginTop: 28 }}>
              <CommentsPanel mediaId={item?.id || id} disabled={false} />
            </div>

            {item.access_level === "boudoir" && !ageVerified && (
              <AgeVerificationModal
                open
                onCancel={() => {}}
                onConfirm={confirmAgeVerification}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}