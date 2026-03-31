import React from "react";
import { Link } from "react-router-dom";

export default function AsetLoungePage() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Aset Lounge</h1>
      <p>Your creative puzzle and relaxation space.</p>

      <div style={{ display: "grid", gap: "12px", maxWidth: "500px", marginTop: "24px" }}>
        <Link to="/aset-lounge/library">Puzzle Library</Link>
        <Link to="/aset-lounge/daily">Daily Puzzle</Link>
        <Link to="/aset-lounge/my-creations">My Creations</Link>
      </div>
    </div>
  );
}
