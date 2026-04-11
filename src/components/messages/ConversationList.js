export default function ConversationList({ conversations, onSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>Conversations</div>

      {conversations.length === 0 ? (
        <div style={styles.empty}>No conversations yet</div>
      ) : (
        <div style={styles.list}>
          {conversations.map((c) => {
            const name =
              c.other_user?.display_name ||
              c.other_user?.username ||
              "Unknown User";

            const username = c.other_user?.username
              ? `@${c.other_user.username}`
              : null;

            return (
              <button
                key={c.conversation_id}
                onClick={() => onSelect(c.conversation_id)}
                style={styles.card}
              >
                <div style={styles.name}>{name}</div>

                {username ? (
                  <div style={styles.username}>{username}</div>
                ) : null}

                <div style={styles.action}>Open →</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },

  list: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  empty: {
    padding: 16,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },

  card: {
    textAlign: "left",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    padding: "12px 14px",
    cursor: "pointer",
    color: "#fff",
    display: "block",
    width: "100%",
    transition: "all 0.15s ease",
  },

  name: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 4,
  },

  username: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 6,
  },

  action: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
};