import React, { useMemo, useState } from "react";

const LINE_ART = "/images/richard-lawson-clean-line-art.png";
const FINAL_PORTRAIT = "/images/richard-lawson-painted-target.png";
const FALLBACK = "/images/rlawson.png";

const palette = [
  { id: "c1", number: 1, name: "Ivory Light", hex: "#f2dfbd" },
  { id: "c2", number: 2, name: "Warm Cream", hex: "#d7b98d" },
  { id: "c3", number: 3, name: "Golden Bronze", hex: "#b9874e" },
  { id: "c4", number: 4, name: "Soft Umber", hex: "#94623c" },
  { id: "c5", number: 5, name: "Portrait Clay", hex: "#b06f53" },
  { id: "c6", number: 6, name: "Deep Sienna", hex: "#70442f" },
  { id: "c7", number: 7, name: "Suit Charcoal", hex: "#272321" },
  { id: "c8", number: 8, name: "Noir Brown", hex: "#15110f" },
  { id: "c9", number: 9, name: "Aset Gold", hex: "#c9a45c" },
  { id: "c10", number: 10, name: "Gallery Shadow", hex: "#080706" },
];

const zones = [
  { id: 1, color: "c1", x: 47, y: 14 },
  { id: 2, color: "c2", x: 38, y: 28 },
  { id: 3, color: "c5", x: 58, y: 30 },
  { id: 4, color: "c4", x: 46, y: 42 },
  { id: 5, color: "c6", x: 61, y: 48 },
  { id: 6, color: "c7", x: 36, y: 61 },
  { id: 7, color: "c8", x: 62, y: 64 },
  { id: 8, color: "c3", x: 29, y: 80 },
  { id: 9, color: "c9", x: 50, y: 82 },
  { id: 10, color: "c10", x: 72, y: 82 },
];

