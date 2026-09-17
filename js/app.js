// app.js: Main application coordinator for Micro-Startup Compass PWA.
// Coordinates stage navigation, dedicated resource tabs (Help, Summary, Disclaimer, About),
// and single comprehensive data reset.

import { store } from "./store.js";
import { renderStage1 } from "./modules/realityCheck.js";
import { renderStage2 } from "./modules/interviewTracker.js";
import { renderStage3 } from "./modules/leanCanvas.js";
import { renderStage4 } from "./modules/cheapTesting.js";
import { renderStage5 } from "./modules/buildRoadmap.js";
import { 
  renderHelpTab, 
  renderDisclaimerTab, 
  renderAboutTab, 
  renderSummaryTab,
  renderStoriesTab 
} from "./modules/helpAndLegalViews.js";
import { initSetbackAlchemist } from "./modules/setbackAlchemist.js";
import { initExportDossier } from "./modules/exportDossier.js";
import { renderDailyMissions } from "./modules/dailyMissions.js";
import { renderMilestoneModal } from "./modules/milestoneBadges.js";
import { renderConversationSimulator } from "./modules/conversationSimulator.js";
import { renderAiSettingsModal } from "./modules/aiSettingsModal.js";

const STEP_TABS = [
  { id: 1, name: "1. Clarify Problem", title: "Step 1: Clarify the Problem" },
  { id: 2, name: "2. Talk to People", title: "Step 2: Talk to Real People" },
  { id: 3, name: "3. One-Page Plan", title: "Step 3: One-Page Plan" },
  { id: 4, name: "4. Quick Free Tests", title: "Step 4: Quick Free Tests" },
  { id: 5, name: "5. Next Steps & Grants", title: "Step 5: Next Steps & Grants" }
];

const RESOURCE_TABS = [
  { id: "stories", name: "🌟 Real Stories", title: "Everyday Innovator Stories: The Micro-Startup Hall of Fame" },
  { id: "help", name: "💡 Help Guide", title: "The Encourager & Fix-It Guide" },
  { id: "summary", name: "📄 Summary & Flyer", title: "Project Summary & Community Flyer" },
  { id: "disclaimer", name: "⚖️ Legal Disclaimer", title: "Legal Disclaimer & Terms of Use" }
];

class App {
  constructor() {
    this.container = document.getElementById("main-stage-container");
    this.stageNav = document.getElementById("stage-nav");
    this.projectTitleEl = document.getElementById("project-title-input");
    this.confidenceValEl = document.getElementById("confidence-score-val");
    this.resetModal = document.getElementById("reset-modal");
    this.milestonesModal = document.getElementById("milestones-modal");
    this.milestonesContainer = document.getElementById("milestones-modal-container");
    this.simulatorModal = document.getElementById("simulator-modal");
    this.simulatorContainer = document.getElementById("simulator-modal-container");
    this.aiSettingsModal = document.getElementById("ai-settings-modal");
    this.aiSettingsContainer = document.getElementById("ai-settings-modal-container");
    this.aiBtn = document.getElementById("btn-ai-settings");
    this.aiStatusIndicator = document.getElementById("ai-status-indicator");
    this.aiBtnLabel = document.getElementById("ai-btn-label");
    this.missionsContainer = document.getElementById("daily-missions-section");
    this.activeTab = store.state.currentStage || 1;
  }

  init() {
    this.registerServiceWorker();
    this.setupEventListeners();
    this.setupModals();
    this.renderNavigation();
    this.renderMissions();
    this.updateAiHeaderState();
    this.navigateToTab(this.activeTab);
    initSetbackAlchemist();
    initExportDossier();
  }

