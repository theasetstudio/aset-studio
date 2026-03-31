import { supabase } from "../supabaseClient";

/*
  Get or create a direct 1-to-1 conversation between two users.
  Returns the conversation_id.
*/
export async function getOrCreateConversation(userA, userB) {
  if (!userA || !userB) {
    throw new Error("Both user IDs are required");
  }

  if (userA === userB) {
    throw new Error("You cannot message yourself");
  }

  const {
    data: { user: sessionUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError) {
    console.error("Error getting current session user:", sessionError);
    throw sessionError;
  }

  if (!sessionUser) {
    throw new Error("You must be logged in to start a conversation");
  }

  if (sessionUser.id !== userA) {
    throw new Error("Authenticated user does not match the conversation starter");
  }

  // Step 1: Find all conversations for userA
  const { data: aConvos, error: aError } = await supabase
    .from("participants")
    .select("conversation_id")
    .eq("user_id", userA);

  if (aError) {
    console.error("Error fetching userA conversations:", aError);
    throw aError;
  }

  const conversationIds = (aConvos || []).map((row) => row.conversation_id);

  // Step 2: Check whether userB shares any of those conversations
  if (conversationIds.length > 0) {
    const { data: shared, error: sharedError } = await supabase
      .from("participants")
      .select("conversation_id")
      .in("conversation_id", conversationIds)
      .eq("user_id", userB);

    if (sharedError) {
      console.error("Error checking shared conversations:", sharedError);
      throw sharedError;
    }

    const sharedConversationIds = (shared || []).map(
      (row) => row.conversation_id
    );

    // Step 3: Only reuse a conversation if it is truly a 1-to-1 thread
    for (const conversationId of sharedConversationIds) {
      const { data: participants, error: participantsError } = await supabase
        .from("participants")
        .select("user_id")
        .eq("conversation_id", conversationId);

      if (participantsError) {
        console.error(
          "Error checking participant count for conversation:",
          conversationId,
          participantsError
        );
        throw participantsError;
      }

      if ((participants || []).length === 2) {
        return conversationId;
      }
    }
  }

  // Step 4: Create a new conversation using the authenticated session user
  const { data: convo, error: convoError } = await supabase
    .from("conversations")
    .insert({
      created_by: sessionUser.id,
    })
    .select()
    .single();

  if (convoError) {
    console.error("Error creating conversation:", convoError);
    throw convoError;
  }

  const conversationId = convo.id;

  // Step 5: Add both participants
  const { error: participantError } = await supabase
    .from("participants")
    .insert([
      {
        conversation_id: conversationId,
        user_id: userA,
      },
      {
        conversation_id: conversationId,
        user_id: userB,
      },
    ]);

  if (participantError) {
    console.error("Error inserting participants:", participantError);
    throw participantError;
  }

  return conversationId;
}