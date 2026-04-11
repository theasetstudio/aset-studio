export function getCreatorUsername(creator) {
  if (!creator) return "";

  return (
    creator.username ||
    creator.handle ||
    creator.slug ||
    creator.user_name ||
    ""
  );
}

export function getCreatorProfilePath(creator) {
  const username = getCreatorUsername(creator);

  if (!username) return "/creators";

  return `/creator/${encodeURIComponent(username)}`;
}

export function getCreatorFollowersPath(creator) {
  const username = getCreatorUsername(creator);

  if (!username) return "/creators";

  return `/creator/${encodeURIComponent(username)}/followers`;
}

export function getCreatorFollowingPath(creator) {
  const username = getCreatorUsername(creator);

  if (!username) return "/creators";

  return `/creator/${encodeURIComponent(username)}/following`;
}