export default function DiamondVaultPage() {
  const [selectedColor, setSelectedColor] = useState("c1");
  const [paintedZones, setPaintedZones] = useState([]);
  const [notice, setNotice] = useState(
    "Select a pigment, then tap the matching number on the portrait."
  );

  const activeColor = useMemo(() => {
    return palette.find((color) => color.id === selectedColor) || palette[0];
  }, [selectedColor]);

  const progress = Math.round((paintedZones.length / zones.length) * 100);
  const isComplete = paintedZones.length === zones.length;

  function paintZone(zone) {
    if (paintedZones.includes(zone.id)) return;

    if (zone.color !== selectedColor) {
      setNotice("That number belongs to a different pigment.");
      return;
    }

    setPaintedZones((current) => [...current, zone.id]);
    setNotice(`Number ${zone.id} completed.`);
  }

  function resetGame() {
    setPaintedZones([]);
    setSelectedColor("c1");
    setNotice("Canvas reset. Ready for a clean replay.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(201,164,92,0.2), transparent 34%), linear-gradient(135deg, #030303, #11100e 52%, #050403)",
        color: "#f7ead2",
        padding: "92px 5vw 54px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <header style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: "0 0 10px",
              color: "#c9a45c",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            The Painted Legacy
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, serif",
              fontSize: "clamp(36px, 6vw, 78px)",
              lineHeight: "0.95",
              color: "#fff6e6",
            }}
          >
            Richard Lawson Paint Vault
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: "18px 0 0",
              color: "rgba(247,234,210,0.72)",
              fontSize: "16px",
              lineHeight: "1.75",
            }}
          >
            A playable luxury paint-by-number demo. Select a pigment, tap the
            matching numbered marker, and complete the portrait board.
          </p>
        </header>

        <div
          className="diamond-vault-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: "26px",
            alignItems: "start",
          }}
        >
          <section
            style={{
              borderRadius: "32px",
              padding: "18px",
              border: "1px solid rgba(201,164,92,0.28)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.018))",
              boxShadow: "0 34px 100px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "760px",
                margin: "0 auto",
                aspectRatio: "4 / 5",
                borderRadius: "26px",
                overflow: "hidden",
                background: "#f3efe7",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={LINE_ART}
                alt="Richard Lawson paint-by-number template"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK;
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.12), transparent 38%)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />

              {zones.map((zone) => {
                const isPainted = paintedZones.includes(zone.id);
                const zoneColor =
                  palette.find((item) => item.id === zone.color) || palette[0];

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => paintZone(zone)}
                    aria-label={`Paint number ${zone.id}`}
                    style={{
                      position: "absolute",
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: isPainted ? "36px" : "38px",
                      height: isPainted ? "36px" : "38px",
                      borderRadius: "999px",
                      border: isPainted
                        ? "1px solid rgba(255,255,255,0.4)"
                        : zone.color === selectedColor
                        ? `2px solid ${activeColor.hex}`
                        : "1px solid rgba(20,16,12,0.18)",
                      background: isPainted
                        ? zoneColor.hex
                        : "rgba(255,248,240,0.88)",
                      color: isPainted ? "#fff" : "#17110c",
                      cursor: isPainted ? "default" : "pointer",
                      zIndex: 5,
                      fontSize: isPainted ? "16px" : "13px",
                      fontWeight: 900,
                      boxShadow: isPainted
                        ? `0 0 18px ${zoneColor.hex}88`
                        : zone.color === selectedColor
                        ? `0 0 24px ${activeColor.hex}55`
                        : "0 6px 16px rgba(0,0,0,0.12)",
                      transition: "all 220ms ease",
                    }}
                  >
                    {isPainted ? "✓" : zone.id}
                  </button>
                );
              })}

              {isComplete && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 8,
                    background: "rgba(0,0,0,0.72)",
                    display: "grid",
                    placeItems: "center",
                    padding: "28px",
                    animation: "completeOverlayReveal 500ms ease forwards",
                  }}
                >
                  <div
                    style={{
                      width: "min(92%, 520px)",
                      borderRadius: "24px",
                      overflow: "hidden",
                      border: "1px solid rgba(201,164,92,0.5)",
                      boxShadow: "0 26px 80px rgba(0,0,0,0.5)",
                      background: "#070605",
                    }}
                  >
                    <img
                      src={FINAL_PORTRAIT}
                      alt="Richard Lawson completed painted portrait"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK;
                      }}
                      style={{
                        width: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        padding: "16px",
                        background: "rgba(5,5,5,0.96)",
                        color: "#f7ead2",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          color: "#c9a45c",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          fontSize: "11px",
                          fontWeight: 900,
                        }}
                      >
                        Restoration Complete
                      </p>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        The Painted Legacy portrait is fully unlocked.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  left: "18px",
                  bottom: "18px",
                  zIndex: 10,
                  padding: "10px 14px",
                  borderRadius: "999px",
                  background: "rgba(0,0,0,0.58)",
                  border: "1px solid rgba(201,164,92,0.28)",
                  backdropFilter: "blur(12px)",
                  color: "#f7ead2",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                {progress}% Complete
              </div>
            </div>
          </section>

          <aside
            style={{
              borderRadius: "32px",
              padding: "24px",
              border: "1px solid rgba(201,164,92,0.28)",
              background: "rgba(9,8,7,0.78)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.38)",
              position: "sticky",
              top: "92px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#c9a45c",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontSize: "11px",
                fontWeight: 800,
              }}
            >
              Paint Palette
            </p>

            <h2
              style={{
                margin: "0 0 18px",
                fontFamily: "Georgia, serif",
                fontSize: "30px",
                color: "#fff6e6",
              }}
            >
              Select Color
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {palette.map((color) => {
                const isSelected = selectedColor === color.id;

                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.id);
                      setNotice(`Selected ${color.number}. ${color.name}.`);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "11px",
                      borderRadius: "16px",
                      border: isSelected
                        ? "1px solid rgba(201,164,92,0.95)"
                        : "1px solid rgba(255,255,255,0.12)",
                      background: isSelected
                        ? "rgba(201,164,92,0.18)"
                        : "rgba(255,255,255,0.04)",
                      color: "#f7ead2",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        flex: "0 0 26px",
                        borderRadius: "999px",
                        background: color.hex,
                        display: "grid",
                        placeItems: "center",
                        color:
                          color.id === "c1" || color.id === "c2"
                            ? "#1a120d"
                            : "#fff6e6",
                        fontSize: "11px",
                        fontWeight: 900,
                        boxShadow: isSelected
                          ? "0 0 0 4px rgba(201,164,92,0.22)"
                          : "0 0 0 1px rgba(255,255,255,0.18)",
                      }}
                    >
                      {color.number}
                    </span>

                    <span style={{ fontSize: "12px", fontWeight: 800 }}>
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ margin: "0 0 8px", color: "#c9a45c" }}>
                Paint Progress
              </p>

              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #94623c, #c9a45c, #f3e4c7)",
                    transition: "width 400ms ease",
                  }}
                />
              </div>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(247,234,210,0.72)",
                  fontSize: "13px",
                }}
              >
                {paintedZones.length} of {zones.length} numbers complete
              </p>
            </div>

            <p
              style={{
                minHeight: "44px",
                margin: "18px 0 0",
                color: "rgba(247,234,210,0.72)",
                fontSize: "14px",
                lineHeight: "1.55",
              }}
            >
              {notice}
            </p>

            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: "18px",
                width: "100%",
                padding: "14px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201,164,92,0.45)",
                background: "transparent",
                color: "#f7ead2",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "12px",
                fontWeight: 900,
              }}
            >
              Reset Board
            </button>
          </aside>
        </div>
      </section>

      <style>{`
        @keyframes completeOverlayReveal {
          0% {
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
          }
        }

        @media (max-width: 900px) {
          .diamond-vault-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          main {
            padding-top: 78px !important;
          }
        }
      `}</style>
    </main>
  );
}