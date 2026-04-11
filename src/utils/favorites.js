import { supabase } from "../supabaseClient";

// Returns a Set of media_item_id values the user has favorited
export async function fetchMyFavoriteIds(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("media_item_id")
    .eq("user_id", userId);

  if (error) throw error;

  return new Set((data || []).map((row) => row.media_item_id).filter(Boolean));
}

export async function addFavorite({ userId, mediaItemId }) {
  const { error } = await supabase.from("favorites").insert([
    {
      user_id: userId,
      media_item_id: mediaItemId,
    },
  ]);

  // Ignore duplicate favorites if a unique constraint exists
  if (error && error.code !== "23505") {
    throw error;
  }
}

export async function removeFavorite({ userId, mediaItemId }) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("media_item_id", mediaItemId);

  if (error) throw error;
}

/**
 * Fetch favorited media items for a user.
 * Filters out hidden items and keeps approved/published only.
 */
export async function fetchMyFavoriteItems(userId, { limit = 200 } = {}) {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      media_item_id,
      media_items:media_item_id (*)
    `
    )
    .eq("user_id", userId)
    .limit(limit);

  if (error) throw error;

  const items = (data || [])
    .map((row) => row.media_items)
    .filter(Boolean)
    .filter((item) => {
      const status = String(item?.status || "").trim().toLowerCase();
      return (status === "approved" || status === "published") && item.hidden === false;
    });

  return items;
}

