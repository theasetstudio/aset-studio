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
    <div
      style={{
        flex: 1,
        padding: 20,
        overflowY: "auto",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length === 0 ? (
        <p style={{ color: "#ddd" }}>No messages yet.</p>
      ) : (
        messages.map((msg) => {
          const senderName = profilesById[msg.sender_id] || "Unknown User";
          const isMine = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMine ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#bdbdbd",
                    fontWeight: 600,
                  }}
                >
                  {isMine ? "You" : senderName}
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 16,
                    backgroundColor: isMine ? "#f2f2f2" : "#171717",
                    color: isMine ? "#111" : "#fff",
                    border: isMine ? "none" : "1px solid #2d2d2d",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
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