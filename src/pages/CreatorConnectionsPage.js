import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PAGE_SIZE = 20;
const SIGNED_URL_TTL_SECONDS = 600;

function normalizeStoragePath(input) {
  if (!input) return "";

  let p = String(input).trim();

  while (p.startsWith("/")) {
    p = p.slice(1);
  }

  if (p.toLowerCase().startsWith("media/")) {
    p = p.slice(6);
  }

  if (p.toLowerCase().startsWith("public/")) {
    p = p.slice(7);
  }

  while (p.includes("//")) {
    p = p.replace("//", "/");
  }

  return p;
}

async function getSignedUrl(path) {
  const cleanPath = normalizeStoragePath(path);
  if (!cleanPath) return "";

  try {
    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(cleanPath, SIGNED_URL_TTL_SECONDS);

    if (error) {
      console.error("Signed URL error:", error);
      return "";
    }

    return data?.signedUrl || "";
  } catch (error) {
    console.error("Signed URL exception:", error);
    return "";
  }
}

export default function CreatorConnectionsPage({ mode: modeProp }) {
  const { username } = useParams();
  const location = useLocation();

  const mode =
    modeProp ||
    (location.pathname.endsWith("/following") ? "following" : "followers");

  const [creatorProfile, setCreatorProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [followStatusMap, setFollowStatusMap] = useState({});
  const [followsYouMap, setFollowsYouMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const currentUserId = supabase.auth.user()?.id;

  const loadMoreProfiles = useCallback(async () => {
    if (loadingRef.current || !creatorProfile?.id) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      let connectionIds = [];

      const start = pageRef.current * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      if (mode === "followers") {
        const { data: followRows, error } = await supabase
          .from("creator_follows")
          .select("follower_id")
          .eq("creator_id", creatorProfile.id)
          .range(start, end);

        if (error) throw error;
        connectionIds = followRows?.map((row) => row.follower_id) || [];
      } else {
        const { data: followRows, error } = await supabase
          .from("creator_follows")
          .select("creator_id")
          .eq("follower_id", creatorProfile.id)
          .range(start, end);

        if (error) throw error;
        connectionIds = followRows?.map((row) => row.creator_id) || [];
      }

      if (connectionIds.length === 0) {
        setHasMore(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", connectionIds);

      if (profileError) throw profileError;

      const profilesWithSignedUrls = await Promise.all(
        (profileData || []).map(async (profile) => {
          const avatar_signed_url = profile.avatar_url
            ? await getSignedUrl(profile.avatar_url)
            : "";

          return {
            ...profile,
            creator_slug: profile.username || profile.id,
            avatar_signed_url,
          };
        })
      );

      setProfiles((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newProfiles = profilesWithSignedUrls.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...newProfiles];
      });

      const { count, error: countError } = await supabase
        .from("creator_follows")
        .select("*", { count: "exact", head: true })
        .eq(mode === "followers" ? "creator_id" : "follower_id", creatorProfile.id);

      if (countError) throw countError;

      setHasMore((pageRef.current + 1) * PAGE_SIZE < (count || 0));

      if (currentUserId) {
        const { data: currentUserFollows, error: currentFollowsError } =
          await supabase
            .from("creator_follows")
            .select("creator_id")
            .eq("follower_id", currentUserId);

        if (currentFollowsError) throw currentFollowsError;

        const statusMap = {};
        (currentUserFollows || []).forEach((row) => {
          statusMap[row.creator_id] = true;
        });
        setFollowStatusMap(statusMap);
      }

      if (currentUserId && connectionIds.length > 0) {
        const { data: followsYouRows, error: followsYouError } = await supabase
          .from("creator_follows")
          .select("follower_id")
          .eq("creator_id", currentUserId)
          .in("follower_id", connectionIds);

        if (followsYouError) throw followsYouError;

        const youMap = {};
        connectionIds.forEach((userId) => {
          youMap[userId] = false;
        });

        (followsYouRows || []).forEach((row) => {
          youMap[row.follower_id] = true;
        });

        setFollowsYouMap((prev) => ({
          ...prev,
          ...youMap,
        }));
      }

      pageRef.current += 1;
    } catch (err) {
      console.error("Error loading connections:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [creatorProfile?.id, mode, currentUserId]);

  useEffect(() => {
    let alive = true;

    async function loadCreatorProfile() {
      try {
        setLoading(true);
        pageRef.current = 0;
        setProfiles([]);
        setHasMore(false);
        setFollowStatusMap({});
        setFollowsYouMap({});
        setSearchTerm("");

        const routeValue = String(username || "").trim();

        if (!routeValue) {
          if (alive) {
            setCreatorProfile(null);
            setLoading(false);
          }
          return;
        }

        let profileData = null;

        const { data: usernameMatch, error: usernameError } = await supabase
          .from("profiles")
          .select("id, display_name, username")
          .eq("username", routeValue)
          .maybeSingle();

        if (usernameError) throw usernameError;
        profileData = usernameMatch;

        if (!profileData) {
          const { data: lowerUsernameMatch, error: lowerUsernameError } = await supabase
            .from("profiles")
            .select("id, display_name, username")
            .eq("username", routeValue.toLowerCase())
            .maybeSingle();

          if (lowerUsernameError) throw lowerUsernameError;
          profileData = lowerUsernameMatch;
        }

        if (!profileData) {
          const { data: idMatch, error: idError } = await supabase
            .from("profiles")
            .select("id, display_name, username")
            .eq("id", routeValue)
            .maybeSingle();

          if (idError) throw idError;
          profileData = idMatch;
        }

        if (!alive) return;
        setCreatorProfile(profileData || null);
      } catch (error) {
        console.error("Error loading creator profile for connections:", error);
        if (!alive) return;
        setCreatorProfile(null);
        setLoading(false);
      }
    }

    loadCreatorProfile();

    return () => {
      alive = false;
    };
  }, [username]);

  useEffect(() => {
    if (!creatorProfile?.id) return;
    loadMoreProfiles();
  }, [creatorProfile?.id, loadMoreProfiles]);

  const toggleFollow = async (profileId) => {
    if (!currentUserId || profileId === currentUserId) return;

    const isFollowing = followStatusMap[profileId];

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("creator_follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("creator_id", profileId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("creator_follows").insert([
          {
            follower_id: currentUserId,
            creator_id: profileId,
          },
        ]);

        if (error) throw error;
      }

      setFollowStatusMap((prev) => ({
        ...prev,
        [profileId]: !isFollowing,
      }));
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const renderAvatar = (profile) => {
    if (profile.avatar_signed_url) {
      return (
        <img
          src={profile.avatar_signed_url}
          alt={profile.display_name || "Creator avatar"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      );
    }

    const initials = (profile.display_name || profile.username || "U")
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {initials}
      </div>
    );
  };

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 150;

    if (bottom && hasMore && !loadingRef.current) {
      loadMoreProfiles();
    }
  }, [hasMore, loadMoreProfiles]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredProfiles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return profiles;

    return profiles.filter((profile) => {
      const displayName = (profile.display_name || "").toLowerCase();
      const usernameValue = (profile.username || "").toLowerCase();
      return (
        displayName.includes(normalizedSearch) ||
        usernameValue.includes(normalizedSearch)
      );
    });
  }, [profiles, searchTerm]);

  const creatorSlug = creatorProfile?.username || creatorProfile?.id || "";

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 900,
        margin: "0 auto",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>
        {mode === "followers" ? "Followers" : "Following"}
      </h1>

      <div style={{ marginBottom: 16 }}>
        <Link
          to={`/creator/${creatorSlug}`}
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          Back to Profile
        </Link>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${mode}...`}
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      {filteredProfiles.length === 0 && !loading ? (
        <p>{searchTerm.trim() ? "No matching users found." : "No users found."}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {filteredProfiles.map((profile) => {
            const followsYou = !!followsYouMap[profile.id];
            const isMutual = followsYou && !!followStatusMap[profile.id];
            const profileSlug = profile.username || profile.id;

            return (
              <div
                key={profile.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <Link
                  to={`/creator/${profileSlug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textDecoration: "none",
                    color: "#fff",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#222",
                      flexShrink: 0,
                    }}
                  >
                    {renderAvatar(profile)}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {profile.display_name || "Unnamed"}

                      {isMutual ? (
                        <span
                          style={{
                            fontSize: 10,
                            background: "#6b4b1f",
                            padding: "2px 6px",
                            borderRadius: 4,
                            color: "#fff",
                            letterSpacing: 0.2,
                          }}
                        >
                          Mutual
                        </span>
                      ) : followsYou ? (
                        <span
                          style={{
                            fontSize: 10,
                            background: "#444",
                            padding: "2px 6px",
                            borderRadius: 4,
                            color: "#fff",
                            letterSpacing: 0.2,
                          }}
                        >
                          Follows You
                        </span>
                      ) : null}
                    </div>

                    {profile.username ? (
                      <div style={{ opacity: 0.7 }}>@{profile.username}</div>
                    ) : null}
                  </div>
                </Link>

                {currentUserId && currentUserId !== profile.id ? (
                  <button
                    type="button"
                    onClick={() => toggleFollow(profile.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1px solid #555",
                      background: followStatusMap[profile.id]
                        ? "#555"
                        : "#2c2c2c",
                      color: "#fff",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {followStatusMap[profile.id] ? "Unfollow" : "Follow"}
                  </button>
                ) : null}
              </div>
            );
          })}

          {loading ? <p style={{ marginTop: 16 }}>Loading...</p> : null}
          {!hasMore && profiles.length > 0 && !loading ? (
            <p style={{ marginTop: 16 }}>No more users.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}