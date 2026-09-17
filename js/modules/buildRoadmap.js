// buildRoadmap.js: Step 5: Next Steps, Starter Budget, and Grant Exploration.
// Provided strictly for educational and planning purposes without financial or legal guarantees.

import { store } from "../store.js";
import { decisionTrees } from "../data/decisionTrees.js";
import { fundingPrograms, readinessChecklist } from "../data/grantsData.js";
import { callAi } from "../services/aiClient.js";

let aiBudgetSuggestions = null;
let isAuditingBudget = false;

export function renderStage5(container) {
  const s5 = store.state.stage5;
  const activeTab = store.state.activeDecisionTreeTab || "finance";
  const budgetItems = s5.microBudgetItems || [];
  const totalBudget = budgetItems.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const calc = store.getNapkinMathCalculations();
  const breakEvenCount = calc.price > 0 ? Math.ceil(totalBudget / calc.price) : 0;

  const readiness = s5.readinessChecks || {};
  const totalChecks = readinessChecklist.length;
  const passedChecks = readinessChecklist.filter(c => readiness[c.id]).length;
  const readinessPct = Math.round((passedChecks / totalChecks) * 100);

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Step 5: Next Steps & Grants</div>
      <h2 class="stage-title">Planning Next Steps & Grant Exploration</h2>
      <p class="stage-subtitle">
        Now that you have gathered initial customer feedback, review practical execution steps.
        Set up a cautious starter budget and explore third-party grant opportunities that support small businesses.
      </p>
    </div>

    <!-- Practical Guides Tabs -->
    <div class="card mb-4">
      <div class="tabs-header">
        <button class="tab-btn ${activeTab === "finance" ? "active" : ""}" data-tab="finance">
          💰 Money Guide
        </button>
        <button class="tab-btn ${activeTab === "marketing" ? "active" : ""}" data-tab="marketing">
          🎯 Finding Your First 20 People
        </button>
        <button class="tab-btn ${activeTab === "team" ? "active" : ""}" data-tab="team">
          🤝 Solo or Partner?
        </button>
      </div>

      <div class="tab-content p-4">
        ${renderDecisionTreeContent(activeTab)}
      </div>
    </div>

    <!-- Micro-Budget Calculator -->
    <div class="card card-oat mb-4">
      <div class="flex-between">
        <div>
          <h3 class="panel-heading m-0">Your 30-Day Starter Budget</h3>
          <p class="text-xs text-muted mt-1 mb-0">Keep your planned spending small and conservative. Focus on essential needs.</p>
        </div>
        <div class="stat-badge">
          <span class="stat-num">$${totalBudget}</span>
          <span class="stat-lbl">Total Planned</span>
        </div>
      </div>

      <div class="budget-table-container mt-3">
        <table class="data-table">
          <thead>
            <tr>
              <th>Expense Item</th>
              <th style="width: 140px;">Cost ($)</th>
              <th style="width: 80px;">Action</th>
            </tr>
          </thead>
          <tbody id="budget-items-body">
            ${budgetItems.map((item, idx) => `
              <tr>
                <td>
                  <input type="text" class="budget-desc-input" data-index="${idx}" value="${escapeHtml(item.description)}">
                </td>
                <td>
                  <input type="number" class="budget-amt-input" data-index="${idx}" min="0" value="${item.amount}">
                </td>
                <td>
                  <button class="btn-icon text-danger delete-budget-btn" data-index="${idx}">✕</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="flex-between mt-3">
        <div class="flex-row items-center gap-2">
          <button id="btn-add-budget-item" class="btn btn-secondary text-xs">+ Add Expense Item</button>
          <button id="btn-ai-audit-budget" class="btn btn-secondary text-xs flex-center gap-1" ${isAuditingBudget ? "disabled" : ""} style="border-color: var(--color-amber);">
            <span>${isAuditingBudget ? "⏳" : "✨"}</span> 
            <strong>${isAuditingBudget ? "Auditing budget..." : "AI Blindspot & Hidden Cost Audit"}</strong>
          </button>
        </div>
        <button id="btn-save-budget" class="btn btn-primary text-xs">Save Budget</button>
      </div>

      ${aiBudgetSuggestions ? `
        <div class="card card-highlight p-3 border-warm mt-3 animate-fade-in" style="border-left: 4px solid var(--color-amber);">
          <div class="flex-between mb-2">
            <div class="flex-row items-center gap-2">
              <span style="font-size: 1.2rem;">✨</span>
              <strong class="text-terracotta text-xs font-bold">Overlooked Hidden Costs for Your Trade:</strong>
            </div>
            <button class="btn-icon text-xs" id="btn-dismiss-ai-budget" title="Dismiss">✕</button>
          </div>
          <p class="text-xs text-muted mb-2">${escapeHtml(aiBudgetSuggestions.advice || "Common small expenses founders forget to budget:")}</p>
          <div class="budget-suggestions-list">
            ${(aiBudgetSuggestions.items || []).map((item, idx) => `
              <div class="p-2 mb-2 bg-white-soft rounded border-warm flex-between gap-2 text-xs">
                <div>
                  <strong class="text-espresso">${escapeHtml(item.description)}</strong>
                  <span class="text-muted ml-2">~$${item.amount}</span>
                  <span class="text-xs text-terracotta d-block">${escapeHtml(item.reason || "")}</span>
                </div>
                <button class="btn btn-primary text-xs btn-add-suggested-cost" data-index="${idx}" style="white-space: nowrap;">
                  + Add to Budget
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Break-Even Velocity Insight -->
      <div class="p-3 bg-white-soft rounded border-warm mt-3 flex-between">
        <div>
          <strong class="text-espresso">⚡ Break-Even Velocity:</strong>
          <span class="text-xs text-muted ml-1">
            Based on your unit price of <strong>$${calc.price}</strong> from Step 3:
          </span>
          <div class="text-sm mt-1">
            You need just <strong class="text-terracotta" style="font-size: 1.15rem;">${breakEvenCount} paying ${calc.unitLabel}</strong> to completely pay back your $${totalBudget} starter budget!
          </div>
        </div>
        <span class="badge badge-success text-xs">Low Financial Risk</span>
      </div>
    </div>

    <!-- Funding Readiness Checklist -->
    <div class="card card-highlight mb-4">
      <div class="flex-between">
        <div>
          <span class="badge badge-accent mb-1">Grant Preparation Checklist</span>
          <h3 class="panel-heading m-0">Application Preparation Score: ${readinessPct}%</h3>
          <p class="text-xs text-muted mt-1 mb-0">
            Completing these preparation items helps organize your materials before submitting external applications.
          </p>
        </div>
        <div class="stat-badge">
          <span class="stat-num">${passedChecks} / ${totalChecks}</span>
          <span class="stat-lbl">Items Prepared</span>
        </div>
      </div>

      <div class="readiness-list mt-3">
        ${readinessChecklist.map(check => {
          const isChecked = !!readiness[check.id];
          return `
            <div class="readiness-item ${isChecked ? "item-passed" : ""}">
              <label class="checkbox-label">
                <input type="checkbox" class="readiness-chk" data-id="${check.id}" ${isChecked ? "checked" : ""}>
                <div>
                  <strong>${check.label}</strong>
                  <p class="text-xs text-muted mb-0">${check.description}</p>
                </div>
              </label>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- Grants Directory -->
    <div class="card mb-4">
      <div class="flex-between mb-3">
        <div>
          <h3 class="panel-heading m-0">Third-Party Grants & Mentorship Programs</h3>
          <p class="text-xs text-muted mt-1 mb-0">
            Informational directory of independent programs. All grants are subject to third-party eligibility and competitive selection; funding is never guaranteed.
          </p>
        </div>
      </div>

      <div class="grants-grid">
        ${fundingPrograms.map(prog => `
          <div class="grant-card">
            <div class="flex-between mb-2">
              <span class="badge badge-success text-xs">${prog.equity}</span>
              <span class="badge badge-neutral text-xs">${prog.amountRange}</span>
            </div>
            <h4 class="grant-name">${prog.name}</h4>
            <div class="text-xs text-muted mb-2">Organization: ${prog.provider}</div>
            
            <div class="grant-details text-xs">
              <div class="mb-1"><strong>Target Applicants:</strong> ${prog.stageTarget}</div>
              <div class="mb-1"><strong>Typical Requirements:</strong> ${prog.readinessRequirement}</div>
              <div class="tactical-box mt-2 p-2 rounded bg-oat">
                <strong>Practical Tip:</strong> ${prog.tacticalAdvice}
              </div>
            </div>

            <div class="mt-3 text-right">
              <a href="${prog.actionUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary text-xs">
                Visit External Site ↗
              </a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Final Export Card -->
    <div class="card card-highlight text-center py-4">
      <h3 class="panel-heading m-0">Create Your 1-Click Project Summary</h3>
      <p class="text-sm text-muted mt-2 max-w-600 mx-auto">
        Review your problem summary, conversation notes, 1-page plan, and budget in a single organized document.
        Useful for sharing with a mentor, local advisor, or preparing grant materials.
      </p>
      <div class="mt-3">
        <button id="btn-open-dossier" class="btn btn-primary btn-lg">
          📄 View & Export My Complete Summary
        </button>
      </div>
    </div>
  `;

  attachStage5Events(container);
}

function renderDecisionTreeContent(tabKey) {
  const tree = decisionTrees[tabKey];
  if (!tree) return `<p>Select a guide above.</p>`;

  const path = store.state.decisionTreePath[tabKey] || ["start"];
  const currentNodeKey = path[path.length - 1];
  const node = tree.nodes[currentNodeKey] || tree.nodes["start"];

  return `
    <div class="decision-tree-container">
      <div class="flex-between mb-2">
        <h4 class="text-terracotta m-0">${tree.title}</h4>
        ${path.length > 1 ? `
          <button class="btn-link text-xs btn-tree-restart" data-tab="${tabKey}">↺ Start Over</button>
        ` : ""}
      </div>
      <p class="text-sm text-muted mb-3">${tree.intro}</p>

      ${node.type === "outcome" ? `
        <div class="outcome-box p-3 rounded bg-highlight border-warm">
          <div class="flex-between mb-2">
            <span class="badge badge-accent">${node.badge}</span>
          </div>
          <strong class="text-espresso">${node.summary}</strong>
          <ul class="step-list text-sm mt-3">
            ${node.actionSteps.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
      ` : `
        <div class="question-box p-3 rounded bg-oat">
          <h5 class="question-text mb-3">${node.question}</h5>
          <div class="options-list">
            ${node.options.map((opt, idx) => `
              <button class="btn btn-secondary tree-opt-btn w-100 text-left mb-2" data-tab="${tabKey}" data-next="${opt.next}">
                → ${opt.text}
              </button>
            `).join("")}
          </div>
        </div>
      `}
    </div>
  `;
}

function attachStage5Events(container) {
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      store.state.activeDecisionTreeTab = tab;
      store.saveState();
      renderStage5(container);
    });
  });

  container.querySelectorAll(".tree-opt-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      const next = e.currentTarget.getAttribute("data-next");
      if (!store.state.decisionTreePath[tab]) store.state.decisionTreePath[tab] = ["start"];
      store.state.decisionTreePath[tab].push(next);
      store.saveState();
      renderStage5(container);
    });
  });

  container.querySelectorAll(".btn-tree-restart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      store.state.decisionTreePath[tab] = ["start"];
      store.saveState();
      renderStage5(container);
    });
  });

  const addBudgetBtn = container.querySelector("#btn-add-budget-item");
  const saveBudgetBtn = container.querySelector("#btn-save-budget");

  addBudgetBtn?.addEventListener("click", () => {
    if (!store.state.stage5.microBudgetItems) store.state.stage5.microBudgetItems = [];
    store.state.stage5.microBudgetItems.push({
      id: "b_" + Date.now(),
      description: "New expense item",
      amount: 50
    });
    store.saveState();
    renderStage5(container);
  });

  saveBudgetBtn?.addEventListener("click", () => {
    syncBudgetFromDOM(container);
    store.saveState();
    renderStage5(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
  });

  // AI Budget Audit Click
  const aiBudgetBtn = container.querySelector("#btn-ai-audit-budget");
  aiBudgetBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    isAuditingBudget = true;
    renderStage5(container);

    const idea = store.state.name || "Small Business";
    const s1 = store.state.stage1 || {};
    const audience = s1.targetAudience || "Local clients";
    const existingItems = (store.state.stage5.microBudgetItems || []).map(i => `${i.description} ($${i.amount})`).join(", ");

    const prompt = `Review this micro-startup starter budget:
Business: "${idea}"
Audience: "${audience}"
Current Planned Expenses: ${existingItems || "None yet"}

Task: Identify 2 to 3 commonly overlooked or hidden small expenses that founders in this type of trade or service forget until it's too late (e.g. food cottage licensing, trade liability insurance, card payment processing fee buffers, basic sanitizer/ppe, domain renewal).
Keep each expense modest and realistic under $100.

Respond strictly with valid JSON only in this exact format:
{
  "advice": "1 brief sentence summarizing why tracking hidden costs early keeps your startup safe.",
  "items": [
    {
      "description": "Specific expense name",
      "amount": 45,
      "reason": "Why this is critical for this trade"
    }
  ]
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are a conservative financial advisor helping small micro-startups keep budgets safe.",
        temperature: 0.7,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      aiBudgetSuggestions = parsed;
    } catch (err) {
      alert(`AI Budget Audit error: ${err.message || String(err)}`);
    } finally {
      isAuditingBudget = false;
      renderStage5(container);
    }
  });

  // Dismiss AI budget suggestions
  container.querySelector("#btn-dismiss-ai-budget")?.addEventListener("click", () => {
    aiBudgetSuggestions = null;
    renderStage5(container);
  });

  // Add suggested cost to budget
  container.querySelectorAll(".btn-add-suggested-cost").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      const item = aiBudgetSuggestions?.items?.[idx];
      if (item) {
        if (!store.state.stage5.microBudgetItems) store.state.stage5.microBudgetItems = [];
        store.state.stage5.microBudgetItems.push({
          id: "b_" + Date.now(),
          description: item.description,
          amount: Number(item.amount) || 25
        });
        store.saveState();
        renderStage5(container);
        window.dispatchEvent(new CustomEvent("app:state-updated"));
      }
    });
  });

  container.querySelectorAll(".delete-budget-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      store.state.stage5.microBudgetItems.splice(idx, 1);
      store.saveState();
      renderStage5(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    });
  });

  container.querySelectorAll(".readiness-chk").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!store.state.stage5.readinessChecks) store.state.stage5.readinessChecks = {};
      store.state.stage5.readinessChecks[id] = e.currentTarget.checked;
      store.saveState();
      renderStage5(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    });
  });

  const openDossierBtn = container.querySelector("#btn-open-dossier");
  openDossierBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:open-dossier"));
  });
}

function syncBudgetFromDOM(container) {
  const items = [];
  container.querySelectorAll("#budget-items-body tr").forEach(row => {
    const desc = row.querySelector(".budget-desc-input")?.value.trim();
    const amt = parseFloat(row.querySelector(".budget-amt-input")?.value) || 0;
    if (desc) {
      items.push({ id: "b_" + Math.random().toString(36).substr(2, 6), description: desc, amount: amt });
    }
  });
  store.state.stage5.microBudgetItems = items;
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
