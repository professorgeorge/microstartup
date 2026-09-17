// milestoneBadges.js: Visual Founder Momentum & Milestone Badges modal.
// Celebrates psychological and practical breakthroughs for everyday innovators.

import { store } from "../store.js";

export const FOUNDER_BADGES = [
  {
    id: "jargon_slayer",
    icon: "🛡️",
    title: "The Jargon Slayer",
    stage: "Step 1",
    criteria: "Synthesized a plain-English problem statement without startup buzzwords.",
    quote: "If you cannot explain it to a friend at a diner, it is not clear yet.",
    checkEarned: (s) => !!(s.stage1 && s.stage1.isCompleted)
  },
  {
    id: "empathetic_listener",
    icon: "👂",
    title: "The Empathetic Listener",
    stage: "Step 2",
    criteria: "Logged your first real quote of a customer describing their frustration.",
    quote: "Listening to another human's pain is the true beginning of all real innovation.",
    checkEarned: (s) => !!(s.stage2 && s.stage2.interviews && s.stage2.interviews.length >= 1)
  },
  {
    id: "reality_check",
    icon: "🤝",
    title: "The Evidence Gatherer",
    stage: "Step 2",
    criteria: "Completed 5 customer discovery conversations with real evidence.",
    quote: "You have crossed the hardest threshold in business: talking to real people.",
    checkEarned: (s) => !!(s.stage2 && s.stage2.interviews && s.stage2.interviews.length >= 5)
  },
  {
    id: "napkin_mathematician",
    icon: "🧮",
    title: "The Napkin Mathematician",
    stage: "Step 3",
    criteria: "Calculated your reachable daily and weekly paying customer pace.",
    quote: "Math demystifies fear. You don't need a million users—just 2 a day.",
    checkEarned: (s) => !!(s.napkinMath && s.napkinMath.targetMonthlyIncome > 0 && s.napkinMath.pricePerUnit > 0)
  },
  {
    id: "one_page_architect",
    icon: "📐",
    title: "The 1-Page Architect",
    stage: "Step 3",
    criteria: "Mapped your entire business model onto a clean single page.",
    quote: "A 40-page business plan gathers dust. A 1-page plan takes flight.",
    checkEarned: (s) => !!(s.stage3 && s.stage3.isCompleted)
  },
  {
    id: "zero_dollar_scientist",
    icon: "🧪",
    title: "The Zero-Dollar Scientist",
    stage: "Step 4",
    criteria: "Tested customer interest by hand or via signup before building software.",
    quote: "Small, harmless experiments save families from big financial mistakes.",
    checkEarned: (s) => !!(s.stage4 && s.stage4.isCompleted)
  },
  {
    id: "grounded_founder",
    icon: "🚀",
    title: "The Grounded Founder",
    stage: "Step 5",
    criteria: "Set a conservative starter budget and outlined your local readiness steps.",
    quote: "Courage grounded in practical discipline is an unstoppable combination.",
    checkEarned: (s) => !!(s.stage5 && s.stage5.isCompleted)
  },
  {
    id: "rehearsed_inquirer",
    icon: "🎭",
    title: "The Rehearsed Inquirer",
    stage: "Step 2",
    criteria: "Completed a safe-practice rehearsal in the Discovery Simulator.",
    quote: "Practice in private before you perform in public. Confidence follows competence.",
    checkEarned: (s) => !!s.hasCompletedSimulator
  }
];

export function getBadgesStatus() {
  const s = store.state;
  const badges = FOUNDER_BADGES.map(b => ({
    ...b,
    isEarned: b.checkEarned(s)
  }));
  const earnedCount = badges.filter(b => b.isEarned).length;
  const totalCount = badges.length;
  const pct = Math.round((earnedCount / totalCount) * 100);

  return { badges, earnedCount, totalCount, pct };
}

export function renderMilestoneModal(modalContainer) {
  if (!modalContainer) return;
  const { badges, earnedCount, totalCount, pct } = getBadgesStatus();

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div>
          <span class="badge badge-accent text-xs">Founder Milestones</span>
          <h3 class="m-0 mt-1">Your Momentum & Breakthrough Badges</h3>
        </div>
        <button class="btn-icon" id="milestones-close-btn" aria-label="Close modal">✕</button>
      </div>
    </div>

    <div class="modal-body text-sm">
      <div class="card card-highlight p-3 mb-3 flex-between">
        <div>
          <strong class="text-espresso">Your Founder Momentum:</strong>
          <p class="text-xs text-muted m-0 mt-1">
            ${earnedCount === totalCount ? "🎉 Incredible! You have unlocked all 7 Founder Breakthrough Badges!" : `${earnedCount} of ${totalCount} badges unlocked (${pct}%). Keep going!`}
          </p>
        </div>
        <div class="stat-badge">
          <span class="stat-num text-terracotta">${earnedCount} / ${totalCount}</span>
          <span class="stat-lbl">Badges</span>
        </div>
      </div>

      <div class="badges-grid">
        ${badges.map(b => `
          <div class="badge-card ${b.isEarned ? "badge-earned" : "badge-locked"} p-3 rounded border-warm mb-2">
            <div class="flex-row items-center gap-3">
              <div class="badge-token ${b.isEarned ? "token-unlocked" : "token-locked"}">
                ${b.icon}
              </div>
              <div style="flex: 1;">
                <div class="flex-between">
                  <strong class="badge-title text-sm ${b.isEarned ? "text-espresso" : "text-muted"}">
                    ${b.title}
                  </strong>
                  <span class="badge ${b.isEarned ? "badge-success" : "badge-neutral"} text-xs">
                    ${b.isEarned ? "✓ Unlocked" : "🔒 In Progress"}
                  </span>
                </div>
                <p class="text-xs text-muted m-0 mt-1">${b.criteria}</p>
                ${b.isEarned ? `
                  <div class="text-xs font-italic text-terracotta mt-1">
                    "${b.quote}"
                  </div>
                ` : `
                  <div class="text-xs text-muted mt-1">
                    Focus on ${b.stage} to unlock this badge.
                  </div>
                `}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-primary" id="milestones-done-btn">Back to Compass</button>
    </div>
  `;

  // Attach close listeners
  const close = () => modalContainer.closest(".modal-overlay")?.classList.remove("modal-open");
  modalContainer.querySelector("#milestones-close-btn")?.addEventListener("click", close);
  modalContainer.querySelector("#milestones-done-btn")?.addEventListener("click", close);
}
