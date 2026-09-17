// exportDossier.js: Generates a clean Project Summary and Printable Community Notice Flyer.
// Built for everyday innovators to share with advisors, grants, or post on neighborhood bulletin boards.

import { store } from "../store.js";
import { polishFlyerHooks } from "../services/aiClient.js";

let activeDossierView = "summary"; // 'summary' or 'flyer'
let customFlyerHooks = null;
let isPolishingFlyer = false;

export function initExportDossier() {
  const modal = document.getElementById("dossier-modal");
  const closeBtn = document.getElementById("dossier-close-btn");
  const contentEl = document.getElementById("dossier-content");
  const printBtn = document.getElementById("dossier-print-btn");
  const copyMdBtn = document.getElementById("dossier-copy-md-btn");

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("modal-open");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("modal-open");
    }
  });

  printBtn?.addEventListener("click", () => {
    window.print();
  });

  copyMdBtn?.addEventListener("click", () => {
    const text = activeDossierView === "summary" ? generateMarkdownDossier() : generateFlyerText();
    navigator.clipboard.writeText(text).then(() => {
      copyMdBtn.textContent = "✓ Copied to Clipboard!";
      setTimeout(() => { copyMdBtn.textContent = "📋 Copy Text"; }, 2000);
    });
  });

  window.addEventListener("app:open-dossier", () => {
    activeDossierView = "summary";
    renderDossierView(contentEl);
    modal.classList.add("modal-open");
  });
}

export function renderDossierView(container) {
  container.innerHTML = `
    <!-- View Switcher Tabs -->
    <div class="tabs-header mb-3">
      <button class="tab-btn ${activeDossierView === "summary" ? "active" : ""}" id="tab-view-summary">
        📄 Complete Project Summary
      </button>
      <button class="tab-btn ${activeDossierView === "flyer" ? "active" : ""}" id="tab-view-flyer">
        📢 Neighborhood Notice & Flyer
      </button>
    </div>

    <div id="dossier-inner-content">
      ${activeDossierView === "summary" ? renderSummaryHTML() : `
        <div class="flex-between flex-wrap gap-2 mb-3 p-3 bg-oat rounded border-warm">
          <div>
            <strong class="text-espresso text-xs">Community Notice & Noticeboard Flyer:</strong>
            <span class="text-xs text-muted d-block">Ready to print or post on local Facebook/Nextdoor corkboards</span>
          </div>
          <div class="flex-row items-center gap-2">
            ${customFlyerHooks ? `
              <button id="btn-reset-flyer-hooks" class="btn btn-secondary text-xs" title="Restore default flyer copy">
                ↺ Reset Copy
              </button>
            ` : ""}
            <button id="btn-ai-polish-flyer" class="btn btn-secondary text-xs" title="Rewrite into warm, neighborly copy with high curiosity headlines for bulletin boards">
              ${isPolishingFlyer ? "⏳ Polishing Flyer Copy..." : "✨ Polish Flyer for Noticeboards"}
            </button>
          </div>
        </div>
        ${renderFlyerHTML()}
      `}
    </div>
  `;

  // Attach tab events
  container.querySelector("#tab-view-summary")?.addEventListener("click", () => {
    activeDossierView = "summary";
    renderDossierView(container);
  });

  container.querySelector("#tab-view-flyer")?.addEventListener("click", () => {
    activeDossierView = "flyer";
    renderDossierView(container);
  });

  // Attach Flyer Polish Events
  container.querySelector("#btn-reset-flyer-hooks")?.addEventListener("click", () => {
    customFlyerHooks = null;
    renderDossierView(container);
  });

  container.querySelector("#btn-ai-polish-flyer")?.addEventListener("click", async () => {
    const s = store.state;
    const s1 = s.stage1;

    if (!store.isAiConfigured()) {
      const wantsAi = confirm(
        "✨ AI Co-Pilot is not configured yet.\n\nWould you like to connect an AI provider (OpenAI, Gemini, Claude, Grok, or local Ollama) to polish your flyer copy?\n\n(Click Cancel to see our grounded standard neighborhood copy immediately)."
      );
      if (wantsAi) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
        return;
      }
      // Offline fallback
      customFlyerHooks = {
        headline: `Tired of dealing with ${s1.currentWorkaround || "this headache"}?`,
        subheadline: `A neighbor right here in the community offering reliable, simple help to fix this for good.`,
        bullets: [
          "✓ Direct, friendly assistance from a real neighbor",
          "✓ Zero hassle, zero long contracts, and honest pricing",
          "✓ 5 free pilot test slots open this week for early feedback"
        ],
        callToAction: "Text or call neighbor [Your Name] for a free 5-minute chat!"
      };
      renderDossierView(container);
      return;
    }

    isPolishingFlyer = true;
    renderDossierView(container);

    try {
      const res = await polishFlyerHooks({
        ideaName: s.name,
        problem: s1.problemHypothesis || s1.painStory || "everyday headache",
        solution: s1.elevatorPremise || s.stage3.canvas?.uniqueValueProposition || "friendly service",
        audience: s1.targetAudience || "local residents",
        config: store.getAiConfig()
      });
      customFlyerHooks = res;
    } catch (err) {
      alert("Could not polish flyer copy: " + (err.message || String(err)));
    } finally {
      isPolishingFlyer = false;
      renderDossierView(container);
    }
  });
}

