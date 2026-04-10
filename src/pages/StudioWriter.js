import React, { useState } from "react";

export default function StudioWriter() {
  const [mode, setMode] = useState("screenplay");
  const [scenePrompt, setScenePrompt] = useState("");
  const [tone, setTone] = useState("Dramatic");
  const [intensity, setIntensity] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [outputData, setOutputData] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  // Phase 3 active engine:
  // "ai" uses the deployed Supabase Edge Function.
  // If AI fails for any reason, we safely fall back to mock output.
  const GENERATOR_ENGINE = "ai";

  const SUPABASE_FUNCTION_URL =
    "https://xilrceoojnnxiugezrrj.supabase.co/functions/v1/scene-architect";

  const presets = [
    {
      label: "Power Confrontation",
      prompt: "Two powerful figures confront each other in a private office after a betrayal is exposed.",
      tone: "Dramatic",
      intensity: 4,
      mode: "screenplay",
    },
    {
      label: "Dark Secret",
      prompt: "A character reveals a hidden truth that changes the balance of power in the room.",
      tone: "Dark",
      intensity: 3,
      mode: "novel",
    },
    {
      label: "Romantic Tension",
      prompt: "Two people with unresolved feelings are forced into close proximity during a high-stakes moment.",
      tone: "Mature",
      intensity: 3,
      mode: "novel",
    },
    {
      label: "Light Chemistry",
      prompt: "Two characters banter playfully while something deeper simmers underneath.",
      tone: "Light",
      intensity: 2,
      mode: "screenplay",
    },
  ];

  const applyPreset = (preset) => {
    setScenePrompt(preset.prompt);
    setTone(preset.tone);
    setIntensity(preset.intensity);
    setMode(preset.mode);
    setOutputData(null);
    setErrorMessage("");
    setCopyMessage("");
  };

  const getSceneVibe = (selectedTone, selectedIntensity, selectedMode) => {
    const vibeMap = {
      Light: {
        1: "Soft, conversational, and lightly atmospheric.",
        2: "Warm tension with gentle emotional movement.",
        3: "Bright but emotionally charged, with clear interpersonal stakes.",
        4: "Energetic and highly expressive with heightened emotional motion.",
      },
      Dramatic: {
        1: "Controlled tension with restrained emotion under the surface.",
        2: "Emotionally loaded and cinematic, with visible pressure building.",
        3: "Heavy dramatic tension with sharp emotional stakes.",
        4: "Explosive dramatic energy with intense emotional collision.",
      },
      Dark: {
        1: "Quiet unease with a subtle shadow hanging over the scene.",
        2: "Brooding and tense, with emotional danger beneath the dialogue.",
        3: "Dark, volatile, and psychologically pressurized.",
        4: "Oppressive, dangerous, and emotionally ruthless.",
      },
      Mature: {
        1: "Measured intimacy with controlled emotional undertones.",
        2: "Charged adult tension with layered emotional complexity.",
        3: "Intimate, sharp, and emotionally consuming.",
        4: "Deeply charged mature tension with commanding emotional gravity.",
      },
    };

    const base = vibeMap[selectedTone][selectedIntensity];

    if (selectedMode === "screenplay") {
      return `${base} Build it with visible performance beats, pauses, and cinematic transitions.`;
    }

    return `${base} Let the prose linger on internal tension, atmosphere, and emotional texture.`;
  };

  const getEmotionalCore = (selectedTone, selectedIntensity) => {
    const coreMap = {
      Light: "The scene revolves around connection, charm, and subtle emotional movement.",
      Dramatic: "The scene revolves around pressure, emotional restraint, and the threat of rupture.",
      Dark: "The scene revolves around power, danger, secrecy, and emotional instability.",
      Mature: "The scene revolves around attraction, emotional complexity, and controlled vulnerability.",
    };

    let result = coreMap[selectedTone];

    if (selectedIntensity >= 3) {
      result += " The emotional stakes should feel impossible to ignore.";
    } else {
      result += " The emotional weight should stay controlled and deliberate.";
    }

    return result;
  };

  const getVisualDirection = (selectedTone, selectedIntensity, selectedMode) => {
    const visualMap = {
      Light: "Use softer lighting, open body language, and a clean visual frame with emotional warmth.",
      Dramatic: "Use contrast lighting, stillness, eye contact, and deliberate pauses to heighten tension.",
      Dark: "Use shadows, minimal movement, controlled framing, and sharp visual contrast.",
      Mature: "Use intimate framing, close proximity, restrained gestures, and slow visual pacing.",
    };

    let result = visualMap[selectedTone];

    if (selectedIntensity === 4) {
      result += " Push the pacing tighter so the scene feels immediate and inescapable.";
    } else if (selectedIntensity === 1) {
      result += " Let the pacing breathe so tension builds gradually.";
    }

    if (selectedMode === "novel") {
      result += " Translate the visual language into sensory prose rather than only external staging.";
    }

    return result;
  };

  const getSceneFocus = (selectedMode, selectedTone, selectedIntensity) => {
    if (selectedMode === "screenplay") {
      if (selectedTone === "Dark" || selectedTone === "Dramatic") {
        return "Focus on sharp dialogue, silence between lines, and character blocking that reveals power shifts.";
      }

      if (selectedTone === "Mature") {
        return "Focus on charged pauses, eye contact, and body language that carries as much meaning as the dialogue.";
      }

      return "Focus on dialogue rhythm, character chemistry, and visible movement within the scene.";
    }

    if (selectedIntensity >= 3) {
      return "Focus on internal monologue, emotional pressure, and descriptive prose that heightens the atmosphere.";
    }

    return "Focus on interior feeling, sensory detail, and smooth emotional progression through the prose.";
  };

  const getWritingPrompt = (trimmedPrompt, selectedMode, selectedTone, selectedIntensity) => {
    if (selectedMode === "screenplay") {
      return `Write this as a screenplay scene. Keep the tone ${selectedTone.toLowerCase()} at intensity level ${selectedIntensity}. Use strong visual staging, restrained but meaningful action lines, and dialogue that carries subtext. Base the scene on this prompt: "${trimmedPrompt}"`;
    }

    return `Write this in novel prose. Keep the tone ${selectedTone.toLowerCase()} at intensity level ${selectedIntensity}. Emphasize atmosphere, emotional texture, and internal tension while building the scene from this prompt: "${trimmedPrompt}"`;
  };

  const buildScreenplayScene = (promptValue, selectedTone, selectedIntensity) => {
    const toneLineMap = {
      Light: "The room carries a softened edge, but something meaningful is moving underneath the surface.",
      Dramatic: "The room is still, but the silence feels loaded enough to split open.",
      Dark: "The shadows in the room seem to close in around every unspoken thought.",
      Mature: "The air feels close, charged, and far too intimate for either of them to ignore.",
    };

    const dialogueMap = {
      Light: [
        "You always do this thing where you pretend it's nothing.",
        "Maybe I'm waiting to see if you notice first.",
      ],
      Dramatic: [
        "You knew exactly what this would do when you kept it from me.",
        "I knew what it would cost. I just didn't know if you'd still be standing here after.",
      ],
      Dark: [
        "You should have buried this deeper.",
        "I would have, if I thought you were ever going to stop digging.",
      ],
      Mature: [
        "You keep standing this close like it doesn't change anything.",
        "Maybe it changes everything. Maybe that's the problem.",
      ],
    };

    const pacingLine =
      selectedIntensity >= 3
        ? "Neither of them moves first. The pressure between them sharpens with every second."
        : "A measured pause stretches between them, careful and deliberate.";

    const promptReference = `The tension in the room reflects the core situation: ${promptValue}`;

    return `INT. PRIVATE ROOM - NIGHT

Low light cuts across the space. The atmosphere is controlled, but unstable.

${toneLineMap[selectedTone]}

${pacingLine}

CHARACTER ONE
${dialogueMap[selectedTone][0]}

CHARACTER TWO
${dialogueMap[selectedTone][1]}

A silence follows, heavier than either response.

${promptReference}`;
  };

  const buildNovelScene = (promptValue, selectedTone, selectedIntensity) => {
    const openingMap = {
      Light: "The room felt warmer than it should have, softened by the kind of quiet that invited honesty without demanding it.",
      Dramatic: "The room held its breath around them, as if it already understood something was about to break.",
      Dark: "The shadows in the room clung to the walls like they were listening, waiting for the first crack in control.",
      Mature: "The air between them felt too close, too aware, threaded with the kind of tension neither distance nor discipline could fully erase.",
    };

    const middleMap = {
      Light: "Even the smallest exchange carried more weight than either of them wanted to admit, and that only made the moment more revealing.",
      Dramatic: "Every glance felt like a challenge, every pause a decision not yet spoken aloud.",
      Dark: "Nothing in the room felt safe, not the silence, not the nearness, and certainly not the truth pressing its way upward.",
      Mature: "The restraint between them did not weaken the moment; it deepened it, made every look and pause feel sharpened by want and consequence.",
    };

    const intensityLine =
      selectedIntensity >= 3
        ? "By the time either of them spoke, the emotional pressure had already become impossible to ignore."
        : "The moment unfolded slowly, with enough restraint to make every shift in tone matter.";

    return `${openingMap[selectedTone]} ${middleMap[selectedTone]} ${intensityLine}

${promptValue.charAt(0).toUpperCase()}${promptValue.slice(1)} The emotional center of the scene rests in what remains unsaid as much as in what is finally spoken, leaving the atmosphere charged long after the exchange begins.`;
  };

  const buildMockOutput = (promptValue, modeValue, toneValue, intensityValue) => {
    return {
      engine: "mock",
      sceneVibe: getSceneVibe(toneValue, intensityValue, modeValue),
      emotionalCore: getEmotionalCore(toneValue, intensityValue),
      visualDirection: getVisualDirection(toneValue, intensityValue, modeValue),
      sceneFocus: getSceneFocus(modeValue, toneValue, intensityValue),
      writingPrompt: getWritingPrompt(promptValue, modeValue, toneValue, intensityValue),
      fullScene:
        modeValue === "screenplay"
          ? buildScreenplayScene(promptValue, toneValue, intensityValue)
          : buildNovelScene(promptValue, toneValue, intensityValue),
    };
  };

  const buildAiOutput = async (promptValue, modeValue, toneValue, intensityValue) => {
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptValue,
          mode: modeValue === "screenplay" ? "Screenplay" : "Novel",
          tone: toneValue,
          intensity: intensityValue,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success || !data?.content) {
        throw new Error("AI generation failed.");
      }

      return {
        engine: "ai",
        sceneVibe: getSceneVibe(toneValue, intensityValue, modeValue),
        emotionalCore: getEmotionalCore(toneValue, intensityValue),
        visualDirection: getVisualDirection(toneValue, intensityValue, modeValue),
        sceneFocus: getSceneFocus(modeValue, toneValue, intensityValue),
        writingPrompt: getWritingPrompt(promptValue, modeValue, toneValue, intensityValue),
        fullScene: data.content,
      };
    } catch (error) {
      console.error("Scene Architect AI error:", error);

      return buildMockOutput(promptValue, modeValue, toneValue, intensityValue);
    }
  };

  const generateSceneOutput = async (promptValue, modeValue, toneValue, intensityValue) => {
    if (GENERATOR_ENGINE === "ai") {
      return await buildAiOutput(promptValue, modeValue, toneValue, intensityValue);
    }

    return buildMockOutput(promptValue, modeValue, toneValue, intensityValue);
  };

  const handleGenerate = async () => {
    const trimmedPrompt = scenePrompt.trim();

    if (!trimmedPrompt) {
      setErrorMessage("Enter a scene prompt to generate.");
      setOutputData(null);
      setCopyMessage("");
      return;
    }

    setErrorMessage("");
    setCopyMessage("");

    const result = await generateSceneOutput(trimmedPrompt, mode, tone, intensity);
    setOutputData(result);
  };

  const handleMakeDarker = () => {
    if (!outputData) return;

    setTone("Dark");
    setCopyMessage("");
    setOutputData((prev) => ({
      ...prev,
      sceneVibe: `${prev.sceneVibe} Push the emotional temperature into darker, more dangerous territory.`,
      emotionalCore: `${prev.emotionalCore} Add secrecy, threat, and a stronger sense of psychological risk.`,
      visualDirection: `${prev.visualDirection} Deepen the shadows and make the environment feel more oppressive.`,
      sceneFocus: `${prev.sceneFocus} Let power imbalance and hidden motive sit closer to the surface.`,
      writingPrompt: `${prev.writingPrompt} Make the scene darker, more dangerous, and emotionally harsher.`,
      fullScene: `${prev.fullScene}

A darker undercurrent settles over the exchange, making every word feel more dangerous than the last.`,
    }));
  };

  const handleIncreaseTension = () => {
    if (!outputData) return;

    const nextIntensity = intensity < 4 ? intensity + 1 : 4;
    setIntensity(nextIntensity);
    setCopyMessage("");

    setOutputData((prev) => ({
      ...prev,
      sceneVibe: `${prev.sceneVibe} Increase the pressure so every line feels closer to rupture.`,
      emotionalCore: `${prev.emotionalCore} Raise the emotional stakes and tighten the restraint between characters.`,
      visualDirection: `${prev.visualDirection} Shorten the pacing and reduce visual softness.`,
      sceneFocus: `${prev.sceneFocus} Let every pause feel loaded with consequence.`,
      writingPrompt: `${prev.writingPrompt} Increase the tension and sharpen the emotional stakes.`,
      fullScene: `${prev.fullScene}

The tension escalates until even silence begins to feel like a threat.`,
    }));
  };

  const handleIntensifyRomance = () => {
    if (!outputData) return;

    setTone("Mature");
    setCopyMessage("");
    setOutputData((prev) => ({
      ...prev,
      sceneVibe: `${prev.sceneVibe} Add charged intimacy and a stronger undercurrent of attraction.`,
      emotionalCore: `${prev.emotionalCore} Heighten longing, restraint, and emotional vulnerability.`,
      visualDirection: `${prev.visualDirection} Bring the framing closer and slow the moments between gestures.`,
      sceneFocus: `${prev.sceneFocus} Let proximity, eye contact, and silence do more work.`,
      writingPrompt: `${prev.writingPrompt} Intensify the romantic tension while keeping it emotionally controlled.`,
      fullScene: `${prev.fullScene}

Something more intimate moves beneath the scene, turning restraint into its own kind of confession.`,
    }));
  };

  const handleSlowPacing = () => {
    if (!outputData) return;

    setCopyMessage("");
    setOutputData((prev) => ({
      ...prev,
      sceneVibe: `${prev.sceneVibe} Let the scene unfold more slowly and deliberately.`,
      emotionalCore: `${prev.emotionalCore} Give the emotional beats more room to breathe.`,
      visualDirection: `${prev.visualDirection} Extend pauses, stillness, and observational detail.`,
      sceneFocus: `${prev.sceneFocus} Draw out reaction, silence, and atmosphere before release.`,
      writingPrompt: `${prev.writingPrompt} Slow the pacing and allow the emotional tension to build more gradually.`,
      fullScene: `${prev.fullScene}

The pacing slows, allowing every reaction, breath, and shift in expression to linger longer in the room.`,
    }));
  };

  const handleCopyScene = async () => {
    if (!outputData?.fullScene) return;

    try {
      await navigator.clipboard.writeText(outputData.fullScene);
      setCopyMessage("Scene copied.");
    } catch (error) {
      setCopyMessage("Copy failed. Please copy manually.");
    }
  };

  const handleReset = () => {
    setScenePrompt("");
    setTone("Dramatic");
    setIntensity(2);
    setMode("screenplay");
    setOutputData(null);
    setErrorMessage("");
    setCopyMessage("");
  };

  const handleRegenerate = async () => {
    const trimmedPrompt = scenePrompt.trim();

    if (!trimmedPrompt) return;

    const variation = intensity < 4 ? intensity + 1 : 3;

    setIntensity(variation);
    setErrorMessage("");
    setCopyMessage("");

    const result = await generateSceneOutput(trimmedPrompt, mode, tone, variation);
    setOutputData(result);
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>THE STUDIO</p>
          <h1 style={styles.title}>Scene Architect</h1>
          <p style={styles.subtitle}>
            Construct cinematic scenes with controlled tone, intensity, and structure.
          </p>
        </div>

        <div style={styles.presetRow}>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              style={styles.presetButton}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <label style={styles.label}>Mode</label>
            <div style={styles.toggleRow}>
              <button
                type="button"
                onClick={() => setMode("screenplay")}
                style={{
                  ...styles.toggleButton,
                  ...(mode === "screenplay" ? styles.active : {}),
                }}
              >
                Screenplay
              </button>
              <button
                type="button"
                onClick={() => setMode("novel")}
                style={{
                  ...styles.toggleButton,
                  ...(mode === "novel" ? styles.active : {}),
                }}
              >
                Novel
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Scene Prompt</label>
            <textarea
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              style={styles.textarea}
              placeholder="Describe the scene you want to build..."
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={styles.select}>
              <option value="Light">Light</option>
              <option value="Dramatic">Dramatic</option>
              <option value="Dark">Dark</option>
              <option value="Mature">Mature</option>
            </select>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Intensity: {intensity}</label>
            <input
              type="range"
              min="1"
              max="4"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.rangeLabels}>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>

          {errorMessage ? <p style={styles.error}>{errorMessage}</p> : null}

          <div style={styles.buttonRow}>
            <button type="button" onClick={handleGenerate} style={styles.generate}>
              Generate Scene
            </button>

            <button type="button" onClick={handleRegenerate} style={styles.secondaryButton}>
              Regenerate
            </button>

            <button type="button" onClick={handleReset} style={styles.secondaryButton}>
              Reset
            </button>
          </div>
        </div>

        <div style={styles.outputCard}>
          <div style={styles.outputHeader}>
            <p style={styles.outputLabel}>Output</p>

            <div style={styles.enhanceRow}>
              <button type="button" onClick={handleMakeDarker} style={styles.enhanceButton}>
                Make Darker
              </button>
              <button type="button" onClick={handleIncreaseTension} style={styles.enhanceButton}>
                Increase Tension
              </button>
              <button type="button" onClick={handleIntensifyRomance} style={styles.enhanceButton}>
                Intensify Romance
              </button>
              <button type="button" onClick={handleSlowPacing} style={styles.enhanceButton}>
                Slow Pacing
              </button>
            </div>
          </div>

          <div style={styles.outputBox}>
            {outputData ? (
              <div style={styles.outputContent}>
                <div style={styles.engineRow}>
                  <span style={styles.engineBadge}>
                    Engine: {outputData.engine === "ai" ? "AI" : "Mock"}
                  </span>
                </div>

                <div style={styles.outputGrid}>
                  <div style={styles.outputPanel}>
                    <p style={styles.outputSectionTitle}>Scene Vibe</p>
                    <p style={styles.outputText}>{outputData.sceneVibe}</p>
                  </div>

                  <div style={styles.outputPanel}>
                    <p style={styles.outputSectionTitle}>Emotional Core</p>
                    <p style={styles.outputText}>{outputData.emotionalCore}</p>
                  </div>

                  <div style={styles.outputPanel}>
                    <p style={styles.outputSectionTitle}>Visual Direction</p>
                    <p style={styles.outputText}>{outputData.visualDirection}</p>
                  </div>

                  <div style={styles.outputPanel}>
                    <p style={styles.outputSectionTitle}>Scene Focus</p>
                    <p style={styles.outputText}>{outputData.sceneFocus}</p>
                  </div>
                </div>

                <div style={styles.outputPanel}>
                  <p style={styles.outputSectionTitle}>Writing Prompt</p>
                  <p style={styles.outputText}>{outputData.writingPrompt}</p>
                </div>

                <div style={styles.scenePanel}>
                  <div style={styles.scenePanelHeader}>
                    <p style={styles.outputSectionTitle}>Generated Scene</p>

                    <div style={styles.copyRow}>
                      <button type="button" onClick={handleCopyScene} style={styles.copyButton}>
                        Copy Scene
                      </button>
                      {copyMessage ? <span style={styles.copyMessage}>{copyMessage}</span> : null}
                    </div>
                  </div>

                  <pre style={styles.sceneText}>{outputData.fullScene}</pre>
                </div>
              </div>
            ) : (
              <p style={styles.placeholder}>
                Select a preset or build your own scene, then generate structured output.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0c",
    color: "#fff",
    padding: "60px 20px",
    boxSizing: "border-box",
  },

  wrapper: {
    maxWidth: "980px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "30px",
  },

  eyebrow: {
    fontSize: "11px",
    letterSpacing: "3px",
    color: "#888",
    margin: "0 0 10px 0",
  },

  title: {
    fontSize: "40px",
    margin: "0 0 12px 0",
    lineHeight: "1.1",
  },

  subtitle: {
    color: "#aaa",
    margin: 0,
    lineHeight: "1.6",
    maxWidth: "680px",
  },

  presetRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  presetButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },

  card: {
    background: "#121217",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid #222",
  },

  section: {
    marginBottom: "16px",
  },

  label: {
    fontSize: "13px",
    color: "#ccc",
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },

  toggleRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  toggleButton: {
    padding: "8px 12px",
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  active: {
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: "1.6",
  },

  select: {
    width: "100%",
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "10px",
    boxSizing: "border-box",
  },

  slider: {
    width: "100%",
  },

  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#777",
    marginTop: "6px",
  },

  error: {
    color: "#ff6b6b",
    margin: "0 0 14px 0",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  generate: {
    flex: "1 1 220px",
    padding: "12px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryButton: {
    flex: "1 1 160px",
    padding: "12px",
    background: "#0f0f12",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
  },

  outputCard: {
    background: "#121217",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #222",
  },

  outputHeader: {
    marginBottom: "14px",
  },

  outputLabel: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: "#888",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  enhanceRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  enhanceButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#0f0f12",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },

  outputBox: {
    minHeight: "260px",
    border: "1px dashed #333",
    borderRadius: "12px",
    padding: "20px",
    background: "#0d0d10",
    boxSizing: "border-box",
  },

  outputContent: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  engineRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  engineBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid #31313b",
    background: "#111116",
    color: "#bdbdc7",
    fontSize: "11px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  outputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  outputPanel: {
    background: "#111116",
    border: "1px solid #202028",
    borderRadius: "12px",
    padding: "16px",
  },

  scenePanel: {
    background: "#101015",
    border: "1px solid #262630",
    borderRadius: "14px",
    padding: "18px",
  },

  scenePanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  copyRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  copyButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#ffffff",
    color: "#000",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  copyMessage: {
    fontSize: "12px",
    color: "#a8a8b3",
  },

  outputSectionTitle: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#9a9aa3",
    fontWeight: "700",
  },

  outputText: {
    margin: 0,
    color: "#d0d0d6",
    lineHeight: "1.7",
    fontSize: "14px",
    whiteSpace: "pre-line",
  },

  sceneText: {
    margin: 0,
    color: "#f2f2f3",
    lineHeight: "1.8",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
  },

  placeholder: {
    color: "#777",
    margin: 0,
    lineHeight: "1.7",
  },
};