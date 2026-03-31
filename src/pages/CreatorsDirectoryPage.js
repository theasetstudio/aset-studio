import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CREATOR_TYPE_OPTIONS = [
  "All",
  "Visual Artist",
  "Virtual Photographer",
  "Boudoir Photographer",
  "Film Creator",
  "Music Creator",
  "Writer",
  "Scriptwriter",
  "Creative Director",
  "Visual Alchemist",
  "Speaker",
  "Actor",
  "Model",
  "DJ",
];

function cleanRole(role) {
  return String(role || "").trim().toLowerCase();
}

function isCreatorProfile(profile) {
  if (!profile) return false;

  const role = cleanRole(profile.role);
  return role === "creator" || role === "admin" || !!profile.is_creator;
}

function getCreatorStrengthScore(creator) {
  let score = 0;

  if (creator.banner_url) score += 3;
  if (creator.avatar_url) score += 3;
  if (creator.portfolio_tagline) score += 2;
  if (creator.bio) score += 2;
  if (creator.location) score += 1;
  if (creator.is_available_for_collab) score += 1;
  if (creator.is_available_for_client_work) score += 1;

  score += (creator.creator_types || []).length * 2;
  score += (creator.custom_creator_types || []).length * 2;

  return score;
}

function SmallFeaturedCreatorCard({ creator, label }) {
  const allBadges = [...creator.creator_types, ...creator.custom_creator_types];
  const primaryBadge = allBadges[0] || "Creator";

  return (
    <Link
      to={`/creator/${creator.id}`}
      style={{
        minWidth: 280,
        maxWidth: 320,
        textDecoration: "none",
        color: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0b0b0b",
        display: "block",
      }}
    >
      <div
        style={{
          height: 120,
          background: creator.banner_url
            ? `url(${creator.banner_url}) center/cover no-repeat`
            : "linear-gradient(135deg, #1b1b1b 0%, #2b1f1f 100%)",
        }}
      />

      <div style={{ padding: 16, marginTop: -34 }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #0b0b0b",
            background: "#1a1a1a",
            marginBottom: 12,
          }}
        >
          {creator.avatar_url ? (
            <img
              src={creator.avatar_url}
              alt={creator.display_name || creator.username || "Creator avatar"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "rgba(255,255,255,0.65)",
                fontWeight: 700,
              }}
            >
              {(creator.display_name || creator.username || "?")[0].toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "inline-block",
            marginBottom: 10,
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {label}
        </div>

        <h3 style={{ margin: "0 0 6px", fontSize: 22 }}>
          {creator.display_name || "Unnamed Creator"}
        </h3>

        <div style={{ color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>
          {creator.username ? `@${creator.username}` : "No username yet"}
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "7px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          {primaryBadge}
        </div>

        <div
          style={{
            marginBottom: 12,
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          👥 {creator.follower_count || 0} followers
        </div>

        {creator.portfolio_tagline ? (
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.5,
            }}
          >
            {creator.portfolio_tagline}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export default function CreatorsDirectoryPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadCreators() {
      try {
        setLoading(true);

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            display_name,
            username,
            portfolio_tagline,
            location,
            bio,
            is_available_for_collab,
            is_available_for_client_work,
            creator_types,
            custom_creator_type,
            avatar_url,
            banner_url,
            created_at,
            is_creator,
            role
          `);

        if (profilesError) throw profilesError;

        const creatorProfiles = (profilesData || []).filter((profile) =>
          isCreatorProfile(profile)
        );

        const { data: followsData, error: followsError } = await supabase
          .from("creator_follows")
          .select("creator_id");

        if (followsError) throw followsError;

        const followerCountsMap = (followsData || []).reduce((acc, follow) => {
          acc[follow.creator_id] = (acc[follow.creator_id] || 0) + 1;
          return acc;
        }, {});

        const cleanedCreators = creatorProfiles.map((creator) => ({
          ...creator,
          creator_types: Array.isArray(creator.creator_types)
            ? creator.creator_types
            : creator.creator_types
            ? [creator.creator_types]
            : [],
          custom_creator_types: creator.custom_creator_type
            ? [creator.custom_creator_type]
            : [],
          follower_count: followerCountsMap[creator.id] || 0,
        }));

        if (!alive) return;
        setCreators(cleanedCreators);
      } catch (err) {
        console.error("Error loading creators:", err);
        if (!alive) return;
        setCreators([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadCreators();

    return () => {
      alive = false;
    };
  }, []);

  const trendingCreators = useMemo(() => {
    return [...creators]
      .sort((a, b) => getCreatorStrengthScore(b) - getCreatorStrengthScore(a))
      .slice(0, 4);
  }, [creators]);

  const newestCreators = useMemo(() => {
    return [...creators]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 4);
  }, [creators]);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const allTypes = [...creator.creator_types, ...creator.custom_creator_types];

      const matchesType =
        selectedType === "All" || allTypes.includes(selectedType);

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        (creator.display_name || "").toLowerCase().includes(search) ||
        (creator.username || "").toLowerCase().includes(search) ||
        (creator.portfolio_tagline || "").toLowerCase().includes(search) ||
        (creator.location || "").toLowerCase().includes(search) ||
        (creator.bio || "").toLowerCase().includes(search) ||
        allTypes.some((type) => type.toLowerCase().includes(search));

      return matchesType && matchesSearch;
    });
  }, [creators, selectedType, searchTerm]);

  if (loading) {
    return <div style={{ padding: 40, color: "#fff" }}>Loading creators…</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "32px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 36 }}>Creators</h1>
          <p style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
            Discover artists, photographers, writers, directors, and visionary creators
            across The Aset Studio.
          </p>
        </div>

        {trendingCreators.length > 0 ? (
          <section style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 26 }}>Trending Creators</h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)" }}>
                Strong profiles getting visibility across the platform.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 6,
              }}
            >
              {trendingCreators.map((creator) => (
                <SmallFeaturedCreatorCard
                  key={`trending-${creator.id}`}
                  creator={creator}
                  label="Trending"
                />
              ))}
            </div>
          </section>
        ) : null}

        {newestCreators.length > 0 ? (
          <section style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 26 }}>Newest Creators</h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)" }}>
                Recently joined creators building their presence.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 6,
              }}
            >
              {newestCreators.map((creator) => (
                <SmallFeaturedCreatorCard
                  key={`newest-${creator.id}`}
                  creator={creator}
                  label="New"
                />
              ))}
            </div>
          </section>
        ) : null}

        <div
          style={{
            display: "grid",
            gap: 16,
            marginBottom: 24,
            padding: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <input
            type="text"
            placeholder="Search by name, username, location, bio, or creator type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0f0f0f",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CREATOR_TYPE_OPTIONS.map((type) => {
              const isActive = selectedType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.35)"
                      : "1px solid rgba(255,255,255,0.12)",
                    background: isActive ? "#fff" : "transparent",
                    color: isActive ? "#111" : "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 26 }}>All Creators</h2>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)" }}>
            Browse every creator profile on The Aset Studio.
          </p>
        </div>

        {filteredCreators.length === 0 ? (
          <div
            style={{
              padding: 24,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>No creators found</h2>
            <p style={{ marginBottom: 0, color: "rgba(255,255,255,0.75)" }}>
              Try a different search term or filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {filteredCreators.map((creator) => {
              const allBadges = [...creator.creator_types, ...creator.custom_creator_types];
              const joinedYear = creator.created_at
                ? new Date(creator.created_at).getFullYear()
                : null;

              return (
                <div
                  key={creator.id}
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0b0b0b",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      height: 120,
                      background: creator.banner_url
                        ? `url(${creator.banner_url}) center/cover no-repeat`
                        : "linear-gradient(135deg, #1b1b1b 0%, #2b1f1f 100%)",
                    }}
                  />

                  <div style={{ padding: 18, marginTop: -42 }}>
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid #0b0b0b",
                        background: "#1a1a1a",
                        marginBottom: 14,
                      }}
                    >
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.display_name || creator.username || "Creator avatar"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            color: "rgba(255,255,255,0.65)",
                            fontWeight: 700,
                          }}
                        >
                          {(creator.display_name || creator.username || "?")[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>
                      {creator.display_name || "Unnamed Creator"}
                    </h2>

                    <div style={{ color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>
                      {creator.username ? `@${creator.username}` : "No username yet"}
                    </div>

                    <Link
                      to={`/creator/${creator.id}/followers`}
                      style={{
                        display: "inline-block",
                        marginBottom: 12,
                        color: "rgba(255,255,255,0.75)",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      👥 {creator.follower_count || 0} followers
                    </Link>

                    {creator.portfolio_tagline ? (
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 12,
                          color: "rgba(255,255,255,0.9)",
                          lineHeight: 1.5,
                        }}
                      >
                        {creator.portfolio_tagline}
                      </p>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {allBadges.length > 0 ? (
                        allBadges.map((badge) => (
                          <span
                            key={`${creator.id}-${badge}`}
                            style={{
                              padding: "7px 10px",
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              fontSize: 12,
                            }}
                          >
                            {badge}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                          No creator types yet
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 8,
                        marginBottom: 16,
                        color: "rgba(255,255,255,0.82)",
                        fontSize: 14,
                      }}
                    >
                      {creator.location ? <div>📍 {creator.location}</div> : null}
                      {creator.is_available_for_collab ? (
                        <div>🤝 Available for collaboration</div>
                      ) : null}
                      {creator.is_available_for_client_work ? (
                        <div>💼 Available for client work</div>
                      ) : null}
                      {joinedYear ? <div>🗓 Member since {joinedYear}</div> : null}
                    </div>

                    {creator.bio ? (
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 18,
                          color: "rgba(255,255,255,0.72)",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {creator.bio}
                      </p>
                    ) : null}

                    <Link
                      to={`/creator/${creator.id}`}
                      style={{
                        display: "inline-block",
                        padding: "11px 16px",
                        borderRadius: 12,
                        background: "#fff",
                        color: "#111",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}