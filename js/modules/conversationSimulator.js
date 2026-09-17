// conversationSimulator.js: Interactive Customer Discovery Conversation Simulator.
// Provides safe, turn-by-turn rehearsal so lay founders master non-salesy customer discovery.

import { SIMULATOR_PERSONAS } from "../data/simulatorPersonas.js";
import { store } from "../store.js";
import { callAi } from "../services/aiClient.js";

let currentPersona = null;
let currentTurnIndex = 0;
let conversationHistory = [];
let accumulatedScore = 0;
let simulationComplete = false;
let lastSelectedChoice = null;
let isTyping = false;
let voiceEnabled = false;
let isGeneratingAiPersona = false;
let customAiPersona = null;

export function renderConversationSimulator(container) {
  if (!container) return;

  if (!currentPersona) {
    renderPersonaSelection(container);
  } else if (simulationComplete) {
    renderDebriefScorecard(container);
  } else {
    renderActiveChatTurn(container);
  }
}

function speakText(text, pitch = 1.0, rate = 1.0) {
  if (!voiceEnabled) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis unavailable:", e);
  }
}

function renderPersonaSelection(container) {
  const completedPersonas = store.state.completedPersonas || [];
  const totalPersonas = SIMULATOR_PERSONAS.length;
  const isAllDone = completedPersonas.length >= totalPersonas;

  container.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div>
          <span class="badge badge-accent text-xs">Safe Practice Arena</span>
          <h3 class="m-0 mt-1">🎮 Customer Discovery Simulator</h3>
        </div>
        <button class="btn-icon" id="sim-close-btn" aria-label="Close simulator">✕</button>
      </div>
    </div>

    <div class="modal-body text-sm">
      <div class="p-3 bg-oat rounded border-warm mb-3 flex-between">
        <div>
          <strong class="text-espresso text-xs">Rehearsals Completed: ${completedPersonas.length} of ${totalPersonas} Archetypes</strong>
          <p class="text-xs text-muted m-0 mt-1">
            Before talking to real customers, practice here! Learn how discovery questions unlock real past behavior while pitches trigger defensiveness.
          </p>
        </div>
        <button class="btn btn-secondary text-xs" id="sim-toggle-voice-top">
          ${voiceEnabled ? "🔊 Voice: ON" : "🔈 Voice: OFF"}
        </button>
      </div>

      ${isAllDone ? `
        <div class="card card-highlight p-3 mb-3 border-warm flex-between">
          <div class="flex-row items-center gap-3">
            <span style="font-size: 1.8rem;">🏆</span>
            <div>
              <strong class="text-terracotta text-sm font-bold">Discovery Mastery Achieved!</strong>
              <p class="text-xs text-charcoal m-0 mt-1">
                You have practiced across all 4 customer archetypes: the skeptic contractor, the polite friend, the overwhelmed maker, and the frugal neighbor!
              </p>
            </div>
          </div>
        </div>
      ` : ""}

      <!-- Dynamic AI Customer Persona Generator -->
      <div class="card card-highlight p-3 rounded border-warm mb-3" style="border-left: 4px solid var(--color-amber);">
        <div class="flex-between">
          <div class="flex-row items-center gap-3">
            <span style="font-size: 1.8rem;">✨</span>
            <div>
              <div class="flex-row items-center gap-2">
                <span class="badge badge-accent text-xs">Dynamic AI Rehearsal</span>
                <strong class="text-espresso text-sm">Roleplay with YOUR Custom Customer</strong>
              </div>
              <p class="text-xs text-muted m-0 mt-1">
                Generate an interactive simulated customer based on your idea ("${escapeHtml(store.state.name || "My Idea")}") and target audience.
              </p>
            </div>
          </div>
          <button class="btn btn-primary text-xs" id="btn-generate-ai-persona" ${isGeneratingAiPersona ? "disabled" : ""} style="white-space: nowrap;">
            ${isGeneratingAiPersona ? "⏳ Generating Persona..." : "✨ Generate & Rehearse →"}
          </button>
        </div>
      </div>

      <h4 class="text-espresso text-xs font-bold mb-2">Or Choose a Classic Archetype to Rehearse With:</h4>
      <div class="personas-grid">
        ${customAiPersona ? `
          <div class="persona-select-card p-3 rounded bg-white-soft border-warm mb-3 flex-between" style="border-left: 3px solid var(--color-amber);">
            <div class="flex-row items-center gap-3">
              <span class="persona-avatar-lg">${customAiPersona.avatar}</span>
              <div>
                <div class="flex-row items-center gap-2">
                  <strong class="text-espresso text-sm">${customAiPersona.name}</strong>
                  <span class="badge badge-accent text-xs">${customAiPersona.badge}</span>
                  <span class="badge badge-warning text-xs">Custom AI</span>
                </div>
                <p class="text-xs text-muted m-0 mt-1">${customAiPersona.context}</p>
              </div>
            </div>
            <button class="btn btn-primary text-xs btn-start-custom-ai">
              Practice Custom →
            </button>
          </div>
        ` : ""}

        ${SIMULATOR_PERSONAS.map(p => {
          const isDone = completedPersonas.includes(p.id);
          return `
            <div class="persona-select-card p-3 rounded bg-white-soft border-warm mb-3 flex-between">
              <div class="flex-row items-center gap-3">
                <span class="persona-avatar-lg">${p.avatar}</span>
                <div>
                  <div class="flex-row items-center gap-2">
                    <strong class="text-espresso text-sm">${p.name}</strong>
                    <span class="badge badge-neutral text-xs">${p.badge}</span>
                    ${isDone ? '<span class="badge badge-success text-xs">✓ Rehearsed</span>' : ''}
                  </div>
                  <p class="text-xs text-muted m-0 mt-1">${p.context}</p>
                </div>
              </div>
              <button class="btn ${isDone ? "btn-secondary" : "btn-primary"} text-xs btn-start-persona" data-id="${p.id}">
                ${isDone ? "Rehearse Again ↺" : "Practice →"}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <div class="modal-footer flex-between">
      <span class="text-xs text-muted">All personas test real-world psychological traps</span>
      <button class="btn btn-secondary text-xs" id="sim-cancel-btn">Back to Tracker</button>
    </div>
  `;

  attachSelectionEvents(container);
}

function attachSelectionEvents(container) {
  const close = () => container.closest(".modal-overlay")?.classList.remove("modal-open");
  container.querySelector("#sim-close-btn")?.addEventListener("click", close);
  container.querySelector("#sim-cancel-btn")?.addEventListener("click", close);

  container.querySelector("#sim-toggle-voice-top")?.addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    renderPersonaSelection(container);
  });

  // Start classic persona
  container.querySelectorAll(".btn-start-persona").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      startSimulation(id, container);
    });
  });

  // Start custom AI persona
  container.querySelector(".btn-start-custom-ai")?.addEventListener("click", () => {
    if (customAiPersona) {
      startSimulation(customAiPersona.id, container, customAiPersona);
    }
  });

  // Generate Custom AI Persona
  const genBtn = container.querySelector("#btn-generate-ai-persona");
  genBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    isGeneratingAiPersona = true;
    renderPersonaSelection(container);

    const s1 = store.state.stage1 || {};
    const ideaName = store.state.name || "Everyday Service";
    const audience = s1.targetAudience || "local homeowners or small businesses";
    const problem = s1.problemHypothesis || "dealing with frustrating disorganization";
    const workaround = s1.currentWorkaround || "clumsy manual spreadsheets or notes";

    const prompt = `Based on this founder project:
Idea: "${ideaName}"
Target Audience: "${audience}"
Problem: "${problem}"
Current Workaround: "${workaround}"

Task: Create a realistic customer persona archetype for an interactive 3-turn customer discovery rehearsal.
The persona must be realistic, slightly busy, skeptical of sales pitches, and grounded in real-life chores or expenses.

Respond strictly with valid JSON only in this exact structure:
{
  "id": "persona_ai_custom",
  "name": "First Name (Role/Context)",
  "role": "Short description of what they do",
  "avatar": "👤",
  "badge": "2-3 word archetype badge",
  "context": "1-2 sentences setting the scene where the founder encounters them",
  "initialGreeting": "Their realistic, busy opening remark when approached",
  "turns": [
    {
      "turnNumber": 1,
      "questionPrompt": "How do you open the conversation?",
      "choices": [
        { "type": "pitch", "label": "🔴 The Pitch Trap", "text": "Premature pitch asking if they'd buy", "personaReply": "Defensive resistance", "scoreImpact": 0, "coachNote": "Why pitching early failed" },
        { "type": "vague", "label": "🟡 The Vague Question", "text": "Generic question", "personaReply": "Generic answer", "scoreImpact": 1, "coachNote": "Why vague questions yield weak signals" },
        { "type": "discovery", "label": "🟢 The Past-Behavior Question", "text": "Question asking for the last time they experienced it", "personaReply": "Concrete story with details", "scoreImpact": 3, "coachNote": "Why asking about real past behavior works" }
      ]
    },
    {
      "turnNumber": 2,
      "questionPrompt": "How do you explore their past workaround and costs?",
      "choices": [
        { "type": "pitch", "label": "🔴 The Solution Pitch", "text": "Pitching a feature", "personaReply": "Skepticism", "scoreImpact": 0, "coachNote": "Note on premature selling" },
        { "type": "vague", "label": "🟡 The Vague Question", "text": "Hypothetical question", "personaReply": "Polite guess", "scoreImpact": 1, "coachNote": "Note on hypothetical math" },
        { "type": "discovery", "label": "🟢 The Past-Behavior Question", "text": "Asking what they actually spent or tried in the past", "personaReply": "Specific dollar or emotional breakdown", "scoreImpact": 3, "coachNote": "Praise uncovering real costs" }
      ]
    },
    {
      "turnNumber": 3,
      "questionPrompt": "How do you close respectfully with a lightweight test offer?",
      "choices": [
        { "type": "pitch", "label": "🔴 The Hard Close", "text": "Aggressive sales ask", "personaReply": "Awkward exit", "scoreImpact": 0, "coachNote": "Note on pushy closes" },
        { "type": "vague", "label": "🟡 The Passive Goodbye", "text": "Polite passive goodbye", "personaReply": "Polite wave", "scoreImpact": 1, "coachNote": "Note on missed opportunities" },
        { "type": "discovery", "label": "🟢 The Low-Risk Test Offer", "text": "Free demonstration or manual test offer", "personaReply": "Eager acceptance", "scoreImpact": 3, "coachNote": "Praise securing a zero-risk pilot" }
      ]
    }
  ],
  "debrief": {
    "keyQuote": "A memorable quote uncovering real behavioral pain and costs",
    "topTakeaway": "Practical lesson for this customer segment",
    "sampleInterviewEntry": {
      "id": "sim_ai_custom",
      "contactName": "Custom Persona Name",
      "channel": "Discovery Simulator AI Rehearsal",
      "pastWorkaround": "...",
      "painScore": 5,
      "spentLastMonth": "$...",
      "keyQuote": "...",
      "willingToPaySignal": true,
      "tags": ["AI Custom Practice", "Real Past Pain"]
    }
  }
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are a customer discovery trainer teaching founders not to pitch.",
        temperature: 0.7,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      parsed.id = "persona_ai_custom";
      parsed.voicePitch = 1.0;
      parsed.voiceRate = 1.0;
      customAiPersona = parsed;

      // Start the simulation with this custom persona immediately!
      startSimulation(customAiPersona.id, container, customAiPersona);
    } catch (err) {
      alert(`AI Persona Generation error: ${err.message || String(err)}`);
      isGeneratingAiPersona = false;
      renderPersonaSelection(container);
    }
  });
}

function startSimulation(personaId, container, customObj = null) {
  if (customObj) {
    currentPersona = customObj;
  } else {
    currentPersona = SIMULATOR_PERSONAS.find(p => p.id === personaId) || SIMULATOR_PERSONAS[0];
  }
  currentTurnIndex = 0;
  accumulatedScore = 0;
  simulationComplete = false;
  lastSelectedChoice = null;
  isTyping = false;
  conversationHistory = [
    {
      speaker: currentPersona.name,
      avatar: currentPersona.avatar,
      isPersona: true,
      text: currentPersona.initialGreeting
    }
  ];

  speakText(currentPersona.initialGreeting, currentPersona.voicePitch || 1.0, currentPersona.voiceRate || 1.0);
  renderActiveChatTurn(container);
}

function renderActiveChatTurn(container) {
  const currentTurn = currentPersona.turns[currentTurnIndex];

  container.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div class="flex-row items-center gap-2">
          <span class="persona-avatar-sm">${currentPersona.avatar}</span>
          <div>
            <h4 class="m-0 text-sm font-bold text-espresso">${currentPersona.name}</h4>
            <span class="text-xs text-muted">Round ${currentTurnIndex + 1} of ${currentPersona.turns.length} (${currentPersona.badge})</span>
          </div>
        </div>
        <div class="flex-row items-center gap-2">
          <button class="btn btn-secondary text-xs" id="sim-toggle-voice" style="padding: 4px 8px;">
            ${voiceEnabled ? "🔊 Voice: ON" : "🔈 Voice: OFF"}
          </button>
          <button class="btn-icon" id="sim-chat-close-btn" aria-label="Close simulator">✕</button>
        </div>
      </div>
    </div>

    <div class="modal-body text-sm" id="sim-chat-body" style="max-height: 65vh; overflow-y: auto;">
      <!-- Persona Context Box -->
      <div class="p-2 bg-oat rounded text-xs text-muted mb-3 border-warm">
        📍 <strong>Scene:</strong> ${currentPersona.context}
      </div>

      <!-- Dialogue History -->
      <div class="chat-thread mb-3">
        ${conversationHistory.map(msg => `
          <div class="chat-bubble-row ${msg.isPersona ? "bubble-row-persona" : "bubble-row-user"} mb-2">
            <div class="chat-bubble ${msg.isPersona ? "bubble-persona" : "bubble-user"} p-3 rounded">
              <span class="chat-speaker-lbl text-xs font-bold ${msg.isPersona ? "text-terracotta" : "text-white-soft"} d-block mb-1">
                ${msg.avatar} ${msg.speaker}:
              </span>
              <p class="m-0 text-sm">${escapeHtml(msg.text)}</p>
            </div>
          </div>
        `).join("")}

        ${isTyping ? `
          <div class="chat-bubble-row bubble-row-persona mb-2 animate-fade-in">
            <div class="chat-bubble bubble-persona p-2 px-3 rounded text-xs text-muted font-italic">
              ${currentPersona.avatar} ${currentPersona.name} is typing... 💬
            </div>
          </div>
        ` : ""}
      </div>

      <!-- Turn Choice or Feedback -->
      ${!isTyping && !lastSelectedChoice ? `
        <div class="choices-container card card-highlight p-3 border-warm">
          <strong class="text-espresso text-xs d-block mb-2">
            👉 ${currentTurn.questionPrompt} (Choose what to ask):
          </strong>
          
          <div class="choices-list">
            ${currentTurn.choices.map((c, idx) => `
              <button class="choice-btn text-left p-2 mb-2 rounded bg-white-soft border-warm w-100 btn-select-choice" data-index="${idx}">
                <div class="flex-between">
                  <span class="badge ${c.type === "discovery" ? "badge-success" : c.type === "vague" ? "badge-neutral" : "badge-danger"} text-xs mb-1">
                    ${c.label}
                  </span>
                </div>
                <div class="choice-text text-xs text-espresso font-italic">
                  "${escapeHtml(c.text)}"
                </div>
              </button>
            `).join("")}
          </div>
        </div>
      ` : ""}

      ${!isTyping && lastSelectedChoice ? `
        <!-- Discovery Coach Insight Box -->
        <div class="coach-insight-card p-3 rounded bg-highlight border-warm mb-3 animate-fade-in" id="coach-insight-box">
          <div class="flex-between mb-1">
            <strong class="text-terracotta text-xs font-bold">💡 Discovery Coach Breakdown:</strong>
            <span class="badge ${lastSelectedChoice.scoreImpact === 3 ? "badge-success" : lastSelectedChoice.scoreImpact === 2 ? "badge-neutral" : "badge-warning"} text-xs">
              +${lastSelectedChoice.scoreImpact} Insight Pts
            </span>
          </div>
          <p class="text-xs text-charcoal m-0 mb-3">${lastSelectedChoice.coachNote}</p>
          <button id="btn-next-sim-turn" class="btn btn-primary text-xs w-100">
            ${currentTurnIndex + 1 < currentPersona.turns.length ? "Continue to Next Round →" : "View Final Rehearsal Debrief →"}
          </button>
        </div>
      ` : ""}
    </div>

    <div class="modal-footer flex-between">
      <button class="btn btn-secondary text-xs" id="btn-restart-sim">Restart Rehearsal</button>
      <span class="text-xs text-muted">Goal: Discover real past pain, never pitch</span>
    </div>
  `;

  attachChatEvents(container, currentTurn);

  // Auto-scroll chat to bottom
  const chatBody = container.querySelector("#sim-chat-body");
  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function attachChatEvents(container, currentTurn) {
  const close = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    container.closest(".modal-overlay")?.classList.remove("modal-open");
  };

  container.querySelector("#sim-chat-close-btn")?.addEventListener("click", close);

  container.querySelector("#sim-toggle-voice")?.addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    renderActiveChatTurn(container);
  });

  container.querySelector("#btn-restart-sim")?.addEventListener("click", () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    currentPersona = null;
    renderPersonaSelection(container);
  });

  // Handle choice selection with animated typing delay
  container.querySelectorAll(".btn-select-choice").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      const choice = currentTurn.choices[idx];
      accumulatedScore += choice.scoreImpact;

      // 1. Add user speech
      conversationHistory.push({
        speaker: "You (Founder)",
        avatar: "🧭",
        isPersona: false,
        text: choice.text
      });

      // 2. Set typing state
      isTyping = true;
      renderActiveChatTurn(container);

      // 3. Reveal response after 450ms
      setTimeout(() => {
        isTyping = false;
        lastSelectedChoice = choice;

        conversationHistory.push({
          speaker: currentPersona.name,
          avatar: currentPersona.avatar,
          isPersona: true,
          text: choice.personaReply
        });

        speakText(choice.personaReply, currentPersona.voicePitch || 1.0, currentPersona.voiceRate || 1.0);
        renderActiveChatTurn(container);

        // Smooth scroll to coach box
        const coachEl = container.querySelector("#coach-insight-box");
        if (coachEl) {
          coachEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 450);
    });
  });

  // Handle continue turn button
  container.querySelector("#btn-next-sim-turn")?.addEventListener("click", () => {
    lastSelectedChoice = null;
    currentTurnIndex += 1;
    if (currentTurnIndex >= currentPersona.turns.length) {
      simulationComplete = true;
      if (store.completeSimulation) {
        store.completeSimulation({
          personaId: currentPersona.id,
          score: accumulatedScore
        });
      }
    }
    renderConversationSimulator(container);
  });
}

