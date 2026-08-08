export const SIGNED_URL_TTL_SECONDS = 600;
export const PREVIEW_LIMIT = 5;

export function clean(value) {
  return String(value || "").trim();
}

export function norm(value) {
  return clean(value).toLowerCase();
}

export function isVideoFile(path) {
  const value = norm(path);

  return (
    value.endsWith(".mp4") ||
    value.endsWith(".mov") ||
    value.endsWith(".webm") ||
    value.endsWith(".m4v")
  );
}

export function safariFrame(url) {
  return url ? `${url}#t=0.1` : "";
}

export function textPool(item) {
  return [
    item?.category,
    item?.subcategory,
    item?.section,
    item?.collection,
    item?.type,
    item?.title,
    item?.description,
    item?.tagline,
    item?.quote,
    item?.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matches(item, terms) {
  const text = textPool(item);
  return terms.some((term) => text.includes(norm(term)));
}

export function displayTitle(item) {
  return (
    clean(item?.title) ||
    clean(item?.tagline) ||
    clean(item?.quote) ||
    "The Aset Cinema Presentation"
  );
}

export function displayDescription(item) {
  return (
    clean(item?.description) ||
    clean(item?.tagline) ||
    "An official presentation from The Aset Cinema."
  );
}

export function displayCategory(item) {
  return (
    clean(item?.category) ||
    clean(item?.section) ||
    clean(item?.collection) ||
    "Aset Cinema"
  );
}

export function uniqueItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

export function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function isGalleryOnly(item) {
  const text = textPool(item);

  return (
    text.includes("gallery only") ||
    text.includes("image gallery") ||
    text.includes("visual art gallery") ||
    text.includes("gallery exclusive") ||
    text.includes("mood piece") ||
    text.includes("prompt experiment")
  );
}

export function isApprovedForCinema(item) {
  const text = textPool(item);

  return (
    item?.show_in_cinema === true ||
    item?.cinema_approved === true ||
    item?.is_cinema === true ||
    text.includes("aset cinema") ||
    text.includes("cinema release") ||
    text.includes("cinematic release") ||
    text.includes("official screening") ||
    text.includes("aset original") ||
    text.includes("studio original") ||
    text.includes("featured premiere") ||
    text.includes("interview") ||
    text.includes("performance room") ||
    text.includes("music video") ||
    text.includes("red carpet")
  );
}

export function getMediaPath(item) {
  return (
    clean(item?.watermarked_path) ||
    clean(item?.file_path) ||
    clean(item?.video_path) ||
    ""
  );
}

export function roomMatches(items, terms) {
  return uniqueItems(items.filter((item) => matches(item, terms)));
}
