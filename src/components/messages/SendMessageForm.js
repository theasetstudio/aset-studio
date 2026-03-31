import { useState } from "react";

export default function SendMessageForm({ onSend }) {
  const [text, setText] = useState("");

  async function handleSend() {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    await onSend(trimmed);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        borderTop: "1px solid #2a2a2a",
        padding: 12,
        display: "flex",
        gap: 10,
        alignItems: "center",
        backgroundColor: "#0f0f0f",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #333",
          backgroundColor: "#151515",
          color: "#fff",
          outline: "none",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #333",
          backgroundColor: "#fff",
          color: "#111",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}