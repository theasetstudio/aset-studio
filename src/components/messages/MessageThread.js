import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabaseClient";

export default function MessageThread({ messages, currentUserId }) {
  const [profilesById, setProfilesById] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    async function loadProfiles() {
      const senderIds = [
        ...new Set((messages || []).map((m) => m.sender_id).filter(Boolean)),
      ];

      if (senderIds.length === 0) {
        setProfilesById({});
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", senderIds);

      if (error) {
        console.error("Error loading sender profiles:", error);
        return;
      }

      const map = {};
      (data || []).forEach((profile) => {
        map[profile.id] =
          profile.display_name || profile.username || "Unknown User";
      });

      setProfilesById(map);
    }

    loadProfiles();
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.length === 0 ? (
        <div style={styles.empty}>No messages yet.</div>
      ) : (
        messages.map((msg) => {
          const senderName = profilesById[msg.sender_id] || "Unknown User";
          const isMine = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              style={{
                ...styles.row,
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageGroup,
                  alignItems: isMine ? "flex-end" : "flex-start",
                }}
              >
                <div style={styles.senderName}>
                  {isMine ? "You" : senderName}
                </div>

                <div
                  style={{
                    ...styles.bubble,
                    ...(isMine ? styles.myBubble : styles.theirBubble),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })
      )}

      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  empty: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 1.6,
    padding: "8px 2px",
  },

  row: {
    display: "flex",
    marginBottom: 12,
    width: "100%",
  },

  messageGroup: {
    maxWidth: "min(78%, 720px)",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  senderName: {
    fontSize: 12,
    marginBottom: 5,
    color: "#bdbdbd",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  bubble: {
    padding: "12px 14px",
    borderRadius: 16,
    lineHeight: 1.5,
    wordBreak: "break-word",
    fontSize: 14,
    whiteSpace: "pre-wrap",
  },

  myBubble: {
    backgroundColor: "#f2f2f2",
    color: "#111",
    border: "none",
  },

  theirBubble: {
    backgroundColor: "#171717",
    color: "#fff",
    border: "1px solid #2d2d2d",
  },
};