  updateAiHeaderState() {
    const isConfigured = store.isAiConfigured();
    const cfg = store.getAiConfig();
    if (this.aiStatusIndicator && this.aiBtnLabel) {
      if (isConfigured) {
        const providerName = cfg.provider === "gemini" ? "Gemini" 
          : cfg.provider === "openai" ? "OpenAI" 
          : cfg.provider === "claude" ? "Claude" 
          : cfg.provider === "grok" ? "Grok" 
          : cfg.provider === "ollama" ? "Ollama" : "AI";
        this.aiStatusIndicator.textContent = "✨";
        this.aiBtnLabel.textContent = `AI: ${providerName}`;
        this.aiBtn?.classList.add("btn-ai-active");
      } else {
        this.aiStatusIndicator.textContent = "✨";
        this.aiBtnLabel.textContent = "AI Co-Pilot";
        this.aiBtn?.classList.remove("btn-ai-active");
      }
    }
  }

  renderMissions() {
    if (this.missionsContainer) {
      renderDailyMissions(this.missionsContainer);
    }
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
          .then(reg => console.log("Service Worker registered:", reg.scope))
          .catch(err => console.log("Service Worker registration failed:", err));
      });
    }
  }

  setupEventListeners() {
    this.projectTitleEl?.addEventListener("change", (e) => {
      store.state.name = e.target.value.trim() || "My New Idea";
      store.saveState();
    });

    window.addEventListener("app:navigate-stage", (e) => {
      if (e.detail && e.detail.stage) {
        this.navigateToTab(e.detail.stage);
      }
    });

    window.addEventListener("app:navigate-tab", (e) => {
      if (e.detail && e.detail.tab) {
        this.navigateToTab(e.detail.tab);
      }
    });

    window.addEventListener("app:state-updated", () => {
      this.renderNavigation();
      this.renderMissions();
    });

    window.addEventListener("app:open-simulator", () => {
      if (this.openSimulator) this.openSimulator();
    });

    window.addEventListener("app:open-ai-settings", () => {
      if (this.openAiSettings) this.openAiSettings();
    });

    window.addEventListener("app:ai-config-updated", () => {
      this.updateAiHeaderState();
    });

  }

  setupModals() {
    // Reset Modal
    const openReset = () => this.resetModal?.classList.add("modal-open");
    const closeReset = () => this.resetModal?.classList.remove("modal-open");

    document.getElementById("btn-reset-data")?.addEventListener("click", openReset);
    document.getElementById("reset-close-btn")?.addEventListener("click", closeReset);
    document.getElementById("reset-cancel-btn")?.addEventListener("click", closeReset);

    this.resetModal?.addEventListener("click", (e) => {
      if (e.target === this.resetModal) closeReset();
    });

    // Milestones Modal
    const openMilestones = () => {
      if (this.milestonesContainer) renderMilestoneModal(this.milestonesContainer);
      this.milestonesModal?.classList.add("modal-open");
    };
    const closeMilestones = () => {
      this.milestonesModal?.classList.remove("modal-open");
    };

    document.getElementById("confidence-meter-badge")?.addEventListener("click", openMilestones);
    this.milestonesModal?.addEventListener("click", (e) => {
      if (e.target === this.milestonesModal) closeMilestones();
    });

    // Simulator Modal
    this.openSimulator = () => {
      if (this.simulatorContainer) renderConversationSimulator(this.simulatorContainer);
      this.simulatorModal?.classList.add("modal-open");
    };
    const closeSimulator = () => {
      this.simulatorModal?.classList.remove("modal-open");
    };
    this.simulatorModal?.addEventListener("click", (e) => {
      if (e.target === this.simulatorModal) closeSimulator();
    });

    // AI Settings Modal
    this.openAiSettings = () => {
      if (this.aiSettingsContainer) renderAiSettingsModal(this.aiSettingsContainer);
      this.aiSettingsModal?.classList.add("modal-open");
    };
    const closeAiSettings = () => {
      this.aiSettingsModal?.classList.remove("modal-open");
    };
    this.aiBtn?.addEventListener("click", this.openAiSettings);
    this.aiSettingsModal?.addEventListener("click", (e) => {
      if (e.target === this.aiSettingsModal) closeAiSettings();
    });

    // Single Comprehensive Reset Action
    document.getElementById("btn-confirm-reset")?.addEventListener("click", () => {
      localStorage.removeItem("micro_startup_compass_v1");
      store.resetToFresh();
      if (this.projectTitleEl) this.projectTitleEl.value = store.state.name;
      this.renderNavigation();
      this.renderMissions();
      this.navigateToTab(1);
      closeReset();
      alert("All data has been reset to a clean, fresh start.");
    });
  }

  renderNavigation() {
    if (!this.stageNav) return;
    const currentTab = this.activeTab;
    const unlocked = store.state.unlockedStages || [1];

    let html = "";

    // Step Tabs
    STEP_TABS.forEach((tab) => {
      const isUnlocked = unlocked.includes(tab.id);
      const isActive = currentTab === tab.id;

      let badge = "";
      if (isActive) {
        badge = '<span class="nav-dot active-dot"></span>';
      } else if (isUnlocked) {
        badge = '<span class="nav-dot unlocked-dot">✓</span>';
      } else {
        badge = '<span class="nav-lock">🔒</span>';
      }

      html += `
        <button 
          class="stage-nav-item ${isActive ? "active" : ""} ${!isUnlocked ? "locked" : ""}" 
          data-tab="${tab.id}" 
          ${!isUnlocked ? 'title="Complete the previous step first to unlock this"' : `title="${tab.title}"`}
        >
          ${badge}
          <span class="stage-nav-label">${tab.name}</span>
        </button>
      `;
    });

    // Divider
    html += '<span class="nav-divider" aria-hidden="true"></span>';

    // Resource Tabs
    RESOURCE_TABS.forEach((tab) => {
      const isActive = currentTab === tab.id;

      html += `
        <button 
          class="stage-nav-item resource-nav-item ${isActive ? "active" : ""}" 
          data-tab="${tab.id}" 
          title="${tab.title}"
        >
          <span class="stage-nav-label">${tab.name}</span>
        </button>
      `;
    });

    this.stageNav.innerHTML = html;

    // Attach click listeners to all tabs
    this.stageNav.querySelectorAll(".stage-nav-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const rawTab = e.currentTarget.getAttribute("data-tab");
        const numericTab = parseInt(rawTab, 10);
        const tabKey = isNaN(numericTab) ? rawTab : numericTab;

        if (typeof tabKey === "number") {
          if (unlocked.includes(tabKey)) {
            this.navigateToTab(tabKey);
          } else {
            alert(`Step ${tabKey} is locked. Please finish the simple questions in Step ${tabKey - 1} first.`);
          }
        } else {
          this.navigateToTab(tabKey);
        }
      });
    });

    if (this.projectTitleEl) {
      this.projectTitleEl.value = store.state.name || "My New Idea";
    }

    if (this.confidenceValEl) {
      const score = store.getConfidenceScore();
      this.confidenceValEl.textContent = `${score}%`;
    }
  }

  navigateToTab(tabKey) {
    this.activeTab = tabKey;

    if (typeof tabKey === "number") {
      store.state.currentStage = tabKey;
      store.saveState();
    }

    this.renderNavigation();

    switch (tabKey) {
      case 1:
        renderStage1(this.container);
        break;
      case 2:
        renderStage2(this.container);
        break;
      case 3:
        renderStage3(this.container);
        break;
      case 4:
        renderStage4(this.container);
        break;
      case 5:
        renderStage5(this.container);
        break;
      case "stories":
        renderStoriesTab(this.container);
        break;
      case "help":
        renderHelpTab(this.container);
        break;
      case "summary":
        renderSummaryTab(this.container);
        break;
      case "disclaimer":
        renderDisclaimerTab(this.container);
        break;
      case "about":
        renderAboutTab(this.container);
        break;
      default:
        renderStage1(this.container);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.init();
  });
}
