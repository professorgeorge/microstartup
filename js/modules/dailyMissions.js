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
    <div class="missions-container">
      <div class="missions-header flex-between">
        <div class="missions-title-group">
          <span class="missions-icon" aria-hidden="true">⚡</span>
          <div>
            <div class="flex-row items-center gap-2">
              <h3 class="missions-title m-0">15-Minute Daily Founder Missions</h3>
              <span class="badge ${stats.pct === 100 ? "badge-success" : "badge-accent"} text-xs">
                ${stats.pct === 100 ? "🎉 All 10 Done!" : `🔥 ${stats.completed} of ${stats.total} Complete (${stats.pct}%)`}
              </span>
            </div>
            <p class="missions-subtitle text-xs text-muted m-0 mt-1">
              No time to build a whole startup today? Complete just one 15-minute mission to keep moving forward.
            </p>
          </div>
        </div>

        <div class="missions-actions flex-row items-center gap-2">
          <button id="btn-toggle-missions" class="btn btn-secondary text-xs">
            ${isMissionsExpanded ? "▲ Collapse" : "▼ View All 10 Missions"}
          </button>
        </div>
      </div>

      <!-- Quick Active Mission Callout (Always visible) -->
      ${nextMission ? `
        <div class="next-mission-banner mt-3 p-2 bg-white-soft rounded border-warm flex-between">
          <div class="flex-row items-center gap-2">
            <span class="badge badge-warning text-xs">Today's Mission</span>
            <strong class="text-espresso text-xs">${nextMission.title}</strong>
            <span class="text-xs text-muted">(${nextMission.duration}): ${nextMission.desc}</span>
          </div>
          <div class="flex-row items-center gap-2">
            ${nextMission.stage === 2 ? `
              <button class="btn btn-secondary text-xs btn-open-sim-mission" title="Rehearse customer chats first in the safe arena">
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
      ` : `
        <div class="next-mission-banner mt-3 p-2 bg-success-soft rounded border-warm flex-between">
          <span class="text-xs text-success font-bold">
            🌟 Fantastic job! You have completed all 10 Daily Founder Missions!
          </span>
          <button class="btn btn-secondary text-xs btn-jump-mission" data-stage="summary">
            View Project Summary & Flyer →
          </button>
        </div>
      `}

      <!-- Full Expandable Missions Checklist -->
      ${isMissionsExpanded ? `
        <div class="missions-list mt-3">
          ${DEFAULT_MISSIONS.map(m => {
            const isDone = completedMissions.includes(m.id);
            return `
              <div class="mission-item ${isDone ? "mission-done" : ""} p-2 mb-2 rounded bg-white-soft border-warm flex-between">
                <div class="flex-row items-center gap-3">
                  <label class="mission-checkbox-label">
                    <input type="checkbox" class="mission-chk" data-id="${m.id}" ${isDone ? "checked" : ""}>
                    <span class="checkmark"></span>
                  </label>
                  <div>
                    <div class="flex-row items-center gap-2">
                      <strong class="mission-item-title text-sm ${isDone ? "text-muted font-strikethrough" : "text-espresso"}">
                        ${m.title}
                      </strong>
                      <span class="badge badge-neutral text-xs">${m.duration}</span>
                      <span class="badge badge-accent text-xs">Step ${m.stage}</span>
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
      ` : ""}
    </div>
  `;

  attachMissionsEvents(container);
}

function attachMissionsEvents(container) {
  const toggleBtn = container.querySelector("#btn-toggle-missions");
  toggleBtn?.addEventListener("click", () => {
    isMissionsExpanded = !isMissionsExpanded;
    renderDailyMissions(container);
  });

  container.querySelectorAll(".mission-chk").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      store.toggleMission(id);
      renderDailyMissions(container);
    });
  });

  container.querySelectorAll(".btn-quick-check-mission").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      store.toggleMission(id);
      renderDailyMissions(container);
    });
  });

  container.querySelectorAll(".btn-open-sim-mission").forEach(btn => {
    btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("app:open-simulator"));
    });
  });

  container.querySelectorAll(".btn-jump-mission").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const rawStage = e.currentTarget.getAttribute("data-stage");
      const numStage = parseInt(rawStage, 10);
      const target = isNaN(numStage) ? rawStage : numStage;
      window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: target } }));
    });
  });
}
