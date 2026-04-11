import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getSignedMediaUrl } from "../utils/storage";
import { getCreatorProfilePath } from "../utils/creatorLinks";

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "C";
}

function getCreatorName(creator) {
  return creator.display_name || creator.username || "Creator";
}

function getCreatorBio(creator) {
  return (
    creator.bio ||
    creator.description ||
    creator.about ||
    "This creator is building their presence inside The Aset Studio."
  );
}

function getCreatorLocation(creator) {
  const parts = [creator.city, creator.state, creator.country].filter(Boolean);
  return parts.join(", ");
}

function getCreatorTags(creator) {
  if (Array.isArray(creator.specialties) && creator.specialties.length > 0) {
    return creator.specialties.slice(0, 3);
  }

  if (Array.isArray(creator.tags) && creator.tags.length > 0) {
    return creator.tags.slice(0, 3);
  }

  return [];
}

function CreatorCard({ creator, badgeText = null }) {
  const name = getCreatorName(creator);
  const bio = getCreatorBio(creator);
  const location = getCreatorLocation(creator);
  const tags = getCreatorTags(creator);

  const [avatarSignedUrl, setAvatarSignedUrl] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);

  const usernameLabel =
    typeof creator.username === "string" && creator.username.trim() !== ""
      ? `@${creator.username.trim()}`
      : "@creator";

  useEffect(() => {
    let alive = true;

    async function loadAvatar() {
      try {
        setAvatarFailed(false);
        setAvatarSignedUrl("");

        if (!creator.avatar_url) {
          return;
        }

        const signedUrl = await getSignedMediaUrl(creator.avatar_url);

        if (alive) {
          setAvatarSignedUrl(signedUrl || "");
        }
      } catch (err) {
        console.error("Creator avatar load failed:", err);
        if (alive) {
          setAvatarSignedUrl("");
        }
      }
    }

    loadAvatar();

    return () => {
      alive = false;
    };
  }, [creator.avatar_url]);

  const showAvatar = avatarSignedUrl && !avatarFailed;

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.avatarWrap}>
          {showAvatar ? (
            <img
              src={avatarSignedUrl}
              alt={name}
              style={styles.avatarImage}
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div style={styles.avatarFallback}>{getInitial(name)}</div>
          )}
        </div>

        {badgeText ? <div style={styles.badge}>{badgeText}</div> : null}
      </div>

      <div style={styles.cardContent}>
        <h2 style={styles.cardTitle}>{name}</h2>
        <p style={styles.cardUsername}>{usernameLabel}</p>

        {location ? <p style={styles.cardLocation}>📍 {location}</p> : null}

        {tags.length > 0 ? (
          <div style={styles.tagRow}>
            {tags.map((tag) => (
              <span key={`${creator.id}-${tag}`} style={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <p style={styles.cardBio}>{bio}</p>

        <div style={styles.buttonRow}>
          <Link to={getCreatorProfilePath(creator)} style={styles.primaryButton}>
            View Profile
          </Link>

          <Link to={getCreatorProfilePath(creator)} style={styles.secondaryButton}>
            Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {subtitle ? <p style={styles.sectionSubtitle}>{subtitle}</p> : null}
    </div>
  );
}

export default function CreatorsDirectoryPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreators() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .not("username", "is", null)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setCreators(data || []);
      } catch (err) {
        console.error("Creators load failed:", err);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, []);

  const featuredCreators = creators.slice(0, 3);

  const newestCreators = creators
    .filter((creator) => !featuredCreators.some((featured) => featured.id === creator.id))
    .slice(0, 6);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingCard}>Loading creators...</div>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyCard}>
            <h2 style={styles.emptyTitle}>Creator profiles are coming soon</h2>
            <p style={styles.emptyText}>
              Public creator discovery is ready. Once creators begin joining, they
              will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <SectionHeader
          title="Featured Creators"
          subtitle="Spotlighted profiles with strong presentation."
        />

        <div style={styles.grid}>
          {featuredCreators.map((creator) => (
            <CreatorCard
              key={`featured-${creator.id}`}
              creator={creator}
              badgeText="Featured"
            />
          ))}
        </div>

        <div style={styles.sectionSpacer} />

        <SectionHeader
          title="Newest Creators"
          subtitle="Recently joined creators building their presence."
        />

        <div style={styles.grid}>
          {newestCreators.map((creator) => (
            <CreatorCard key={`newest-${creator.id}`} creator={creator} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "48px 20px 80px",
  },

  container: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  sectionSpacer: {
    height: "56px",
  },

  sectionHeader: {
    marginBottom: "24px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 40px)",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  sectionSubtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "rgba(255,255,255,0.65)",
    fontSize: "16px",
    lineHeight: 1.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    width: "100%",
    borderRadius: "30px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.99) 100%)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
  },

  cardTop: {
    position: "relative",
  },

  avatarWrap: {
    width: "100%",
    aspectRatio: "4 / 4.4",
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    position: "relative",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "54px",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },

  badge: {
    position: "absolute",
    top: "18px",
    left: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "34px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.52)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(10px)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  cardContent: {
    padding: "26px 24px 24px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 34px)",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  cardUsername: {
    margin: "10px 0 0 0",
    color: "rgba(255,255,255,0.70)",
    fontSize: "16px",
    lineHeight: 1.5,
  },

  cardLocation: {
    margin: "14px 0 0 0",
    color: "rgba(255,255,255,0.62)",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
  },

  tag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "34px",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.88)",
    fontSize: "13px",
    lineHeight: 1,
    fontWeight: 500,
  },

  cardBio: {
    margin: "20px 0 0 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: "15px",
    lineHeight: 1.75,
    flex: 1,
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "28px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    padding: "0 20px",
    borderRadius: "18px",
    background: "#ffffff",
    color: "#111111",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1,
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    padding: "0 20px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: 1,
  },

  loadingCard: {
    borderRadius: "28px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: "28px",
    fontSize: "18px",
    color: "#ffffff",
  },

  emptyCard: {
    borderRadius: "30px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: "36px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "clamp(28px, 3vw, 38px)",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  emptyText: {
    marginTop: "14px",
    marginBottom: 0,
    maxWidth: "820px",
    color: "rgba(255,255,255,0.72)",
    fontSize: "16px",
    lineHeight: 1.8,
  },
};