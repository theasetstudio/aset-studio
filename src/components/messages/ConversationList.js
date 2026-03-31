export default function ConversationList({ conversations, onSelect }) {
  return (
    <div style={{ width: 300, borderRight: "1px solid #444", padding: 20 }}>
      <h2>Conversations</h2>

      {conversations.length === 0 ? (
        <p>No conversations</p>
      ) : (
        conversations.map((c) => {
          const name =
            c.other_user?.display_name ||
            c.other_user?.username ||
            "Unknown User";

          return (
            <div
              key={c.conversation_id}
              onClick={() => onSelect(c.conversation_id)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                cursor: "pointer",
                border: "1px solid #555",
                borderRadius: "6px",
                background: "#1a1a1a",
              }}
            >
              <strong>{name}</strong>
            </div>
          );
        })
      )}
    </div>
  );
}