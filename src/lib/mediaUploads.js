import { supabase } from "../supabaseClient";

export async function uploadWatermarkedAndCreateMediaItem({
  file,
  title = "",
  gallery = "public",
  category = null,
  isBoudoir = false,
}) {
  if (!file) throw new Error("No file provided.");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not authenticated.");

  const safeFileName = (file.name || "upload")
    .replace(/[^\w.\-]+/g, "_")
    .slice(0, 120);

  const timestamp = Date.now();
  const watermarkedPath = `watermarked/${user.id}/${timestamp}_${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(watermarkedPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("media_items")
    .insert({
      owner_id: user.id,
      title: title || null,
      gallery,
      category,
      is_boudoir: !!isBoudoir,
      watermarked_path: watermarkedPath,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from("media").remove([watermarkedPath]).catch(() => {});
    throw insertError;
  }

  return data;
}

export async function fetchPublishedMediaItems({
  gallery = "public",
  category = null,
  limit = 48,
  offset = 0,
} = {}) {
  let q = supabase
    .from("media_items")
    .select("*")
    .eq("status", "published")
    .eq("gallery", gallery)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) q = q.eq("category", category);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export function getWatermarkedPublicUrl(path) {
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data?.publicUrl ?? "";
}
