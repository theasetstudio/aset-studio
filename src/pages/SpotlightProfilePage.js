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

  const renderCollection = (title, items, emptyText) => {
    const safeItems = asArray(items);

    return (
      <section className="section">
        <p className="section-kicker">Aset Archive</p>
        <h2 className="section-title">{title}</h2>

        {safeItems.length > 0 ? (
          <div className="card-grid">
            {safeItems.map((item, index) => (
              <article className="card" key={`${title}-${index}`}>
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

  if (loading) {
    return (
      <main className="page">
        <p className="loading">Loading Aset Spotlight...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
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

  return (
    <main className="page">
      <style>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(169,112,42,0.18), transparent 34%),
            linear-gradient(180deg, #050505 0%, #0a0806 55%, #000 100%);
          color: #f5efe5;
          padding: 110px 6vw 70px;
        }

        .loading {
          color: #d8c6aa;
          font-size: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero {
          max-width: 1280px;
          margin: 0 auto 70px;
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(300px, 1fr);
          gap: 48px;
          align-items: center;
        }

        .image-panel {
          border: 1px solid rgba(214, 174, 101, 0.22);
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: min(760px, 78vh);
          object-fit: cover;
          display: block;
        }

        .image-placeholder {
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b89762;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .identity {
          padding: 30px 0;
        }

        .kicker,
        .section-kicker {
          color: #d7b46c;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 0 0 14px;
        }

        .alias {
          font-size: clamp(56px, 8vw, 118px);
          line-height: 0.9;
          margin: 0 0 16px;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: #ffffff;
        }

        .name {
          font-size: clamp(24px, 3vw, 44px);
          margin: 0 0 22px;
          color: #ead7b4;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .role {
          color: #c9b89e;
          font-size: 15px;
          line-height: 1.8;
          max-width: 720px;
          margin: 0 0 30px;
        }

        .statement {
          border-left: 3px solid #d7a84f;
          padding: 22px 0 22px 24px;
          max-width: 760px;
        }

        .statement p {
          font-size: clamp(21px, 2.4vw, 34px);
          line-height: 1.3;
          color: #fff4df;
          margin: 0;
          font-weight: 700;
        }

        .screening {
          max-width: 1280px;
          margin: 0 auto 48px;
          padding: 42px;
          border: 1px solid rgba(214, 174, 101, 0.18);
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
        }

        .section {
          max-width: 1280px;
          margin: 0 auto 34px;
          padding: 38px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .section-title,
        .screening-title {
          font-size: clamp(32px, 5vw, 68px);
          margin: 0 0 24px;
          color: #fff7e8;
          letter-spacing: -0.05em;
        }

        .video {
          width: 100%;
          max-height: 720px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          display: block;
        }

        .empty-screening {
          min-height: 260px;
          border: 1px solid rgba(215, 168, 79, 0.22);
          background: radial-gradient(circle at center, rgba(215,168,79,0.12), rgba(0,0,0,0.55));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
        }

        .empty-screening p {
          color: #d9c49c;
          font-size: 18px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          max-width: 720px;
          line-height: 1.7;
          margin: 0;
        }

        .bio {
          color: #e8dcc8;
          font-size: 18px;
          line-height: 1.95;
          max-width: 980px;
          margin: 0;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }

        .card {
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.035);
        }

        .card h3 {
          color: #fff4dd;
          font-size: 20px;
          margin: 0 0 8px;
        }

        .card p,
        .empty {
          color: #d9ccb8;
          font-size: 15px;
          line-height: 1.8;
          margin: 8px 0;
        }

        .meta {
          color: #b9975f !important;
          font-size: 13px !important;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        .gallery-item {
          margin: 0;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.035);
          overflow: hidden;
        }

        .gallery-item img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
        }

        .gallery-item figcaption {
          color: #d9ccb8;
          padding: 14px;
          font-size: 14px;
        }

        .gold-link {
          color: #d7b46c;
          text-decoration: none;
          font-weight: 700;
        }

        .footer {
          max-width: 1280px;
          margin: 40px auto 0;
        }

        .back-link {
          color: #d7b46c;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .not-found {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 0;
        }

        .not-found h1 {
          font-size: 52px;
          margin: 0 0 18px;
        }

        @media (max-width: 900px) {
          .page {
            padding: 92px 22px 56px;
          }

          .hero {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .hero-image {
            height: auto;
            max-height: 680px;
          }

          .screening {
            padding: 26px;
          }

          .alias {
            font-size: clamp(48px, 15vw, 78px);
          }
        }
      `}</style>

      <section className="hero">
        <div className="image-panel">
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

          <h1 className="alias">{profile.alias || profile.name}</h1>

          {profile.name && profile.alias && (
            <h2 className="name">{profile.name}</h2>
          )}

          {profile.role && <p className="role">{profile.role}</p>}

          <div className="statement">
            <p>
              {profile.aset_statement ||
                "A defining cinematic presence in authorship, visual storytelling, and controlled creative environments."}
            </p>
          </div>
        </div>
      </section>

      <section className="screening">
        <p className="section-kicker">Featured Presence</p>
        <h2 className="screening-title">Featured Screening</h2>

        {profile.featured_video_url ? (
          <>
            <video
              src={profile.featured_video_url}
              controls
              playsInline
              className="video"
            />

            {(profile.featured_video_title || profile.featured_video_caption) && (
              <article className="card">
                {profile.featured_video_title && (
                  <h3>{profile.featured_video_title}</h3>
                )}
                {profile.featured_video_caption && (
                  <p>{profile.featured_video_caption}</p>
                )}
              </article>
            )}
          </>
        ) : (
          <div className="empty-screening">
            <p>
              A featured screening is currently in development.
              <br />
              This presentation will be released by The Aset Studio.
            </p>
          </div>
        )}
      </section>

      <section className="section">
        <p className="section-kicker">Personal Archive</p>
        <h2 className="section-title">Bio</h2>
        <p className="bio">
          {profile.bio || "This personal archive has not been written yet."}
        </p>
      </section>

      <section className="section">
        <p className="section-kicker">Visual Record</p>
        <h2 className="section-title">Gallery</h2>

        {gallery.length > 0 ? (
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <figure className="gallery-item" key={`gallery-${index}`}>
                {image.url && (
                  <img
                    src={image.url}
                    alt={image.caption || profile.name || "Aset Spotlight gallery"}
                  />
                )}
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <p className="empty">No spotlight gallery images added yet.</p>
        )}
      </section>

      {renderCollection(
        "Honors & Recognition",
        awards,
        "No honors or recognition listed yet."
      )}

      {renderCollection("Filmography", filmography, "No filmography listed yet.")}
      {renderCollection("Discography", discography, "No discography listed yet.")}
      {renderCollection("Bibliography", bibliography, "No bibliography listed yet.")}

      <section className="section">
        <p className="section-kicker">Controlled Access</p>
        <h2 className="section-title">Official Fan Club</h2>

        {fanClub && fanClub.enabled ? (
          <article className="card">
            <h3>{fanClub.name || "Official Fan Club"}</h3>
            {fanClub.description && <p>{fanClub.description}</p>}
            {fanClub.link && (
              <a
                href={fanClub.link}
                target="_blank"
                rel="noreferrer"
                className="gold-link"
              >
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
              <article className="card">
                <h3>Agent</h3>
                {representation.agent.name && <p>{representation.agent.name}</p>}
                {representation.agent.email && (
                  <a
                    href={`mailto:${representation.agent.email}`}
                    className="gold-link"
                  >
                    {representation.agent.email}
                  </a>
                )}
              </article>
            )}

            {representation.aset_studio && (
              <article className="card">
                <h3>The Aset Studio</h3>
                {representation.aset_studio.name && (
                  <p>{representation.aset_studio.name}</p>
                )}
                {representation.aset_studio.email && (
                  <a
                    href={`mailto:${representation.aset_studio.email}`}
                    className="gold-link"
                  >
                    {representation.aset_studio.email}
                  </a>
                )}
              </article>
            )}
          </div>
        ) : (
          <p className="empty">
            Representation details have not been added yet.
          </p>
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