// helpAndLegalViews.js: Dedicated in-app views for Help & Coach, Legal Disclaimer, Summary & Flyer, and About & Credits.
// Keeps these essential resources permanently accessible as first-class tabs in the main navigation.

import { alchemistScenarios } from "../data/alchemistData.js";
import { INNOVATOR_STORIES } from "../data/innovatorStories.js";
import { store } from "../store.js";
import { renderDossierView } from "./exportDossier.js";
import { coachCustomSetback } from "../services/aiClient.js";

let activeStoryCategory = "all";
let activeHelpSubTab = "guide"; // "guide" | "encourager" | "faq"
let customSetbackResult = null;
let isCoachingSetback = false;
let lastSetbackInputText = "";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderHelpTab(container) {
  let activeScenarioId = store.state.activeAlchemistScenarioId || alchemistScenarios[0].id;
  const currentScenario = alchemistScenarios.find(s => s.id === activeScenarioId) || alchemistScenarios[0];

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Resource Tab: Founder Support & How-To</div>
      <h2 class="stage-title">Help Guide & Navigation Companion</h2>
      <p class="stage-subtitle">
        Simple, plain-language guidance to help you use this app at your own pace without feeling overwhelmed.
      </p>
    </div>

    <!-- Help Guide Sub-Navigation Tabs -->
    <div class="help-subtab-bar mb-4">
      <button class="btn help-subtab-btn ${activeHelpSubTab === 'guide' ? 'btn-primary' : 'btn-secondary'} text-xs" data-subtab="guide">
        📖 How to Use This App (No Overwhelm)
      </button>
      <button class="btn help-subtab-btn ${activeHelpSubTab === 'encourager' ? 'btn-primary' : 'btn-secondary'} text-xs" data-subtab="encourager">
        💡 The Encourager & Setback Fixer
      </button>
      <button class="btn help-subtab-btn ${activeHelpSubTab === 'faq' ? 'btn-primary' : 'btn-secondary'} text-xs" data-subtab="faq">
        ❓ Frequently Asked Questions (FAQ)
      </button>
    </div>

    <!-- Active Subtab Content Container -->
    <div id="help-subtab-content">
      ${activeHelpSubTab === 'guide' ? renderAppGuideView() : ''}
      ${activeHelpSubTab === 'encourager' ? renderEncouragerView(activeScenarioId, currentScenario) : ''}
      ${activeHelpSubTab === 'faq' ? renderFaqView() : ''}
    </div>
  `;

  // Attach Subtab Switching Handlers
  container.querySelectorAll(".help-subtab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeHelpSubTab = e.currentTarget.getAttribute("data-subtab");
      renderHelpTab(container);
    });
  });

  // Attach Guide Actions
  if (activeHelpSubTab === 'guide') {
    container.querySelector("#btn-help-go-missions")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:open-missions"));
    });

    container.querySelector("#btn-help-go-step1")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:navigate-tab", { detail: { tab: 1 } }));
    });

    container.querySelector("#btn-help-go-stories")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:navigate-tab", { detail: { tab: "stories" } }));
    });

    container.querySelector("#btn-help-go-simulator")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:open-simulator"));
    });

    container.querySelector("#btn-help-go-encourager")?.addEventListener("click", () => {
      activeHelpSubTab = "encourager";
      renderHelpTab(container);
    });
  }

  // Attach Encourager Handlers
  if (activeHelpSubTab === 'encourager') {
    container.querySelectorAll("#help-tab-scenarios .scenario-item-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        store.state.activeAlchemistScenarioId = id;
        store.saveState();
        renderHelpTab(container);
      });
    });

    const copyBtn = container.querySelector("#btn-copy-tab-script");
    copyBtn?.addEventListener("click", () => {
      navigator.clipboard.writeText(currentScenario.actionPrompt).then(() => {
        copyBtn.textContent = "✓ Copied Script!";
        setTimeout(() => { copyBtn.textContent = "📋 Copy Script"; }, 2000);
      });
    });

    // Custom Setback AI Coach Handlers
    const setbackInput = container.querySelector("#input-custom-setback");
    const askSetbackBtn = container.querySelector("#btn-ask-custom-setback");
    const clearSetbackBtn = container.querySelector("#btn-clear-custom-setback");
    const copyCustomScriptBtn = container.querySelector("#btn-copy-custom-setback-script");

    clearSetbackBtn?.addEventListener("click", () => {
      customSetbackResult = null;
      renderHelpTab(container);
    });

    copyCustomScriptBtn?.addEventListener("click", () => {
      if (customSetbackResult?.script) {
        navigator.clipboard.writeText(customSetbackResult.script).then(() => {
          copyCustomScriptBtn.textContent = "✓ Copied!";
          setTimeout(() => { copyCustomScriptBtn.textContent = "📋 Copy Script"; }, 2000);
        });
      }
    });

    askSetbackBtn?.addEventListener("click", async () => {
      const situation = setbackInput ? setbackInput.value.trim() : lastSetbackInputText;
      if (!situation) {
        alert("Please type what happened or what the person said first.");
        return;
      }
      lastSetbackInputText = situation;

      if (!store.isAiConfigured()) {
        const wantsAi = confirm(
          "✨ AI Co-Pilot is not configured yet.\n\nWould you like to connect an AI provider (OpenAI, Gemini, Claude, Grok, or local Ollama) for a tailored diagnosis?\n\n(Click Cancel to see our grounded standard Encourager advice immediately)."
        );
        if (wantsAi) {
          window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
          return;
        }
        // Offline graceful diagnosis
        customSetbackResult = {
          diagnosis: "When someone says 'no' or acts uninterested, it usually means they don't experience this headache frequently enough, or they felt they were being pitched a product.",
          reframe: "This is a great outcome! Learning this in 5 minutes costs $0 and prevents you from building something that won't sell.",
          script: "Thanks so much for being honest! Quick question: how do you currently handle this in your daily routine right now?"
        };
        renderHelpTab(container);
        return;
      }

      isCoachingSetback = true;
      renderHelpTab(container);

      try {
        const res = await coachCustomSetback({
          situation,
          projectContext: `${store.state.name} (${store.state.stage1?.problemHypothesis || ""})`,
          config: store.getAiConfig()
        });
        customSetbackResult = res;
      } catch (err) {
        alert("Could not analyze situation: " + (err.message || String(err)));
      } finally {
        isCoachingSetback = false;
        renderHelpTab(container);
      }
    });
  }
}

// -------------------------------------------------------------
// Subview 1: How to Use This App (No Overwhelm Guide)
// -------------------------------------------------------------
function renderAppGuideView() {
  return `
    <!-- Calming Reassurance Banner -->
    <div class="card p-4 mb-4 bg-oat border-warm">
      <div class="flex items-center gap-2 mb-2">
        <span style="font-size: 26px;">🌿</span>
        <h3 class="m-0 text-espresso">Take a breath — you do not have to do everything today.</h3>
      </div>
      <p class="text-sm text-charcoal mb-2">
        This app has a lot of tools because different innovators need different things at different times. 
        <strong>You do not need to fill out every box</strong>, and you definitely do not need to rush.
      </p>
      <p class="text-xs text-muted mb-0">
        Think of this as your private digital notebook. There are no tests, no grades, and no outside investors watching. 
        <strong>Just 15 minutes of steady curiosity a day</strong> is all it takes to test an idea carefully and avoid wasting your money.
      </p>
    </div>

    <!-- Section 1: Choose Your Starting Path -->
    <div class="mb-4">
      <div class="flex-between mb-2">
        <h4 class="text-espresso m-0">🧭 Where Should You Start? (Choose Your Path)</h4>
        <span class="text-xs text-muted">Pick the card that fits you right now</span>
      </div>

      <div class="grid-2-col gap-3">
        <!-- Path 1 -->
        <div class="help-path-card">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-accent text-xs">Path 1</span>
              <strong class="text-espresso">"I only have 15 minutes today"</strong>
            </div>
            <p class="text-xs text-muted mb-3">
              Click <strong>⚡ Missions</strong> in the top header or click the button below. 
              Complete just today's single micro-task and call it a win!
            </p>
          </div>
          <button id="btn-help-go-missions" class="btn btn-secondary text-xs w-100">
            ⚡ Open 15-Minute Daily Missions
          </button>
        </div>

        <!-- Path 2 -->
        <div class="help-path-card">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-success text-xs">Path 2</span>
              <strong class="text-espresso">"I have a new idea I want to test"</strong>
            </div>
            <p class="text-xs text-muted mb-3">
              Start in <strong>Step 1: Clarify Problem</strong>. Follow the 5 steps in order (1 through 5) 
              to turn a vague hunch into real customer proof without risking money.
            </p>
          </div>
          <button id="btn-help-go-step1" class="btn btn-primary text-xs w-100">
            🚀 Go to Step 1 (Clarify Problem)
          </button>
        </div>

        <!-- Path 3 -->
        <div class="help-path-card">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-warning text-xs">Path 3</span>
              <strong class="text-espresso">"I want to start, but I need an idea"</strong>
            </div>
            <p class="text-xs text-muted mb-3">
              Check the <strong>Everyday Goldmines</strong> in Step 1 (chores people hate, slow contractors), 
              or browse real micro-founders who started with under $100.
            </p>
          </div>
          <button id="btn-help-go-stories" class="btn btn-secondary text-xs w-100">
            🌟 Browse Real Founder Stories
          </button>
        </div>

        <!-- Path 4 -->
        <div class="help-path-card">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-accent text-xs">Path 4</span>
              <strong class="text-espresso">"I feel nervous talking to people"</strong>
            </div>
            <p class="text-xs text-muted mb-3">
              Rehearse in the <strong>Customer Discovery Simulator</strong> in Step 2. 
              Practice with realistic simulated characters in private with zero awkwardness and instant coaching!
            </p>
          </div>
          <button id="btn-help-go-simulator" class="btn btn-secondary text-xs w-100">
            🎮 Rehearse in Customer Simulator
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: The 5 Steps in Everyday English -->
    <div class="card p-4 mb-4">
      <h4 class="text-espresso mb-1">🗺️ The 5 Steps Explained in Plain English</h4>
      <p class="text-xs text-muted mb-3">
        Here is what you actually do in each step, stripped of Silicon Valley buzzwords:
      </p>

      <div class="flex flex-col gap-3">
        <div class="help-step-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta">Step 1: Clarify the Problem</strong>
            <span class="badge badge-sand text-xs">The Foundation</span>
          </div>
          <p class="text-xs text-charcoal mb-1">
            <strong>What you do:</strong> Clearly state what everyday headache, chore, or expense your customer suffers from. 
            If an 8th grader can't understand it, rewrite it until it's simple.
          </p>
          <div class="text-xs text-muted">
            <em>💡 Tip: Avoid building a product until you can explain the customer's actual pain in one sentence.</em>
          </div>
        </div>

        <div class="help-step-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta">Step 2: Talk to Real People</strong>
            <span class="badge badge-sand text-xs">Customer Discovery</span>
          </div>
          <p class="text-xs text-charcoal mb-1">
            <strong>What you do:</strong> Have 3 to 5 friendly 10-minute chats with people who experience that headache. 
            Ask about how they handle it today. <strong>Do NOT try to sell them anything!</strong>
          </p>
          <div class="text-xs text-muted">
            <em>💡 Tip: Use the built-in 1-Click Outreach Scripts so you know exactly what to text or say.</em>
          </div>
        </div>

        <div class="help-step-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta">Step 3: One-Page Plan & Napkin Math</strong>
            <span class="badge badge-sand text-xs">The Business Model</span>
          </div>
          <p class="text-xs text-charcoal mb-1">
            <strong>What you do:</strong> Summarize your entire concept on a single sheet. Use the Pocket Napkin Math 
            calculator to see the exact number of daily or weekly customers you need to replace your income.
          </p>
          <div class="text-xs text-muted">
            <em>💡 Tip: Instead of scary 5-year spreadsheets, you learn simple targets like "I just need 2 clients a week".</em>
          </div>
        </div>

        <div class="help-step-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta">Step 4: Quick Free Tests ($0 to $50)</strong>
            <span class="badge badge-sand text-xs">Pre-Build Proof</span>
          </div>
          <p class="text-xs text-charcoal mb-1">
            <strong>What you do:</strong> Run a zero-dollar manual experiment (a paper flyer, pre-order list, or curbside demo) 
            to see if someone will give you their contact info or a tiny deposit.
          </p>
          <div class="text-xs text-muted">
            <em>💡 Tip: If nobody wants it when it's free or manual, building software or buying inventory won't fix it.</em>
          </div>
        </div>

        <div class="help-step-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta">Step 5: Next Steps & Starter Grants</strong>
            <span class="badge badge-sand text-xs">Launch & Funding</span>
          </div>
          <p class="text-xs text-charcoal mb-1">
            <strong>What you do:</strong> Outline a calm 30-day starter budget under $500, calculate how quickly you break even, 
            and browse free non-dilutive local grants (grants that don't take your equity).
          </p>
          <div class="text-xs text-muted">
            <em>💡 Tip: You can bootstrap a sustainable micro-business without owing anyone a dime.</em>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Superpowers at a Glance -->
    <div class="mb-4">
      <h4 class="text-espresso mb-2">⚡ Special Helpers Built Right Into This App</h4>
      <div class="grid-2-col gap-3">
        <div class="help-tool-card">
          <strong class="text-espresso">⚡ 15-Minute Daily Missions</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            Located in the top header (or via Path 1). Breaks the journey into 10 bite-sized missions so you always know your single next step.
          </p>
        </div>
        <div class="help-tool-card">
          <strong class="text-espresso">🎮 Customer Discovery Simulator</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            In Step 2. Practice conversations with simulated customers (voice synthesis included!) to build real confidence.
          </p>
        </div>
        <div class="help-tool-card">
          <strong class="text-espresso">🧮 Pocket Napkin Math</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            In Step 3 and Step 5. Translates big revenue targets into manageable daily customer goals and calculates break-even velocity.
          </p>
        </div>
        <div class="help-tool-card">
          <strong class="text-espresso">💬 1-Click Outreach Scripts</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            In Step 2. Ready-to-use WhatsApp, SMS, and in-person openers that get honest feedback without feeling "salesy".
          </p>
        </div>
        <div class="help-tool-card">
          <strong class="text-espresso">✨ AI Co-Pilot (Completely Optional)</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            Connect your own key (Gemini, OpenAI, Claude, Grok, or local Ollama) if you want extra brainstorming. The app works fully without it!
          </p>
        </div>
        <div class="help-tool-card">
          <strong class="text-espresso">📄 Summary & Community Flyer</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            In the top menu. Formats your workbook into a clean 1-page summary or a printable flyer to hang on neighborhood boards.
          </p>
        </div>
      </div>
    </div>

    <!-- Section 4: 4 Rules for Peace of Mind -->
    <div class="card p-4 bg-sand-light border-warm">
      <h4 class="text-terracotta mb-2">🌿 4 Rules for Complete Peace of Mind</h4>
      <div class="text-xs text-charcoal flex flex-col gap-2">
        <div>
          <strong>1. Consistency beats speed:</strong> Doing one 15-minute mission three days a week will beat a 50-page business plan every time.
        </div>
        <div>
          <strong>2. Stored locally on your device:</strong> Your notes stay in your browser's local storage rather than being sent to a central app server or database.
        </div>
        <div>
          <strong>3. Keep your wallet in your pocket:</strong> Never spend money on inventory, software, or fancy logos until 3 real people say "take my money".
        </div>
        <div>
          <strong>4. A "No" is a victory, not a failure:</strong> Finding out early that people won't pay for an idea saves you months of stress and thousands of dollars!
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Subview 2: The Encourager & Setback Fixer (Setback Alchemist)
// -------------------------------------------------------------
function renderEncouragerView(activeScenarioId, currentScenario) {
  return `
    <div class="card p-4 mb-4">
      <div class="flex-between mb-2">
        <div>
          <h3 class="m-0 text-espresso">💡 The Encourager & Setback Fixer</h3>
          <p class="text-xs text-muted mt-1 mb-0">
            Every founder encounters awkward moments, friends who give polite lies, and people who ghost. 
            Select any situation below to get an honest diagnosis and an exact script to say or send.
          </p>
        </div>
      </div>

      <!-- Interactive Custom Setback Coach (AI Powered) -->
      <div class="card p-3 my-3 bg-white-soft border-warm">
        <div class="flex-between mb-1">
          <div class="flex items-center gap-2">
            <span style="font-size: 1.2rem;" aria-hidden="true">✨</span>
            <strong class="text-espresso text-xs">Facing a Specific Awkward Moment or Rejection?</strong>
          </div>
          <span class="badge badge-accent text-xs">Custom Setback Coach</span>
        </div>
        <p class="text-xs text-muted mb-2">
          Did someone ghost you, laugh at your price, or say something confusing? Type what happened below to get an honest diagnosis and an exact reply script.
        </p>
        <div class="flex gap-2">
          <input type="text" id="input-custom-setback" class="w-100 text-xs p-2 rounded border-warm" placeholder="e.g. A local business owner told me they already do this themselves on paper..." value="${escapeHtml(lastSetbackInputText)}">
          <button id="btn-ask-custom-setback" class="btn btn-primary text-xs" style="white-space: nowrap;">
            ${isCoachingSetback ? "⏳ Diagnosing..." : "✨ Coach Me"}
          </button>
        </div>

        ${customSetbackResult ? `
          <div class="custom-setback-result mt-3 p-3 bg-sand-light rounded border-warm">
            <div class="flex-between mb-2">
              <strong class="text-terracotta text-xs">🌱 Encourager Diagnosis & Exact Reply:</strong>
              <button id="btn-clear-custom-setback" class="btn-link text-xs">✕ Close</button>
            </div>
            <div class="diagnosis-card mb-2 p-2 rounded bg-white-soft border-warm">
              <strong class="text-espresso text-xs">What this actually means:</strong>
              <p class="text-xs text-charcoal mb-0 mt-1">${escapeHtml(customSetbackResult.diagnosis)}</p>
            </div>
            <div class="reframe-card mb-2 p-2 rounded bg-highlight border-warm">
              <strong class="text-terracotta text-xs">Why this is actually good news:</strong>
              <p class="text-xs text-charcoal mb-0 mt-1">${escapeHtml(customSetbackResult.reframe)}</p>
            </div>
            <div class="script-card p-2 rounded bg-white-soft border-warm">
              <div class="flex-between mb-1">
                <strong class="text-espresso text-xs">An exact reply to text or say:</strong>
                <button id="btn-copy-custom-setback-script" class="btn-link text-xs">📋 Copy Script</button>
              </div>
              <p class="text-xs font-italic text-charcoal mb-0 p-2 bg-oat rounded">"${escapeHtml(customSetbackResult.script)}"</p>
            </div>
          </div>
        ` : ""}
      </div>

      <div class="alchemist-modal-layout mt-3">
        <!-- Left Scenario List -->
        <div class="scenario-list-pane" id="help-tab-scenarios">
          ${alchemistScenarios.map(sc => `
            <button class="scenario-item-btn text-left ${sc.id === activeScenarioId ? "active-scenario" : ""}" data-id="${sc.id}">
              <span class="scenario-title">💡 ${sc.title}</span>
              <span class="scenario-snippet text-xs text-muted mt-1">${sc.symptom}</span>
            </button>
          `).join("")}
        </div>

        <!-- Right Detail Card -->
        <div class="scenario-detail-pane" id="help-tab-detail">
          <div class="scenario-detail-header mb-3">
            <span class="badge badge-accent mb-1">Friendly Guidance</span>
            <h3 class="m-0 text-espresso">${currentScenario.title}</h3>
            <p class="text-xs text-muted mt-1">${currentScenario.symptom}</p>
          </div>

          <div class="diagnosis-card mb-3 p-3 rounded bg-highlight border-warm">
            <strong class="text-terracotta">What this actually means:</strong>
            <p class="text-sm mt-1 mb-0">${currentScenario.diagnosis}</p>
          </div>

          <div class="fix-card mb-3 p-3 rounded bg-oat">
            <strong class="text-espresso">How to handle it:</strong>
            <p class="text-sm mt-1 mb-0">${currentScenario.tacticalFix}</p>
          </div>

          <div class="action-card mb-3 p-3 rounded bg-white-soft border-warm">
            <div class="flex-between mb-1">
              <strong class="text-terracotta">A friendly script to say or send:</strong>
              <button id="btn-copy-tab-script" class="btn-link text-xs">📋 Copy Script</button>
            </div>
            <p id="tab-script-text" class="text-sm font-italic mb-0 p-2 bg-oat rounded">
              "${currentScenario.actionPrompt}"
            </p>
          </div>

          <div class="pivot-card p-3 rounded bg-accent-soft">
            <strong class="text-espresso">Where to look next:</strong>
            <p class="text-sm mt-1 mb-0">${currentScenario.pivotDirection}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Subview 3: Frequently Asked Questions (FAQ)
// -------------------------------------------------------------
function renderFaqView() {
  const faqs = [
    {
      q: "Do I have to do all 5 steps in order?",
      a: "Yes, following Steps 1 through 5 is the recommended order because each step builds on the last one. However, you can freely click between tabs at any time to browse or take notes. Your work is automatically saved."
    },
    {
      q: "Do I need an AI key or internet connection to use this app?",
      a: "No. The app is free to use and fully functional offline without an AI key. All templates, questions, calculators, and simulated personas are built right into the app. AI is purely an optional helper for users who want extra synthetic brainstorming ideas."
    },
    {
      q: "Is my business idea safe and private?",
      a: "All your notes, interview answers, and financial numbers are stored locally on your device in your browser's storage (localStorage). This app does not use account logins, tracking analytics, or remote application databases to harvest your entries."
    },
    {
      q: "What if someone tells me my idea won't work?",
      a: "Celebrate! Hearing that early is the greatest gift in business because it costs you zero dollars. You just saved yourself months of work. Check 'The Encourager & Setback Fixer' subtab right here for tactical advice on how to pivot toward a headache people actually will pay to fix."
    },
    {
      q: "Can I use this on my phone or tablet?",
      a: "Yes! Micro-Startup Compass is a Progressive Web App (PWA). In mobile Safari or Chrome, tap the Share or Menu button and select 'Add to Home Screen' to install it on your device like a native app."
    },
    {
      q: "How do I share my progress with a mentor, spouse, or partner?",
      a: "Click on the '📄 Summary & Flyer' tab in the top navigation bar. You can copy your clean notes with one click or click 'Print / Save PDF' to create an executive one-page handout."
    },
    {
      q: "What does 'Reset App' do in the top header?",
      a: "It gives you a single, safe button to clear your workbook notes so you can start a fresh business concept from day one. (Your optional AI API key is safely kept even if you reset your workbook)."
    }
  ];

  return `
    <div class="card p-4 mb-4">
      <div class="mb-3">
        <h3 class="m-0 text-espresso">❓ Frequently Asked Questions</h3>
        <p class="text-xs text-muted mt-1 mb-0">
          Quick, clear answers to common questions about using this guide.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        ${faqs.map(item => `
          <div class="faq-card">
            <div class="faq-question">
              <span>💬</span>
              <span>${item.q}</span>
            </div>
            <p class="faq-answer">
              ${item.a}
            </p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}


export function renderDisclaimerTab(container) {
  container.innerHTML = `
    <div class="stage-header">
      <div class="flex-between mb-2">
        <button class="btn btn-secondary text-xs" id="btn-disclaimer-back">
          ← Return to Step 1
        </button>
        <span class="stage-tag m-0">Legal Compliance & Terms</span>
      </div>
      <h2 class="stage-title">Legal Disclaimer & Terms of Use</h2>
      <p class="stage-subtitle">
        Please review these terms carefully before using this brainstorming guide.
      </p>
    </div>

    <div class="card p-4 mb-4">
      <div class="card card-warning-warm p-3 mb-4">
        <strong class="text-danger">Important Notice & Summary of Terms:</strong>
        <p class="text-xs text-muted mb-0 mt-1">
          This application is provided strictly for educational, informational, and self-guided exploration. You are solely responsible for your own business choices, money, contracts, and legal compliance. The creators, contributors, and Professor Babu George carry zero liability.
        </p>
      </div>

      <div class="legal-sections text-sm text-charcoal">
        <div class="mb-4">
          <h4 class="text-espresso mb-1">1. Educational & Brainstorming Tool Only</h4>
          <p class="text-xs text-muted mb-0">
            This application is designed solely to facilitate self-guided idea exploration. It does not provide legal, financial, accounting, tax, investment, commercial, or regulatory advice. Users must consult qualified licensed professionals in their jurisdiction before entering into contracts, spending capital, or establishing legal entities.
          </p>
        </div>

        <div class="mb-4">
          <h4 class="text-espresso mb-1">2. No Guarantees or Warranties of Commercial Success</h4>
          <p class="text-xs text-muted mb-0">
            No representations, warranties, or guarantees (express or implied) are made regarding the commercial viability, profitability, customer demand, or success of any concept, business model, product, or service evaluated using this tool. All feedback scores, evaluation metrics, and sample templates are exploratory estimates only.
          </p>
        </div>

        <div class="mb-4">
          <h4 class="text-espresso mb-1">3. Third-Party Programs & External Funding</h4>
          <p class="text-xs text-muted mb-0">
            Any references to third-party programs, grants, loans, accelerators, or non-profit entities (including CDFIs, SBA PRIME, or the Amber Grant) are strictly for educational awareness. We do not administer these programs, review applications, endorse submissions, or guarantee eligibility, acceptance, or funding.
          </p>
        </div>

        <div class="mb-4">
          <h4 class="text-espresso mb-1">4. Sole User Liability & Assumption of Risk</h4>
          <p class="text-xs text-muted mb-0">
            The user assumes sole liability, risk, and responsibility for all actions, decisions, communications, financial outlays, partnerships, customer interactions, experiments, and compliance with all applicable local, municipal, state, federal, and international laws, permits, and tax obligations.
          </p>
        </div>

        <div>
          <h4 class="text-espresso mb-1">5. Limitation of Liability & Hold Harmless</h4>
          <p class="text-xs text-muted mb-0">
            To the maximum extent permitted by law, the creators, developers, contributors, and Professor Babu George disclaim all express and implied warranties and shall have zero liability for any direct, indirect, incidental, consequential, special, punitive, or financial damages, losses, or legal disputes resulting from or related to the use of or inability to use this software or any resources linked herein.
          </p>
        </div>
      </div>
    </div>
  `;

  container.querySelector("#btn-disclaimer-back")?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:navigate-tab", { detail: { tab: 1 } }));
  });
}

export function renderAboutTab(container) {
  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">About & Academic Credits</div>
      <h2 class="stage-title">About Micro-Startup Compass</h2>
      <p class="stage-subtitle">
        A practical, stage-gated companion created for individual micro-scale innovators.
      </p>
    </div>

    <div class="card p-4 mb-4">
      <div class="p-3 bg-oat rounded mb-4 border-warm">
        <div class="text-xs text-muted text-uppercase font-bold mb-1">Conceptualization & Leadership</div>
        <h3 class="m-0 text-espresso">
          Conceptualization and Development Credit: 
          <a href="https://www.linkedin.com/in/beingbabu/" target="_blank" rel="noopener noreferrer" class="credit-link">
            <strong>Professor Babu George</strong>
          </a>
        </h3>
        <p class="text-xs text-muted mb-0 mt-2">
          Connect on LinkedIn: <a href="https://www.linkedin.com/in/beingbabu/" target="_blank" rel="noopener noreferrer" class="credit-link">https://www.linkedin.com/in/beingbabu/</a>
        </p>
      </div>

      <div class="mb-4">
        <h4 class="text-espresso mb-2">Why This Tool Was Created</h4>
        <p class="text-sm text-charcoal mb-2">
          Most startup advice assumes an entrepreneur already has venture funding, a technical co-founder, or an MBA. For solo micro-innovators with an early, half-baked idea, generic advice often leads to building too soon, spending precious savings on legal filings or logos, and getting stuck in silence.
        </p>
        <p class="text-sm text-charcoal mb-0">
          The <strong>Micro-Startup Compass</strong> provides a disciplined sequence from vague intuition to customer-verified evidence. It replaces confusing startup jargon with plain language and practical micro-experiments that cost zero dollars.
        </p>
      </div>

      <div class="grid-2-col gap-3 mb-4">
        <div class="p-3 bg-sand-light rounded border-warm">
          <strong class="text-terracotta">1. Stage-Gated, Not Domain-Gated</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            Instead of asking you to jump between marketing, finance, and operations, the guide walks you through natural validation milestones: problem clarity first, real conversations second, 1-page plans third, and cheap smoke tests fourth.
          </p>
        </div>
        <div class="p-3 bg-sand-light rounded border-warm">
          <strong class="text-terracotta">2. $0 Pre-Build Validation</strong>
          <p class="text-xs text-muted mb-0 mt-1">
            Never build code or buy inventory before confirming willingness to pay. Every test in this guide can be performed with conversations, paper notes, simple phone calls, or hand-delivered assistance.
          </p>
        </div>
      </div>

      <div class="p-3 bg-oat rounded text-xs text-muted">
        <strong>Legal & Educational Reminder:</strong> 
        This application is an educational resource. Users are independent individuals responsible for their own business choices and legal compliance. See the dedicated <a href="#disclaimer" class="credit-link" id="link-to-disclaimer">Legal Disclaimer</a> for complete terms.
      </div>
    </div>
  `;

  container.querySelector("#link-to-disclaimer")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("app:navigate-tab", { detail: { tab: "disclaimer" } }));
  });
}

export function renderSummaryTab(container) {
  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Resource Tab: Overview & Documents</div>
      <h2 class="stage-title">Project Summary & Community Flyer</h2>
      <p class="stage-subtitle">
        Review your complete project notes or prepare a printable neighborhood flyer to gather early feedback.
      </p>
    </div>

    <div class="flex-between mb-3">
      <div class="text-xs text-muted">
        All details auto-update as you write notes across each step.
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary text-xs" id="btn-tab-summary-copy">📋 Copy Text</button>
        <button class="btn btn-primary text-xs" id="btn-tab-summary-print">🖨️ Print / Save PDF</button>
      </div>
    </div>

    <div class="card p-3 mb-4" id="tab-summary-inner">
      <!-- Dossier view will render here -->
    </div>
  `;

  const inner = container.querySelector("#tab-summary-inner");
  renderDossierView(inner);

  container.querySelector("#btn-tab-summary-print")?.addEventListener("click", () => {
    window.print();
  });

  container.querySelector("#btn-tab-summary-copy")?.addEventListener("click", () => {
    const copyBtn = container.querySelector("#btn-tab-summary-copy");
    const activeViewBtn = inner.querySelector(".tab-btn.active");
    const isFlyer = activeViewBtn && activeViewBtn.id === "tab-view-flyer";
    const textToCopy = isFlyer ? "Community Notice Flyer" : "Micro-Startup Compass Summary";
    // Trigger copy
    const text = inner.innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => { copyBtn.textContent = "📋 Copy Text"; }, 2000);
    });
  });
}

export function renderStoriesTab(container) {
  const categories = ["all", "Trades & Craft", "Makers & Food", "Community & Civic", "Digital & Freelance", "Local Service"];
  const filteredStories = activeStoryCategory === "all" 
    ? INNOVATOR_STORIES 
    : INNOVATOR_STORIES.filter(s => s.category === activeStoryCategory);

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Resource Tab: Inspiration & Proof</div>
      <h2 class="stage-title">Everyday Innovator Stories: The Micro-Startup Hall of Fame</h2>
      <p class="stage-subtitle">
        Real-world proof that sustainable, life-changing micro-ventures can start with under $100, 
        zero venture capital, and honest curiosity.
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="script-tabs-header mb-4">
      ${categories.map(cat => `
        <button class="tab-btn script-tab-btn ${activeStoryCategory === cat ? "active" : ""}" data-cat="${cat}">
          ${cat === "all" ? "🌟 All Stories (5)" : cat}
        </button>
      `).join("")}
    </div>

    <!-- Stories List -->
    <div class="stories-grid">
      ${filteredStories.map(story => `
        <div class="card p-4 mb-4 story-card border-warm">
          <div class="flex-between mb-2">
            <span class="badge badge-accent">${story.badge}</span>
            <div class="flex gap-2">
              <span class="badge badge-neutral text-xs">Start: <strong>${story.initialBudget}</strong></span>
              <span class="badge badge-success text-xs">Current: <strong>${story.monthlyRevenue}</strong></span>
            </div>
          </div>

          <h3 class="story-headline text-espresso m-0 mt-1 mb-2">${story.name}: ${story.headline}</h3>

          <div class="grid-2-col gap-3 mt-3">
            <div class="p-3 bg-oat rounded text-xs">
              <strong class="text-terracotta">1. What Frustration Did They Notice?</strong>
              <p class="m-0 mt-1">${story.initialWorkaround}</p>
            </div>
            <div class="p-3 bg-oat rounded text-xs">
              <strong class="text-espresso">2. How Did They Land Their First 5 Clients?</strong>
              <p class="m-0 mt-1">${story.firstFiveStrategy}</p>
            </div>
          </div>

          <div class="p-3 bg-highlight rounded border-warm text-xs mt-3">
            <strong class="text-terracotta">💡 The Breakthrough Moment:</strong>
            <p class="m-0 mt-1 font-italic">${story.ahaMoment}</p>
          </div>

          <div class="p-3 bg-white-soft rounded border-warm text-xs mt-3 flex-between">
            <div>
              <strong class="text-espresso">🌟 Key Lesson for You:</strong>
              <span class="ml-1 text-muted">${story.keyTakeaway}</span>
            </div>
            <button class="btn btn-secondary text-xs btn-jump-to-step1" title="Start testing your own idea in Step 1">
              Apply in Step 1 →
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Attach filter event listeners
  container.querySelectorAll(".script-tab-btn[data-cat]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeStoryCategory = e.currentTarget.getAttribute("data-cat");
      renderStoriesTab(container);
    });
  });

  container.querySelectorAll(".btn-jump-to-step1").forEach(btn => {
    btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 1 } }));
    });
  });
}

