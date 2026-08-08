import React from "react";
import { Link } from "react-router-dom";
import { safariFrame } from "./cinemaUtils";

export default function CinemaHero({
  featuredPremiere,
  featuredUrl,
  mutedHero,
  onToggleMute,
  onExplore,
}) {
  return (
    <section className="cinema-hero">
      <div className="cinema-hero-media" aria-hidden="true">
        {featuredUrl ? (
          <video
            src={safariFrame(featuredUrl)}
            autoPlay
            loop
            muted={mutedHero}
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="cinema-hero-placeholder" />
        )}
      </div>

      <div className="cinema-hero-overlay" />
      <div className="cinema-hero-vignette" />

      <div className="cinema-hero-content">
        <p className="cinema-kicker">THE ASET STUDIO PRESENTS</p>

        <h1>
          The Aset
          <span>Cinema</span>
        </h1>

        <p className="cinema-hero-tagline">
          Original stories. Real voices. AI innovation. Cinematic excellence.
        </p>

        <p className="cinema-hero-description">
          A premium cinema destination for original productions, real films,
          AI-powered storytelling, exclusive interviews, performances, music,
          comedy, premieres, and entertainment culture.
        </p>

        <div className="cinema-hero-actions">
          <button
            type="button"
            className="cinema-primary-button"
            onClick={onExplore}
          >
            <span aria-hidden="true">▶</span>
            Explore Cinema
          </button>

          {featuredPremiere ? (
            <Link
              to={`/media/${featuredPremiere.id}`}
              className="cinema-secondary-button"
            >
              Featured Premiere
            </Link>
          ) : (
            <button
              type="button"
              className="cinema-secondary-button"
              onClick={onExplore}
            >
              Featured Premiere
            </button>
          )}

          <Link to="/" className="cinema-text-button">
            Return to Studio
          </Link>
        </div>

        <div className="cinema-hero-pillars">
          <span>REAL CINEMA</span>
          <span>AI CINEMA</span>
          <span>INTERVIEWS</span>
          <span>PERFORMANCES</span>
        </div>
      </div>

      {featuredUrl && (
        <button
          type="button"
          className="cinema-sound-button"
          onClick={onToggleMute}
          aria-label={mutedHero ? "Turn hero sound on" : "Mute hero video"}
        >
          {mutedHero ? "🔇" : "🔊"}
        </button>
      )}
    </section>
  );
}
