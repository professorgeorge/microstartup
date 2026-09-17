// interviewTracker.js: Step 2: Talk to Real People.
// Re-organized with clean information hierarchy: Progress first, unified Conversation Coach, and rapid logging.

import { store } from "../store.js";
import { callAi, generateCustomOutreach } from "../services/aiClient.js";
import { getIcon } from "../services/icons.js";

const QUICK_TAGS = [
  "Losing Money", "Severe Stress", "Tried Other Tools", 
  "Wants It Yesterday", "Will Pay Monthly", "Wrong Audience", "Zero Interest"
];

let selectedTags = [];
let activeScriptTab = "sms";
let tailoredAiScripts = null;
let isTailoringScripts = false;

function getOutreachScripts(audience, workaround) {
  const cleanAudience = audience || "people who deal with this";
  const cleanWorkaround = workaround || "handling this manually";

  if (tailoredAiScripts) {
    return {
      sms: {
        title: "💬 Tailored WhatsApp / SMS",
        badge: "✨ AI-Tailored for your specific audience",
        target: "SMS or WhatsApp message",
        text: tailoredAiScripts.whatsapp,
        why: "💡 Why this works: Personalized to their specific headache while strictly respecting The Mom Test (no sales pitch, asks about past behavior)."
      },
      inperson: {
        title: "🤝 Tailored In-Person Opener",
        badge: "✨ AI-Tailored casual question",
        target: "Face-to-face quick inquiry",
        text: tailoredAiScripts.inPerson,
        why: "💡 Why this works: Natural, non-salesy opening that lowers defenses and invites authentic storytelling without pitching."
      },
      community: {
        title: "✉️ Tailored Email / DM",
        badge: "✨ AI-Tailored outreach email",
        target: "Email or Direct Message",
        text: tailoredAiScripts.email,
        why: "💡 Why this works: Brief, humble, and asks for advice rather than a purchase."
      }
    };
  }

  return {
    sms: {
      title: "💬 Friendly Text / WhatsApp",
      badge: "Best for friends, ex-coworkers & mutual contacts",
      target: "SMS or WhatsApp message",
      text: `Hey [Name]! Quick question—I know you have real experience with ${cleanAudience}. When you have to deal with ${cleanWorkaround}, what is the single biggest headache you run into? Doing a quick study on how folks cope with this and would love your honest take. (Zero sales pitch, promise!)`,
      why: "💡 Why this works: Casual tone, explicit reassurance of zero sales pitch, and respects their time with one focused question."
    },
    community: {
      title: "📢 Community Group Post",
      badge: "Best for Facebook Groups, Nextdoor, Slack, or Trade Forums",
      target: "Discussion post for groups",
      text: `Quick question for fellow ${cleanAudience}: When you are dealing with ${cleanWorkaround}, what is your single biggest pet peeve or time-waster? What is the one thing you wish worked better? Looking to hear real experiences from the trenches!`,
      why: "💡 Why this works: Does not drop links or promote anything, which prevents group moderators from deleting your post while sparking relatable discussion."
    },
    inperson: {
      title: "🤝 In-Person 2-Min Opener",
      badge: "Best for supply shops, local trade counters, coffee shops, or markets",
      target: "Face-to-face quick inquiry",
      text: `Excuse me, sorry to interrupt—I noticed you [or 'I know you do ${cleanAudience} work']. I'm doing a quick 2-minute study on how folks handle ${cleanWorkaround}. What is the single most annoying part of dealing with that during your typical week?`,
      why: "💡 Why this works: Upfront 2-minute expectation setting removes fear of getting trapped in a long pitch. Asking for their 'annoyance' invites authentic storytelling."
    },
    followup: {
      title: "🙏 Gracious Thank You",
      badge: "Best for sending 24 hours after a great conversation",
      target: "Follow-up note",
      text: `Hi [Name], thanks so much for sharing your story about ${cleanWorkaround} yesterday—that insight was pure gold! If I end up sketching a super simple, free test to fix that specific headache, could I send you a 30-second screenshot to get your honest thoughts before I build anything?`,
      why: "💡 Why this works: Expresses sincere gratitude and secures permission to re-contact them without obligating them to buy."
    }
  };
}

