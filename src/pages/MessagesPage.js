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
    return <div style={{ padding: 40 }}>Loading messages...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Messages</h1>
        <p>You must be signed in to view your messages.</p>
        <button
          type="button"
          onClick={() => navigate("/auth")}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      <ConversationList
        conversations={conversations}
        onSelect={handleSelectConversation}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MessageThread messages={messages} currentUserId={user?.id} />
        {selectedConversation && <SendMessageForm onSend={sendMessage} />}
      </div>
    </div>
  );
}