// aiClient.js: Unified client-side LLM abstraction for Micro-Startup Compass.
// Supports: Google Gemini, OpenAI, Anthropic Claude, xAI Grok, Ollama (local), and Custom OpenAI-compatible endpoints.
// Local client-side execution: credentials are sent directly to the user's chosen provider endpoint.

import { store } from "../store.js";

export const AI_PROVIDERS = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    icon: "✨",
    defaultModel: "gemini-1.5-flash",
    models: ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"],
    keyPlaceholder: "AIzaSy...",
    helpUrl: "https://aistudio.google.com/app/apikey",
    helpText: "Free API key available in Google AI Studio with high rate limits."
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    icon: "🟢",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o"],
    keyPlaceholder: "sk-proj-...",
    helpUrl: "https://platform.openai.com/api-keys",
    helpText: "Standard OpenAI key. gpt-4o-mini is fast and ultra-low cost."
  },
  claude: {
    id: "claude",
    name: "Anthropic Claude",
    icon: "🟣",
    defaultModel: "claude-3-5-haiku-latest",
    models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest"],
    keyPlaceholder: "sk-ant-...",
    helpUrl: "https://console.anthropic.com/settings/keys",
    helpText: "Requires Anthropic direct browser access header (enabled automatically)."
  },
  grok: {
    id: "grok",
    name: "xAI Grok",
    icon: "⚡",
    defaultModel: "grok-beta",
    models: ["grok-beta", "grok-2"],
    keyPlaceholder: "xai-...",
    helpUrl: "https://console.x.ai/",
    helpText: "Official xAI API key."
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local Models)",
    icon: "🦙",
    defaultModel: "llama3.2:latest",
    models: ["llama3.2:latest", "gemma4:12b", "llama3.2", "llama3", "mistral", "qwen2.5", "deepseek-r1", "phi3"],
    keyPlaceholder: "Not required for local",
    defaultEndpoint: "http://localhost:11434",
    helpUrl: "https://ollama.com/",
    helpText: "Runs locally and offline on your machine. Auto-detects your installed local models."
  },
  custom: {
    id: "custom",
    name: "Custom (OpenAI-Compatible)",
    icon: "🛠️",
    defaultModel: "llama-3.3-70b-versatile",
    defaultEndpoint: "https://api.groq.com/openai/v1",
    keyPlaceholder: "gsk_... or API key",
    helpUrl: "",
    helpText: "Use with Groq, OpenRouter, DeepSeek, Together AI, or local vLLM."
  }
};

