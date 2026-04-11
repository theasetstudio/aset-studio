import { supabase } from "../supabaseClient";

const MEDIA_BUCKET = "media";

function isFullUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function hasSignedQuery(url) {
  if (!isFullUrl(url)) return false;

  try {
    const parsed = new URL(url);
    return (
      parsed.searchParams.has("token") ||
      parsed.searchParams.has("expires") ||
      parsed.searchParams.has("signature")
    );
  } catch {
    return false;
  }
}

function extractMediaBucketPath(value) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!isFullUrl(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname || "";

    const marker = `/object/${MEDIA_BUCKET}/`;
    const publicMarker = `/object/public/${MEDIA_BUCKET}/`;
    const signMarker = `/render/image/private/${MEDIA_BUCKET}/`;

    if (pathname.includes(marker)) {
      return decodeURIComponent(pathname.split(marker)[1] || "").replace(/^\/+/, "");
    }

    if (pathname.includes(publicMarker)) {
      return decodeURIComponent(pathname.split(publicMarker)[1] || "").replace(/^\/+/, "");
    }

    if (pathname.includes(signMarker)) {
      return decodeURIComponent(pathname.split(signMarker)[1] || "").replace(/^\/+/, "");
    }

    return "";
  } catch {
    return "";
  }
}

export async function getSignedMediaUrl(path, expiresIn = 86400) {
  if (!path) return "";

  const rawValue = String(path).trim();
  if (!rawValue) return "";

  if (isFullUrl(rawValue) && hasSignedQuery(rawValue)) {
    return rawValue;
  }

  const cleanPath = extractMediaBucketPath(rawValue);
  if (!cleanPath) {
    if (isFullUrl(rawValue)) {
      return rawValue;
    }
    return "";
  }

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(cleanPath, expiresIn);

  if (error) {
    console.error("getSignedMediaUrl error:", error.message, cleanPath);
    return "";
  }

  let url = data?.signedUrl || "";

  if (url.includes("/render/image/private/")) {
    url = url.replace("/render/image/private/", "/object/");
  }

  return url;
}