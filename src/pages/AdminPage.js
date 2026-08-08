import React from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient";

const adminSections = [
  {
    number: "01",
    title: "Photography Studio",
    description:
      "Upload and manage photoshoot-level images for the Photography Studio.",
    path: "/admin/photography",
    action: "Open Photography Admin",
  },
  {
    number: "02",
    title: "Gallery",
    description:
      "Upload artwork, visual concepts and finished creative pieces for the public Gallery.",
    path: "/admin/gallery",
    action: "Open Gallery Admin",
  },
  {
    number: "03",
    title: "Cinema",
    description:
      "Manage Aset Cinema films, releases, interviews and visual productions.",
    path: "/videos",
    action: "Open Cinema",
  },
  {
    number: "04",
    title: "Inquiries",
    description:
      "Review contact requests, service inquiries and client messages.",
    path: "/admin/inquiries",
    action: "Review Inquiries",
  },
  {
    number: "05",
    title: "Spotlight",
    description:
      "Manage Spotlight profiles, interviews and featured individuals.",
    path: "/admin/spotlight",
    action: "Open Spotlight Admin",
  },
  {
    number: "06",
    title: "Managers",
    description:
      "Manage manager profiles and representation listings.",
    path: "/admin/managers",
    action: "Open Managers Admin",
  },
  {
    number: "07",
    title: "Beauty Applications",
    description:
      "Review applications submitted to the Aset Beauty Collective.",
    path: "/admin/beauty-applications",
    action: "Review Applications",
  },
  {
    number: "08",
    title: "Brick by Brick",
    description:
      "Manage Brick by Brick characters, world content and production tools.",
    path: "/brick-admin",
    action: "Open Brick Admin",
  },
];

export default function AdminPage() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/");
    } catch (error) {
      console.error("Admin logout failed:", error);
      alert(error?.message || "Logout failed.");
    }
  }

  function openSection(path) {
    navigate(path);
  }

  return (
    <main className="aset-control-room">
      <style>{adminStyles}</style>

      <header className="aset-admin-bar">
        <button
          type="button"
          className="aset-admin-brand"
          onClick={() => navigate("/admin")}
        >
          THE ASET STUDIO ADMIN
        </button>

        <div className="aset-admin-actions">
          <button
            type="button"
            className="aset-admin-header-button"
            onClick={() => navigate("/")}
          >
            View Site
          </button>

          <button
            type="button"
            className="aset-admin-header-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="aset-control-shell">
        <header className="aset-control-hero">
          <p className="aset-control-eyebrow">
            THE ASET STUDIO ADMIN
          </p>

          <h1 className="aset-control-title">
            Studio Control
            <br />
            Room
          </h1>

          <p className="aset-control-intro">
            Choose the department you want to manage. Each area now has
            one clear purpose and its own dedicated workspace.
          </p>
        </header>

        <section
          className="aset-control-grid"
          aria-label="Admin departments"
        >
          {adminSections.map((section) => (
            <article
              key={section.title}
              className="aset-control-card"
              role="button"
              tabIndex={0}
              onClick={() => openSection(section.path)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  openSection(section.path);
                }
              }}
            >
              <div className="aset-control-card-top">
                <span className="aset-control-number">
                  {section.number}
                </span>

                <span
                  className="aset-control-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <div className="aset-control-card-content">
                <h2 className="aset-control-card-title">
                  {section.title}
                </h2>

                <p className="aset-control-card-description">
                  {section.description}
                </p>
              </div>

              <div className="aset-control-card-footer">
                <span className="aset-control-action">
                  {section.action}
                </span>
              </div>
            </article>
          ))}
        </section>

        <footer className="aset-control-footer">
          <p>THE ASET STUDIO</p>

          <span>
            Business, network and creative production administration.
          </span>
        </footer>
      </section>
    </main>
  );
}

