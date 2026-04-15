import React from "react";
import { Link } from "react-router-dom";

const featuredPieces = [
  {
    id: 1,
    title: "He Loves Me in Private",
    category: "Devotion",
    type: "Featured Vault",
    excerpt:
      "He does not raise his voice for me, only his walls. He loves me like something that must survive, not something that can be seen.",
  },
  {
    id: 2,
    title: "After the Scene",
    category: "Silence",
    type: "Featured Vault",
    excerpt:
      "The room was still warm from the argument. Pride stood where tenderness should have been, and nobody reached back first.",
  },
  {
    id: 3,
    title: "Built From Ruin",
    category: "Power",
    type: "Featured Vault",
    excerpt:
      "She did not become dangerous overnight. She became dangerous the moment grief stopped bending her and started building her.",
  },
];

const categories = [
  "Power",
  "Devotion",
  "Ruin",
  "Becoming",
  "Silence",
  "Desire",
  "Control",
  "Obsession",
];

export default function ExpressionVaultPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050505 0%, #0b0b0d 45%, #111114 100%)",
        color: "#f5f1eb",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "48px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "24px",
            padding: "40px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#b8aa92",
            }}
          >
            The Studio
          </p>

          <h1
            style={{
              marginTop: "14px",
              marginBottom: "16px",
              fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            The Expression Vault
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "rgba(245, 241, 235, 0.78)",
            }}
          >
            A cinematic archive of language, emotion, and atmosphere. The
            Expression Vault holds curated pieces from The Aset Studio’s
            signature voice while preparing space for future community
            expression.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.92rem",
              }}
            >
              Curated cinematic writing
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.92rem",
              }}
            >
              Foundation build
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.92rem",
              }}
            >
              Community posting later
            </div>
          </div>
        </div>

        <section style={{ marginBottom: "42px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.7rem",
                  fontWeight: 600,
                }}
              >
                Featured Vault
              </h2>
              <p
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  color: "rgba(245, 241, 235, 0.7)",
                  lineHeight: 1.7,
                }}
              >
                Signature pieces from The Aset Studio’s cinematic expression
                archive.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {featuredPieces.map((piece) => (
              <article
                key={piece.id}
                style={{
                  borderRadius: "22px",
                  padding: "24px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    marginBottom: "14px",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c8b79d",
                  }}
                >
                  {piece.type}
                </div>

                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                    fontSize: "1.35rem",
                    lineHeight: 1.2,
                  }}
                >
                  {piece.title}
                </h3>

                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    color: "rgba(245, 241, 235, 0.78)",
                    lineHeight: 1.8,
                  }}
                >
                  {piece.excerpt}
                </p>

                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "0.88rem",
                    color: "#e9dcc9",
                  }}
                >
                  {piece.category}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "42px" }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              fontSize: "1.7rem",
              fontWeight: 600,
            }}
          >
            Vault Categories
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {categories.map((category) => (
              <div
                key={category}
                style={{
                  padding: "10px 16px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(245, 241, 235, 0.88)",
                  fontSize: "0.92rem",
                }}
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            borderRadius: "24px",
            padding: "30px 24px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "14px",
              fontSize: "1.7rem",
              fontWeight: 600,
            }}
          >
            Community Vault
          </h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              maxWidth: "760px",
              color: "rgba(245, 241, 235, 0.72)",
              lineHeight: 1.8,
            }}
          >
            Community posting is planned for a future phase. For now, this
            vault is being established as a cinematic archive with curated
            expression from The Aset Studio.
          </p>

          <div
            style={{
              padding: "18px 16px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.14)",
              color: "rgba(245, 241, 235, 0.75)",
            }}
          >
            Future expansion: user submissions, profile-linked pieces, moderated
            publishing flow, and premium locked collections.
          </div>
        </section>

        <div style={{ marginTop: "28px" }}>
          <Link
            to="/studio"
            style={{
              color: "#d6c3a5",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← Back to The Studio
          </Link>
        </div>
      </div>
    </div>
  );
}