function renderDebriefScorecard(container) {
  const maxScore = currentPersona.turns.length * 3; // 9
  const percentage = Math.round((accumulatedScore / maxScore) * 100);

  let rating = "";
  let badgeClass = "badge-success";
  if (percentage >= 80) {
    rating = "🌟 Master Inquirer: You listened deeply and uncovered true behavioral gold!";
    badgeClass = "badge-success";
  } else if (percentage >= 50) {
    rating = "👍 Cautious Learner: Good instincts, but you leaned into pitch territory once or twice.";
    badgeClass = "badge-accent";
  } else {
    rating = "⚠️ The Pitch Trapper: You pitched solutions early, which created polite resistance.";
    badgeClass = "badge-warning";
  }

  container.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div>
          <span class="badge badge-accent text-xs">Rehearsal Debrief</span>
          <h3 class="m-0 mt-1">Rehearsal Complete: ${currentPersona.name}</h3>
        </div>
        <button class="btn-icon" id="sim-debrief-close-btn" aria-label="Close">✕</button>
      </div>
    </div>

    <div class="modal-body text-sm" style="max-height: 65vh; overflow-y: auto;">
      <div class="card card-highlight p-3 mb-3 text-center">
        <span class="badge ${badgeClass} text-xs mb-1">Discovery Score</span>
        <div class="text-terracotta" style="font-size: 2.2rem; font-weight: 800;">
          ${percentage}%
        </div>
        <strong class="text-espresso text-sm d-block mt-1">${rating}</strong>
      </div>

      <div class="card p-3 bg-white-soft border-warm mb-3">
        <div class="flex-between mb-1">
          <strong class="text-terracotta text-xs font-bold">💎 Gold Nugget Discovered:</strong>
          <button class="btn btn-secondary text-xs" id="btn-copy-debrief-quote" data-quote="${escapeHtml(currentPersona.debrief.keyQuote)}">
            📋 Copy Quote
          </button>
        </div>
        <p class="text-xs text-espresso font-italic m-0 mt-1 p-2 bg-oat rounded border-warm">
          "${escapeHtml(currentPersona.debrief.keyQuote)}"
        </p>
      </div>

      <div class="card p-3 bg-highlight border-warm mb-3 text-xs">
        <strong class="text-espresso font-bold">🎓 #1 Takeaway for Step 2:</strong>
        <p class="m-0 mt-1 text-charcoal">${currentPersona.debrief.topTakeaway}</p>
      </div>

      <!-- Action Card: Save Sample to Step 2 -->
      <div class="card p-3 bg-sand-light border-warm mb-3" id="save-sample-action-card">
        <div class="flex-between">
          <div>
            <strong class="text-espresso text-xs font-bold">Want to see this in your tracker?</strong>
            <p class="text-xs text-muted m-0 mt-1">
              Add this simulated interview with ${currentPersona.name} directly into your Step 2 notes as a reference example.
            </p>
          </div>
          <button class="btn btn-primary text-xs" id="btn-save-practice-int" style="white-space: nowrap;">
            📝 Save as Example in Step 2
          </button>
        </div>
        <div id="save-practice-feedback" class="text-xs text-success font-bold mt-2 d-none">
          ✓ Added to Step 2 Notes! You can view this example anytime in your interview tracker.
        </div>
      </div>

      <div class="p-2 bg-success-soft rounded border-warm text-xs mb-1 text-success font-bold flex-between">
        <span>🎭 Breakthrough Badge Unlocked: 'The Rehearsed Inquirer'</span>
        <span>✓ Awarded</span>
      </div>
    </div>

    <div class="modal-footer flex-between">
      <button class="btn btn-secondary text-xs" id="btn-sim-pick-another">Rehearse Another Persona</button>
      <button class="btn btn-primary text-xs" id="btn-sim-done">Apply to Real Conversations (Step 2) →</button>
    </div>
  `;

  const close = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    container.closest(".modal-overlay")?.classList.remove("modal-open");
  };

  container.querySelector("#sim-debrief-close-btn")?.addEventListener("click", close);

  // Copy quote button
  const copyBtn = container.querySelector("#btn-copy-debrief-quote");
  copyBtn?.addEventListener("click", () => {
    const text = copyBtn.getAttribute("data-quote") || currentPersona.debrief.keyQuote;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => { copyBtn.textContent = "📋 Copy Quote"; }, 2000);
    });
  });

  // Save to Step 2 button
  const saveIntBtn = container.querySelector("#btn-save-practice-int");
  saveIntBtn?.addEventListener("click", () => {
    if (currentPersona.debrief.sampleInterviewEntry && store.addPracticeInterviewToStage2) {
      store.addPracticeInterviewToStage2(currentPersona.debrief.sampleInterviewEntry);
      saveIntBtn.textContent = "✓ Added to Step 2!";
      saveIntBtn.disabled = true;
      const feedback = container.querySelector("#save-practice-feedback");
      if (feedback) feedback.classList.remove("d-none");
    }
  });

  container.querySelector("#btn-sim-done")?.addEventListener("click", () => {
    close();
    window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 2 } }));
  });

  container.querySelector("#btn-sim-pick-another")?.addEventListener("click", () => {
    currentPersona = null;
    simulationComplete = false;
    renderPersonaSelection(container);
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
