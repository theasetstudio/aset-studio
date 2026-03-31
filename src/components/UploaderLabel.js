// src/components/UploaderLabel.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UploaderLabel({ uploaderId, displayNameFallback = "The Aset Studio", small = false }) {
  const navigate = useNavigate();
  const [uploader, setUploader] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUploader() {
      if (!uploaderId) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", uploaderId)
          .maybeSingle();

        if (!mounted) return;
        if (!error && data) setUploader(data);
      } catch (e) {
        console.error("UploaderLabel fetch error:", e);
      }
    }

    fetchUploader();
    return () => {
      mounted = false;
    };
  }, [uploaderId]);

  const handleClick = () => {
    if (uploaderId) navigate(`/creator/${uploaderId}`);
  };

  const name = uploader?.display_name || displayNameFallback;
  const avatarUrl = uploader?.avatar_url || null;

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: small ? 6 : 8,
        padding: 0,
        margin: 0,
        background: "none",
        border: "none",
        cursor: uploaderId ? "pointer" : "default",
        textDecoration: "underline",
        color: "inherit",
        font: "inherit",
      }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: small ? 24 : 32,
            height: small ? 24 : 32,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <span style={{ fontSize: small ? 12 : 14 }}>{name}</span>
    </button>
  );
}