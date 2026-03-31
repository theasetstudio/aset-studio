import { supabase } from "../supabaseClient";

// -----------------------------
// PUZZLES
// -----------------------------
export async function getPublishedPuzzles() {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPuzzleBySlug(slug) {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw error;
  return data;
}

export async function getDailyPuzzle() {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("status", "published")
    .eq("is_daily_puzzle", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// -----------------------------
// STORAGE HELPERS
// -----------------------------
export async function getSignedMediaUrl(path, expiresIn = 3600) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Signed URL error:", error.message);
    return null;
  }

  return data?.signedUrl || null;
}

// -----------------------------
// USER PROGRESS
// -----------------------------
export async function getMyPuzzleProgress(userId) {
  const { data, error } = await supabase
    .from("puzzle_progress")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function upsertPuzzleProgress({
  user_id,
  puzzle_id,
  progress_percent,
  is_completed = false,
  save_data = {},
}) {
  const payload = {
    user_id,
    puzzle_id,
    progress_percent,
    is_completed,
    save_data,
    completed_at: is_completed ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("puzzle_progress")
    .upsert(payload, { onConflict: "user_id,puzzle_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -----------------------------
// USER CREATIONS
// -----------------------------
export async function getMyCreations(userId) {
  const { data, error } = await supabase
    .from("user_puzzle_creations")
    .select(`
      *,
      puzzles (
        id,
        title,
        slug,
        preview_path,
        puzzle_type
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function savePuzzleCreation({
  user_id,
  puzzle_id,
  progress_id = null,
  final_image_path = null,
  visibility = "private",
  share_enabled = true,
}) {
  const { data, error } = await supabase
    .from("user_puzzle_creations")
    .insert({
      user_id,
      puzzle_id,
      progress_id,
      final_image_path,
      visibility,
      share_enabled,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCreationVisibility(creationId, visibility) {
  const { data, error } = await supabase
    .from("user_puzzle_creations")
    .update({ visibility })
    .eq("id", creationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

