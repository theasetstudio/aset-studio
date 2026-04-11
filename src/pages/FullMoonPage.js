import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import lockedPreview from "../assets/locked-preview.jpg";
import AgeVerificationModal from "../components/AgeVerificationModal";

export default function GalleryPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [ageModalOpen, setAgeModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role, is_age_verified")
        .eq("id", session.user.id)
        .single();

      setProfile(data || null);
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadMedia() {
      const { data } = await supabase
        .from("media_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(24);

      setItems(data || []);
      setLoading(false);
    }

    loadMedia();
  }, []);

  useEffect(() => {
    async function hydrate() {
      const map = {};

      for (const item of items) {
        const path = item.watermarked_path || item.file_path;
        if (!path) continue;

        const { data } = await supabase.storage
          .from("media")
          .createSignedUrl(path, 600);

        if (data?.signedUrl) {
          map[item.id] = data.signedUrl;
        }
      }

      setSignedUrls(map);
    }

    if (items.length > 0) {
      hydrate();
    }
  }, [items]);

  function canView(item) {
    if (!profile) return item.access_level === "public";

    if (profile.role === "admin") return true;
    if (item.access_level === "public") return true;

    if (item.access_level === "supreme") {
      return profile.role === "supreme";
    }

    if (item.access_level === "boudoir") {
      return profile.is_age_verified === true;
    }

    return true;
  }

  function handleClick(item) {
    const allowed = canView(item);

    if (!allowed) {
      if (item.access_level === "boudoir") {
        setAgeModalOpen(true);
        return;
      }

      navigate("/supreme");
      return;
    }

    window.open(`/media/${item.id}`, "_blank");
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1>Gallery</h1>

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div>No media found.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item) => {
            const img = signedUrls[item.id];
            const allowed = canView(item);

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={img || lockedPreview}
                  alt={item.title || "media"}
                  style={{ width: "100%", height: 300, objectFit: "cover" }}
                />

                <div>{item.title || "Untitled"}</div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {!allowed
                    ? item.access_level === "boudoir"
                      ? "Age verification required"
                      : "Supreme access required"
                    : item.category || "Gallery"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AgeVerificationModal
        open={ageModalOpen}
        onCancel={() => setAgeModalOpen(false)}
        onConfirm={() => {
          localStorage.setItem("is_age_verified", "true");
          setAgeModalOpen(false);
          setProfile((prev) => ({
            ...(prev || {}),
            is_age_verified: true,
          }));
        }}
      />
    </div>
  );
}