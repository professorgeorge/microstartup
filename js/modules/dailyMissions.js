// dailyMissions.js: The 15-Minute Daily Founder Missions module.
// Breaks down the startup journey into non-intimidating, bite-sized daily actions.

import { store, DEFAULT_MISSIONS } from "../store.js";
import { simplifyMission } from "../services/aiClient.js";

let isMissionsExpanded = false;
let activeBabyStep = null; // { missionId, data, loading }

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
          
          ${activeBabyStep && activeBabyStep.missionId === nextMission.id ? `
            <div class="baby-step-card p-3 my-2 bg-sand-light rounded border-warm">
              <div class="flex-between mb-1">
                <strong class="text-terracotta text-xs">🌱 5-Minute Baby Step: ${activeBabyStep.data?.babyStepTitle || ""}</strong>
                <span class="badge badge-accent text-xs">Zero Pressure</span>
              </div>
              <p class="text-xs text-charcoal mb-1">${activeBabyStep.data?.babyStepAction || ""}</p>
              <div class="text-xs text-muted"><em>💡 Why it works: ${activeBabyStep.data?.whyItWorks || ""}</em></div>
            </div>
          ` : ""}

          <div class="flex-between flex-wrap gap-2 pt-1">
            <span class="badge badge-sand text-xs">Step ${nextMission.stage}</span>
            <div class="flex-row items-center flex-wrap gap-2">
              <button class="btn btn-secondary text-xs btn-simplify-mission" data-id="${nextMission.id}" title="Too tired or anxious today? Reduce this to an effortless 4-minute baby step">
                ✨ ${activeBabyStep && activeBabyStep.missionId === nextMission.id && activeBabyStep.loading ? "Simplifying..." : "5-Min Baby Step"}
              </button>
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

  container.querySelectorAll(".btn-simplify-mission").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const mission = DEFAULT_MISSIONS.find(m => m.id === id);
      if (!mission) return;

      if (!store.isAiConfigured()) {
        const wantsConfig = confirm(
          "AI Co-Pilot is not configured yet.\n\nWould you like to connect an AI provider (OpenAI, Gemini, Claude, Grok, or local Ollama) for tailored baby steps?\n\n(Click Cancel to see our grounded offline 5-minute baby step immediately)."
        );
        if (wantsConfig) {
          close();
          window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
          return;
        }
        // Graceful offline fallback
        activeBabyStep = {
          missionId: id,
          loading: false,
          data: {
            babyStepTitle: `Quick 3-Minute Start on Step ${mission.stage}`,
            babyStepAction: `Don't worry about completing the whole thing today. Open a blank index card or notepad and write down just ONE specific note or question related to this mission. That counts as your victory for today!`,
            whyItWorks: "Micro-commitments eliminate friction and defeat procrastination every single time."
          }
        };
        renderDailyMissions(container);
        return;
      }

      // AI Configured
      activeBabyStep = {
        missionId: id,
        loading: true,
        data: null
      };
      renderDailyMissions(container);

      try {
        const result = await simplifyMission({
          missionTitle: mission.title,
          missionDesc: mission.desc,
          projectContext: `${store.state.name} (${store.state.problemDescription || ""})`
        });
        activeBabyStep = {
          missionId: id,
          loading: false,
          data: result
        };
      } catch (err) {
        alert("Could not generate baby step: " + err.message);
        activeBabyStep = null;
      }
      renderDailyMissions(container);
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
