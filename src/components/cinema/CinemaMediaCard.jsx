import React from "react";
import { Link } from "react-router-dom";
import {
  displayCategory,
  displayTitle,
  formatDate,
  safariFrame,
} from "./cinemaUtils";

function getBadge(item, featured) {
  if (featured) {
    return "FEATURED";
  }

  if (item?.is_new === true || item?.new_release === true) {
    return "NEW";
  }

  if (
    item?.is_original === true ||
    item?.aset_original === true ||
    item?.studio_original === true
  ) {
    return "ASET ORIGINAL";
  }

  return "";
}

export default function CinemaMediaCard({
  item,
  previewUrl,
  featured = false,
}) {
  const title = displayTitle(item);
  const category = displayCategory(item);
  const date = formatDate(item.created_at);
  const badge = getBadge(item, featured);

  return (
    <Link
      to={`/media/${item.id}`}
      className="cinema-media-card"
      aria-label={`Watch ${title}`}
    >
      <div className="cinema-card-media">
        {previewUrl ? (
          <video
            src={safariFrame(previewUrl)}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="cinema-card-placeholder">
            <span>THE ASET CINEMA</span>
          </div>
        )}

        <div className="cinema-card-gradient" />

        {badge && (
          <span className="cinema-card-badge">
            {badge}
          </span>
        )}

        <div className="cinema-card-play" aria-hidden="true">
          ▶
        </div>

        <div className="cinema-card-hover-copy">
          <span>WATCH NOW</span>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="cinema-card-copy">
        <p>{category}</p>
        <h3>{title}</h3>

        <div className="cinema-card-meta">
          {date && <span>{date}</span>}
          <span>Official Presentation</span>
        </div>
      </div>
    </Link>
  );
}