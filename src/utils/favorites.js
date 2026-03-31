// src/utils/favorites.js
import { supabase } from "../supabaseClient";

// Returns a Set of media_item_id values the user has favorited
export async function fetchMyFavoriteIds(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("media_item_id")
    .eq("user_id", userId);

  if (error) throw error;
  return new Set((data || []).map((row) => row.media_item_id));
}

export async function addFavorite({ userId, mediaItemId }) {
  const { error } = await supabase.from("favorites").insert([
    {
      user_id: userId,
      media_item_id: mediaItemId,
    },
  ]);

  // Ignore duplicate favorites (unique index)
  if (error && error.code !== "23505") throw error;
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
 * Fetch favorited media items for a user (approved + not hidden only).
 * Favorites page should STILL gate display + signed URLs using getAccessGate,
 * but this prevents obviously unavailable items from showing up at all.
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

  // Flatten joined rows
  const items = (data || [])
    .map((row) => row.media_items)
    .filter(Boolean)
    .filter((it) => it.status === "approved" && it.hidden === false);

  return items;
}

