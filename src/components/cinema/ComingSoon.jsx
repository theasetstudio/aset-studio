import React from "react";
import { Link } from "react-router-dom";
import CinemaMediaCard from "./CinemaMediaCard";

export default function ComingSoon({ items, previewUrls }) {
  return (
    <section className="cinema-coming-soon">
      <div className="cinema-upcoming-heading">
        <div>
          <p>COMING TO THE ASET CINEMA</p>
          <h2>The next chapter is already in motion.</h2>
          <span>
            Upcoming films, trailers, first looks, announcements, and future
            presentations gather here.
          </span>
        </div>

        <div className="cinema-upcoming-count">
          {items.length}
          <span>Upcoming</span>
        </div>
      </div>

      {items.length ? (
        <div className="cinema-coming-soon-grid">
          {items.slice(0, 4).map((item, index) => (
            <CinemaMediaCard
              key={`coming-${item.id}`}
              item={item}
              previewUrl={previewUrls[item.id] || ""}
              featured={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="cinema-coming-soon-empty">
          <span>🎞</span>
          <div>
            <p>FUTURE RELEASES</p>
            <h3>The schedule is being prepared.</h3>
            <span>
              New announcements will appear here as productions move toward
              release.
            </span>
          </div>
          <Link to="/">Return to The Aset Studio →</Link>
        </div>
      )}
    </section>
  );
}
