import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SpotlightProfilePage() {
  const { slug } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("spotlight_profiles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error loading spotlight profile:", error);
        setProfile(null);
        setErrorMsg("This spotlight profile is not available yet.");
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    if (slug) fetchProfile();
  }, [slug]);

  const asArray = (value) => {
    return Array.isArray(value) ? value : [];
  };

  const renderCollection = (title, items, emptyText) => {
    const safeItems = asArray(items);

    return (
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Aset Archive</p>
          <h2 style={styles.sectionTitle}>{title}</h2>
        </div>

        {safeItems.length > 0 ? (
          <div style={styles.cardGrid}>
            {safeItems.map((item, index) => (
              <article style={styles.archiveCard} key={`${title}-${index}`}>
                {(item.title || item.name) && (
                  <h3 style={styles.cardTitle}>{item.title || item.name}</h3>
                )}

                {item.year && <p style={styles.metaText}>{item.year}</p>}
                {item.role && <p style={styles.bodyText}>{item.role}</p>}
                {item.description && <p style={styles.bodyText}>{item.description}</p>}
                {item.caption && <p style={styles.bodyText}>{item.caption}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>{emptyText}</p>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.loadingText}>Loading Aset Spotlight...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main style={styles.page}>
        <section style={styles.notFound}>
          <p style={styles.kicker}>The Aset Studio</p>
          <h1 style={styles.notFoundTitle}>Spotlight Not Found</h1>
          <p style={styles.bodyText}>
            {errorMsg || "This profile could not be found."}
          </p>
          <Link style={styles.backLink} to="/aset-spotlight">
            Return to Aset Spotlight
          </Link>
        </section>
      </main>
    );
  }

  const awards = asArray(profile.awards);
  const gallery = asArray(profile.gallery);
  const filmography = asArray(profile.filmography);
  const discography = asArray(profile.discography);
  const bibliography = asArray(profile.bibliography);
  const fanClub = profile.fan_club || null;
  const representation = profile.representation || null;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.imagePanel}>
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.name || "Aset Spotlight profile"}
              style={styles.heroImage}
            />
          ) : (
            <div style={styles.imagePlaceholder}>Aset Spotlight</div>
          )}
        </div>

        <div style={styles.identityPanel}>
          <p style={styles.kicker}>Recognized by The Aset Studio</p>

          <h1 style={styles.aliasTitle}>{profile.alias || profile.name}</h1>

          {profile.name && profile.alias && (
            <h2 style={styles.nameTitle}>{profile.name}</h2>
          )}

          {profile.role && <p style={styles.roleText}>{profile.role}</p>}

          <div style={styles.statementBox}>
            <p style={styles.statementText}>
              {profile.aset_statement ||
                "A defining creative presence recognized within The Aset Studio."}
            </p>
          </div>
        </div>
      </section>

      <section style={styles.screeningSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Featured Presence</p>
          <h2 style={styles.screeningTitle}>Featured Screening</h2>
        </div>

        {profile.featured_video_url ? (
          <div style={styles.videoFrame}>
            <video
              src={profile.featured_video_url}
              controls
              playsInline
              style={styles.video}
            />

            {(profile.featured_video_title || profile.featured_video_caption) && (
              <div style={styles.videoCaptionBox}>
                {profile.featured_video_title && (
                  <h3 style={styles.cardTitle}>{profile.featured_video_title}</h3>
                )}
                {profile.featured_video_caption && (
                  <p style={styles.bodyText}>{profile.featured_video_caption}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.emptyScreening}>
            <p style={styles.emptyScreeningText}>
              A featured screening will be presented by The Aset Studio.
            </p>
          </div>
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Personal Archive</p>
          <h2 style={styles.sectionTitle}>Bio</h2>
        </div>
        <p style={styles.bioText}>
          {profile.bio ||
            "This personal archive has not been written yet."}
        </p>
      </section>

      {renderCollection(
        "Honors & Recognition",
        awards,
        "No honors or recognition listed yet."
      )}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Visual Record</p>
          <h2 style={styles.sectionTitle}>Gallery</h2>
        </div>

        {gallery.length > 0 ? (
          <div style={styles.galleryGrid}>
            {gallery.map((image, index) => (
              <figure style={styles.galleryItem} key={`gallery-${index}`}>
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.caption || profile.name || "Aset Spotlight gallery"}
                    style={styles.galleryImage}
                  />
                ) : null}

                {image.caption && (
                  <figcaption style={styles.galleryCaption}>
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No spotlight gallery images added yet.</p>
        )}
      </section>

      {renderCollection("Filmography", filmography, "No filmography listed yet.")}
      {renderCollection("Discography", discography, "No discography listed yet.")}
      {renderCollection("Bibliography", bibliography, "No bibliography listed yet.")}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Controlled Access</p>
          <h2 style={styles.sectionTitle}>Official Fan Club</h2>
        </div>

        {fanClub && fanClub.enabled ? (
          <article style={styles.archiveCard}>
            <h3 style={styles.cardTitle}>{fanClub.name || "Official Fan Club"}</h3>
            {fanClub.description && (
              <p style={styles.bodyText}>{fanClub.description}</p>
            )}
            {fanClub.link && (
              <a
                href={fanClub.link}
                target="_blank"
                rel="noreferrer"
                style={styles.goldLink}
              >
                Enter Official Fan Club
              </a>
            )}
          </article>
        ) : (
          <p style={styles.emptyText}>
            No official fan club is currently listed.
          </p>
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Professional Contact</p>
          <h2 style={styles.sectionTitle}>Representation & Inquiries</h2>
        </div>

        {representation ? (
          <div style={styles.cardGrid}>
            {representation.agent && (
              <article style={styles.archiveCard}>
                <h3 style={styles.cardTitle}>Agent</h3>
                {representation.agent.name && (
                  <p style={styles.bodyText}>{representation.agent.name}</p>
                )}
                {representation.agent.email && (
                  <a
                    href={`mailto:${representation.agent.email}`}
                    style={styles.goldLink}
                  >
                    {representation.agent.email}
                  </a>
                )}
              </article>
            )}

            {representation.aset_studio && (
              <article style={styles.archiveCard}>
                <h3 style={styles.cardTitle}>The Aset Studio</h3>
                {representation.aset_studio.name && (
                  <p style={styles.bodyText}>
                    {representation.aset_studio.name}
                  </p>
                )}
                {representation.aset_studio.email && (
                  <a
                    href={`mailto:${representation.aset_studio.email}`}
                    style={styles.goldLink}
                  >
                    {representation.aset_studio.email}
                  </a>
                )}
              </article>
            )}
          </div>
        ) : (
          <p style={styles.emptyText}>
            Representation details have not been added yet.
          </p>
        )}
      </section>

      <div style={styles.footerNav}>
        <Link style={styles.backLink} to="/aset-spotlight">
          Back to Aset Spotlight
        </Link>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(169, 112, 42, 0.18), transparent 34%), linear-gradient(180deg, #050505 0%, #0a0806 55%, #000 100%)",
    color: "#f5efe5",
    padding: "110px 6vw 70px",
    fontFamily: "inherit",
  },

  loadingText: {
    color: "#d8c6aa",
    fontSize: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.9fr) minmax(300px, 1fr)",
    gap: "48px",
    alignItems: "center",
    maxWidth: "1280px",
    margin: "0 auto 70px",
  },

  imagePanel: {
    border: "1px solid rgba(214, 174, 101, 0.22)",
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "min(760px, 78vh)",
    objectFit: "cover",
    display: "block",
  },

  imagePlaceholder: {
    minHeight: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#b89762",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  identityPanel: {
    padding: "30px 0",
  },

  kicker: {
    color: "#d7b46c",
    fontSize: "12px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    marginBottom: "18px",
    fontWeight: 700,
  },

  aliasTitle: {
    fontSize: "clamp(54px, 8vw, 118px)",
    lineHeight: "0.9",
    margin: "0 0 16px",
    letterSpacing: "-0.05em",
    textTransform: "uppercase",
  },

  nameTitle: {
    fontSize: "clamp(24px, 3vw, 44px)",
    margin: "0 0 22px",
    color: "#ead7b4",
    fontWeight: 600,
    letterSpacing: "0.03em",
  },

  roleText: {
    color: "#c9b89e",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "720px",
    marginBottom: "30px",
  },

  statementBox: {
    borderLeft: "3px solid #d7a84f",
    padding: "22px 0 22px 24px",
    maxWidth: "760px",
  },

  statementText: {
    fontSize: "clamp(21px, 2.4vw, 34px)",
    lineHeight: 1.3,
    color: "#fff4df",
    margin: 0,
    fontWeight: 700,
  },

  screeningSection: {
    maxWidth: "1280px",
    margin: "0 auto 48px",
    padding: "42px",
    border: "1px solid rgba(214, 174, 101, 0.18)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
  },

  section: {
    maxWidth: "1280px",
    margin: "0 auto 34px",
    padding: "38px 0",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  sectionHeader: {
    marginBottom: "22px",
  },

  sectionKicker: {
    color: "#b99154",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    margin: "0 0 8px",
    fontWeight: 700,
  },

  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 52px)",
    margin: 0,
    color: "#fff7e8",
    letterSpacing: "-0.04em",
  },

  screeningTitle: {
    fontSize: "clamp(32px, 5vw, 68px)",
    margin: 0,
    color: "#fff7e8",
    letterSpacing: "-0.05em",
  },

  videoFrame: {
    marginTop: "24px",
  },

  video: {
    width: "100%",
    maxHeight: "720px",
    background: "#000",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "block",
  },

  videoCaptionBox: {
    marginTop: "18px",
  },

  emptyScreening: {
    minHeight: "260px",
    border: "1px solid rgba(215, 168, 79, 0.22)",
    background:
      "radial-gradient(circle at center, rgba(215,168,79,0.12), rgba(0,0,0,0.55))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    textAlign: "center",
  },

  emptyScreeningText: {
    color: "#d9c49c",
    fontSize: "18px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    maxWidth: "620px",
    lineHeight: 1.7,
  },

  bioText: {
    color: "#e8dcc8",
    fontSize: "18px",
    lineHeight: 1.95,
    maxWidth: "980px",
    margin: 0,
  },

  bodyText: {
    color: "#d9ccb8",
    fontSize: "15px",
    lineHeight: 1.8,
    margin: "8px 0",
  },

  metaText: {
    color: "#b9975f",
    fontSize: "13px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "8px 0",
  },

  emptyText: {
    color: "#a99d8c",
    fontSize: "15px",
    lineHeight: 1.7,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  archiveCard: {
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.035)",
  },

  cardTitle: {
    color: "#fff4dd",
    fontSize: "20px",
    margin: "0 0 8px",
  },

  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  galleryItem: {
    margin: 0,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.035)",
    overflow: "hidden",
  },

  galleryImage: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    display: "block",
  },

  galleryCaption: {
    color: "#d9ccb8",
    padding: "14px",
    fontSize: "14px",
  },

  goldLink: {
    color: "#d7b46c",
    textDecoration: "none",
    fontWeight: 700,
  },

  footerNav: {
    maxWidth: "1280px",
    margin: "40px auto 0",
  },

  backLink: {
    color: "#d7b46c",
    textDecoration: "none",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "12px",
  },

  notFound: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "80px 0",
  },

  notFoundTitle: {
    fontSize: "52px",
    margin: "0 0 18px",
  },
};