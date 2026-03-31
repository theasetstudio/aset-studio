// src/components/AgeVerificationModal.js
import React from "react";

export default function AgeVerificationModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "#0b0b0b",
          padding: 18,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Age Verification Required</h2>

        <p style={{ marginTop: 0, opacity: 0.85, lineHeight: 1.5 }}>
          This section contains boudoir content. You must confirm you are 18+ to continue.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "white",
              color: "black",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            I am 18+
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
          Your choice is saved on this device.
        </div>
      </div>
    </div>
  );
}