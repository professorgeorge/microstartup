// dailyMissions.js: The 15-Minute Daily Founder Missions module.
// Breaks down the startup journey into non-intimidating, bite-sized daily actions.

import { store, DEFAULT_MISSIONS } from "../store.js";

let isMissionsExpanded = false;

export function renderDailyMissions(container) {
  if (!container) return;

  const stats = store.getMissionStats();
  const completedMissions = store.state.completedMissions || [];
  
  // Find the first uncompleted mission as "Next Mission"
  const nextMission = DEFAULT_MISSIONS.find(m => !completedMissions.includes(m.id)) || null;

  container.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div class="flex-row items-center gap-2">
          <span style="font-size: 1.4rem;" aria-hidden="true">⚡</span>
          <div>
            <h3 class="m-0 text-sm font-bold text-espresso">15-Minute Daily Founder Missions</h3>
            <span class="text-xs text-muted">Bite-sized daily steps so you never feel overwhelmed</span>
          </div>
        </div>
        <div class="flex-row items-center gap-2">
          <span class="badge ${stats.pct === 100 ? "badge-success" : "badge-accent"} text-xs">
            ${stats.pct === 100 ? "🎉 All 10 Done!" : `🔥 ${stats.completed} of ${stats.total} Done (${stats.pct}%)`}
          </span>
          <button class="btn-icon" id="missions-modal-close-btn" aria-label="Close missions modal">✕</button>
        </div>
      </div>
    </div>

    <div class="modal-body text-sm" style="max-height: 70vh; overflow-y: auto;">
      <p class="text-xs text-muted mb-3">
        No time to build an entire company today? Complete just one 15-minute mission below to keep moving forward without stress.
      </p>

      <!-- Active Next Mission Card -->
      ${nextMission ? `
        <div class="card p-3 bg-white-soft border-warm mb-3">
          <div class="flex-between mb-1">
            <span class="badge badge-warning text-xs">Today's Recommended Mission</span>
            <span class="text-xs text-muted">${nextMission.duration}</span>
          </div>
          <h4 class="m-0 text-espresso text-sm">${nextMission.title}</h4>
          <p class="text-xs text-charcoal mt-1 mb-2">${nextMission.desc}</p>
          <div class="flex-between">
            <span class="badge badge-sand text-xs">Step ${nextMission.stage}</span>
            <div class="flex-row items-center gap-2">
              ${nextMission.stage === 2 ? `
                <button class="btn btn-secondary text-xs btn-open-sim-mission" title="Practice conversation in simulator">
                  🎮 Simulator
                </button>
              ` : ""}
              <button class="btn btn-primary text-xs btn-jump-mission" data-stage="${nextMission.stage}">
                Go to Step ${nextMission.stage} →
              </button>
              <button class="btn btn-secondary text-xs btn-quick-check-mission" data-id="${nextMission.id}">
                ✓ Mark Done
              </button>
            </div>
          </div>
        </div>
      ` : `
        <div class="card p-3 bg-success-soft border-warm mb-3 flex-between">
          <span class="text-xs text-success font-bold">
            🌟 Fantastic job! You have completed all 10 Daily Founder Missions!
          </span>
          <button class="btn btn-secondary text-xs btn-jump-mission" data-stage="summary">
            View Summary & Flyer →
          </button>
        </div>
      `}

      <!-- Full 10-Mission Action Checklist -->
      <div class="flex-between mb-2">
        <h4 class="text-espresso text-xs font-bold m-0">All 10 Action Missions:</h4>
        <span class="text-xs text-muted">${stats.completed}/10 checked</span>
      </div>

      <div class="missions-list">
        ${DEFAULT_MISSIONS.map(m => {
          const isDone = completedMissions.includes(m.id);
          return `
            <div class="mission-item ${isDone ? "mission-done" : ""} p-2 mb-2 rounded bg-white-soft border-warm flex-between">
              <div class="flex-row items-center gap-3" style="flex: 1;">
                <label class="mission-checkbox-label">
                  <input type="checkbox" class="mission-chk" data-id="${m.id}" ${isDone ? "checked" : ""}>
                  <span class="checkmark"></span>
                </label>
                <div>
                  <div class="flex-row items-center gap-2">
                    <strong class="mission-item-title text-xs ${isDone ? "text-muted font-strikethrough" : "text-espresso"}">
                      ${m.title}
                    </strong>
                    <span class="badge badge-neutral text-xs">${m.duration}</span>
                    <span class="badge badge-sand text-xs">Step ${m.stage}</span>
                  </div>
                  <p class="mission-item-desc text-xs text-muted m-0 mt-1">
                    ${m.desc}
                  </p>
                </div>
              </div>

              <div class="mission-item-actions flex-row items-center gap-2">
                ${m.stage === 2 ? `
                  <button class="btn btn-secondary text-xs btn-open-sim-mission" title="Rehearse dialogue first">
                    🎮 Practice
                  </button>
                ` : ""}
                <button class="btn btn-secondary text-xs btn-jump-mission" data-stage="${m.stage}">
                  Step ${m.stage} →
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <div class="modal-footer flex-between">
      <span class="text-xs text-muted">Missions auto-save to your local device storage.</span>
      <button class="btn btn-secondary text-xs" id="missions-modal-footer-close-btn">Close</button>
    </div>
  `;

  attachMissionsEvents(container);
}

function attachMissionsEvents(container) {
  const close = () => {
    container.closest(".modal-overlay")?.classList.remove("modal-open");
  };

  container.querySelector("#missions-modal-close-btn")?.addEventListener("click", close);
  container.querySelector("#missions-modal-footer-close-btn")?.addEventListener("click", close);

  container.querySelectorAll(".mission-chk").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      store.toggleMission(id);
      renderDailyMissions(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    });
  });

  container.querySelectorAll(".btn-quick-check-mission").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      store.toggleMission(id);
      renderDailyMissions(container);
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    });
  });

  container.querySelectorAll(".btn-open-sim-mission").forEach(btn => {
    btn.addEventListener("click", () => {
      close();
      window.dispatchEvent(new CustomEvent("app:open-simulator"));
    });
  });

  container.querySelectorAll(".btn-jump-mission").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const rawStage = e.currentTarget.getAttribute("data-stage");
      const numStage = parseInt(rawStage, 10);
      const target = isNaN(numStage) ? rawStage : numStage;
      close();
      window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: target } }));
    });
  });
}
