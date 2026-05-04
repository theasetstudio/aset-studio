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

  const asArray = (value) => (Array.isArray(value) ? value : []);

  if (loading) {
    return (
      <main className="spotlight-page">
        <style>{baseStyles}</style>
        <p className="loading">Loading Aset Spotlight...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="spotlight-page">
        <style>{baseStyles}</style>
        <section className="not-found">
          <p className="kicker">The Aset Studio</p>
          <h1>Spotlight Not Found</h1>
          <p>{errorMsg || "This profile could not be found."}</p>
          <Link to="/aset-spotlight" className="gold-link">
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

  const leadGalleryItem = gallery[0];
  const supportingGallery = gallery.slice(1);

  const renderCollection = (title, items, emptyText) => {
    const safeItems = asArray(items);

    return (
      <section className="section">
        <p className="section-kicker">Aset Archive</p>
        <h2 className="section-title">{title}</h2>

        {safeItems.length > 0 ? (
          <div className="card-grid">
            {safeItems.map((item, index) => (
              <article className="archive-card" key={`${title}-${index}`}>
                {(item.title || item.name) && <h3>{item.title || item.name}</h3>}
                {item.year && <p className="meta">{item.year}</p>}
                {item.role && <p>{item.role}</p>}
                {item.description && <p>{item.description}</p>}
                {item.caption && <p>{item.caption}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="empty">{emptyText}</p>
        )}
      </section>
    );
  };

  const renderGalleryMedia = (item, className = "") => {
    if (!item || !item.url) return null;

    if (item.type === "video") {
      return (
        <video
          src={item.url}
          controls
          playsInline
          preload="metadata"
          className={className}
        />
      );
    }

    return (
      <img
        src={item.url}
        alt={item.caption || item.title || profile.name || "Aset Spotlight gallery"}
        className={className}
      />
    );
  };

  return (
    <main className="spotlight-page">
      <style>{baseStyles}</style>

      <section className="hero">
        <div className="portrait-shell">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.name || "Aset Spotlight profile"}
              className="hero-image"
            />
          ) : (
            <div className="image-placeholder">Aset Spotlight</div>
          )}
        </div>

        <div className="identity">
          <p className="kicker">Recognized by The Aset Studio</p>
          <h1>{profile.alias || profile.name}</h1>

          {profile.name && profile.alias && <h2>{profile.name}</h2>}

          {profile.role && <p className="role">{profile.role}</p>}

          <div className="statement">
            <span>Studio Statement</span>
            <p>
              {profile.aset_statement ||
                "A defining cinematic presence in authorship, visual storytelling, and controlled creative environments."}
            </p>
          </div>
        </div>
      </section>

      <section className="screening">
        <div className="section-heading">
          <p className="section-kicker">Spotlight Reel</p>
          <h2 className="section-title">Featured Screening</h2>
        </div>

        {profile.featured_video_url ? (
          <>
            <div className="reel-frame">
              <video
                src={profile.featured_video_url}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="featured-video"
              />
            </div>

            {(profile.featured_video_title || profile.featured_video_caption) && (
              <div className="screening-meta">
                {profile.featured_video_title && (
                  <h3>{profile.featured_video_title}</h3>
                )}
                {profile.featured_video_caption && (
                  <p>{profile.featured_video_caption}</p>
                )}
              </div>
            )}

            <p className="screening-note">
              Short-form spotlight presentation. Full cinematic releases live in Aset Cinema.
            </p>
          </>
        ) : (
          <div className="empty-screening">
            <p>A spotlight reel is currently in development.</p>
          </div>
        )}
      </section>

      <section className="section bio-section">
        <p className="section-kicker">Personal Archive</p>
        <h2 className="section-title">Bio</h2>
        <p className="bio">
          {profile.bio || "This personal archive has not been written yet."}
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-kicker">Visual Record</p>
          <h2 className="section-title">Gallery</h2>
        </div>

        {gallery.length > 0 ? (
          <div className="cinematic-gallery">
            {leadGalleryItem && (
              <figure className="lead-gallery-card">
                {renderGalleryMedia(leadGalleryItem, "lead-gallery-media")}

                {(leadGalleryItem.title || leadGalleryItem.caption) && (
                  <figcaption>
                    <p className="meta">Lead Frame</p>
                    {leadGalleryItem.title && <h3>{leadGalleryItem.title}</h3>}
                    {leadGalleryItem.caption && <p>{leadGalleryItem.caption}</p>}
                  </figcaption>
                )}
              </figure>
            )}

            {supportingGallery.length > 0 && (
              <div className="supporting-gallery">
                {supportingGallery.map((item, index) => (
                  <figure className="supporting-card" key={`gallery-${index}`}>
                    {renderGalleryMedia(item, "supporting-media")}

                    {(item.title || item.caption) && (
                      <figcaption>
                        {item.title && <h3>{item.title}</h3>}
                        {item.caption && <p>{item.caption}</p>}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="empty">No spotlight gallery images added yet.</p>
        )}
      </section>

      {renderCollection("Honors & Recognition", awards, "No honors or recognition listed yet.")}
      {renderCollection("Filmography", filmography, "No filmography listed yet.")}
      {renderCollection("Discography", discography, "No discography listed yet.")}
      {renderCollection("Bibliography", bibliography, "No bibliography listed yet.")}

      <section className="section">
        <p className="section-kicker">Controlled Access</p>
        <h2 className="section-title">Official Fan Club</h2>

        {fanClub && fanClub.enabled ? (
          <article className="archive-card">
            <h3>{fanClub.name || "Official Fan Club"}</h3>
            {fanClub.description && <p>{fanClub.description}</p>}
            {fanClub.link && (
              <a href={fanClub.link} target="_blank" rel="noreferrer" className="gold-link">
                Enter Official Fan Club
              </a>
            )}
          </article>
        ) : (
          <p className="empty">No official fan club is currently listed.</p>
        )}
      </section>

      <section className="section">
        <p className="section-kicker">Professional Contact</p>
        <h2 className="section-title">Representation & Inquiries</h2>

        {representation ? (
          <div className="card-grid">
            {representation.agent && (
              <article className="archive-card">
                <h3>Agent</h3>
                {representation.agent.name && <p>{representation.agent.name}</p>}
                {representation.agent.email && (
                  <a href={`mailto:${representation.agent.email}`} className="gold-link">
                    {representation.agent.email}
                  </a>
                )}
              </article>
            )}

            {representation.aset_studio && (
              <article className="archive-card">
                <h3>The Aset Studio</h3>
                {representation.aset_studio.name && <p>{representation.aset_studio.name}</p>}
                {representation.aset_studio.email && (
                  <a href={`mailto:${representation.aset_studio.email}`} className="gold-link">
                    {representation.aset_studio.email}
                  </a>
                )}
              </article>
            )}
          </div>
        ) : (
          <p className="empty">Representation details have not been added yet.</p>
        )}
      </section>

      <div className="footer">
        <Link to="/aset-spotlight" className="back-link">
          Back to Aset Spotlight
        </Link>
      </div>
    </main>
  );
}

const baseStyles = `
  .spotlight-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 16% 8%, rgba(194, 133, 54, 0.2), transparent 30%),
      radial-gradient(circle at 88% 24%, rgba(114, 68, 26, 0.22), transparent 34%),
      linear-gradient(180deg, #050403 0%, #0b0806 46%, #000 100%);
    color: #f7efe1;
    padding: 118px 6vw 76px;
  }

  .loading {
    color: #d9c39d;
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .hero {
    max-width: 1320px;
    margin: 0 auto 82px;
    display: grid;
    grid-template-columns: minmax(280px, 0.82fr) minmax(320px, 1fr);
    gap: 58px;
    align-items: center;
  }

  .portrait-shell {
    position: relative;
    overflow: hidden;
    min-height: 620px;
    border: 1px solid rgba(222, 179, 95, 0.24);
    background: rgba(255,255,255,0.035);
    box-shadow: 0 34px 100px rgba(0,0,0,0.62);
  }

  .portrait-shell:after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.64)),
      linear-gradient(90deg, rgba(215,168,79,0.12), transparent 38%);
    pointer-events: none;
  }

  .hero-image {
    width: 100%;
    height: min(780px, 78vh);
    object-fit: cover;
    display: block;
  }

  .image-placeholder {
    min-height: 620px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cda96c;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .kicker,
  .section-kicker {
    color: #d8ad60;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-weight: 800;
    margin: 0 0 14px;
  }

  .identity h1 {
    font-size: clamp(62px, 8.6vw, 132px);
    line-height: 0.86;
    margin: 0 0 20px;
    letter-spacing: -0.075em;
    text-transform: uppercase;
    color: #fffaf0;
  }

  .identity h2 {
    font-size: clamp(24px, 3vw, 46px);
    margin: 0 0 22px;
    color: #ead2a6;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .role {
    color: #cdbfa8;
    font-size: 15px;
    line-height: 1.85;
    max-width: 720px;
    margin: 0 0 34px;
  }

  .statement {
    max-width: 780px;
    padding: 26px;
    border: 1px solid rgba(218, 174, 94, 0.22);
    background:
      radial-gradient(circle at top left, rgba(215,168,79,0.13), transparent 42%),
      rgba(255,255,255,0.035);
  }

  .statement span {
    display: block;
    color: #c79545;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-weight: 800;
  }

  .statement p {
    font-size: clamp(21px, 2.4vw, 34px);
    line-height: 1.32;
    color: #fff4dc;
    margin: 0;
    font-weight: 700;
  }

  .section,
  .screening {
    max-width: 1320px;
    margin: 0 auto 36px;
    padding: 42px 0;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .screening {
    padding: 42px;
    border: 1px solid rgba(218, 174, 94, 0.18);
    background:
      radial-gradient(circle at top right, rgba(215,168,79,0.12), transparent 38%),
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015));
    box-shadow: 0 22px 80px rgba(0,0,0,0.35);
  }

  .section-title {
    font-size: clamp(34px, 5.4vw, 74px);
    line-height: 0.95;
    margin: 0 0 28px;
    color: #fff7e8;
    letter-spacing: -0.06em;
  }

  .reel-frame {
    background: #000;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 28px 82px rgba(0,0,0,0.62);
    overflow: hidden;
  }

  .featured-video {
    width: 100%;
    max-height: 640px;
    display: block;
    background: #000;
  }

  .screening-meta {
    max-width: 900px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .screening-meta h3 {
    color: #fff1d7;
    font-size: 23px;
    margin: 0 0 8px;
  }

  .screening-meta p,
  .screening-note {
    color: #cfc0aa;
    font-size: 15px;
    line-height: 1.7;
    margin: 0;
  }

  .screening-note {
    margin-top: 16px;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .empty-screening {
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(215,168,79,0.22);
    background: radial-gradient(circle at center, rgba(215,168,79,0.12), rgba(0,0,0,0.58));
    text-align: center;
  }

  .empty-screening p,
  .empty {
    color: #d9c8a9;
    font-size: 15px;
    line-height: 1.8;
  }

  .bio {
    color: #eadfcd;
    font-size: 18px;
    line-height: 1.95;
    max-width: 980px;
    margin: 0;
  }

  .cinematic-gallery {
    display: grid;
    grid-template-columns: minmax(280px, 1.2fr) minmax(260px, 0.8fr);
    gap: 20px;
    align-items: stretch;
  }

  .lead-gallery-card,
  .supporting-card {
    margin: 0;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.035);
    box-shadow: 0 18px 60px rgba(0,0,0,0.28);
  }

  .lead-gallery-media {
    width: 100%;
    height: 680px;
    object-fit: cover;
    display: block;
    background: #000;
  }

  .supporting-gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .supporting-media {
    width: 100%;
    height: 330px;
    object-fit: cover;
    display: block;
    background: #000;
  }

  figcaption {
    padding: 18px;
  }

  figcaption h3 {
    color: #fff1d7;
    font-size: 20px;
    margin: 0 0 8px;
  }

  figcaption p {
    color: #d8cab6;
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
    gap: 18px;
  }

  .archive-card {
    padding: 25px;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018));
  }

  .archive-card h3 {
    color: #fff1d7;
    font-size: 20px;
    margin: 0 0 8px;
  }

  .archive-card p {
    color: #d8cab6;
    font-size: 15px;
    line-height: 1.75;
    margin: 8px 0;
  }

  .meta {
    color: #c99b4f !important;
    font-size: 12px !important;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 800;
  }

  .gold-link {
    color: #d8ad60;
    text-decoration: none;
    font-weight: 800;
  }

  .gold-link:hover,
  .back-link:hover {
    color: #ffe0a0;
  }

  .footer {
    max-width: 1320px;
    margin: 44px auto 0;
  }

  .back-link {
    color: #d8ad60;
    text-decoration: none;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 12px;
  }

  .not-found {
    max-width: 740px;
    margin: 0 auto;
    padding: 80px 0;
  }

  .not-found h1 {
    font-size: 54px;
    margin: 0 0 18px;
  }

  .not-found p {
    color: #d8cab6;
    line-height: 1.8;
  }

  @media (max-width: 980px) {
    .spotlight-page {
      padding: 96px 22px 58px;
    }

    .hero,
    .cinematic-gallery {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .portrait-shell {
      min-height: auto;
    }

    .hero-image {
      height: auto;
      max-height: 720px;
    }

    .screening {
      padding: 26px;
    }

    .lead-gallery-media,
    .supporting-media {
      height: auto;
      max-height: 620px;
    }
  }
`;