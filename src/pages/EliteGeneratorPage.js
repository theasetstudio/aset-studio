// src/pages/EliteGeneratorPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STYLE_OPTIONS = [
  "Cinematic",
  "Editorial",
  "Dark Fantasy",
  "Luxury",
  "Mythic",
  "Dreamy",
  "Boudoir Editorial",
];

const MODE_OPTIONS = [
  {
    value: "standard",
    label: "Standard",
    description: "General image generation prompt building.",
  },
  {
    value: "portrait",
    label: "Portrait Lock",
    description: "Identity-preserving portrait prompt building.",
  },
  {
    value: "boudoir",
    label: "Boudoir Editorial",
    description: "Adult glamour / sensual editorial mood, non-explicit.",
  },
];

export default function EliteGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [aspectRatio, setAspectRatio] = useState("Portrait");
  const [mode, setMode] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState("");
  const [mockImage, setMockImage] = useState(null);
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [referencePreviews, setReferencePreviews] = useState([]);

  const canGenerate = useMemo(() => prompt.trim().length > 0, [prompt]);

  useEffect(() => {
    const urls = referenceFiles.map((file) => URL.createObjectURL(file));
    setReferencePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [referenceFiles]);

  async function handleGenerate() {
    setError("");

    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }

    try {
      setIsGenerating(true);

      const finalPrompt = buildPrompt({
        prompt,
        negativePrompt,
        style,
        aspectRatio,
        mode,
        referenceCount: referenceFiles.length,
      });

      await new Promise((resolve) => setTimeout(resolve, 700));

      setGeneratedPrompt(finalPrompt);
      setMockImage({
        title: makePreviewTitle(prompt),
        style,
        aspectRatio,
        mode,
        referenceCount: referenceFiles.length,
        createdAt: new Date().toLocaleString(),
      });
    } catch (err) {
      console.error("Generator page error:", err);
      setError("Something went wrong while preparing your prompt.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setNegativePrompt("");
    setStyle("Cinematic");
    setAspectRatio("Portrait");
    setMode("standard");
    setGeneratedPrompt("");
    setMockImage(null);
    setReferenceFiles([]);
    setError("");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Copy failed. You can still select and copy the text manually.");
    }
  }

  function handleReferenceUpload(event) {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!files.length) {
      return;
    }

    setReferenceFiles((prev) => [...prev, ...files].slice(0, 4));
  }

  function removeReferenceAt(indexToRemove) {
    setReferenceFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.eyebrow}>THE ASET STUDIO</div>
            <h1 style={styles.title}>Elite Generator</h1>
            <p style={styles.subtitle}>
              Reference upload is restored, the layout stays compact, and
              boudoir editorial mode is available as a non-explicit styling
              option.
            </p>
          </div>

          <div style={styles.topLinks}>
            <Link to="/" style={styles.navButton}>
              Home
            </Link>
            <Link to="/gallery" style={styles.navButton}>
              Gallery
            </Link>
          </div>
        </div>

        <div style={styles.notice}>
          This version supports reference image upload and prompt building. The
          uploaded images are previewed on-page right now and can be wired into a
          real image API later.
        </div>

        <div style={styles.grid}>
          <section style={styles.panel}>
            <div style={styles.panelTitle}>Build Your Prompt</div>

            <label style={styles.label}>Generation mode</label>
            <div style={styles.modeGrid}>
              {MODE_OPTIONS.map((option) => {
                const active = mode === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setMode(option.value);
                      if (
                        option.value === "boudoir" &&
                        style !== "Boudoir Editorial"
                      ) {
                        setStyle("Boudoir Editorial");
                      }
                    }}
                    style={{
                      ...styles.modeCard,
                      ...(active ? styles.modeCardActive : {}),
                    }}
                  >
                    <div style={styles.modeLabel}>{option.label}</div>
                    <div style={styles.modeDescription}>
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <label style={styles.label}>Main prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: platinum blonde woman reclining in a cream armchair, luxury editorial mood, soft shadows, identity preserved, sharp brows, glossy black nails"
              style={styles.textareaLarge}
            />

            <label style={styles.label}>Negative prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Example: blurry, low quality, distorted face, extra fingers, warped anatomy"
              style={styles.textarea}
            />

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  style={styles.select}
                >
                  {STYLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Aspect ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  style={styles.select}
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Square">Square</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>
            </div>

            <label style={styles.label}>Reference images</label>
            <label style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleReferenceUpload}
                style={{ display: "none" }}
              />
              <div style={styles.uploadTitle}>Upload reference images</div>
              <div style={styles.uploadText}>
                Add up to 4 images to guide face, styling, pose, wardrobe, or
                mood.
              </div>
            </label>

            {referencePreviews.length > 0 ? (
              <div style={styles.previewGrid}>
                {referencePreviews.map((src, index) => (
                  <div key={`${src}-${index}`} style={styles.referenceCard}>
                    <img
                      src={src}
                      alt={`Reference ${index + 1}`}
                      style={styles.referenceImage}
                    />
                    <button
                      type="button"
                      onClick={() => removeReferenceAt(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {mode === "boudoir" ? (
              <div style={styles.safeNote}>
                Boudoir Editorial mode is for adult glamour, sensual styling, and
                non-explicit editorial mood. It is not an explicit content mode.
              </div>
            ) : null}

            {error ? <div style={styles.error}>{error}</div> : null}

            <div style={styles.actionRow}>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !canGenerate}
                style={{
                  ...styles.primaryButton,
                  ...(isGenerating || !canGenerate ? styles.buttonDisabled : {}),
                }}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                style={styles.secondaryButton}
              >
                Clear
              </button>
            </div>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelTitle}>Generated Result</div>

            {!mockImage ? (
              <div style={styles.placeholderCard}>
                <div style={styles.placeholderTitle}>No result yet</div>
                <p style={styles.placeholderText}>
                  Add your prompt and optional reference images, then press
                  Generate.
                </p>
              </div>
            ) : (
              <>
                <div style={styles.previewFrame}>
                  <div style={styles.previewGlow} />
                  <div style={styles.previewContent}>
                    <div style={styles.previewLabel}>MOCK GENERATED PREVIEW</div>
                    <div style={styles.previewTitle}>{mockImage.title}</div>
                    <div style={styles.previewMetaRow}>
                      <span style={styles.metaBadge}>{mockImage.style}</span>
                      <span style={styles.metaBadge}>{mockImage.aspectRatio}</span>
                      <span style={styles.metaBadge}>
                        {labelForMode(mockImage.mode)}
                      </span>
                      <span style={styles.metaBadge}>
                        {mockImage.referenceCount} ref
                        {mockImage.referenceCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>

                {referencePreviews.length > 0 ? (
                  <>
                    <div style={styles.subSectionTitle}>Reference Previews</div>
                    <div style={styles.resultReferenceGrid}>
                      {referencePreviews.map((src, index) => (
                        <img
                          key={`result-${src}-${index}`}
                          src={src}
                          alt={`Result reference ${index + 1}`}
                          style={styles.resultReferenceImage}
                        />
                      ))}
                    </div>
                  </>
                ) : null}

                <div style={styles.generatedCard}>
                  <div style={styles.generatedCardTitle}>Generation Details</div>
                  <div style={styles.generatedLine}>
                    <strong>Mode:</strong> {labelForMode(mockImage.mode)}
                  </div>
                  <div style={styles.generatedLine}>
                    <strong>Style:</strong> {mockImage.style}
                  </div>
                  <div style={styles.generatedLine}>
                    <strong>Aspect ratio:</strong> {mockImage.aspectRatio}
                  </div>
                  <div style={styles.generatedLine}>
                    <strong>References:</strong> {mockImage.referenceCount}
                  </div>
                  <div style={styles.generatedLine}>
                    <strong>Created:</strong> {mockImage.createdAt}
                  </div>
                </div>

                <div style={styles.subSectionTitle}>Generated Prompt</div>
                <div style={styles.outputBox}>{generatedPrompt}</div>

                <div style={styles.actionRow}>
                  <button
                    type="button"
                    onClick={handleCopy}
                    style={styles.primaryButton}
                  >
                    Copy Prompt
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function labelForMode(mode) {
  if (mode === "portrait") return "Portrait Lock";
  if (mode === "boudoir") return "Boudoir Editorial";
  return "Standard";
}

function makePreviewTitle(text) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= 70) return clean;
  return `${clean.slice(0, 67)}...`;
}

function buildPrompt({
  prompt,
  negativePrompt,
  style,
  aspectRatio,
  mode,
  referenceCount,
}) {
  const styleMap = {
    Cinematic:
      "cinematic scene, dramatic lighting, rich atmosphere, film still energy",
    Editorial:
      "editorial fashion energy, polished composition, high-end magazine mood",
    "Dark Fantasy":
      "dark fantasy mood, haunting beauty, moody depth, mystical atmosphere",
    Luxury:
      "luxury visual language, refined styling, opulent details, elegant finish",
    Mythic:
      "mythic storytelling, divine presence, powerful symbolism, elevated visual tone",
    Dreamy:
      "dreamlike softness, ethereal glow, surreal elegance, poetic atmosphere",
    "Boudoir Editorial":
      "adult glamour editorial mood, sensual but non-explicit styling, intimate luxury setting, elegant pose direction",
  };

  const aspectMap = {
    Portrait: "portrait orientation, vertical composition",
    Square: "square composition, centered framing",
    Landscape: "landscape orientation, wide cinematic framing",
  };

  const modeMap = {
    standard:
      "general generation mode, preserve overall quality, strong composition, polished rendering",
    portrait:
      "identity preservation mode, keep face shape, facial structure, eye spacing, nose shape, lip shape, jawline, skin tone, brow placement, and overall likeness consistent",
    boudoir:
      "adult boudoir editorial mode, tasteful sensuality, glamour styling, non-explicit presentation, refined wardrobe and mood-driven posing",
  };

  const parts = [
    prompt.trim(),
    styleMap[style] || "",
    aspectMap[aspectRatio] || "",
    modeMap[mode] || "",
    referenceCount > 0
      ? `use ${referenceCount} reference image${referenceCount === 1 ? "" : "s"} for likeness, styling, and mood guidance`
      : "",
  ].filter(Boolean);

  let finalText = parts.join(", ");

  if (negativePrompt.trim()) {
    finalText += `

Negative prompt: ${negativePrompt.trim()}`;
  }

  return finalText;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 700px at 50% 10%, rgba(170,140,70,0.12), rgba(0,0,0,0)), #050507",
    color: "#f3efe7",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    padding: "28px 16px",
  },
  shell: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.24em",
    opacity: 0.8,
    marginBottom: "10px",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(30px, 4vw, 52px)",
    lineHeight: 1.05,
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  subtitle: {
    margin: 0,
    maxWidth: "760px",
    opacity: 0.82,
    lineHeight: 1.6,
    fontSize: "15px",
  },
  topLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  navButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#f3efe7",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontWeight: 600,
  },
  notice: {
    marginBottom: "18px",
    borderRadius: "16px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    lineHeight: 1.6,
    opacity: 0.92,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(360px, 1fr) minmax(360px, 1fr)",
    gap: "18px",
    alignItems: "start",
  },
  panel: {
    background: "rgba(17,17,20,0.96)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  },
  panelTitle: {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "16px",
    letterSpacing: "0.01em",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 700,
    opacity: 0.9,
  },
  modeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    marginBottom: "14px",
  },
  modeCard: {
    textAlign: "left",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#f3efe7",
    padding: "14px",
    cursor: "pointer",
  },
  modeCardActive: {
    border: "1px solid rgba(170,140,70,0.55)",
    background: "rgba(170,140,70,0.12)",
  },
  modeLabel: {
    fontSize: "14px",
    fontWeight: 800,
    marginBottom: "4px",
  },
  modeDescription: {
    fontSize: "13px",
    lineHeight: 1.5,
    opacity: 0.82,
  },
  textareaLarge: {
    width: "100%",
    minHeight: "140px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0e0e11",
    color: "#f3efe7",
    padding: "14px",
    resize: "vertical",
    outline: "none",
    marginBottom: "14px",
    boxSizing: "border-box",
    fontSize: "15px",
    lineHeight: 1.5,
  },
  textarea: {
    width: "100%",
    minHeight: "92px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0e0e11",
    color: "#f3efe7",
    padding: "14px",
    resize: "vertical",
    outline: "none",
    marginBottom: "14px",
    boxSizing: "border-box",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  field: {
    minWidth: 0,
  },
  select: {
    width: "100%",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0e0e11",
    color: "#f3efe7",
    padding: "0 12px",
    outline: "none",
    marginBottom: "14px",
    boxSizing: "border-box",
  },
  uploadBox: {
    display: "block",
    borderRadius: "18px",
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    marginBottom: "14px",
    cursor: "pointer",
  },
  uploadTitle: {
    fontSize: "14px",
    fontWeight: 800,
    marginBottom: "6px",
  },
  uploadText: {
    fontSize: "13px",
    opacity: 0.8,
    lineHeight: 1.5,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  referenceCard: {
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0d0d10",
  },
  referenceImage: {
    display: "block",
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  removeButton: {
    width: "100%",
    appearance: "none",
    border: 0,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f3efe7",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  safeNote: {
    marginBottom: "12px",
    borderRadius: "14px",
    padding: "12px 14px",
    background: "rgba(170,140,70,0.12)",
    border: "1px solid rgba(170,140,70,0.24)",
    lineHeight: 1.6,
    fontSize: "13px",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  primaryButton: {
    appearance: "none",
    border: "1px solid rgba(170,140,70,0.55)",
    background: "rgba(170,140,70,0.16)",
    color: "#f3efe7",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f3efe7",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  placeholderCard: {
    minHeight: "260px",
    borderRadius: "18px",
    border: "1px dashed rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
  },
  placeholderTitle: {
    fontSize: "18px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  placeholderText: {
    margin: 0,
    opacity: 0.76,
    lineHeight: 1.6,
    maxWidth: "420px",
  },
  previewFrame: {
    position: "relative",
    minHeight: "240px",
    borderRadius: "22px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "radial-gradient(circle at top, rgba(212,175,55,0.18), rgba(0,0,0,0) 35%), linear-gradient(135deg, #16161b 0%, #0c0c10 100%)",
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "14px",
  },
  previewGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.3))",
  },
  previewContent: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    padding: "20px",
  },
  previewLabel: {
    fontSize: "11px",
    letterSpacing: "0.18em",
    opacity: 0.7,
    marginBottom: "10px",
  },
  previewTitle: {
    fontSize: "clamp(20px, 2.6vw, 30px)",
    lineHeight: 1.15,
    fontWeight: 800,
    fontFamily: 'Georgia, "Times New Roman", serif',
    marginBottom: "12px",
    maxWidth: "90%",
    wordBreak: "break-word",
  },
  previewMetaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  metaBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "7px 12px",
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.26)",
    fontSize: "12px",
    fontWeight: 700,
  },
  subSectionTitle: {
    fontSize: "14px",
    fontWeight: 800,
    marginBottom: "10px",
    marginTop: "2px",
  },
  resultReferenceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  resultReferenceImage: {
    width: "100%",
    height: "90px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "block",
  },
  generatedCard: {
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0d0d10",
    padding: "16px",
    marginBottom: "14px",
  },
  generatedCardTitle: {
    fontSize: "16px",
    fontWeight: 800,
    marginBottom: "10px",
  },
  generatedLine: {
    lineHeight: 1.6,
    fontSize: "14px",
    opacity: 0.92,
    marginBottom: "6px",
  },
  outputBox: {
    minHeight: "180px",
    maxHeight: "320px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.7,
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0d0d10",
    padding: "16px",
    fontSize: "15px",
    marginBottom: "12px",
  },
  error: {
    marginBottom: "10px",
    borderRadius: "14px",
    padding: "12px 14px",
    background: "rgba(140,30,30,0.22)",
    border: "1px solid rgba(255,80,80,0.22)",
    color: "#ffd7d7",
    fontSize: "14px",
  },
};