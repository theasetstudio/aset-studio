import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

import ConversationList from "../components/messages/ConversationList";
import MessageThread from "../components/messages/MessageThread";
import SendMessageForm from "../components/messages/SendMessageForm";

export default function MessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const conversationFromState = location.state?.openConversation || null;
  const conversationFromUrl = searchParams.get("conversation");
  const preferredConversationId =
    conversationFromUrl || conversationFromState || null;

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(
    preferredConversationId
  );
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function initializeMessaging() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting auth user:", userError);
          setUser(null);
          return;
        }

        setUser(user || null);

        if (!user) {
          setConversations([]);
          setMessages([]);
          return;
        }

        const { data, error } = await supabase
          .from("participants")
          .select("conversation_id, user_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading conversations:", error);
          return;
        }

        const loadedConversations = await Promise.all(
          (data || []).map(async (row) => {
            const { data: otherParticipant, error: otherParticipantError } =
              await supabase
                .from("participants")
                .select("user_id")
                .eq("conversation_id", row.conversation_id)
                .neq("user_id", user.id)
                .single();

            if (otherParticipantError) {
              console.error(
                "Error loading other participant:",
                otherParticipantError
              );
            }

            if (!otherParticipant?.user_id) {
              return {
                conversation_id: row.conversation_id,
                other_user: null,
              };
            }

            const { data: otherProfile, error: profileError } = await supabase
              .from("profiles")
              .select("display_name, username")
              .eq("id", otherParticipant.user_id)
              .single();

            if (profileError) {
              console.error("Error loading other user profile:", profileError);
            }

            return {
              conversation_id: row.conversation_id,
              other_user: otherProfile || null,
            };
          })
        );

        setConversations(loadedConversations);

        if (preferredConversationId) {
          setSelectedConversation(preferredConversationId);
          return;
        }

        if (loadedConversations.length > 0) {
          setSelectedConversation(loadedConversations[0].conversation_id);
        } else {
          setSelectedConversation(null);
          setMessages([]);
        }
      } finally {
        setAuthChecked(true);
      }
    }

    initializeMessaging();
  }, [preferredConversationId]);

  useEffect(() => {
    if (!preferredConversationId) return;
    setSelectedConversation(preferredConversationId);
  }, [preferredConversationId]);

  useEffect(() => {
    if (!selectedConversation || !user) return;
    loadMessages(selectedConversation);
  }, [selectedConversation, user]);

  useEffect(() => {
    if (!selectedConversation || !user) return;

    const channel = supabase
      .channel(`messages-${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          setMessages((prev) => {
            const alreadyExists = prev.some((msg) => msg.id === payload.new.id);
            if (alreadyExists) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user]);

  async function loadMessages(conversationId) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages(data || []);
  }

  async function sendMessage(text) {
    if (!selectedConversation || !user) return;

    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation,
      sender_id: user.id,
      content: trimmed,
    });

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    await loadMessages(selectedConversation);
  }

  function handleSelectConversation(conversationId) {
    setSelectedConversation(conversationId);
  }

  if (!authChecked) {
    return (
      <div style={styles.page}>
        <div style={styles.stateCard}>Loading messages...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.authCard}>
          <h1 style={styles.authTitle}>Messages</h1>
          <p style={styles.authText}>
            You must be signed in to view your messages.
          </p>
          <button type="button" onClick={() => navigate("/auth")} style={styles.authButton}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.headerBlock}>
          <div style={styles.eyebrow}>MESSAGES</div>
          <h1 style={styles.title}>Creator &amp; User Messages</h1>
        </div>

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <ConversationList
              conversations={conversations}
              onSelect={handleSelectConversation}
            />
          </aside>

          <section style={styles.threadPanel}>
            <div style={styles.threadInner}>
              <div style={styles.threadArea}>
                <MessageThread messages={messages} currentUserId={user?.id} />
              </div>

              {selectedConversation ? (
                <div style={styles.formWrap}>
                  <SendMessageForm onSend={sendMessage} />
                </div>
              ) : (
                <div style={styles.emptyThreadCard}>
                  Select a conversation to start messaging.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "clamp(16px, 4vw, 24px)",
  },

  shell: {
    maxWidth: 1300,
    margin: "0 auto",
  },

  headerBlock: {
    marginBottom: 18,
  },

  eyebrow: {
    letterSpacing: "0.18em",
    fontSize: "clamp(11px, 1.8vw, 12px)",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 38px)",
    lineHeight: 1.08,
    fontFamily: 'Georgia, "Times New Roman", serif',
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
    gap: 16,
    alignItems: "stretch",
  },

  sidebar: {
    minWidth: 0,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    minHeight: "72vh",
  },

  threadPanel: {
    minWidth: 0,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    minHeight: "72vh",
  },

  threadInner: {
    display: "flex",
    flexDirection: "column",
    minHeight: "72vh",
  },

  threadArea: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },

  formWrap: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: 12,
    background: "rgba(0,0,0,0.22)",
  },

  emptyThreadCard: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: 18,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.6,
  },

  stateCard: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 24,
    color: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },

  authCard: {
    maxWidth: 720,
    margin: "0 auto",
    padding: 24,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },

  authTitle: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: "clamp(26px, 5vw, 34px)",
  },

  authText: {
    marginTop: 0,
    marginBottom: 16,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.6,
  },

  authButton: {
    marginTop: 4,
    padding: "11px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    backgroundColor: "#fff",
    color: "#111",
    cursor: "pointer",
    fontWeight: 700,
    minHeight: 44,
  },
};