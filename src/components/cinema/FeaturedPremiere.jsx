import React from "react";
import { Link } from "react-router-dom";
import {
  displayCategory,
  displayDescription,
  displayTitle,
  formatDate,
  safariFrame,
} from "./cinemaUtils";

export default function FeaturedPremiere({ item, previewUrl }) {
  return (
    <section className="cinema-premiere-section">
      <div className="cinema-section-label">
        <p>⭐ FEATURED PREMIERE</p>
        <span>The centerpiece of The Aset Cinema.</span>
      </div>

      {item ? (
        <article className="cinema-premiere">
          <Link
            to={`/media/${item.id}`}
            className="cinema-premiere-media"
            aria-label={`Watch ${displayTitle(item)}`}
          >
            {previewUrl ? (
              <video
                src={safariFrame(previewUrl)}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="cinema-premiere-placeholder">
                THE ASET CINEMA
              </div>
            )}

            <div className="cinema-premiere-media-overlay" />

            <div className="cinema-premiere-play">
              <span>▶</span>
              Watch Premiere
            </div>
          </Link>

          <div className="cinema-premiere-copy">
            <p>{displayCategory(item)}</p>
            <h2>{displayTitle(item)}</h2>

            <span className="cinema-premiere-description">
              {displayDescription(item)}
            </span>

            <div className="cinema-premiere-meta">
              {formatDate(item.created_at) && (
                <span>{formatDate(item.created_at)}</span>
              )}
              <span>Official Aset Cinema Presentation</span>
            </div>

            <Link
              to={`/media/${item.id}`}
              className="cinema-premiere-button"
            >
              Watch Now
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ) : (
        <article className="cinema-premiere cinema-premiere-empty">
          <div className="cinema-premiere-placeholder">FEATURED PREMIERE</div>

          <div className="cinema-premiere-copy">
            <p>COMING TO THE SCREEN</p>
            <h2>The next premiere begins here.</h2>
            <span className="cinema-premiere-description">
              Films, interviews, original productions, and cinematic
              experiences will be featured in this space.
            </span>
          </div>
        </article>
      )}
    </section>
  );
}
