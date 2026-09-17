// setbackAlchemist.js: The Encourager & Fix-It Guide.
// Friendly, honest advice when you hit a bump in the road.

import { alchemistScenarios } from "../data/alchemistData.js";
import { store } from "../store.js";

export function initSetbackAlchemist() {
  const modal = document.getElementById("alchemist-modal");
  const closeBtn = document.getElementById("alchemist-close-btn");
  const scenariosList = document.getElementById("alchemist-scenarios-list");
  const detailView = document.getElementById("alchemist-detail-view");

  scenariosList.innerHTML = alchemistScenarios.map(sc => `
    <button class="scenario-item-btn text-left" data-id="${sc.id}">
      <span class="scenario-title">💡 ${sc.title}</span>
      <span class="scenario-snippet text-xs text-muted mt-1">${sc.symptom}</span>
    </button>
  `).join("");

  scenariosList.querySelectorAll(".scenario-item-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      showScenarioDetail(id, scenariosList, detailView);
    });
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("modal-open");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("modal-open");
    }
  });

  window.addEventListener("app:open-alchemist", (e) => {
    modal.classList.add("modal-open");
    const targetId = e.detail?.scenarioId || store.state.activeAlchemistScenarioId || alchemistScenarios[0].id;
    showScenarioDetail(targetId, scenariosList, detailView);
  });
}

function showScenarioDetail(scenarioId, listEl, detailEl) {
  store.state.activeAlchemistScenarioId = scenarioId;
  store.saveState();

  listEl.querySelectorAll(".scenario-item-btn").forEach(btn => {
    btn.classList.toggle("active-scenario", btn.getAttribute("data-id") === scenarioId);
  });

  const scenario = alchemistScenarios.find(s => s.id === scenarioId) || alchemistScenarios[0];

  detailEl.innerHTML = `
    <div class="scenario-detail-header mb-3">
      <span class="badge badge-accent mb-1">Friendly Guidance</span>
      <h3 class="m-0 text-espresso">${scenario.title}</h3>
      <p class="text-xs text-muted mt-1">${scenario.symptom}</p>
    </div>

    <div class="diagnosis-card mb-3 p-3 rounded bg-highlight border-warm">
      <strong class="text-terracotta">What this actually means:</strong>
      <p class="text-sm mt-1 mb-0">${scenario.diagnosis}</p>
    </div>

    <div class="fix-card mb-3 p-3 rounded bg-oat">
      <strong class="text-espresso">How to handle it:</strong>
      <p class="text-sm mt-1 mb-0">${scenario.tacticalFix}</p>
    </div>

    <div class="action-card mb-3 p-3 rounded bg-white-soft border-warm">
      <div class="flex-between mb-1">
        <strong class="text-terracotta">A friendly script to say or send:</strong>
        <button id="btn-copy-alchemist-script" class="btn-link text-xs">📋 Copy Script</button>
      </div>
      <p id="alchemist-script-text" class="text-sm font-italic mb-0 p-2 bg-oat rounded">
        "${scenario.actionPrompt}"
      </p>
    </div>

    <div class="pivot-card p-3 rounded bg-accent-soft">
      <strong class="text-espresso">Where to look next:</strong>
      <p class="text-sm mt-1 mb-0">${scenario.pivotDirection}</p>
    </div>
  `;

  const copyBtn = detailEl.querySelector("#btn-copy-alchemist-script");
  copyBtn?.addEventListener("click", () => {
    const text = scenario.actionPrompt;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => { copyBtn.textContent = "📋 Copy Script"; }, 2000);
    });
  });
}