const adminStyles = `
  .aset-control-room {
    min-height: 100vh;
    box-sizing: border-box;
    background:
      radial-gradient(
        circle at 16% 8%,
        rgba(202, 154, 84, 0.15),
        transparent 29%
      ),
      radial-gradient(
        circle at 86% 16%,
        rgba(40, 62, 94, 0.13),
        transparent 29%
      ),
      #050505;
    color: #f4efe6;
    font-family: Arial, sans-serif;
  }

  .aset-admin-bar {
    min-height: 70px;
    padding: 0 28px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: sticky;
    top: 0;
    z-index: 2000;
    background: rgba(5, 5, 5, 0.92);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .aset-admin-brand {
    padding: 0;
    border: none;
    background: transparent;
    color: #f2eee7;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
  }

  .aset-admin-actions {
    display: flex;
    gap: 9px;
  }

  .aset-admin-header-button {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #111111;
    color: #e6e0d8;
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
    transition:
      border-color 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .aset-admin-header-button:hover {
    border-color: rgba(216, 175, 106, 0.5);
    color: #e2bd7b;
    transform: translateY(-1px);
  }

  .aset-control-shell {
    width: min(100%, 1280px);
    margin: 0 auto;
    padding: 80px 24px 110px;
    box-sizing: border-box;
  }

  .aset-control-hero {
    max-width: 820px;
    margin-bottom: 58px;
  }

  .aset-control-eyebrow {
    margin: 0 0 16px;
    color: #d8af6a;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.24em;
  }

  .aset-control-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(4rem, 9vw, 8rem);
    font-weight: 500;
    line-height: 0.84;
    letter-spacing: -0.065em;
  }

  .aset-control-intro {
    max-width: 660px;
    margin: 30px 0 0;
    color: #aaa39a;
    font-size: 15px;
    line-height: 1.85;
  }

  .aset-control-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .aset-control-card {
    min-height: 320px;
    padding: 27px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 34px;
    cursor: pointer;
    outline: none;
    background:
      linear-gradient(
        145deg,
        rgba(216, 175, 106, 0.052),
        rgba(255, 255, 255, 0.012)
      ),
      #0c0c0c;
    border: 1px solid rgba(255, 255, 255, 0.09);
    transition:
      transform 220ms ease,
      border-color 220ms ease,
      background 220ms ease,
      box-shadow 220ms ease;
  }

  .aset-control-card:hover,
  .aset-control-card:focus-visible {
    transform: translateY(-5px);
    border-color: rgba(216, 175, 106, 0.42);
    background:
      linear-gradient(
        145deg,
        rgba(216, 175, 106, 0.095),
        rgba(255, 255, 255, 0.018)
      ),
      #0d0d0d;
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.3);
  }

  .aset-control-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .aset-control-number {
    color: #d8af6a;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.16em;
  }

  .aset-control-arrow {
    color: #706b65;
    font-size: 20px;
    transition:
      color 220ms ease,
      transform 220ms ease;
  }

  .aset-control-card:hover .aset-control-arrow,
  .aset-control-card:focus-visible .aset-control-arrow {
    color: #d8af6a;
    transform: translate(3px, -3px);
  }

  .aset-control-card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .aset-control-card-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 31px;
    font-weight: 500;
    line-height: 1.05;
  }

  .aset-control-card-description {
    margin: 16px 0 0;
    color: #9f9991;
    font-size: 13px;
    line-height: 1.75;
  }

  .aset-control-card-footer {
    padding-top: 21px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .aset-control-action {
    color: #d8af6a;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .aset-control-footer {
    margin-top: 74px;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: #6f6a64;
    font-size: 11px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .aset-control-footer p {
    margin: 0;
    color: #bcb5ac;
    font-weight: 900;
    letter-spacing: 0.16em;
  }

  .aset-control-footer span {
    text-align: right;
  }

  @media (max-width: 980px) {
    .aset-control-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .aset-admin-bar {
      min-height: 76px;
      padding: 10px 14px;
      align-items: center;
    }

    .aset-admin-brand {
      max-width: 150px;
      line-height: 1.4;
      text-align: left;
    }

    .aset-control-shell {
      padding: 64px 14px 90px;
    }

    .aset-control-grid {
      grid-template-columns: 1fr;
    }

    .aset-control-card {
      min-height: 265px;
      padding: 22px;
    }

    .aset-control-footer {
      flex-direction: column;
    }

    .aset-control-footer span {
      text-align: left;
    }
  }
`;