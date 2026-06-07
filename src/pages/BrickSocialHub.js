import React from "react";
import { Link } from "react-router-dom";
import "./BrickSocialHub.css";

export default function BrickSocialHub() {
  const platforms = [
    {
      name: "Pulse",
      type: "Public Network",
      role: "Reputation, family posts, company pages, public drama.",
      vibe: "Facebook-style energy",
      tag: "WHO’S TALKING?"
    },
    {
      name: "Nova",
      type: "Luxury Image Feed",
      role: "Gala photos, status symbols, cryptic captions, beauty and betrayal.",
      vibe: "Instagram-style energy",
      tag: "WHO’S WATCHING?"
    },
    {
      name: "Surge",
      type: "Viral Video Feed",
      role: "Leaked clips, club footage, red carpet chaos, rumors moving fast.",
      vibe: "TikTok-style energy",
      tag: "WHO WENT VIRAL?"
    },
    {
      name: "Blaze",
      type: "Scandal Wire",
      role: "Breaking headlines, exposés, anonymous sources, empire gossip.",
      vibe: "TMZ-style energy",
      tag: "WHO GOT EXPOSED?"
    }
  ];

  return (
    <main className="brick-social-page">
      <section className="brick-social-hero">
        <p className="brick-social-kicker">BRICK BY BRICK UNIVERSE</p>
        <h1>The Social World of the Empire</h1>
        <p className="brick-social-subtitle">
          Step inside the digital noise surrounding the family. Public images,
          leaked moments, scandal headlines, and viral whispers all live here.
        </p>
      </section>

      <section className="brick-platform-grid">
        {platforms.map((platform) => (
          <article className="brick-platform-card" key={platform.name}>
            <div className="brick-platform-topline">
              <span>{platform.tag}</span>
            </div>

            <h2>{platform.name}</h2>
            <p className="brick-platform-type">{platform.type}</p>
            <p className="brick-platform-role">{platform.role}</p>
            <p className="brick-platform-vibe">{platform.vibe}</p>

            <button className="brick-platform-button">
              Enter {platform.name}
            </button>
          </article>
        ))}
      </section>

      <section className="brick-social-preview">
        <p className="brick-social-kicker">LATEST IN-WORLD ACTIVITY</p>

        <div className="brick-feed-shell">
          <div className="brick-feed-item">
            <span>Blaze Exclusive</span>
            <h3>Family Attorney Seen Leaving East Tower After Midnight</h3>
            <p>
              Sources close to the compound say the meeting was “not business as usual.”
            </p>
          </div>

          <div className="brick-feed-item">
            <span>Nova Post</span>
            <h3>Sasha Posts Gala Portrait With No Caption</h3>
            <p>
              The silence has fans questioning whether the family is hiding another fracture.
            </p>
          </div>

          <div className="brick-feed-item">
            <span>Surge Clip</span>
            <h3>12-Second Club Video Sparks Rumors Online</h3>
            <p>
              Viewers claim Varney appears in the background before security blocks the camera.
            </p>
          </div>
        </div>
      </section>

      <div className="brick-social-back">
        <Link to="/brick-by-brick">Return to Brick by Brick</Link>
      </div>
    </main>
  );
}