// Helper: Query Ollama locally for installed models
export async function fetchLocalOllamaModels(endpoint = "http://localhost:11434") {
  try {
    const baseHost = (endpoint || "http://localhost:11434")
      .replace(/\/v1\/?$/, "")
      .replace(/\/api\/(chat|generate)\/?$/, "")
      .replace(/\/$/, "");
    const res = await fetch(`${baseHost}/api/tags`, { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => m.name || m.model).filter(Boolean);
  } catch {
    return [];
  }
}

const SYSTEM_FOUNDER_GUARDRAIL = `You are a practical, encouraging micro-startup advisor specializing in helping everyday, non-technical lay founders (contractors, makers, home bakers, creative freelancers, neighborhood service providers).
Rules:
1. Always write in plain, accessible, down-to-earth conversational English.
2. NEVER use Silicon Valley jargon or corporate buzzwords (no "disrupt", "frictionless", "synergy", "paradigm", "B2B SaaS", "scalable flywheel").
3. Prioritize frugality, real past behavior, concrete dollar figures, and small experiments under $100.
4. When asked for JSON, output ONLY valid JSON with no markdown wrapping or preamble.`;

export async function callAi({ prompt, systemPrompt = "", temperature = 0.7, jsonMode = false, config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  if (!activeConfig || !activeConfig.provider) {
    throw new Error("AI is not configured. Please open AI Settings to set up an API provider.");
  }

  const provider = activeConfig.provider;
  const key = (activeConfig.apiKey || "").trim();
  const model = (activeConfig.model || AI_PROVIDERS[provider]?.defaultModel || "").trim();
  const fullSystemPrompt = `${SYSTEM_FOUNDER_GUARDRAIL}\n\n${systemPrompt}`.trim();

  switch (provider) {
    case "gemini":
      return callGemini({ prompt, systemPrompt: fullSystemPrompt, temperature, jsonMode, key, model });

    case "openai":
      return callOpenAiCompatible({
        baseUrl: "https://api.openai.com/v1",
        key,
        model: model || "gpt-4o-mini",
        prompt,
        systemPrompt: fullSystemPrompt,
        temperature,
        jsonMode
      });

    case "claude":
      return callClaude({ prompt, systemPrompt: fullSystemPrompt, temperature, jsonMode, key, model });

    case "grok":
      return callOpenAiCompatible({
        baseUrl: "https://api.x.ai/v1",
        key,
        model: model || "grok-beta",
        prompt,
        systemPrompt: fullSystemPrompt,
        temperature,
        jsonMode
      });

    case "ollama": {
      return callOllama({
        endpoint: config.endpoint || "http://localhost:11434",
        model: model || "llama3.2:latest",
        prompt,
        systemPrompt: fullSystemPrompt,
        temperature,
        jsonMode
      });
    }

    case "custom": {
      const endpoint = (config.endpoint || "https://api.groq.com/openai/v1").replace(/\/$/, "");
      return callOpenAiCompatible({
        baseUrl: endpoint,
        key,
        model,
        prompt,
        systemPrompt: fullSystemPrompt,
        temperature,
        jsonMode
      });
    }

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// 1. Google Gemini Direct REST API
async function callGemini({ prompt, systemPrompt, temperature, jsonMode, key, model }) {
  if (!key) throw new Error("Please enter your Google Gemini API key in AI Settings.");
  
  const targetModel = model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(key)}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt ? `[Instructions]:\n${systemPrompt}\n\n` : ""}${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: Math.min(Math.max(temperature, 0), 1.0)
    }
  };

  if (jsonMode) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API returned HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return cleanOutput(text, jsonMode);
}

// 2. OpenAI-Compatible Format (OpenAI, xAI Grok, Ollama, Groq, OpenRouter)
async function callOpenAiCompatible({ baseUrl, key, model, prompt, systemPrompt, temperature, jsonMode }) {
  if (!baseUrl) throw new Error("Endpoint URL is required.");
  if (!key && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1")) {
    throw new Error("API key is required for this provider.");
  }

  const url = `${baseUrl}/chat/completions`;
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const body = {
    model,
    messages,
    temperature
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const headers = {
    "Content-Type": "application/json"
  };
  if (key) {
    headers["Authorization"] = `Bearer ${key}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error?.message || `API returned HTTP ${res.status}: ${res.statusText}`;
    if (res.status === 401) {
      throw new Error(`Authentication failed (HTTP 401). Please check that your API key is valid.`);
    }
    if (res.status === 404) {
      throw new Error(`Endpoint or model not found (HTTP 404). Check model '${model}' and endpoint '${baseUrl}'.`);
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Provider returned an empty response.");
  return cleanOutput(text, jsonMode);
}

// 3. Anthropic Claude Direct Browser Access
async function callClaude({ prompt, systemPrompt, temperature, jsonMode, key, model }) {
  if (!key) throw new Error("Please enter your Anthropic API key in AI Settings.");

  const url = "https://api.anthropic.com/v1/messages";
  const body = {
    model: model || "claude-3-5-haiku-latest",
    max_tokens: 1500,
    temperature,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: jsonMode ? `${prompt}\n\nRespond strictly with a valid JSON object only.` : prompt
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Anthropic API returned HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Anthropic returned an empty response.");
  return cleanOutput(text, jsonMode);
}

// 4. Dedicated Ollama Client (Native /api/chat with /v1/chat/completions fallback)
async function callOllama({ endpoint, model, prompt, systemPrompt, temperature, jsonMode }) {
  const baseHost = (endpoint || "http://localhost:11434")
    .replace(/\/v1\/?$/, "")
    .replace(/\/api\/(chat|generate)\/?$/, "")
    .replace(/\/$/, "");

  const targetModel = (model || "llama3.2:latest").trim();

  // 1. Try Native Ollama /api/chat (fastest & standard across all Ollama versions)
  try {
    const nativeUrl = `${baseHost}/api/chat`;
    const messages = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const nativeBody = {
      model: targetModel,
      messages,
      stream: false,
      options: {
        temperature: Math.min(Math.max(temperature, 0), 1.0),
        num_predict: jsonMode ? 600 : 350
      }
    };
    if (jsonMode) {
      nativeBody.format = "json";
    }

    const nativeRes = await fetch(nativeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nativeBody)
    });

    if (nativeRes.ok) {
      const nativeData = await nativeRes.json();
      const text = nativeData.message?.content;
      if (text) return cleanOutput(text, jsonMode);
    } else {
      const errData = await nativeRes.json().catch(() => ({}));
      const errMsg = errData.error || "";
      if (errMsg.toLowerCase().includes("not found")) {
        const installed = await fetchLocalOllamaModels(baseHost);
        const suggestion = installed.length > 0 ? ` Installed models: ${installed.join(", ")}.` : "";
        throw new Error(`Model '${targetModel}' not found in Ollama.${suggestion} Run 'ollama pull ${targetModel}' or choose one of your installed models.`);
      }
    }
  } catch (err) {
    if (err.message && err.message.includes("not found in Ollama")) {
      throw err;
    }
    // Fall through to try /v1/chat/completions route
  }

  // 2. Try OpenAI-Compatible /v1/chat/completions
  const v1Url = `${baseHost}/v1/chat/completions`;
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const v1Body = {
    model: targetModel,
    messages,
    temperature,
    max_tokens: jsonMode ? 600 : 350,
    stream: false
  };
  if (jsonMode) {
    v1Body.response_format = { type: "json_object" };
  }

  const v1Res = await fetch(v1Url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(v1Body)
  });

  if (!v1Res.ok) {
    const errData = await v1Res.json().catch(() => ({}));
    const errMsg = errData.error?.message || errData.error || `Ollama returned HTTP ${v1Res.status}`;
    if (v1Res.status === 404 || errMsg.toLowerCase().includes("not found")) {
      const installed = await fetchLocalOllamaModels(baseHost);
      const suggestion = installed.length > 0 ? ` Installed models: ${installed.join(", ")}.` : "";
      throw new Error(`Model '${targetModel}' not found in Ollama.${suggestion} Run 'ollama pull ${targetModel}' or select an installed model.`);
    }
    throw new Error(errMsg);
  }

  const v1Data = await v1Res.json();
  const text = v1Data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Ollama returned an empty response.");
  return cleanOutput(text, jsonMode);
}

function cleanOutput(text, jsonMode) {
  let cleaned = text.trim();
  if (jsonMode) {
    // Remove markdown code fences like ```json ... ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  return cleaned;
}

// 5. Quick Connection Test
export async function testAiConnection(config) {
  try {
    const testPrompt = "Reply with exactly one word: 'Connected'.";
    const res = await callAi({
      prompt: testPrompt,
      systemPrompt: "You are testing an API connection. Keep response under 3 words.",
      temperature: 0.1,
      config
    });
    return {
      success: true,
      message: `Successfully connected to ${AI_PROVIDERS[config.provider]?.name || config.provider}! Response: "${res.slice(0, 50)}"`
    };
  } catch (err) {
    let troubleshooting = "";
    const msg = err.message || String(err);
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      if (config.provider === "ollama") {
        troubleshooting = ` (Ollama tip: Make sure Ollama is running at ${config.endpoint || "http://localhost:11434"}. In your browser, ensure CORS is allowed: run 'ollama serve' or restart Ollama).`;
      } else {
        troubleshooting = " (Network tip: Check your internet connection or any adblockers blocking direct API requests).";
      }
    }
    return {
      success: false,
      message: `${msg}${troubleshooting}`
    };
  }
}

// =========================================================================
// Specialized Domain AI Helpers (With Fallback Grace & Structured JSON Mode)
// =========================================================================

/**
 * 1. Custom Setback Coach (Encourager & Reframe)
 */
export async function coachCustomSetback({ situation, projectContext = "", config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  const systemPrompt = `You are The Encourager & Setback Alchemist for first-time, micro-scale solo founders. 
You follow Rob Fitzpatrick's 'The Mom Test' and lean validation principles.
Your tone is warm, grounded, zero-bullshit, and highly empathetic.
Respond with valid JSON with keys:
- "diagnosis": (2 sentences explaining what the other person's reaction or awkward moment actually means about their habits, status, or pain, rather than personal rejection)
- "reframe": (2 sentences explaining why this setback is good news, saving money/time or clarifying who the real buyer is)
- "script": (An exact, non-defensive 1-2 sentence response to text or say back)
Do not output markdown code blocks.`;

  const prompt = `Here is the awkward situation or rejection the founder experienced:
"${situation}"

Project Context (if any):
${projectContext || "Solo micro-startup idea"}

Provide the diagnosis, reframe, and exact reply script.`;

  const raw = await callAi({ prompt, systemPrompt, jsonMode: true, temperature: 0.6, config: activeConfig });
  try {
    return JSON.parse(raw);
  } catch {
    return {
      diagnosis: "Reactions like this usually mean the person felt cornered or didn't understand the specific problem being solved, not that your concept has no merit.",
      reframe: "Finding skepticism or disinterest early costs zero dollars and prevents you from spending months building the wrong thing.",
      script: "Thanks so much for the candid thought! Quick question: how do you currently handle this headache in your own day-to-day?"
    };
  }
}

/**
 * 2. Audience-Tailored Outreach Script Generator
 */
export async function generateCustomOutreach({ audience, problem, ideaName, config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  const systemPrompt = `You are an expert in customer discovery who strictly adheres to 'The Mom Test'.
Rules:
1. Never mention the idea or product name.
2. Never ask for money, approval, or opinions about the future.
3. Only ask about past behavior, current workflow, and recent headaches.
4. Keep messages conversational, polite, and under 3 sentences.
Respond with valid JSON with keys:
- "whatsapp": (Casual 2-3 sentence WhatsApp / SMS message asking for 10 min of advice on their experience)
- "inPerson": (A natural 1-2 sentence opener to say in person or over coffee)
- "email": (A warm, brief 3-sentence email with subject line format: "Subject: [Topic] / Quick question")
Do not output markdown code blocks.`;

  const prompt = `Idea/Topic: ${ideaName || "A helpful service"}
Target Audience: ${audience || "Everyday people or local small business owners"}
Core Headache/Problem: ${problem || "Wasting time on repetitive chores"}

Generate 3 tailored outreach scripts for this specific audience.`;

  const raw = await callAi({ prompt, systemPrompt, jsonMode: true, temperature: 0.7, config: activeConfig });
  try {
    return JSON.parse(raw);
  } catch {
    return {
      whatsapp: `Hey! I'm doing some quick research on how folks manage ${problem || "this headache"} these days. Would you be up for a 7-minute phone chat this week? Promise I'm not selling anything, just trying to understand the workflow!`,
      inPerson: `Hey, quick question — I've been noticing a lot of people struggling with ${problem || "this issue"} recently. How do you normally handle that in your own day?`,
      email: `Subject: Quick question about ${problem ? problem.slice(0, 30) : "workflow"}\n\nHi there! I'm researching how local people navigate ${problem || "this issue"}. Do you have 8 minutes for a quick chat sometime this week? Strictly learning how you do things, no sales pitch whatsoever.`
    };
  }
}

/**
 * 3. Pricing Tier & Packaging Strategist
 */
export async function suggestPricingTiers({ ideaName, problem, targetPrice = 50, monthlyGoal = 1000, config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  const systemPrompt = `You are a micro-business packaging and pricing strategist for solo entrepreneurs.
Design 3 sensible packaging tiers to prevent the founder from undercharging or trading time for pennies.
Respond with valid JSON array of 3 objects, each with:
- "name": (Short name e.g. 'Quick Fix / Starter', 'Standard Monthly / Core', 'White-Glove / VIP')
- "price": (Recommended dollar amount as a number e.g. 39)
- "billing": (e.g. 'one-time', 'per month', 'per project')
- "deliverables": (Concise 2-bullet summary of what the customer actually receives)
- "targetBuyer": (Who buys this tier and why)
- "mathHint": (Short note: how many of this tier per month replaces their $${monthlyGoal} goal)
Do not output markdown code blocks.`;

  const prompt = `Project: ${ideaName || "Micro Service"}
Problem: ${problem || "Everyday headache"}
Current Baseline Price Idea: $${targetPrice}
Founder's Monthly Income Goal: $${monthlyGoal}

Suggest 3 smart, practical packaging tiers.`;

  const raw = await callAi({ prompt, systemPrompt, jsonMode: true, temperature: 0.6, config: activeConfig });
  try {
    return JSON.parse(raw);
  } catch {
    const p = Number(targetPrice) || 50;
    return [
      {
        name: "Starter / Audit",
        price: Math.round(p * 0.5),
        billing: "one-time",
        deliverables: "Quick 30-minute diagnosis + action checklist",
        targetBuyer: "Hesitant first-time customers who want a low-risk taste",
        mathHint: `${Math.ceil(monthlyGoal / (p * 0.5))} clients/mo to hit goal`
      },
      {
        name: "Standard Core Solution",
        price: p,
        billing: "per month",
        deliverables: "Full problem solved + ongoing monthly support",
        targetBuyer: "Your ideal regular customers (the sweet spot)",
        mathHint: `${Math.ceil(monthlyGoal / p)} clients/mo to hit goal`
      },
      {
        name: "Done-For-You VIP",
        price: Math.round(p * 2.5),
        billing: "per month",
        deliverables: "100% white-glove setup + zero effort on customer's part",
        targetBuyer: "Busy professionals who value time over money",
        mathHint: `Just ${Math.ceil(monthlyGoal / (p * 2.5))} clients/mo to hit goal`
      }
    ];
  }
}

/**
 * 4. Local Community Noticeboard Flyer Polish
 */
export async function polishFlyerHooks({ ideaName, problem, solution, audience, config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  const systemPrompt = `You write high-converting, warm, friendly flyers for neighborhood bulletin boards, community library noticeboards, local coffee shop corkboards, and Nextdoor / Facebook groups.
Avoid Silicon Valley jargon. Write like a helpful, trustworthy neighbor.
Respond with valid JSON with keys:
- "headline": (Catchy, human headline e.g. "Tired of spending weekends fixing your lawn?")
- "subheadline": (1 sentence clear explanation of the neighborhood service)
- "bullets": (Array of 3 punchy benefit bullet points starting with a checkmark or emoji)
- "callToAction": (Low-pressure, high-curiosity invitation e.g. "Text or call neighbor [Name] at [Phone] for a free 10-minute estimate")
Do not output markdown code blocks.`;

  const prompt = `Idea Name: ${ideaName || "Local Problem Solver"}
Target Audience: ${audience || "Local residents"}
Problem Faced: ${problem || "A common daily annoyance"}
Proposed Solution: ${solution || "A fast, friendly local service"}

Generate friendly, community-oriented flyer copy.`;

  const raw = await callAi({ prompt, systemPrompt, jsonMode: true, temperature: 0.7, config: activeConfig });
  try {
    return JSON.parse(raw);
  } catch {
    return {
      headline: `Tired of dealing with ${problem ? problem.slice(0, 35) : "this everyday headache"}?`,
      subheadline: `A friendly, local neighbor offering dependable help so you get your free time back.`,
      bullets: [
        "✓ Zero complicated contracts or hidden fees",
        "✓ Reliable, personal service right here in the neighborhood",
        "✓ 100% satisfaction guaranteed before you pay a dime"
      ],
      callToAction: "Text or call for a free 5-minute chat to see if we can help!"
    };
  }
}

/**
 * 5. Micro-Action Simplifier ("Make it even simpler")
 */
export async function simplifyMission({ missionTitle, missionDesc, projectContext = "", config }) {
  const activeConfig = config || (typeof store !== "undefined" && store?.getAiConfig ? store.getAiConfig() : null);
  const systemPrompt = `You are a compassionate anti-procrastination coach for anxious solo entrepreneurs.
Your job is to reduce any business task to a ridiculously small 3-to-5 minute baby step that requires ZERO courage, ZERO money, and CANNOT BE FAILED.
Respond with valid JSON with keys:
- "babyStepTitle": (A comforting 4-8 word title e.g. "Just write down 2 names on paper")
- "babyStepAction": (Exactly 2 sentences: step 1 and step 2 of what to physically do right now without leaving their desk)
- "whyItWorks": (1 sentence explaining why this micro-win breaks inertia)
Do not output markdown code blocks.`;

  const prompt = `Current Mission: ${missionTitle}
Description: ${missionDesc}
Project: ${projectContext || "Micro startup"}

Make this mission ridiculously simple so the founder can finish in 4 minutes today.`;

  const raw = await callAi({ prompt, systemPrompt, jsonMode: true, temperature: 0.6, config: activeConfig });
  try {
    return JSON.parse(raw);
  } catch {
    return {
      babyStepTitle: "Just jot down 2 names on paper",
      babyStepAction: "Don't contact anyone yet. Grab an index card or open your notes app and write down 2 people you know who might experience this problem. Once written, your mission for today is 100% done!",
      whyItWorks: "Action creates clarity before motivation arrives; finishing one tiny step unlocks immediate momentum."
    };
  }
}

