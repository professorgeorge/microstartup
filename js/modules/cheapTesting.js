// cheapTesting.js: Step 4: Quick Free Tests Before You Build.
// Guides ordinary innovators through zero-dollar tests to see if people will pay.

import { store } from "../store.js";
import { testingPlaybook, signalEvaluator } from "../data/testingPlaybook.js";
import { callAi } from "../services/aiClient.js";

let aiTailoredTests = null;
let isTailoringTests = false;

export function renderStage4(container) {
  const s4 = store.state.stage4;
  const s2 = store.state.stage2;
  const interviews = s2.interviews || [];

  const currentExperiment = testingPlaybook.find(p => p.id === (s4.selectedExperimentId || "concierge_test")) || testingPlaybook[0];

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Step 4: Quick Free Tests</div>
      <h2 class="stage-title">The Test-Before-You-Build Guide</h2>
      <p class="stage-subtitle">
        Do not hire a computer programmer or spend your savings building a product based on a guess.
        Use one of these simple, free tests to see if people will actually raise their hand and offer to pay first.
      </p>
    </div>

    <!-- Playbook Selection Grid -->
    <div class="card mb-4">
      <div class="flex-between">
        <h3 class="panel-heading m-0">1. Pick a Simple Test to Try</h3>
        <button id="btn-ai-tailor-tests" class="btn btn-secondary text-xs flex-center gap-1" ${isTailoringTests ? "disabled" : ""} style="border-color: var(--color-amber);">
          <span>${isTailoringTests ? "⏳" : "✨"}</span> 
          <strong>${isTailoringTests ? "Tailoring tests..." : "AI Tailor $0 Tests to My Idea"}</strong>
        </button>
      </div>

      ${aiTailoredTests ? `
        <div class="card card-highlight p-3 border-warm mt-3 animate-fade-in" id="ai-tailored-tests-box" style="border-left: 4px solid var(--color-amber);">
          <div class="flex-between mb-2">
            <div class="flex-row items-center gap-2">
              <span style="font-size: 1.2rem;">✨</span>
              <strong class="text-terracotta text-xs font-bold">AI Tailored $0 Tests for "${escapeHtml(store.state.name || "Your Idea")}":</strong>
            </div>
            <button class="btn-icon text-xs" id="btn-dismiss-ai-tests" title="Dismiss">✕</button>
          </div>

          <div class="grid-3-col gap-2 mt-2">
            ${(aiTailoredTests.tests || []).map((t, idx) => `
              <div class="p-2 bg-white-soft rounded border-warm text-xs flex-column justify-between">
                <div>
                  <div class="flex-between mb-1">
                    <strong class="text-espresso">${escapeHtml(t.name)}</strong>
                    <span class="badge badge-success text-xs">$0</span>
                  </div>
                  <p class="text-muted m-0 mb-2">${escapeHtml(t.description)}</p>
                </div>
                <div class="p-1 bg-oat rounded text-charcoal" style="font-size: 11px;">
                  <strong>Green Light Signal:</strong> ${escapeHtml(t.passMetric)}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="experiment-cards-grid mt-3">
        ${testingPlaybook.map(exp => `
          <div class="experiment-card ${exp.id === currentExperiment.id ? "active-exp" : ""}" data-id="${exp.id}">
            <div class="flex-between mb-1">
              <span class="badge ${exp.cost === "$0" ? "badge-success" : "badge-neutral"} text-xs">${exp.cost}</span>
              <span class="text-xs text-muted">${exp.effortHours}</span>
            </div>
            <strong class="exp-title">${exp.name}</strong>
            <p class="text-xs text-muted mt-2">${exp.summary}</p>
            <div class="text-xs text-terracotta mt-2">
              <strong>Best For:</strong> ${exp.bestFor}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Active Experiment Guide -->
    <div class="grid-2-col mb-4">
      <!-- Steps to execute -->
      <div class="panel">
        <div class="flex-between mb-2">
          <h3 class="panel-heading m-0">${currentExperiment.name}</h3>
          <span class="badge badge-accent">${currentExperiment.cost} Test</span>
        </div>
        <p class="text-sm text-muted">${currentExperiment.summary}</p>
        
        <h4 class="text-sm text-terracotta mt-3">Simple Steps to Follow:</h4>
        <ol class="step-list text-sm">
          ${currentExperiment.steps.map(step => `<li>${step}</li>`).join("")}
        </ol>

        <div class="target-signal-box mt-3">
          <strong>What Success Looks Like:</strong>
          <p class="text-xs text-muted mb-0 mt-1">${currentExperiment.signalMetric}</p>
        </div>
      </div>

      <!-- Log Results & Scorecard -->
      <div class="panel panel-highlight">
        <h3 class="panel-heading">2. What Happened When You Tested?</h3>
        
        <div class="form-group">
          <label for="s4-name">Name of Your Test</label>
          <input type="text" id="s4-name" placeholder="e.g. Helped 2 local plumbers dispatch calls by hand over the weekend" value="${s4.experimentName || ""}">
        </div>

        <div class="grid-2-col">
          <div class="form-group">
            <label for="s4-visitors">People You Contacted or Showed</label>
            <input type="number" id="s4-visitors" min="0" value="${s4.visitorCount || 0}">
            <span class="field-hint">How many people did you talk to or send a link to?</span>
          </div>

          <div class="form-group">
            <label for="s4-conversions">People Who Said Yes / Signed Up</label>
            <input type="number" id="s4-conversions" min="0" value="${s4.conversionCount || 0}">
            <span class="field-hint">People who left their email or asked for help.</span>
          </div>
        </div>

        <div class="form-group">
          <label for="s4-preorders">Cash or Deposits Collected ($)</label>
          <input type="number" id="s4-preorders" min="0" value="${s4.preorderCount || 0}">
          <span class="field-hint">Total dollars received (even a $10 tip or deposit counts!).</span>
        </div>

        <div class="form-group">
          <label for="s4-notes">What did you learn? (What surprised you?)</label>
          <textarea id="s4-notes" rows="2" placeholder="What questions did people ask? Did they seem eager or hesitant?">${s4.experimentNotes || ""}</textarea>
        </div>

        <button id="btn-eval-signal" class="btn btn-primary w-100 mt-2">
          Check My Test Results
        </button>
      </div>
    </div>

    <!-- Signal Evaluation Result Card -->
    ${s4.evaluatorResult ? `
      <div class="card card-highlight mb-4">
        <div class="flex-between">
          <div>
            <span class="badge ${s4.evaluatorResult.badgeClass} mb-2">${s4.evaluatorResult.verdict}</span>
            <h4 class="m-0">${s4.evaluatorResult.explanation}</h4>
          </div>
        </div>
        <div class="mt-3 p-3 bg-white-soft rounded text-sm">
          <strong>What You Should Do Next:</strong>
          <p class="mb-0 mt-1">${s4.evaluatorResult.nextSteps}</p>
        </div>
      </div>
    ` : ""}

    <!-- Stage 4 Gate Status -->
    <div class="card flex-between">
      <div>
        <h4 class="m-0">Step 4 Status: ${s4.isCompleted ? '<span class="text-success">Test Completed!</span>' : '<span class="text-warning-dark">Ready to Run a Test</span>'}</h4>
        <p class="text-xs text-muted mb-0 mt-1">
          Try at least 1 test and enter your numbers above to unlock Step 5 (Next Steps & Free Grants).
        </p>
      </div>
      <div>
        ${s4.isCompleted ? `
          <button id="btn-proceed-stage-5" class="btn btn-primary">
            Next: Step 5 (Next Steps & Free Grants) →
          </button>
        ` : ""}
      </div>
    </div>
  `;

  attachStage4Events(container);
}

function attachStage4Events(container) {
  container.querySelectorAll(".experiment-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      store.state.stage4.selectedExperimentId = id;
      store.saveState();
      renderStage4(container);
    });
  });

  const evalBtn = container.querySelector("#btn-eval-signal");
  evalBtn?.addEventListener("click", () => {
    const s4 = store.state.stage4;
    const s2 = store.state.stage2;

    s4.experimentName = container.querySelector("#s4-name").value.trim();
    s4.visitorCount = parseInt(container.querySelector("#s4-visitors").value, 10) || 0;
    s4.conversionCount = parseInt(container.querySelector("#s4-conversions").value, 10) || 0;
    s4.preorderCount = parseInt(container.querySelector("#s4-preorders").value, 10) || 0;
    s4.experimentNotes = container.querySelector("#s4-notes").value.trim();

    const highPainCount = (s2.interviews || []).filter(i => Number(i.painScore) >= 4).length;

    const result = signalEvaluator.calculateSignal({
      interviewsLogged: s2.interviews ? s2.interviews.length : 0,
      highPainCount,
      experimentConversions: s4.conversionCount,
      visitorsOrOutreach: s4.visitorCount
    });

    s4.evaluatorResult = result;
    s4.isCompleted = true;
    store.saveState();
    renderStage4(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
  });

  const proceedBtn = container.querySelector("#btn-proceed-stage-5");
  proceedBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 5 } }));
  });

  // AI Tailor Tests
  const tailorBtn = container.querySelector("#btn-ai-tailor-tests");
  tailorBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    const idea = store.state.name || "Everyday Service";
    const s1 = store.state.stage1 || {};
    const audience = s1.targetAudience || "local customers";
    const problem = s1.problemHypothesis || "recurring daily chore";

    isTailoringTests = true;
    renderStage4(container);

    const prompt = `Based on this startup idea:
Idea: "${idea}"
Audience: "${audience}"
Problem: "${problem}"

Task: Suggest 3 ultra-scrappy, zero-dollar ($0) tests a solo founder can run this week without writing code or spending money.
Examples of types:
1. Concierge Test (doing the service by hand for 3 real people)
2. Simple Link / Smoke Test (putting a simple post or link up to count clicks/messages)
3. Direct Pre-order / Deposit Test (asking for a 50% deposit before buying supplies)

Respond strictly with valid JSON only in this exact format:
{
  "tests": [
    {
      "name": "Test 1 Title",
      "description": "Exactly what physical or manual action to take this weekend (2 sentences)",
      "passMetric": "Concrete metric for success (e.g., 2 people agree or hand you $20 cash)"
    },
    {
      "name": "Test 2 Title",
      "description": "...",
      "passMetric": "..."
    },
    {
      "name": "Test 3 Title",
      "description": "...",
      "passMetric": "..."
    }
  ]
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are a scrappy micro-business experiment advisor specializing in zero-dollar tests.",
        temperature: 0.7,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      aiTailoredTests = parsed;
    } catch (err) {
      alert(`AI Tailored Tests error: ${err.message || String(err)}`);
    } finally {
      isTailoringTests = false;
      renderStage4(container);
    }
  });

  container.querySelector("#btn-dismiss-ai-tests")?.addEventListener("click", () => {
    aiTailoredTests = null;
    renderStage4(container);
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
