Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Method not allowed. Use POST.",
        fallback: true,
      },
      405,
      corsHeaders
    );
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAiKey) {
      return jsonResponse(
        {
          success: false,
          error: "Missing OPENAI_API_KEY.",
          fallback: true,
        },
        500,
        corsHeaders
      );
    }

    const body = await req.json();

    const {
      prompt = "",
      mode = "Screenplay",
      tone = "Dramatic",
      intensity = 2,
      preset = "",
      enhancement = "",
    } = body ?? {};

    const safePrompt = String(prompt || "").trim();
    const safeMode = normalizeMode(mode);
    const safeTone = normalizeTone(tone);
    const safeIntensity = normalizeIntensity(intensity);
    const safePreset = String(preset || "").trim();
    const safeEnhancement = String(enhancement || "").trim();

    if (!safePrompt) {
      return jsonResponse(
        {
          success: false,
          error: "Prompt is required.",
          fallback: true,
        },
        400,
        corsHeaders
      );
    }

    const instructions = buildSystemInstructions();
    const input = buildUserInput({
      prompt: safePrompt,
      mode: safeMode,
      tone: safeTone,
      intensity: safeIntensity,
      preset: safePreset,
      enhancement: safeEnhancement,
    });

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions,
        input,
        max_output_tokens: 1200,
      }),
    });

    const rawText = await openAiResponse.text();

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = null;
    }

    if (!openAiResponse.ok) {
      return jsonResponse(
        {
          success: false,
          error: "OpenAI request failed.",
          details: parsed ?? rawText,
          fallback: true,
        },
        500,
        corsHeaders
      );
    }

    const content =
      typeof parsed?.output_text === "string" ? parsed.output_text.trim() : "";

    if (!content) {
      return jsonResponse(
        {
          success: false,
          error: "OpenAI returned empty output.",
          details: parsed,
          fallback: true,
        },
        500,
        corsHeaders
      );
    }

    return jsonResponse(
      {
        success: true,
        engine: "openai",
        content,
        fallback: false,
      },
      200,
      corsHeaders
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown server error.",
        fallback: true,
      },
      500,
      corsHeaders
    );
  }
});

function jsonResponse(
  data: Record<string, unknown>,
  status = 200,
  headers: Record<string, string> = {}
) {
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

function normalizeMode(value: unknown) {
  const allowed = ["Screenplay", "Novel"];
  const normalized = String(value || "").trim();
  return allowed.includes(normalized) ? normalized : "Screenplay";
}

function normalizeTone(value: unknown) {
  const allowed = ["Light", "Dramatic", "Dark", "Mature"];
  const normalized = String(value || "").trim();
  return allowed.includes(normalized) ? normalized : "Dramatic";
}

function normalizeIntensity(value: unknown) {
  const num = Number(value);
  if (Number.isNaN(num)) return 2;
  if (num < 1) return 1;
  if (num > 4) return 4;
  return Math.round(num);
}

function buildSystemInstructions() {
  return `
You are Scene Architect, a premium cinematic writing engine.

Your job:
- Generate one original fictional scene from the user's prompt.
- Match the requested mode, tone, intensity, preset, and enhancement direction.
- Return only the finished scene text.
- Do not explain your choices.
- Do not add bullets, notes, analysis, or labels.
- Keep the writing polished, emotionally layered, cinematic, and coherent.

Mode rules:
- Screenplay mode: use screenplay-style formatting with scene heading when appropriate, action lines, and dialogue blocks.
- Novel mode: use immersive prose with strong flow, atmosphere, tension, and interiority when relevant.

Tone rules:
- Light = softer, cleaner, emotionally open, less heavy.
- Dramatic = emotionally charged, cinematic, tense.
- Dark = ominous, psychologically heavier, sharper, moodier.
- Mature = emotionally intense, sensual if relevant, suggestive only, never explicit.

Intensity rules:
- 1 = restrained
- 2 = moderate
- 3 = high
- 4 = very high

Safety boundaries:
- No graphic sexual content.
- No pornographic detail.
- No minors in sexual situations.
- No incest.
- No bestiality.
- No graphic sexual violence.
- No instructions for real-world harm or crime.

Quality requirements:
- Premium writing quality.
- Strong subtext.
- Strong visual atmosphere.
- Distinct emotional movement.
- No cheesy filler.
- End on a compelling beat.
`.trim();
}

function buildUserInput({
  prompt,
  mode,
  tone,
  intensity,
  preset,
  enhancement,
}: {
  prompt: string;
  mode: string;
  tone: string;
  intensity: number;
  preset: string;
  enhancement: string;
}) {
  return `
Create one original fictional scene with the following settings.

MODE:
${mode}

TONE:
${tone}

INTENSITY:
${intensity}

PRESET:
${preset || "None"}

ENHANCEMENT:
${enhancement || "None"}

PROMPT:
${prompt}

Output rules:
- Return only the completed scene.
- No intro text.
- No explanation.
- No labels.
`.trim();
}