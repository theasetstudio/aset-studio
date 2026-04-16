import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const featuredPieces = [
  {
    id: 1,
    title: "He Loves Me in Private",
    category: "Devotion",
    type: "Featured Vault",
    excerpt:
      "He does not raise his voice for me, only his walls. He loves me like something that must survive, not something that can be seen.",
    content: `He does not raise his voice for me
only his walls

He loves me
like something that must survive
not something that can be seen

I live in the quiet
between what he feels
and what he will allow the world to know

He touches me
like confession
but carries me
like a secret

And some nights
I hate the tenderness of hidden things

because I do not want love
that survives in shadows

I want a love
that can stand upright
in daylight
and still choose me`,
  },
  {
    id: 2,
    title: "After the Scene",
    category: "Silence",
    type: "Featured Vault",
    excerpt:
      "The room was still warm from the argument. Pride stood where tenderness should have been, and nobody reached back first.",
    content: `The room was still warm
from the argument

His silence remained
where his body had been

Mine too

Pride stood
where tenderness should have lived

and the air
still carried the shape
of words we threw
just to keep from telling the truth

No glass shattered
no doors slammed

only that colder violence
where two people
stand inside their love
and refuse to reach first

By morning
everything looked untouched

but the distance
had already moved in`,
  },
  {
    id: 3,
    title: "Built From Ruin",
    category: "Power",
    type: "Featured Vault",
    excerpt:
      "She did not become dangerous overnight. She became dangerous the moment grief stopped bending her and started building her.",
    content: `She did not become dangerous
all at once

It was not lightning
not spectacle
not rage for the sake of noise

It was the slow education
of loss

the holy brutality
of being broken
and discovering
the pieces still obeyed her

Grief stopped bending her

and started building her

Brick by brick
boundary by boundary
scar by scar

Until one day
the softness remained
but the access did not

Now when they call her powerful
they say it like it was gifted

They do not know
power arrived
the moment ruin
became architecture`,
  },
];

const categories = [
  "All",
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPieceId, setSelectedPieceId] = useState(featuredPieces[0]?.id || 1);

  const visiblePieces = useMemo(() => {
    if (selectedCategory === "All") return featuredPieces;
    return featuredPieces.filter((piece) => piece.category === selectedCategory);
  }, [selectedCategory]);

  const selectedPiece =
    visiblePieces.find((piece) => piece.id === Number(selectedPieceId)) ||
    visiblePieces[0] ||
    null;

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value;
    setSelectedCategory(nextCategory);

    const matchingPieces =
      nextCategory === "All"
        ? featuredPieces
        : featuredPieces.filter((piece) => piece.category === nextCategory);

    setSelectedPieceId(matchingPieces[0]?.id || "");
  };

  const handlePieceChange = (event) => {
    setSelectedPieceId(Number(event.target.value));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050505 0%, #0b0b0d 45%, #111114 100%)",
        color: "#f5f1eb",
        padding: "80px 20px 60px",
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
          <div style={{ marginBottom: "18px" }}>
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
              Browse pieces below, then use the selectors to open the full work.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {visiblePieces.map((piece) => (
              <article
                key={piece.id}
                style={{
                  borderRadius: "22px",
                  padding: "24px",
                  background:
                    Number(selectedPieceId) === piece.id
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    Number(selectedPieceId) === piece.id
                      ? "1px solid rgba(214,195,165,0.45)"
                      : "1px solid rgba(255,255,255,0.08)",
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

        <section
          style={{
            marginBottom: "42px",
            borderRadius: "24px",
            padding: "24px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              fontSize: "1.7rem",
              fontWeight: 600,
            }}
          >
            Vault Controls
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label
                htmlFor="vault-category"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "rgba(245, 241, 235, 0.78)",
                }}
              >
                Category
              </label>
              <select
                id="vault-category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#f5f1eb",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category} style={{ color: "#000" }}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="vault-piece"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "rgba(245, 241, 235, 0.78)",
                }}
              >
                Open piece
              </label>
              <select
                id="vault-piece"
                value={selectedPiece ? selectedPiece.id : ""}
                onChange={handlePieceChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#f5f1eb",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                {visiblePieces.map((piece) => (
                  <option key={piece.id} value={piece.id} style={{ color: "#000" }}>
                    {piece.title}
                  </option>
                ))}
              </select>
            </div>
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
                  border:
                    selectedCategory === category
                      ? "1px solid rgba(214,195,165,0.55)"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    selectedCategory === category
                      ? "rgba(214,195,165,0.12)"
                      : "rgba(255,255,255,0.03)",
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
            marginBottom: "42px",
            borderRadius: "24px",
            padding: "30px 24px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#c8b79d",
                }}
              >
                Open Piece
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  fontSize: "2rem",
                  lineHeight: 1.1,
                  fontWeight: 600,
                }}
              >
                {selectedPiece ? selectedPiece.title : "No piece selected"}
              </h2>
            </div>

            {selectedPiece && (
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "0.88rem",
                  color: "#e9dcc9",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedPiece.category}
              </div>
            )}
          </div>

          <div
            style={{
              maxWidth: "760px",
              color: "rgba(245, 241, 235, 0.9)",
              fontSize: "1.08rem",
              lineHeight: 2,
              whiteSpace: "pre-line",
            }}
          >
            {selectedPiece
              ? selectedPiece.content
              : "No pieces are available in this category yet."}
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
            publishing flow, premium locked collections, and admin-managed
            vault publishing.
          </div>
        </section>

        <div style={{ marginTop: "28px" }}>
          <Link
            to="/"
            style={{
              color: "#d6c3a5",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}