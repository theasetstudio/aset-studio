import { useState } from "react";

export default function SendMessageForm({ onSend }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    const trimmed = String(text || "").trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);
      await onSend(trimmed);
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={styles.container}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={styles.input}
      />

      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          ...styles.button,
          opacity: sending ? 0.7 : 1,
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "12px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "#151515",
    color: "#fff",
    outline: "none",
    fontSize: 14,
  },

  button: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "#fff",
    color: "#111",
    fontWeight: 700,
    minHeight: 44,
  },
};