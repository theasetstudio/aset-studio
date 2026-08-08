import React from "react";
import { Link } from "react-router-dom";
import { displayTitle, safariFrame } from "./cinemaUtils";

export default function CinemaCollectionHub({
  collection,
  previewUrls,
}) {
  const totalItems = collection.rooms.reduce(
    (sum, room) => sum + room.items.length,
    0
  );

  if (!totalItems) return null;

  return (
    <section className="cinema-collection-hub">
      <div className="cinema-collection-heading">
        <div>
          <p>{collection.eyebrow}</p>
          <h2>{collection.title}</h2>
          <span>{collection.description}</span>
        </div>

        <div className="cinema-collection-total">
          {totalItems}
          <span>Presentations</span>
        </div>
      </div>

      <div className="cinema-collection-grid">
        {collection.rooms.map((room) => {
          const leadItem = room.items[0];
          const previewUrl = leadItem ? previewUrls[leadItem.id] || "" : "";

          return (
            <article
              className={
                leadItem
                  ? "cinema-collection-card"
                  : "cinema-collection-card is-empty"
              }
              key={room.title}
            >
              {leadItem ? (
                <Link to={`/media/${leadItem.id}`}>
                  <div className="cinema-collection-media">
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
                  </div>

                  <div className="cinema-collection-copy">
                    <span className="cinema-collection-icon">{room.icon}</span>
                    <div>
                      <p>{room.items.length} PRESENTATION{room.items.length === 1 ? "" : "S"}</p>
                      <h3>{room.title}</h3>
                      <span>{displayTitle(leadItem)}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="cinema-collection-empty">
                  <span className="cinema-collection-icon">{room.icon}</span>
                  <div>
                    <p>PREPARING</p>
                    <h3>{room.title}</h3>
                    <span>This room will open with its first release.</span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