export function renderStage2(container) {
  const s2 = store.state.stage2;
  const s1 = store.state.stage1;
  const interviews = s2.interviews || [];
  const loggedCount = interviews.length;
  const progressPct = Math.min(100, Math.round((loggedCount / 20) * 100));

  const highPainCount = interviews.filter(i => Number(i.painScore) >= 4).length;
  const payingIntentCount = interviews.filter(i => i.willingToPaySignal).length;
  const avgPain = loggedCount > 0 
    ? (interviews.reduce((acc, cur) => acc + Number(cur.painScore), 0) / loggedCount).toFixed(1) 
    : "0.0";

  // Generate 5 customized questions
  const audience = s1.targetAudience || "people who deal with this";
  const workaround = s1.currentWorkaround || "handling this manually";

  const question1 = `When was the last time you had to deal with ${workaround}? Walk me through what happened.`;
  const question2 = `What was the most frustrating part of that experience?`;
  const question3 = `What have you tried in the past to make that easier?`;
  const question4 = `What did that workaround cost you in either lost money, wasted hours, or stress?`;
  const question5 = `If you had a magic wand to change one thing about how this gets handled, what would you change?`;

  const cheatSheetText = `5 Friendly Questions to Ask ${audience}:
1. ${question1}
2. ${question2}
3. ${question3}
4. ${question4}
5. ${question5}`;

  selectedTags = [];

  container.innerHTML = `
    <div class="stage-header">
      <div class="stage-tag">Step 2: Talk to Real People</div>
      <h2 class="stage-title">The 20-Conversations Tracker</h2>
      <p class="stage-subtitle">
        Talk to people who actually experience this problem in their day-to-day life.
        Your goal is not to pitch them, but to uncover what they actually did and spent in the past.
      </p>
    </div>

    <!-- 1. Progress & Analytics Bar (Immediate Visual Orientation) -->
    <div class="card card-highlight mb-4">
      <div class="flex-between">
        <div>
          <h4 class="m-0">Your Progress: ${loggedCount} of 20 Conversations Logged</h4>
          <span class="text-xs text-muted">You need 5 conversations with real evidence to unlock Step 3.</span>
        </div>
        <div class="stat-group">
          <div class="stat-badge">
            <span class="stat-num">${avgPain} / 5</span>
            <span class="stat-lbl">Average Pain</span>
          </div>
          <div class="stat-badge">
            <span class="stat-num">${highPainCount}</span>
            <span class="stat-lbl">Severe Pain (4-5)</span>
          </div>
          <div class="stat-badge">
            <span class="stat-num">${payingIntentCount}</span>
            <span class="stat-lbl">Spend Money to Fix</span>
          </div>
        </div>
      </div>

      <div class="progress-bar-container mt-3">
        <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
      </div>

      <div class="mt-3 flex-between text-xs">
        <span>Step 3 Gate: 5 conversations (${loggedCount >= 5 ? "✓ Complete" : `${5 - loggedCount} more needed`})</span>
        <span>Goal: 20 conversations for deep clarity</span>
      </div>
    </div>

    <!-- 2. Unified Conversation Coach (Questions + Rules side by side) -->
    <div class="card card-oat mb-4">
      <div class="grid-2-col">
        <!-- Left: 5 Pocket Questions -->
        <div class="p-2">
          <div class="flex-between mb-2">
            <h4 class="m-0 text-espresso text-sm font-bold">5 Friendly Questions Ready to Ask</h4>
            <button id="btn-copy-cheat-sheet" class="btn btn-primary text-xs" data-text="${escapeHtml(cheatSheetText)}">
              ${getIcon("copy", { size: 12 })} Copy to Phone
            </button>
          </div>
          <ol class="step-list text-xs mb-0">
            <li class="mb-1"><strong>The Story:</strong> "${question1}"</li>
            <li class="mb-1"><strong>The Pain:</strong> "${question2}"</li>
            <li class="mb-1"><strong>Workaround:</strong> "${question3}"</li>
            <li class="mb-1"><strong>True Cost:</strong> "${question4}"</li>
            <li class="mb-0"><strong>Magic Wand:</strong> "${question5}"</li>
          </ol>
        </div>

        <!-- Right: 3 Rules for Honest Answers -->
        <div class="p-2 border-left-warm">
          <h4 class="m-0 text-espresso text-sm font-bold mb-2">3 Rules for Honest Feedback</h4>
          <div class="text-xs text-charcoal">
            <div class="mb-2">
              <strong class="text-terracotta">1. Past actions only:</strong> Never ask "Would you use an app for this?" Ask what they actually did last time.
            </div>
            <div class="mb-2">
              <strong class="text-terracotta">2. Trace the cash:</strong> Ask what they spent last month to deal with it. $0 spent often means low pain.
            </div>
            <div class="mb-0">
              <strong class="text-terracotta">3. Do not pitch:</strong> Keep your solution a secret during discovery so they do not give polite compliments.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Safe Practice Arena: The Customer Discovery Simulator -->
    <div class="card card-highlight mb-4 flex-between" id="simulator-launch-card">
      <div class="flex-row items-center gap-3">
        <span class="persona-avatar-lg text-terracotta" style="display: flex; align-items: center;">
          ${getIcon("gamepad", { size: 28 })}
        </span>
        <div>
          <div class="flex-row items-center gap-2">
            <span class="badge badge-accent text-xs">Safe Practice Arena</span>
            <h4 class="m-0 text-espresso text-sm font-bold">Unsure What to Say? Rehearse in the Simulator</h4>
          </div>
          <p class="text-xs text-muted mb-0 mt-1">
            Rehearse customer chats with 4 simulated personas (the Rushed Plumber, the Stressed Baker, the 'Polite Friend', and the Frugal Homeowner) before reaching out in real life.
          </p>
        </div>
      </div>
      <button id="btn-launch-sim-step2" class="btn btn-primary text-xs" style="white-space: nowrap;">
        ${getIcon("gamepad", { size: 13 })} Launch Practice Simulator →
      </button>
    </div>

    <!-- 3. The 1-Click Outreach Script Generator -->
    <div class="card card-oat mb-4" id="outreach-script-generator">
      <div class="flex-between flex-wrap gap-2 mb-2">
        <div>
          <span class="badge badge-accent mb-1">Outreach Toolkit</span>
          <h4 class="m-0 text-espresso text-sm font-bold">1-Click Outreach Script Generator</h4>
          <p class="text-xs text-muted mb-0 mt-1">
            Worried about sounding awkward or like a salesperson? Use these friendly, field-tested scripts tailored to your idea.
          </p>
        </div>
        <div class="flex-row items-center gap-2">
          ${tailoredAiScripts ? `
            <button id="btn-reset-outreach-scripts" class="btn btn-secondary text-xs" title="Restore default field-tested templates">
              ${getIcon("refresh", { size: 12 })} Reset to Defaults
            </button>
          ` : ""}
          <button id="btn-ai-tailor-outreach" class="btn btn-secondary text-xs" title="Generate custom Mom Test outreach scripts tailored to your specific audience">
            ${isTailoringScripts ? "Tailoring Scripts..." : `${getIcon("sparkle", { size: 13 })} Tailor Scripts with AI`}
          </button>
        </div>
      </div>

      <div class="script-tabs-header mt-2 mb-3">
        ${Object.keys(getOutreachScripts(audience, workaround)).map(key => {
          const sc = getOutreachScripts(audience, workaround)[key];
          return `
            <button class="tab-btn script-tab-btn ${activeScriptTab === key ? "active" : ""}" data-script="${key}">
              ${sc.title}
            </button>
          `;
        }).join("")}
      </div>

      <div class="script-display-box p-3 bg-white-soft rounded border-warm">
        ${(() => {
          const scripts = getOutreachScripts(audience, workaround);
          const currentScript = scripts[activeScriptTab] || scripts.sms;
          return `
            <div class="flex-between mb-2">
              <span class="badge badge-neutral text-xs">${currentScript.badge}</span>
              <button id="btn-copy-outreach-script" class="btn btn-primary text-xs" data-text="${escapeHtml(currentScript.text)}">
                ${getIcon("copy", { size: 12 })} Copy Script
              </button>
            </div>
            <p id="script-body-text" class="text-sm font-italic mb-2 p-3 bg-oat rounded text-espresso border-warm">
              "${escapeHtml(currentScript.text)}"
            </p>
            <div class="text-xs text-muted p-2 rounded bg-highlight border-warm" id="script-coach-why">
              ${currentScript.why}
            </div>
          `;
        })()}
      </div>
    </div>

    <!-- 4. Add Interview Form -->
    <div class="card mb-4" id="add-interview-card">
      <h3 class="panel-heading">Log a Conversation</h3>
      <div class="grid-2-col">
        <div class="form-group">
          <label for="int-name">Person's Name or Role</label>
          <input type="text" id="int-name" placeholder="e.g. Mike R. (Independent Roofer)">
        </div>
        <div class="form-group">
          <label for="int-channel">Where did you meet or find them?</label>
          <input type="text" id="int-channel" placeholder="e.g. Hardware store counter, local group, cold phone call">
        </div>
        <div class="form-group">
          <label for="int-workaround">What was their current workaround?</label>
          <input type="text" id="int-workaround" placeholder="e.g. Writes notes on truck dashboard, lost 2 customer calls">
        </div>
        <div class="form-group">
          <label for="int-spent">What did they spend last month trying to deal with it?</label>
          <input type="text" id="int-spent" placeholder="e.g. $150 on an answering service or $0">
        </div>
      </div>

      <div class="grid-2-col">
        <div class="form-group">
          <label for="int-quote">Memorable Verbatim Quote</label>
          <input type="text" id="int-quote" placeholder="e.g. 'By the time I crawl out from under the house, they already hired someone else.'">
        </div>
        <div class="form-group">
          <div class="grid-2-col">
            <div>
              <label for="int-pain">Pain Severity (1 to 5)</label>
              <select id="int-pain">
                <option value="5">5: Severe (Costs money or daily crisis)</option>
                <option value="4" selected>4: High (Frequent annoyance, pays to fix)</option>
                <option value="3">3: Moderate (Noticeable inconvenience)</option>
                <option value="2">2: Low (Mild nuisance, easily ignored)</option>
                <option value="1">1: None (Not an active issue)</option>
              </select>
            </div>
            <div class="flex-align-end">
              <label class="checkbox-label">
                <input type="checkbox" id="int-paying-intent">
                <span>Indicated willingness to pay</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Tag Pills -->
      <div class="form-group mt-1">
        <label>Quick Tags:</label>
        <div class="tag-pills-row" id="tag-pills-container">
          ${QUICK_TAGS.map(t => `
            <button type="button" class="tag-pill-btn" data-tag="${t}">+ ${t}</button>
          `).join("")}
        </div>
      </div>

      <div class="flex-between mt-3">
        <button id="btn-ai-analyze-interview" type="button" class="btn btn-secondary text-xs flex-center gap-1" style="border-color: var(--color-amber);">
          ${getIcon("sparkle", { size: 13 })} <strong>AI Analyze Quote & Signals</strong>
        </button>
        <button id="btn-save-interview" class="btn btn-primary">Save Conversation</button>
      </div>
      <div id="ai-interview-feedback" class="text-xs p-2 mt-2 rounded bg-highlight border-warm d-none"></div>
    </div>

    <!-- 4. Logged Interviews Table -->
    <div class="card">
      <h3 class="panel-heading">Saved Conversation Notes (${loggedCount})</h3>
      
      ${interviews.length === 0 ? `
        <div class="empty-state text-center py-4">
          <p class="text-muted">No conversations saved yet. Use the 5 friendly questions above to talk with 1 person today!</p>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Channel</th>
                <th>Workaround</th>
                <th>Spent Last Mo.</th>
                <th>Pain</th>
                <th>Memorable Quote</th>
                <th>Tags</th>
                <th>Pay Signal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${interviews.map((item, idx) => `
                <tr>
                  <td><strong>${escapeHtml(item.contactName)}</strong></td>
                  <td class="text-xs text-muted">${escapeHtml(item.channel || "Direct")}</td>
                  <td class="text-xs">${escapeHtml(item.pastWorkaround || "-")}</td>
                  <td class="text-xs">${escapeHtml(item.spentLastMonth || "$0")}</td>
                  <td>
                    <span class="badge ${item.painScore >= 4 ? "badge-danger-warm" : "badge-neutral"}">
                      ${item.painScore}/5
                    </span>
                  </td>
                  <td class="text-xs font-italic">"${escapeHtml(item.keyQuote || "-")}"</td>
                  <td class="text-xs">
                    ${(item.tags || []).map(t => `<span class="badge badge-neutral text-xs mr-1">${escapeHtml(t)}</span>`).join(" ") || "-"}
                  </td>
                  <td>${item.willingToPaySignal ? '<span class="text-success font-bold">✓ Yes</span>' : '<span class="text-muted">No</span>'}</td>
                  <td>
                    <button class="btn-icon text-danger delete-int-btn" data-index="${idx}" title="Delete entry">✕</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}

      <div class="mt-4 pt-3 border-top flex-between">
        <div>
          ${loggedCount >= 5 ? `
            <div class="text-success font-bold">
              ✓ Step 2 Complete: 5+ conversations logged with real evidence. Step 3 is unlocked!
            </div>
          ` : `
            <div class="text-warning-dark">
              🔒 Step 3 requires talking to ${5 - loggedCount} more person${5 - loggedCount === 1 ? "" : "s"} to unlock.
            </div>
          `}
        </div>
        ${loggedCount >= 5 ? `
          <button id="btn-proceed-stage-3" class="btn btn-primary">
            Next: Step 3 (Your 1-Page Plan) →
          </button>
        ` : ""}
      </div>
    </div>
  `;

  attachStage2Events(container, cheatSheetText);
}

function attachStage2Events(container, cheatSheetText) {
  const saveBtn = container.querySelector("#btn-save-interview");
  const proceedBtn = container.querySelector("#btn-proceed-stage-3");
  const copyCheatSheetBtn = container.querySelector("#btn-copy-cheat-sheet");
  const copyOutreachBtn = container.querySelector("#btn-copy-outreach-script");

  copyCheatSheetBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(cheatSheetText).then(() => {
      copyCheatSheetBtn.innerHTML = `${getIcon("check", { size: 12 })} Copied!`;
      setTimeout(() => { copyCheatSheetBtn.innerHTML = `${getIcon("copy", { size: 12 })} Copy to Phone`; }, 2000);
    });
  });

  copyOutreachBtn?.addEventListener("click", () => {
    const textToCopy = copyOutreachBtn.getAttribute("data-text");
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyOutreachBtn.innerHTML = `${getIcon("check", { size: 12 })} Copied Script!`;
      setTimeout(() => { copyOutreachBtn.innerHTML = `${getIcon("copy", { size: 12 })} Copy Script`; }, 2000);
    });
  });

  container.querySelectorAll(".script-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeScriptTab = e.currentTarget.getAttribute("data-script");
      renderStage2(container);
    });
  });

  // AI Tailored Outreach Scripts
  container.querySelector("#btn-reset-outreach-scripts")?.addEventListener("click", () => {
    tailoredAiScripts = null;
    activeScriptTab = "sms";
    renderStage2(container);
  });

  container.querySelector("#btn-ai-tailor-outreach")?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect an AI provider (OpenAI, Gemini, Claude, Grok, or local Ollama) to generate tailored outreach scripts for your audience?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    isTailoringScripts = true;
    renderStage2(container);

    try {
      const s1 = store.state.stage1;
      const res = await generateCustomOutreach({
        audience: s1.targetAudience || "people dealing with this",
        problem: s1.currentWorkaround || s1.painStory || "handling this manually",
        ideaName: store.state.name,
        config: store.getAiConfig()
      });
      tailoredAiScripts = res;
      activeScriptTab = "sms";
    } catch (err) {
      alert("Could not tailor outreach scripts: " + (err.message || String(err)));
    } finally {
      isTailoringScripts = false;
      renderStage2(container);
    }
  });

  container.querySelector("#btn-launch-sim-step2")?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:open-simulator"));
  });

  container.querySelectorAll(".tag-pill-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tag = e.currentTarget.getAttribute("data-tag");
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        e.currentTarget.classList.remove("active-tag");
      } else {
        selectedTags.push(tag);
        e.currentTarget.classList.add("active-tag");
      }
    });
  });

  // AI Quote & Signal Analyzer
  const aiAnalyzeBtn = container.querySelector("#btn-ai-analyze-interview");
  const aiFeedbackBox = container.querySelector("#ai-interview-feedback");
  aiAnalyzeBtn?.addEventListener("click", async () => {
    if (!store.isAiConfigured()) {
      if (confirm("✨ AI Co-Pilot is not configured yet. Would you like to connect Google Gemini, OpenAI, Claude, Grok, or local Ollama now?")) {
        window.dispatchEvent(new CustomEvent("app:open-ai-settings"));
      }
      return;
    }

    const workaround = container.querySelector("#int-workaround").value.trim();
    const quote = container.querySelector("#int-quote").value.trim();
    const spent = container.querySelector("#int-spent").value.trim();

    if (!quote && !workaround) {
      alert("Please type a customer quote or current workaround first for the AI to analyze.");
      return;
    }

    aiAnalyzeBtn.textContent = "⏳ Analyzing Quote...";
    aiAnalyzeBtn.disabled = true;

    const prompt = `Analyze this customer conversation note:
Quote: "${quote}"
Current Workaround: "${workaround}"
Spent Last Month: "${spent}"

Extract:
1. Likely Pain Score (integer from 1 to 5, where 5 is extreme pain/losing money, 1 is none)
2. Willingness to Pay Signal (boolean: true if they actually spend money or showed real commercial desperation; false if they gave polite compliments or spend $0)
3. Suggested Tags (choose 1 to 2 from: ["Losing Money", "Severe Stress", "Tried Other Tools", "Wants It Yesterday", "Will Pay Monthly", "Wrong Audience", "Zero Interest"])
4. One sentence practical insight on what this person's words really mean.

Respond strictly with valid JSON only in this exact format:
{
  "painScore": 4,
  "willingToPaySignal": true,
  "suggestedTags": ["Losing Money"],
  "insight": "..."
}`;

    try {
      const res = await callAi({
        prompt,
        systemPrompt: "You are an expert customer discovery analyst detecting real buying intent vs polite false positives.",
        temperature: 0.2,
        jsonMode: true,
        config: store.getAiConfig()
      });

      const parsed = JSON.parse(res);
      if (parsed.painScore) {
        container.querySelector("#int-pain").value = String(parsed.painScore);
      }
      if (typeof parsed.willingToPaySignal === "boolean") {
        container.querySelector("#int-paying-intent").checked = parsed.willingToPaySignal;
      }
      if (Array.isArray(parsed.suggestedTags)) {
        parsed.suggestedTags.forEach(t => {
          if (!selectedTags.includes(t)) selectedTags.push(t);
        });
        container.querySelectorAll(".tag-pill-btn").forEach(btn => {
          const t = btn.getAttribute("data-tag");
          if (selectedTags.includes(t)) btn.classList.add("active-tag");
        });
      }
      if (aiFeedbackBox && parsed.insight) {
        aiFeedbackBox.classList.remove("d-none");
        aiFeedbackBox.innerHTML = `<strong>✨ AI Discovery Insight:</strong> ${escapeHtml(parsed.insight)}`;
      }
    } catch (err) {
      alert(`AI Analysis error: ${err.message || String(err)}`);
    } finally {
      aiAnalyzeBtn.innerHTML = `${getIcon("sparkle", { size: 13 })} <strong>AI Analyze Quote & Signals</strong>`;
      aiAnalyzeBtn.disabled = false;
    }
  });

  saveBtn?.addEventListener("click", () => {
    const name = container.querySelector("#int-name").value.trim();
    const channel = container.querySelector("#int-channel").value.trim();
    const workaround = container.querySelector("#int-workaround").value.trim();
    const spent = container.querySelector("#int-spent").value.trim();
    const quote = container.querySelector("#int-quote").value.trim();
    const pain = parseInt(container.querySelector("#int-pain").value, 10);
    const paying = container.querySelector("#int-paying-intent").checked;

    if (!name) {
      alert("Please enter a name or role description for who you spoke with.");
      return;
    }

    const newEntry = {
      id: "int_" + Date.now(),
      contactName: name,
      channel,
      date: new Date().toISOString().split("T")[0],
      pastWorkaround: workaround,
      painScore: pain,
      spentLastMonth: spent,
      keyQuote: quote,
      willingToPaySignal: paying,
      tags: [...selectedTags]
    };

    store.state.stage2.interviews.push(newEntry);
    store.saveState();
    renderStage2(container);
    window.dispatchEvent(new CustomEvent("app:state-updated"));
  });

  container.querySelectorAll(".delete-int-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      if (confirm("Remove this conversation entry?")) {
        store.state.stage2.interviews.splice(idx, 1);
        store.saveState();
        renderStage2(container);
        window.dispatchEvent(new CustomEvent("app:state-updated"));
      }
    });
  });

  proceedBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("app:navigate-stage", { detail: { stage: 3 } }));
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
