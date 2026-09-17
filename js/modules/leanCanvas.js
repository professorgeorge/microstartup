// leanCanvas.js: Step 3: Your 1-Page Plan.
// Streamlined with quick auto-fill, formatted preview access, and evidence markers.

import { store } from "../store.js";
import { callAi, suggestPricingTiers } from "../services/aiClient.js";

let activePricingTiers = null;
let isSuggestingTiers = false;

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderStage3(container) {
  const s3 = store.state.stage3;
  const canvas = s3.canvas || {};
  const s1 = store.state.stage1;
  const s2 = store.state.stage2;

  const hasInterviews = (s2.interviews && s2.interviews.length >= 5);
  const calc = store.getNapkinMathCalculations();

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Step 3: Your 1-Page Plan</div>
      <h2 class="stage-title">Your Simple 1-Page Plan</h2>
      <p class="stage-subtitle">
        Capture your whole business model on one single page. Distinguish between what you have verified 
        with customer conversations versus what remains an initial guess.
      </p>
    </div>

    <!-- Quick Action Toolbar -->
    <div class="card card-oat mb-4 flex-between">
      <div>
        <strong>Auto-Fill & AI Co-Pilot:</strong> Transfer Step 1 & 2 findings, or use AI to brainstorm your channels and unfair advantage.
      </div>
      <div class="btn-row flex-row items-center gap-2">
        <button id="btn-ai-assist-canvas" class="btn btn-secondary text-xs flex-center gap-1" style="border-color: var(--color-amber);">
          <span>✨</span> <strong>AI Co-Pilot (Channels & Edge)</strong>
        </button>
        <button id="btn-sync-canvas" class="btn btn-secondary text-xs">
          ⚡ Auto-Fill from Steps 1 & 2
        </button>
        <button id="btn-preview-canvas" class="btn btn-secondary text-xs">
          📄 View Formatted Preview & Print
        </button>
      </div>
    </div>

    <!-- 1-Page Plan Grid -->
    <div class="lean-canvas-grid mb-4">
      <!-- 1. The Big Headache -->
      <div class="canvas-cell cell-problem">
        <div class="cell-header">
          <span class="cell-title">1. The Big Headache</span>
          <span class="badge ${hasInterviews ? "badge-success" : "badge-warning"} text-xs">
            ${hasInterviews ? "Verified" : "Guess"}
          </span>
        </div>
        <textarea id="canvas-problem" rows="4" placeholder="What are the top 1 to 3 specific frustrations your customers face?">${canvas.problem || ""}</textarea>
        
        <div class="cell-sub-section mt-2">
          <span class="cell-sub-title">What they do instead right now</span>
          <textarea id="canvas-alternatives" rows="3" placeholder="How do they cope right now? (Paper notes, calling a friend, spreadsheets)...">${canvas.existingAlternatives || ""}</textarea>
        </div>
      </div>

      <!-- 2. Your Helpful Answer -->
      <div class="canvas-cell cell-solution">
        <div class="cell-header">
          <span class="cell-title">4. Your Helpful Answer</span>
          <span class="badge badge-neutral text-xs">Concept</span>
        </div>
        <textarea id="canvas-solution" rows="4" placeholder="What are the top 3 simple features that address their headache?">${canvas.solution || ""}</textarea>
      </div>

      <!-- 3. Why They Choose You -->
      <div class="canvas-cell cell-uvp">
        <div class="cell-header">
          <span class="cell-title">3. Why They Choose You</span>
          <span class="badge badge-accent text-xs">Promise</span>
        </div>
        <textarea id="canvas-uvp" rows="4" placeholder="In one clear sentence: why is your approach better and worth paying for?">${canvas.uniqueValueProposition || ""}</textarea>
        
        <div class="cell-sub-section mt-2">
          <span class="cell-sub-title">10-Second Analogy</span>
          <textarea id="canvas-analogy" rows="2" placeholder="e.g. 'Emergency dispatcher assistant for solo plumbers'">${s1.elevatorPremise || ""}</textarea>
        </div>
      </div>

      <!-- 4. Your Personal Edge -->
      <div class="canvas-cell cell-advantage">
        <div class="cell-header">
          <span class="cell-title">9. Your Personal Edge</span>
          <span class="badge badge-neutral text-xs">Personal Edge</span>
        </div>
        <textarea id="canvas-advantage" rows="4" placeholder="What unique strength or access do you have? (Years working in this trade, trusted relationships, insider knowledge)...">${canvas.unfairAdvantage || ""}</textarea>
      </div>

      <!-- 5. Who Suffers Most -->
      <div class="canvas-cell cell-customers">
        <div class="cell-header">
          <span class="cell-title">2. Who Suffers Most</span>
          <span class="badge ${hasInterviews ? "badge-success" : "badge-warning"} text-xs">
            ${hasInterviews ? "Verified" : "Guess"}
          </span>
        </div>
        <textarea id="canvas-customers" rows="4" placeholder="Exact group of people with the acute headache...">${canvas.customerSegments || ""}</textarea>
        
        <div class="cell-sub-section mt-2">
          <span class="cell-sub-title">First People to Try It</span>
          <textarea id="canvas-early" rows="3" placeholder="Who will be excited to test your very first rough version?">${canvas.earlyAdopters || ""}</textarea>
        </div>
      </div>

      <!-- 6. Signs People Love It -->
      <div class="canvas-cell cell-metrics">
        <div class="cell-header">
          <span class="cell-title">8. Signs People Love It</span>
        </div>
        <textarea id="canvas-metrics" rows="3" placeholder="What numbers tell you it is helping? (e.g. 5 customers use it every week, repeat calls saved)...">${canvas.keyMetrics || ""}</textarea>
      </div>

      <!-- 7. Where to Reach Them -->
      <div class="canvas-cell cell-channels">
        <div class="cell-header">
          <span class="cell-title">5. Where to Reach Them</span>
        </div>
        <textarea id="canvas-channels" rows="3" placeholder="Where do these people spend time? (Local trade counters, specific community groups, morning supply shops)...">${canvas.channels || ""}</textarea>
      </div>

      <!-- 8. What It Costs to Run -->
      <div class="canvas-cell cell-costs">
        <div class="cell-header">
          <span class="cell-title">7. What It Costs to Run</span>
        </div>
        <textarea id="canvas-costs" rows="3" placeholder="Estimated monthly costs (Hosting, phone messaging service, basic materials)...">${canvas.costStructure || ""}</textarea>
      </div>

      <!-- 9. How You Make Money -->
      <div class="canvas-cell cell-revenue">
        <div class="cell-header">
          <span class="cell-title">6. How You Make Money</span>
        </div>
        <textarea id="canvas-revenue" rows="3" placeholder="How customers pay you (e.g. $49 per month subscription, or $25 per service)...">${canvas.revenueStreams || ""}</textarea>
      </div>
    </div>

    <!-- Pocket Napkin Math Calculator -->
    <div class="card card-highlight mb-4" id="napkin-math-card">
      <div class="flex-between flex-wrap gap-2 mb-2">
        <div>
          <span class="badge badge-accent mb-1">Financial Clarity</span>
          <h3 class="panel-heading m-0">Pocket Napkin Math: How Many Customers Do You Actually Need?</h3>
          <p class="text-xs text-muted mt-1 mb-0">
            Forget complex 5-year spreadsheets. Turn your monthly income target into an achievable, reachable daily customer pace.
          </p>
        </div>
        <div class="flex-row items-center gap-2">
          ${activePricingTiers ? `
            <button id="btn-clear-pricing-tiers" class="btn btn-secondary text-xs" title="Hide suggested packages">
              ✕ Close Packages
            </button>
          ` : ""}
          <button id="btn-ai-pricing-tiers" class="btn btn-secondary text-xs" title="Suggest 3 structured packaging tiers (Starter, Core, VIP) with instant math calculations">
            ${isSuggestingTiers ? "⏳ Analyzing Packages..." : "✨ Suggest 3 Pricing Packages"}
          </button>
          <button id="btn-apply-napkin-to-canvas" class="btn btn-secondary text-xs" title="Copy these numbers into the Revenue box above">
            ⚡ Apply to Revenue Box
          </button>
        </div>
      </div>

      <div class="grid-3-col mt-3">
        <!-- Target Monthly Income -->
        <div class="form-group mb-2">
          <label for="nm-target-income">Desired Monthly Take-Home ($)</label>
          <input type="number" id="nm-target-income" min="100" step="50" value="${calc.target}">
          <div class="btn-row mt-1" style="gap: 4px;">
            <button class="btn btn-secondary text-xs nm-preset-btn" data-val="500">$500</button>
            <button class="btn btn-secondary text-xs nm-preset-btn" data-val="1500">$1,500</button>
            <button class="btn btn-secondary text-xs nm-preset-btn" data-val="3000">$3,000</button>
          </div>
          <span class="field-hint">Extra monthly income to make this project worth your time.</span>
        </div>

        <!-- Price Per Order / Client -->
        <div class="form-group mb-2">
          <label for="nm-price-unit">Price per Client / Order ($)</label>
          <input type="number" id="nm-price-unit" min="1" step="5" value="${calc.price}">
          <span class="field-hint">A modest, fair price for your first version.</span>
        </div>

        <!-- Monthly Fixed Costs -->
        <div class="form-group mb-2">
          <label for="nm-fixed-costs">Monthly Tool Expenses ($)</label>
          <input type="number" id="nm-fixed-costs" min="0" step="5" value="${calc.expenses}">
          <span class="field-hint">Basic subscriptions (domain, hosting, phone service).</span>
        </div>
      </div>

      <!-- Real-Time Customer Pace Output -->
      <div class="napkin-output-bar p-3 bg-white-soft rounded border-warm mt-3">
        <div class="grid-3-col text-center">
          <div class="stat-box p-2">
            <span class="stat-num text-terracotta" style="font-size: 1.5rem; font-weight: 700;">${calc.customersNeededMonth}</span>
            <span class="stat-lbl d-block text-xs text-muted mt-1">Paying ${calc.unitLabel} / Month</span>
          </div>
          <div class="stat-box p-2">
            <span class="stat-num text-espresso" style="font-size: 1.5rem; font-weight: 700;">~${calc.customersNeededWeek}</span>
            <span class="stat-lbl d-block text-xs text-muted mt-1">Customers / Week</span>
          </div>
          <div class="stat-box p-2">
            <span class="stat-num text-success" style="font-size: 1.5rem; font-weight: 700;">~${calc.customersNeededDay}</span>
            <span class="stat-lbl d-block text-xs text-muted mt-1">Per Working Day</span>
          </div>
        </div>

        <div class="mt-3 p-2 bg-oat rounded text-xs flex-between">
          <span><strong>Reality Verdict:</strong> ${calc.verdict}</span>
          <span class="badge ${calc.badgeClass} text-xs">Pace Indicator</span>
        </div>
      </div>

      ${activePricingTiers ? `
        <div class="pricing-tiers-panel mt-3 p-3 bg-white-soft rounded border-warm">
          <div class="flex-between mb-2">
            <h4 class="text-espresso text-xs font-bold m-0">💡 Suggested 3-Tier Packaging & Pricing:</h4>
            <span class="text-xs text-muted">Click any price below to load into the calculator</span>
          </div>
          <div class="grid-3-col gap-2">
            ${activePricingTiers.map(tier => `
              <div class="p-3 bg-sand-light rounded border-warm flex flex-col justify-between">
                <div>
                  <div class="flex-between mb-1">
                    <strong class="text-espresso text-xs">${escapeHtml(tier.name)}</strong>
                    <span class="badge badge-accent text-xs">$${tier.price}</span>
                  </div>
                  <div class="text-xs text-muted mb-2 font-italic">${escapeHtml(tier.billing || "one-time")}</div>
                  <p class="text-xs text-charcoal mb-2">${escapeHtml(tier.deliverables || "")}</p>
                  <div class="text-xs text-muted mb-2">
                    <strong>For:</strong> ${escapeHtml(tier.targetBuyer || "")}
                  </div>
                </div>
                <div class="mt-2 pt-2 border-top-warm flex-between">
                  <span class="badge badge-neutral text-xs">${escapeHtml(tier.mathHint || "")}</span>
                  <button class="btn btn-primary text-xs btn-apply-single-tier" data-price="${tier.price}">
                    Use $${tier.price} →
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="mt-3 flex-between flex-wrap gap-2">
            <span class="text-xs text-muted">Offer all three? You can copy this complete packaging bundle into your Revenue Streams box.</span>
            <button id="btn-apply-all-tiers-to-revenue" class="btn btn-secondary text-xs">
              📋 Copy All 3 Packages to Revenue Box
            </button>
          </div>
        </div>
      ` : ""}
    </div>

    <!-- Gate Status & Controls -->
    <div class="card flex-between">
      <div>
        <h4 class="m-0">Step 3 Status: ${s3.isCompleted ? '<span class="text-success">Plan Ready!</span>' : '<span class="text-warning-dark">Filling In Plan Boxes</span>'}</h4>
        <p class="text-xs text-muted mb-0 mt-1">
          Complete the Headache, Customers, Promise, and Helpful Answer to unlock Step 4 (Quick Free Tests).
        </p>
      </div>
      <div class="btn-row">
        <button id="btn-save-canvas" class="btn btn-primary">Save My Plan</button>
        ${s3.isCompleted ? `
          <button id="btn-proceed-stage-4" class="btn btn-primary">
            Next: Step 4 (Quick Free Tests) →
          </button>
        ` : ""}
      </div>
    </div>
  `;

  attachStage3Events(container);
}

function attachStage3Events(container) {
  const saveBtn = container.querySelector("#btn-save-canvas");
  const syncBtn = container.querySelector("#btn-sync-canvas");
  const previewBtn = container.querySelector("#btn-preview-canvas");
  const proceedBtn = container.querySelector("#btn-proceed-stage-4");

  saveBtn?.addEventListener("click", () => {
    saveCanvasData(container);
    store.saveState();
    renderStage3(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
  });

  // AI Co-Pilot for Lean Canvas
  const aiAssistBtn = container.querySelector("#btn-ai-assist-canvas");
  aiAssistBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    const s1 = store.state.stage1 || {};
    const ideaName = store.state.name || "My Idea";
    const audience = s1.targetAudience || container.querySelector("#canvas-customers")?.value || "Local residents";
    const problem = s1.problemHypothesis || container.querySelector("#canvas-problem")?.value || "Daily disorganization";
    const uvp = s1.elevatorPremise || container.querySelector("#canvas-uvp")?.value || "Simple local help";

    aiAssistBtn.textContent = "⏳ Brainstorming with AI...";
    aiAssistBtn.disabled = true;

    const prompt = `Based on this micro-startup plan:
Idea: "${ideaName}"
Audience: "${audience}"
Problem: "${problem}"
Value Proposition: "${uvp}"

Task: Brainstorm the hardest boxes for a first-time, non-technical solo founder:
1. Channels: 2 to 3 low-cost, hyper-local or community acquisition channels (e.g. flyers at supply shops, Facebook local groups, direct WhatsApp, local partnerships).
2. Unfair Advantage: 2 authentic competitive edges for a small local maker/tradesperson that cannot easily be copied by software corporations (e.g. personal community trust, 15 years trade mastery, 0% software overhead).
3. Key Metrics: 2 simple numbers to track on a napkin (e.g. 2 customers/day, 90%+ positive review rate).

Respond strictly with valid JSON only in this exact format:
{
  "channels": "Channel 1; Channel 2; Channel 3",
  "unfairAdvantage": "Advantage 1; Advantage 2",
  "keyMetrics": "Metric 1; Metric 2"
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are a scrappy micro-business coach helping small non-technical entrepreneurs.",
        temperature: 0.7,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      const chanEl = container.querySelector("#canvas-channels");
      const advEl = container.querySelector("#canvas-unfair-adv");
      const metEl = container.querySelector("#canvas-metrics");

      if (parsed.channels && chanEl) chanEl.value = parsed.channels;
      if (parsed.unfairAdvantage && advEl) advEl.value = parsed.unfairAdvantage;
      if (parsed.keyMetrics && metEl) metEl.value = parsed.keyMetrics;

      saveCanvasData(container);
      store.saveState();
      renderStage3(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
      alert("✨ AI Co-Pilot populated your Channels, Unfair Advantage, and Key Metrics with tailored suggestions!");
    } catch (err) {
      alert(`AI Co-Pilot error: ${err.message || String(err)}`);
    } finally {
      aiAssistBtn.innerHTML = "<span>✨</span> <strong>AI Co-Pilot (Channels & Edge)</strong>";
      aiAssistBtn.disabled = false;
    }
  });

  syncBtn?.addEventListener("click", () => {
    const s1 = store.state.stage1;
    const probEl = container.querySelector("#canvas-problem");
    const altEl = container.querySelector("#canvas-alternatives");
    const custEl = container.querySelector("#canvas-customers");
    const uvpEl = container.querySelector("#canvas-uvp");

    if (s1.problemHypothesis && !probEl.value) {
      probEl.value = s1.problemHypothesis;
    }
    if (s1.currentWorkaround && !altEl.value) {
      altEl.value = s1.currentWorkaround;
    }
    if (s1.targetAudience && !custEl.value) {
      custEl.value = s1.targetAudience;
    }
    if (s1.elevatorPremise && !uvpEl.value) {
      uvpEl.value = s1.elevatorPremise;
    }

    saveCanvasData(container);
    store.saveState();
    renderStage3(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
    alert("Plan auto-filled from your problem and interview notes!");
  });

  previewBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:open-dossier"));
  });

  proceedBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 4 } }));
  });

  // Napkin Math Events
  const targetIncomeInput = container.querySelector("#nm-target-income");
  const priceUnitInput = container.querySelector("#nm-price-unit");
  const fixedCostsInput = container.querySelector("#nm-fixed-costs");
  const applyNapkinBtn = container.querySelector("#btn-apply-napkin-to-canvas");

  const handleNapkinChange = () => {
    saveCanvasData(container);
    store.updateNapkinMath({
      targetMonthlyIncome: Number(targetIncomeInput.value) || 0,
      pricePerUnit: Number(priceUnitInput.value) || 1,
      fixedExpenses: Number(fixedCostsInput.value) || 0
    });
    renderStage3(container);
  };

  targetIncomeInput?.addEventListener("change", handleNapkinChange);
  priceUnitInput?.addEventListener("change", handleNapkinChange);
  fixedCostsInput?.addEventListener("change", handleNapkinChange);

  container.querySelectorAll(".nm-preset-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const val = Number(e.currentTarget.getAttribute("data-val"));
      if (targetIncomeInput) targetIncomeInput.value = val;
      handleNapkinChange();
    });
  });

  applyNapkinBtn?.addEventListener("click", () => {
    const c = store.getNapkinMathCalculations();
    const revEl = container.querySelector("#canvas-revenue");
    if (revEl) {
      revEl.value = `$${c.price} per ${c.unitLabel}. Targeting ${c.customersNeededMonth} customers/month (~${c.customersNeededWeek}/week) to generate $${c.target}/mo net profit.`;
      saveCanvasData(container);
      store.saveState();
      renderStage3(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
      alert("Napkin math numbers copied into your Revenue Streams box!");
    }
  });

  // AI Pricing Tiers Handlers
  container.querySelector("#btn-clear-pricing-tiers")?.addEventListener("click", () => {
    activePricingTiers = null;
    renderStage3(container);
  });

  container.querySelector("#btn-ai-pricing-tiers")?.addEventListener("click", async () => {
    const currentPrice = Number(priceUnitInput.value) || 50;
    const currentTarget = Number(targetIncomeInput.value) || 1000;

    if (!store.isAiConfigured()) {
      const wantsAi = confirm(
        "✨ AI Co-Pilot is not configured yet.\n\nWould you like to connect an AI provider (OpenAI, Gemini, Claude, Grok, or local Ollama) for custom package suggestions?\n\n(Click Cancel to see our grounded standard 3-tier starter packages immediately)."
      );
      if (wantsAi) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
        return;
      }
      // Offline graceful tiered package defaults
      activePricingTiers = [
        {
          name: "Tier 1: Starter / Audit",
          price: Math.max(15, Math.round(currentPrice * 0.5)),
          billing: "one-time",
          deliverables: "Quick diagnosis, action checklist, or sample trial",
          targetBuyer: "Hesitant first-time customers testing your reliability",
          mathHint: `${Math.ceil(currentTarget / Math.max(15, Math.round(currentPrice * 0.5)))} clients/mo`
        },
        {
          name: "Tier 2: Core Sweet Spot",
          price: currentPrice,
          billing: "per month / project",
          deliverables: "Complete problem solved with ongoing standard support",
          targetBuyer: "Your ideal recurring regular customers",
          mathHint: `${Math.ceil(currentTarget / currentPrice)} clients/mo`
        },
        {
          name: "Tier 3: White Glove VIP",
          price: Math.round(currentPrice * 2.5),
          billing: "per month",
          deliverables: "100% done-for-you priority service and zero hassle",
          targetBuyer: "Time-poor professionals who value convenience",
          mathHint: `Just ${Math.ceil(currentTarget / (currentPrice * 2.5))} clients/mo`
        }
      ];
      renderStage3(container);
      return;
    }

    isSuggestingTiers = true;
    renderStage3(container);

    try {
      const s1 = store.state.stage1 || {};
      const res = await suggestPricingTiers({
        ideaName: store.state.name,
        problem: s1.problemHypothesis || s1.painStory || "Everyday headache",
        targetPrice: currentPrice,
        monthlyGoal: currentTarget,
        config: store.getAiConfig()
      });
      activePricingTiers = res;
    } catch (err) {
      alert("Could not generate pricing tiers: " + (err.message || String(err)));
    } finally {
      isSuggestingTiers = false;
      renderStage3(container);
    }
  });

  container.querySelectorAll(".btn-apply-single-tier").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const p = Number(e.currentTarget.getAttribute("data-price"));
      if (priceUnitInput && p) {
        priceUnitInput.value = p;
        handleNapkinChange();
      }
    });
  });

  container.querySelector("#btn-apply-all-tiers-to-revenue")?.addEventListener("click", () => {
    if (!activePricingTiers) return;
    const revEl = container.querySelector("#canvas-revenue");
    if (revEl) {
      const tierText = activePricingTiers
        .map(t => `• ${t.name}: $${t.price} (${t.billing}) — ${t.deliverables}`)
        .join("\n");
      revEl.value = tierText;
      saveCanvasData(container);
      store.saveState();
      renderStage3(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
      alert("All 3 packaging tiers copied into your Revenue Streams box!");
    }
  });
}

function saveCanvasData(container) {
  const c = store.state.stage3.canvas || {};
  c.problem = container.querySelector("#canvas-problem").value.trim();
  c.existingAlternatives = container.querySelector("#canvas-alternatives").value.trim();
  c.solution = container.querySelector("#canvas-solution").value.trim();
  c.uniqueValueProposition = container.querySelector("#canvas-uvp").value.trim();
  c.unfairAdvantage = container.querySelector("#canvas-advantage").value.trim();
  c.customerSegments = container.querySelector("#canvas-customers").value.trim();
  c.earlyAdopters = container.querySelector("#canvas-early").value.trim();
  c.keyMetrics = container.querySelector("#canvas-metrics").value.trim();
  c.channels = container.querySelector("#canvas-channels").value.trim();
  c.costStructure = container.querySelector("#canvas-costs").value.trim();
  c.revenueStreams = container.querySelector("#canvas-revenue").value.trim();
  
  store.state.stage3.canvas = c;
}
