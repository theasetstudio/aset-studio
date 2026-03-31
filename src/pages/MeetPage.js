// src/pages/MeetPage.js
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const SIGNED_URL_TTL_SECONDS = 60 * 15; // 15 minutes
const RESIGN_EARLY_MS = 60 * 1000; // refresh 1 minute before expiry

export default function MeetPage() {
  const [loading, setLoading] = useState(true);
  const [meetProfile, setMeetProfile] = useState(null);
  const [signedImageUrl, setSignedImageUrl] = useState("");

  const refreshTimerRef = useRef(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const signMeetProfileImage = async (rawPath) => {
    try {
      clearRefreshTimer();

      if (!rawPath || typeof rawPath !== "string") {
        console.warn("[MEET] No valid profile_image_path, skipping signing:", rawPath);
        setSignedImageUrl("");
        return;
      }

      let imagePath = rawPath.trim();

      // ✅ Leading slash breaks signing
      if (imagePath.startsWith("/")) {
        console.warn("[MEET] profile_image_path had leading slash. Fixing:", imagePath);
        imagePath = imagePath.slice(1);
      }

      console.log("[MEET] profile_image_path from DB:", imagePath);

      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(imagePath, SIGNED_URL_TTL_SECONDS);

      console.log("[MEET] createSignedUrl result:", { data, error });

      if (error) {
        console.error("[MEET] Signing failed:", error);
        setSignedImageUrl("");
        return;
      }

      if (!data?.signedUrl) {
        console.warn("[MEET] No signedUrl returned (unexpected).");
        setSignedImageUrl("");
        return;
      }

      console.log("[MEET] signedUrl:", data.signedUrl);
      setSignedImageUrl(data.signedUrl);

      // ✅ Auto-refresh so image never breaks while page is open
      const refreshMs = SIGNED_URL_TTL_SECONDS * 1000 - RESIGN_EARLY_MS;
      refreshTimerRef.current = setTimeout(() => {
        signMeetProfileImage(imagePath);
      }, refreshMs);
    } catch (e) {
      console.error("[MEET] Unexpected error signing image:", e);
      setSignedImageUrl("");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadMeetProfile = async () => {
      try {
        setLoading(true);

        // ✅ No ordering — your table does NOT have updated_at
        const { data, error } = await supabase
          .from("meet_profiles")
          .select("*")
          .limit(1);

        if (error) {
          console.error("[MEET] Failed to load meet profile:", error);
          if (isMounted) setMeetProfile(null);
          return;
        }

        const profile = data?.[0] || null;
        console.log("[MEET] Loaded meet profile:", profile);

        if (!isMounted) return;

        setMeetProfile(profile);

        const imagePath = profile?.profile_image_path || "";

        if (imagePath) {
          await signMeetProfileImage(imagePath);
        } else {
          console.warn("[MEET] No profile_image_path on profile.");
          setSignedImageUrl("");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMeetProfile();

    return () => {
      isMounted = false;
      clearRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ If profile_image_path changes later, re-sign
  useEffect(() => {
    const imagePath = meetProfile?.profile_image_path || "";
    if (imagePath) signMeetProfileImage(imagePath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetProfile?.profile_image_path]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Meet</h2>
        <p>Loading…</p>
      </div>
    );
  }

  if (!meetProfile) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Meet</h2>
        <p>No profile found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Meet</h2>

      {/* Profile Image */}
      <div style={{ marginTop: 16 }}>
        {signedImageUrl ? (
          <img
            src={signedImageUrl}
            alt="Meet profile"
            style={{
              width: "100%",
              maxWidth: 420,
              height: "auto",
              borderRadius: 12,
              display: "block",
            }}
            onError={() => {
              console.error("[MEET] <img> failed to load signed URL.");
              // one retry for stability
              const imagePath = meetProfile?.profile_image_path || "";
              if (imagePath) signMeetProfileImage(imagePath);
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 16,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p style={{ margin: 0 }}>No profile image available.</p>
          </div>
        )}
      </div>

      {/* Text fields (only render if present) */}
      <div style={{ marginTop: 20 }}>
        {meetProfile?.name && <h3 style={{ marginBottom: 8 }}>{meetProfile.name}</h3>}
        {meetProfile?.headline && <p style={{ marginTop: 0 }}>{meetProfile.headline}</p>}
        {meetProfile?.bio && <p>{meetProfile.bio}</p>}
      </div>

      {/* Debug (remove later) */}
      <div style={{ marginTop: 24, fontSize: 12, opacity: 0.85 }}>
        <div><strong>Debug:</strong></div>
        <div>profile_image_path: {meetProfile?.profile_image_path || "(none)"}</div>
        <div>signed url present: {signedImageUrl ? "YES" : "NO"}</div>
      </div>
    </div>
  );
}




npm 