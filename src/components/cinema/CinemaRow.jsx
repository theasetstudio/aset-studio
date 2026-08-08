import React from "react";
import CinemaMediaCard from "./CinemaMediaCard";
import { PREVIEW_LIMIT, slugify } from "./cinemaUtils";

export default function CinemaRow({
  room,
  previewUrls,
  onScroll,
}) {
  if (!room.items.length) return null;

  const roomId = `cinema-row-${slugify(room.title)}`;
  const roomItems = room.items.slice(0, PREVIEW_LIMIT);

  return (
    <section className="cinema-room">
      <div className="cinema-room-heading">
        <div className="cinema-room-heading-copy">
          <p>
            <span aria-hidden="true">{room.icon}</span> {room.subtitle}
          </p>
          <h2>{room.title}</h2>
          <span>{room.description}</span>
        </div>

        {roomItems.length > 1 && (
          <div className="cinema-room-controls">
            <button
              type="button"
              onClick={() => onScroll("left", roomId)}
              aria-label={`Scroll ${room.title} left`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => onScroll("right", roomId)}
              aria-label={`Scroll ${room.title} right`}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="cinema-card-row" id={roomId}>
        {roomItems.map((item, index) => (
          <CinemaMediaCard
            key={`${room.key}-${item.id}`}
            item={item}
            previewUrl={previewUrls[item.id] || ""}
            featured={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