function renderSummaryHTML() {
  const s = store.state;
  const s1 = s.stage1;
  const s2 = s.stage2;
  const s3 = s.stage3;
  const s4 = s.stage4;
  const s5 = s.stage5;

  const interviews = s2.interviews || [];
  const highPain = interviews.filter(i => Number(i.painScore) >= 4).length;
  const totalBudget = (s5.microBudgetItems || []).reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const confidence = store.getConfidenceScore();

  return `
    <div class="dossier-paper p-4">
      <div class="dossier-header border-bottom pb-3 mb-4 flex-between">
        <div>
          <span class="badge badge-accent text-xs">Small Business Project Summary</span>
          <h2 class="m-0 text-espresso mt-1">${escapeHtml(s.name || "My Project")}</h2>
          <span class="text-xs text-muted">Created on ${new Date().toLocaleDateString()} with Micro-Startup Compass</span>
        </div>
        <div class="text-right text-xs text-muted">
          <div>Step Reached: ${s.currentStage} of 5</div>
          <div>Confidence Score: <strong>${confidence}%</strong></div>
          <div>Conversations Logged: ${interviews.length}</div>
        </div>
      </div>

      <!-- Section 1: Problem Definition -->
      <div class="dossier-section mb-4">
        <h3 class="dossier-section-title">1. The Problem & Who It Helps</h3>
        <div class="p-3 bg-oat rounded text-sm mb-2">
          <strong>Core Problem Statement:</strong>
          <p class="mb-0 mt-1">${escapeHtml(s1.problemHypothesis || "Not written yet.")}</p>
        </div>
        <div class="grid-2-col text-xs text-muted mt-2">
          <div><strong>Who Hurts Most:</strong> ${escapeHtml(s1.targetAudience || "-")}</div>
          <div><strong>What They Do Today:</strong> ${escapeHtml(s1.currentWorkaround || "-")}</div>
          <div><strong>What It Costs Them:</strong> ${escapeHtml(s1.tangibleCost || "-")}</div>
          <div><strong>10-Second Explanation:</strong> ${escapeHtml(s1.elevatorPremise || "-")}</div>
        </div>
      </div>

      <!-- Section 2: Customer Discovery Evidence -->
      <div class="dossier-section mb-4">
        <h3 class="dossier-section-title">2. Notes from Real Conversations</h3>
        <div class="flex-between text-xs mb-2">
          <span><strong>Total People Spoken To:</strong> ${interviews.length}</span>
          <span><strong>High Pain Level (4-5/5):</strong> ${highPain}</span>
          <span><strong>Indicated Willingness to Pay:</strong> ${interviews.filter(i => i.willingToPaySignal).length} people</span>
        </div>

        ${interviews.length > 0 ? `
          <div class="table-responsive">
            <table class="data-table text-xs">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Where Met</th>
                  <th>Current Workaround</th>
                  <th>Spent Last Mo.</th>
                  <th>Pain</th>
                  <th>Memorable Quote</th>
                </tr>
              </thead>
              <tbody>
                ${interviews.map(i => `
                  <tr>
                    <td><strong>${escapeHtml(i.contactName)}</strong></td>
                    <td>${escapeHtml(i.channel)}</td>
                    <td>${escapeHtml(i.pastWorkaround)}</td>
                    <td>${escapeHtml(i.spentLastMonth)}</td>
                    <td>${i.painScore}/5</td>
                    <td class="font-italic">"${escapeHtml(i.keyQuote)}"</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : `<p class="text-xs text-muted">No conversations logged yet.</p>`}
      </div>

      <!-- Section 3: 1-Page Plan Overview -->
      <div class="dossier-section mb-4">
        <h3 class="dossier-section-title">3. Your 1-Page Plan Overview</h3>
        <div class="grid-3-col text-xs">
          <div class="p-2 bg-oat rounded">
            <strong>The Headache:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.problem || "-")}</p>
          </div>
          <div class="p-2 bg-oat rounded">
            <strong>Your Helpful Answer:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.solution || "-")}</p>
          </div>
          <div class="p-2 bg-oat rounded">
            <strong>Why Choose You:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.uniqueValueProposition || "-")}</p>
          </div>
          <div class="p-2 bg-oat rounded">
            <strong>Who Suffers Most:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.customerSegments || "-")}</p>
          </div>
          <div class="p-2 bg-oat rounded">
            <strong>Where to Reach Them:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.channels || "-")}</p>
          </div>
          <div class="p-2 bg-oat rounded">
            <strong>How You Make Money:</strong>
            <p class="mt-1 mb-0">${escapeHtml(s3.canvas.revenueStreams || "-")}</p>
          </div>
        </div>
      </div>

      <!-- Section 4: Cheap Test Results -->
      <div class="dossier-section mb-4">
        <h3 class="dossier-section-title">4. Quick Test Results</h3>
        <div class="p-3 bg-highlight rounded text-xs">
          <div class="flex-between mb-1">
            <strong>Test Name: ${escapeHtml(s4.experimentName || s4.selectedExperimentId || "-")}</strong>
            <span class="badge ${s4.evaluatorResult ? s4.evaluatorResult.badgeClass : "badge-neutral"}">
              ${s4.evaluatorResult ? s4.evaluatorResult.verdict : "Not tested yet"}
            </span>
          </div>
          <div><strong>People Contacted:</strong> ${s4.visitorCount || 0} | <strong>People Who Said Yes:</strong> ${s4.conversionCount || 0} | <strong>Money / Deposits:</strong> $${s4.preorderCount || 0}</div>
          <p class="mt-2 mb-0"><strong>Observations:</strong> ${escapeHtml(s4.experimentNotes || "None logged")}</p>
        </div>
      </div>

      <!-- Section 5: Starter Budget -->
      <div class="dossier-section">
        <div class="flex-between mb-2">
          <h3 class="dossier-section-title m-0">5. 30-Day Starter Budget</h3>
          <strong>Total Budget: $${totalBudget}</strong>
        </div>
        <ul class="step-list text-xs">
          ${(s5.microBudgetItems || []).map(b => `
            <li>${escapeHtml(b.description)}: <strong>$${b.amount}</strong></li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderFlyerHTML() {
  const s = store.state;
  const audience = s.stage1.targetAudience || "Local Neighbors & Friends";
  const workaround = s.stage1.currentWorkaround || "dealing with this headache manually";
  const premise = s.stage1.elevatorPremise || s.stage3.canvas.uniqueValueProposition || "A friendly, simple way to make life easier.";

  const headline = customFlyerHooks?.headline || `Attention ${audience}!`;
  const subheadline = customFlyerHooks?.subheadline || `Are you tired of having to ${workaround}?`;
  const bullets = customFlyerHooks?.bullets || null;
  const cta = customFlyerHooks?.callToAction || "We are looking for 5 people to try our first batch for free!";

  return `
    <div class="flyer-container p-4 bg-white border-warm rounded text-center">
      <div class="flyer-tag mb-2 text-terracotta font-bold text-xs">
        📢 LOCAL COMMUNITY NOTICE & CALL FOR TESTERS
      </div>
      <h2 class="flyer-headline text-espresso mb-3">
        ${escapeHtml(headline)}
      </h2>
      <div class="flyer-question p-3 bg-oat rounded text-sm mb-3 font-bold">
        ${escapeHtml(subheadline)}
      </div>

      ${bullets && bullets.length ? `
        <div class="flyer-bullets text-left max-w-500 mx-auto my-3 p-3 bg-sand-light rounded border-warm text-xs text-charcoal">
          ${bullets.map(b => `<div class="mb-1">${escapeHtml(b)}</div>`).join("")}
        </div>
      ` : `
        <p class="flyer-body text-sm text-charcoal mb-4 max-w-600 mx-auto">
          ${escapeHtml(premise)}
        </p>
      `}

      <div class="flyer-callout p-3 bg-highlight border-warm rounded mb-4 max-w-600 mx-auto">
        <strong class="text-terracotta">${escapeHtml(cta)}</strong>
        <p class="text-xs text-muted mt-1 mb-0">
          In exchange, all we ask is 10 minutes of your honest feedback. No sales pitch, no pushy calls.
        </p>
      </div>
      <div class="flyer-contact p-3 border-top text-xs text-muted">
        <div><strong>Interested? Contact:</strong> [Insert Your Phone or Email Here]</div>
        <div class="mt-1">Project: ${escapeHtml(s.name || "Community Pilot")}</div>
      </div>
    </div>
  `;
}

function generateFlyerText() {
  const s = store.state;
  const audience = s.stage1.targetAudience || "Local Neighbors";
  const workaround = s.stage1.currentWorkaround || "dealing with this manually";
  const premise = s.stage1.elevatorPremise || s.stage3.canvas.uniqueValueProposition || "A simple way to fix this.";

  if (customFlyerHooks) {
    return `${customFlyerHooks.headline.toUpperCase()}

${customFlyerHooks.subheadline}

${(customFlyerHooks.bullets || []).join("\n")}

${customFlyerHooks.callToAction}
In exchange, all we ask for is 10 minutes of your honest feedback.

Interested? Reply to this notice or text me at [Your Phone/Email]!
Project: ${s.name || "Local Pilot"}
`;
  }

  return `ATTENTION ${audience.toUpperCase()}!

Are you tired of having to ${workaround}?

${premise}

We are testing a simple, local solution and looking for 5 people to try it out.
In exchange, all we ask for is 10 minutes of your honest feedback.

Interested? Reply to this post or text me at [Your Phone/Email]!
Project: ${s.name || "Local Pilot"}
`;
}

function generateMarkdownDossier() {
  const s = store.state;
  const s1 = s.stage1;
  const s2 = s.stage2;
  const s3 = s.stage3;
  const s4 = s.stage4;
  const s5 = s.stage5;

  const interviews = s2.interviews || [];
  const highPain = interviews.filter(i => Number(i.painScore) >= 4).length;
  const totalBudget = (s5.microBudgetItems || []).reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

  return `# Small Business Project Summary: ${s.name || "My Project"}
Date: ${new Date().toLocaleDateString()}
Step Reached: ${s.currentStage} of 5
Confidence Score: ${store.getConfidenceScore()}%

## 1. Problem & Who It Helps
- Core Problem Statement: ${s1.problemHypothesis || "Not written yet"}
- Target People: ${s1.targetAudience || "Not specified"}
- Current Clumsy Workaround: ${s1.currentWorkaround || "Not specified"}
- Tangible Cost: ${s1.tangibleCost || "Not specified"}
- 10-Second Explanation: ${s1.elevatorPremise || "Not specified"}

## 2. Conversation Notes
- Total People Spoken To: ${interviews.length}
- Severe Headache Count (4-5/5): ${highPain}
- Indicated Willingness to Pay: ${interviews.filter(i => i.willingToPaySignal).length}

### Memorable Quotes:
${interviews.map(i => `* ${i.contactName} (${i.channel}): Pain ${i.painScore}/5. Spent last month: ${i.spentLastMonth}. Quote: "${i.keyQuote}"`).join("\n")}

## 3. Simple 1-Page Plan
- The Headache: ${s3.canvas.problem || "-"}
- What They Do Today: ${s3.canvas.existingAlternatives || "-"}
- Your Helpful Answer: ${s3.canvas.solution || "-"}
- Why Choose You: ${s3.canvas.uniqueValueProposition || "-"}
- Who Suffers Most: ${s3.canvas.customerSegments || "-"}
- First People to Try It: ${s3.canvas.earlyAdopters || "-"}
- Where to Reach Them: ${s3.canvas.channels || "-"}
- How You Make Money: ${s3.canvas.revenueStreams || "-"}
- What It Costs to Run: ${s3.canvas.costStructure || "-"}
- Signs People Love It: ${s3.canvas.keyMetrics || "-"}
- Your Personal Edge: ${s3.canvas.unfairAdvantage || "-"}

## 4. Quick Test Results
- Test Name: ${s4.experimentName || s4.selectedExperimentId || "-"}
- People Reached: ${s4.visitorCount || 0}
- People Who Said Yes: ${s4.conversionCount || 0}
- Money / Deposits Collected: $${s4.preorderCount || 0}
- Result: ${s4.evaluatorResult ? s4.evaluatorResult.verdict : "Not evaluated"}
- Notes: ${s4.experimentNotes || "None"}

## 5. 30-Day Starter Budget (Total: $${totalBudget})
${(s5.microBudgetItems || []).map(b => `* ${b.description}: $${b.amount}`).join("\n")}
`;
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
