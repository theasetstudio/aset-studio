import React from "react";

export function CinemaLoading() {
  return (
    <div className="videos-loading">
      <span className="cinema-loader" />
      Opening The Aset Cinema...
    </div>
  );
}

export function CinemaError({ message, onRetry }) {
  return (
    <div className="cinema-status-card cinema-error-card">
      <p>SCREENING CONNECTION</p>
      <h2>We could not open the cinema library.</h2>
      <span>{message}</span>
      <button type="button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export function CinemaEmpty({ onReset }) {
  return (
    <div className="cinema-status-card">
      <p>NO MATCHING SCREENINGS</p>
      <h2>That room is quiet for now.</h2>
      <span>
        Try another search or return to the complete cinema collection.
      </span>
      <button type="button" onClick={onReset}>
        View All Cinema
      </button>
    </div>
  );
}
