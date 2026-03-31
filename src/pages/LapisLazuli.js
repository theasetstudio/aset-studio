import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LapisLazuli.css";

export default function LapisLazuli() {
  const [stoneImageSrc, setStoneImageSrc] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStoneImage() {
      try {
        setImageLoading(true);

        const { data, error } = await supabase
          .from("stones")
          .select("image_url")
          .eq("slug", "lapis-lazuli")
          .maybeSingle();

        if (error) throw error;

        const imagePath = data?.image_url || "";

        if (!imagePath) {
          if (isMounted) {
            setStoneImageSrc("");
          }
          return;
        }

        if (imagePath.startsWith("/assets/")) {
          if (isMounted) {
            setStoneImageSrc(imagePath);
          }
          return;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("media")
          .createSignedUrl(imagePath, 3600);

        if (signedError) throw signedError;

        if (isMounted) {
          setStoneImageSrc(signedData?.signedUrl || "");
        }
      } catch (error) {
        console.error("Failed to load Lapis Lazuli image:", error);
        if (isMounted) {
          setStoneImageSrc("");
        }
      } finally {
        if (isMounted) {
          setImageLoading(false);
        }
      }
    }

    loadStoneImage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="lapis-container">
      <div className="lapis-nav">
        <Link to="/stones-and-minerals" className="lapis-back">
          ← Back to Stones & Minerals
        </Link>
      </div>

      <div className="lapis-hero">
        <h1>Lapis Lazuli</h1>
        <p className="lapis-subtitle">
          Stone of Truth, Wisdom, and Sacred Communication
        </p>
      </div>

      {stoneImageSrc ? (
        <div className="lapis-card">
          <img
            src={stoneImageSrc}
            alt="Lapis Lazuli"
            style={{
              width: "100%",
              maxWidth: "420px",
              display: "block",
              margin: "0 auto",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </div>
      ) : imageLoading ? (
        <div className="lapis-card">
          <p>Loading stone image...</p>
        </div>
      ) : null}

      <div className="lapis-card">
        <p>
          Lapis Lazuli has been revered for thousands of years as a stone of
          wisdom, truth, and spiritual insight. Its deep celestial blue has
          symbolized the heavens, divine knowledge, and the power of honest
          expression.
        </p>

        <p>
          Within the Sirens Realm, Lapis Lazuli represents clarity of mind,
          confidence in one's voice, and alignment with inner truth. It
          encourages open communication, strengthens intuition, and promotes
          harmony between intellect and spirit.
        </p>
      </div>

      <div className="lapis-section-title">Core Energies</div>

      <div className="lapis-grid">
        {[
          "Communication",
          "Peace",
          "Honesty",
          "Clarity",
          "Protection",
          "Confidence",
          "Truth",
          "Harmony",
          "Wisdom",
          "Intuition",
          "Purification",
          "Openness",
        ].map((trait) => (
          <div key={trait} className="lapis-trait">
            {trait}
          </div>
        ))}
      </div>
    </div>
  );
}