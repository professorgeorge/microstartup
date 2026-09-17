// realityCheck.js: Step 1: Get Clear on the Problem.
// Streamlined with contextual helper prompts on the input side and a focused output panel.

import { store } from "../store.js";
import { GOLDMINE_ZONES } from "../data/ideaSparks.js";
import { callAi } from "../services/aiClient.js";

let isGoldminesOpen = false;
let activeZoneId = "hate_doing_it";
let aiRefining = false;
let aiStage1Suggestions = null;

const FLUFF_WORDS = [
  "synergy", "disrupt", "revolutionary", "empower", "all-in-one", 
  "game-changer", "next-gen", "paradigm", "ecosystem", "seamlessly",
  "frictionless", "transformative", "holistic", "cutting-edge", "unleash"
];

export function renderStage1(container) {
  const s1 = store.state.stage1;

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Step 1: Get Clear on the Pain</div>
      <h2 class="stage-title">The Plain-English Idea Check</h2>
      <p class="stage-subtitle">
        Before you spend time or money building anything, define the exact human being in pain, 
        their current manual workaround, and what that headache costs them.
      </p>
    </div>

    <!-- Example Template Picker -->
    <div class="card card-oat mb-4 flex-between">
      <div>
        <strong>Explore Real Pre-Tested Examples:</strong> Choose a domain to see how validation works:
      </div>
      <div class="btn-row" style="flex-wrap: wrap; gap: 6px;">
        <button class="btn btn-secondary text-xs btn-load-tmpl" data-template="plumber" title="Local Trade & Service Business">
          🔧 Solo Plumber (Trade)
        </button>
        <button class="btn btn-secondary text-xs btn-load-tmpl" data-template="baker" title="Cottage Food & Solo Maker">
          🎂 Home Baker (Maker)
        </button>
        <button class="btn btn-secondary text-xs btn-load-tmpl" data-template="civic" title="Civic & Community Service Innovation">
          🤝 Community ToolShare (Civic)
        </button>
        <button class="btn btn-secondary text-xs btn-load-tmpl" data-template="tech" title="Freelancer Software & Micro-Tech">
          💻 Freelance Assistant (Tech)
        </button>
      </div>
    </div>

    <!-- Idea Spark & Everyday Goldmine Finder -->
    <div class="card card-highlight mb-4" id="goldmine-finder-card">
      <div class="flex-between">
        <div>
          <span class="badge badge-accent mb-1">Inspiration Assistant</span>
          <h3 class="panel-heading m-0">💡 Stuck for an Idea? Explore the 4 Everyday Goldmines</h3>
          <p class="text-xs text-muted mt-1 mb-0">
            Great micro-startups don't require high tech. Pick an everyday zone below to explore pre-tested starting seeds:
          </p>
        </div>
        <button id="btn-toggle-goldmines" class="btn btn-secondary text-xs">
          ${isGoldminesOpen ? "▲ Hide Sparks" : "▼ Explore 12 Starter Sparks"}
        </button>
      </div>

      ${isGoldminesOpen ? `
        <div class="goldmine-drawer mt-3 pt-3 border-top-warm">
          <div class="script-tabs-header mb-3">
            ${GOLDMINE_ZONES.map(z => `
              <button class="tab-btn script-tab-btn ${activeZoneId === z.id ? "active" : ""}" data-zone="${z.id}">
                ${z.icon} ${z.title}
              </button>
            `).join("")}
          </div>

          ${(() => {
            const currentZone = GOLDMINE_ZONES.find(z => z.id === activeZoneId) || GOLDMINE_ZONES[0];
            return `
              <p class="text-xs text-muted mb-3 font-italic">${currentZone.subtitle}</p>
              <div class="sparks-grid">
                ${currentZone.sparks.map(sp => `
                  <div class="spark-card p-3 rounded bg-white-soft border-warm mb-2 flex-between">
                    <div style="flex: 1; padding-right: 14px;">
                      <strong class="text-espresso text-sm">${sp.title}</strong>
                      <p class="text-xs text-muted m-0 mt-1">${sp.tagline}</p>
                      <div class="text-xs mt-1 text-charcoal">
                        <span class="badge badge-neutral text-xs">For:</span> ${sp.targetAudience}
                      </div>
                    </div>
                    <div>
                      <button class="btn btn-primary text-xs btn-use-spark" 
                        data-spark='${escapeHtml(JSON.stringify(sp))}'
                        title="Auto-fill this spark into Step 1">
                        ⚡ Use This Spark
                      </button>
                    </div>
                  </div>
                `).join("")}
              </div>
            `;
          })()}
        </div>
      ` : ""}
    </div>

    <div class="grid-2-col">
      <!-- Input Panel -->
      <div class="panel">
        <div class="flex-between mb-2">
          <h3 class="panel-heading m-0">1. Describe the Problem</h3>
          <span class="badge badge-warning text-xs">Rule: No Solutions Yet</span>
        </div>
        <p class="text-xs text-muted mb-3">
          Focus strictly on the customer's current reality. Do not describe your app, website, or product here.
        </p>
        
        <div class="form-group">
          <label for="s1-raw-idea">What is your idea in your own words?</label>
          <textarea id="s1-raw-idea" rows="3" placeholder="e.g. I want to help solo plumbers so they do not miss emergency calls while working under a sink...">${s1.rawIdea || ""}</textarea>
          <div id="fluff-feedback" class="fluff-warning text-xs mt-1"></div>
        </div>

        <div class="form-group">
          <label for="s1-target-audience">Who specifically deals with this headache?</label>
          <input type="text" id="s1-target-audience" placeholder="e.g. Solo residential plumbers who drive their own truck" value="${s1.targetAudience || ""}">
          <span class="field-hint">Pick one exact type of person you can clearly picture.</span>
        </div>

        <div class="form-group">
          <label for="s1-workaround">What clumsy way do they deal with it right now?</label>
          <textarea id="s1-workaround" rows="2" placeholder="e.g. Scribbling phone numbers on paper napkins while driving, or missing calls under the sink">${s1.currentWorkaround || ""}</textarea>
          <span class="field-hint">If they are not already trying to cope with sticky notes, phone calls, or spreadsheets, the pain might be too weak.</span>
        </div>

        <div class="form-group">
          <label for="s1-cost">What does this headache actually cost them?</label>
          <input type="text" id="s1-cost" placeholder="e.g. Losing 3 weekend jobs worth $1,800 every month" value="${s1.tangibleCost || ""}">
          <span class="field-hint">Lost money, wasted hours each week, or intense stress.</span>
        </div>

        <!-- Contextual Inspiration Helper -->
        <div class="p-3 bg-oat rounded text-xs mb-3">
          <strong class="text-espresso">Stuck for answers? Ask yourself:</strong>
          <ul class="step-list text-xs mt-1 mb-0">
            <li>What task in your week do you dread doing most?</li>
            <li>What do neighbors or clients always ask you to help with?</li>
            <li>What local service always feels disorganized or slow to respond?</li>
          </ul>
        </div>

        <div class="btn-row mt-3 flex-column gap-2">
          <button id="btn-synthesize-hypothesis" class="btn btn-primary w-100">
            Create My Problem Statement (Formula)
          </button>
          <button id="btn-ai-refine-stage1" class="btn btn-secondary w-100 flex-center gap-2" ${aiRefining ? "disabled" : ""} style="border-color: var(--color-amber);">
            <span>${aiRefining ? "⏳" : "✨"}</span>
            <strong>${aiRefining ? "AI is Polishing Statements..." : "AI Jargon Slayer & Premise Refiner"}</strong>
          </button>
        </div>

        ${aiStage1Suggestions ? `
          <div class="card card-highlight p-3 border-warm mt-3 animate-fade-in" id="ai-stage1-suggestions-box">
            <div class="flex-between mb-2">
              <strong class="text-terracotta text-xs font-bold">✨ AI Refined Problem Statements:</strong>
              <button class="btn-icon text-xs" id="btn-dismiss-ai-stage1" title="Dismiss">✕</button>
            </div>
            
            <div class="mb-3">
              <span class="text-xs text-muted font-bold d-block mb-1">Problem Hypotheses (Choose to apply):</span>
              ${(aiStage1Suggestions.hypotheses || []).map((h, idx) => `
                <div class="p-2 mb-2 bg-white-soft rounded border-warm flex-between gap-2">
                  <span class="text-xs text-espresso" style="flex: 1;">"${escapeHtml(h)}"</span>
                  <button class="btn btn-primary text-xs btn-apply-ai-hyp" data-index="${idx}" style="white-space: nowrap;">
                    Use This →
                  </button>
                </div>
              `).join("")}
            </div>

            <div>
              <span class="text-xs text-muted font-bold d-block mb-1">Elevator Premises (Choose to apply):</span>
              ${(aiStage1Suggestions.elevatorPremises || []).map((p, idx) => `
                <div class="p-2 mb-2 bg-white-soft rounded border-warm flex-between gap-2">
                  <span class="text-xs text-espresso" style="flex: 1;">"${escapeHtml(p)}"</span>
                  <button class="btn btn-secondary text-xs btn-apply-ai-premise" data-index="${idx}" style="white-space: nowrap;">
                    Use This →
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>

      <!-- Focused Output Panel -->
      <div class="panel panel-highlight">
        <h3 class="panel-heading">2. Your Clear Problem Summary</h3>
        
        <div class="output-box mb-3">
          <div class="output-label">Your Core Problem Statement:</div>
          <p id="display-hypothesis" class="output-text">
            ${s1.problemHypothesis || "Fill in the fields on the left and click 'Create My Problem Statement' to generate your clear statement."}
          </p>
        </div>

        <div class="output-box mb-4">
          <div class="output-label">Your Quick 10-Second Explanation:</div>
          <p id="display-elevator" class="output-text">
            ${s1.elevatorPremise || "Your quick 10-second explanation will appear here."}
          </p>
        </div>

        <div class="gate-status-card ${s1.isCompleted ? "gate-open" : "gate-locked"} mb-4">
          <div class="gate-icon">${s1.isCompleted ? "✓" : "🔒"}</div>
          <div class="gate-info">
            <strong>Step 1 Status: ${s1.isCompleted ? "Ready to Move Forward" : "Waiting for Problem Summary"}</strong>
            <p class="text-xs text-muted mb-0">
              ${s1.isCompleted 
                ? "Your problem summary is ready. Step 2 (Talk to Real People) is now unlocked!" 
                : "Complete your problem summary above to unlock Step 2."}
            </p>
          </div>
        </div>

        ${s1.isCompleted ? `
          <div class="text-right">
            <button id="btn-proceed-stage-2" class="btn btn-primary w-100">
              Next: Step 2 (Talk to Real People) →
            </button>
          </div>
        ` : ""}
      </div>
    </div>
  `;

  attachStage1Events(container);
}

function attachStage1Events(container) {
  const rawIdeaInput = container.querySelector("#s1-raw-idea");
  const audienceInput = container.querySelector("#s1-target-audience");
  const workaroundInput = container.querySelector("#s1-workaround");
  const costInput = container.querySelector("#s1-cost");
  const fluffFeedback = container.querySelector("#fluff-feedback");
  const synthBtn = container.querySelector("#btn-synthesize-hypothesis");
  const proceedBtn = container.querySelector("#btn-proceed-stage-2");

  rawIdeaInput?.addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase();
    const foundFluff = FLUFF_WORDS.filter(w => text.includes(w));
    if (foundFluff.length > 0) {
      fluffFeedback.innerHTML = `⚠️ Jargon alert: Words like <strong>${foundFluff.join(", ")}</strong> sound fancy, but keep it simple so anyone understands.`;
    } else {
      fluffFeedback.innerHTML = "";
    }
  });

  synthBtn?.addEventListener("click", () => {
    const raw = rawIdeaInput.value.trim();
    const audience = audienceInput.value.trim() || "specific target people";
    const workaround = workaroundInput.value.trim() || "clumsy manual workarounds";
    const cost = costInput.value.trim() || "lost time and money";

    if (!raw && !audienceInput.value) {
      alert("Please enter a short description of your idea and who it is for.");
      return;
    }

    const hypothesis = `${audience} deal with real frustration because having to ${workaround} leads to ${cost}.`;
    const elevator = `For ${audience} who are tired of having to ${workaround}, our aim is to help reduce ${cost} by addressing the root problem directly.`;

    store.state.stage1.rawIdea = raw;
    store.state.stage1.targetAudience = audience;
    store.state.stage1.currentWorkaround = workaround;
    store.state.stage1.tangibleCost = cost;
    store.state.stage1.problemHypothesis = hypothesis;
    store.state.stage1.elevatorPremise = elevator;
    store.state.stage1.isCompleted = true;

    store.saveState();
    renderStage1(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
  });

  // AI Refine Button Click
  const aiRefineBtn = container.querySelector("#btn-ai-refine-stage1");
  aiRefineBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    const raw = rawIdeaInput.value.trim();
    const audience = audienceInput.value.trim();
    const workaround = workaroundInput.value.trim();
    const cost = costInput.value.trim();

    if (!raw && !audience) {
      alert("Please enter at least a rough idea and target audience first so the AI has context.");
      return;
    }

    aiRefining = true;
    renderStage1(container);

    const prompt = `Based on these founder notes:
- Raw Idea: ${raw || "Everyday service"}
- Target Audience: ${audience || "Local residents or tradespeople"}
- Current Clumsy Workaround: ${workaround || "Manual notes and messy phone calls"}
- Tangible Cost: ${cost || "Lost time, wasted money, high stress"}

Task: Generate 2 crisp, plain-English Problem Hypotheses (no corporate jargon) and 2 Elevator Premises.
Format:
Problem Hypothesis: "[Audience] deal with [friction] because having to [workaround] leads to [cost]."
Elevator Premise: "For [audience] who struggle with [problem], [Service/Idea Name] is a [simple service] that [core benefit] without [usual headache]."

Respond strictly with valid JSON only in this exact format:
{
  "hypotheses": ["hypothesis 1", "hypothesis 2"],
  "elevatorPremises": ["premise 1", "premise 2"]
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are a pragmatic startup advisor helping everyday non-technical founders.",
        temperature: 0.7,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      aiStage1Suggestions = parsed;
    } catch (err) {
      alert(`AI refinement error: ${err.message || String(err)}`);
    } finally {
      aiRefining = false;
      renderStage1(container);
    }
  });

  // Dismiss AI suggestions
  container.querySelector("#btn-dismiss-ai-stage1")?.addEventListener("click", () => {
    aiStage1Suggestions = null;
    renderStage1(container);
  });

  // Apply chosen AI hypothesis
  container.querySelectorAll(".btn-apply-ai-hyp").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      if (aiStage1Suggestions?.hypotheses?.[idx]) {
        store.state.stage1.problemHypothesis = aiStage1Suggestions.hypotheses[idx];
        store.state.stage1.isCompleted = true;
        store.saveState();
        renderStage1(container);
        window.dispatchEvent(new CustomEvent("app:state-updated"));
      }
    });
  });

  // Apply chosen AI premise
  container.querySelectorAll(".btn-apply-ai-premise").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      if (aiStage1Suggestions?.elevatorPremises?.[idx]) {
        store.state.stage1.elevatorPremise = aiStage1Suggestions.elevatorPremises[idx];
        store.saveState();
        renderStage1(container);
        window.dispatchEvent(new CustomEvent("app:state-updated"));
      }
    });
  });

  container.querySelectorAll(".btn-load-tmpl").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tmplKey = e.currentTarget.getAttribute("data-template");
      store.loadTemplate(tmplKey);
      renderStage1(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    });
  });

  proceedBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 2 } }));
  });

  // Goldmine events
  const toggleGoldminesBtn = container.querySelector("#btn-toggle-goldmines");
  toggleGoldminesBtn?.addEventListener("click", () => {
    isGoldminesOpen = !isGoldminesOpen;
    renderStage1(container);
  });

  container.querySelectorAll(".script-tab-btn[data-zone]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeZoneId = e.currentTarget.getAttribute("data-zone");
      renderStage1(container);
    });
  });

  container.querySelectorAll(".btn-use-spark").forEach(btn => {
    btn.addEventListener("click", (e) => {
      try {
        const raw = e.currentTarget.getAttribute("data-spark");
        const spark = JSON.parse(raw);
        
        store.state.name = spark.title;
        store.state.stage1.rawIdea = spark.rawIdea;
        store.state.stage1.targetAudience = spark.targetAudience;
        store.state.stage1.currentWorkaround = spark.currentWorkaround;
        store.state.stage1.tangibleCost = spark.tangibleCost;

        const hypothesis = `${spark.targetAudience} deal with real frustration because having to ${spark.currentWorkaround} leads to ${spark.tangibleCost}.`;
        const elevator = `For ${spark.targetAudience} who are tired of having to ${spark.currentWorkaround}, our aim is to help reduce ${spark.tangibleCost} by addressing the root problem directly.`;

        store.state.stage1.problemHypothesis = hypothesis;
        store.state.stage1.elevatorPremise = elevator;
        store.state.stage1.isCompleted = true;

        isGoldminesOpen = false;
        store.saveState();
        renderStage1(container);
        window.dispatchEvent(new CustomEvent("app:state-updated"));
        alert(`Starting spark loaded: "${spark.title}"! Your problem statement is ready.`);
      } catch (err) {
        console.error("Failed to load spark:", err);
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
