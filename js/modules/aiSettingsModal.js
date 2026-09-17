// aiSettingsModal.js: Modal interface for configuring optional Bring-Your-Own-Key AI.
// Supports Google Gemini, OpenAI, Anthropic Claude, xAI Grok, Ollama (local), and Custom OpenAI endpoints.

import { AI_PROVIDERS, testAiConnection, fetchLocalOllamaModels } from "../services/aiClient.js";
import { store } from "../store.js";

let activeProvider = "gemini";
let showKey = false;
let isTesting = false;

export function renderAiSettingsModal(container) {
  if (!container) return;
  const currentConfig = store.getAiConfig();
  if (!activeProvider) activeProvider = currentConfig.provider || "gemini";

  const providerMeta = AI_PROVIDERS[activeProvider] || AI_PROVIDERS.gemini;

  container.innerHTML = `
    <div class="modal-header">
      <div class="flex-between w-100">
        <div class="flex-row items-center gap-2">
          <span style="font-size: 1.5rem;">✨</span>
          <div>
            <h3 class="m-0 text-sm font-bold text-espresso">AI Co-Pilot & Provider Settings (Optional)</h3>
            <span class="text-xs text-muted">Bring your own key for Google Gemini, OpenAI, Claude, Grok, or local Ollama</span>
          </div>
        </div>
        <button class="btn-icon" id="ai-settings-close-btn" aria-label="Close modal">✕</button>
      </div>
    </div>

    <div class="modal-body text-sm" style="max-height: 70vh; overflow-y: auto;">
      <!-- Local Storage Notice -->
      <div class="card p-2 px-3 bg-white-soft border-warm mb-3 flex-between">
        <div class="flex-row items-center gap-2">
          <span style="font-size: 1.2rem;">🔒</span>
          <span class="text-xs text-charcoal">
            <strong>Local Storage Notice:</strong> Your key is saved locally in this browser. Requests connect directly to your chosen provider endpoint without an intermediary server or analytics from this app.
          </span>
        </div>
        <span class="badge ${currentConfig.enabled ? "badge-success" : "badge-neutral"} text-xs">
          ${currentConfig.enabled ? "✓ AI Active" : "AI Disabled"}
        </span>
      </div>

      <!-- Provider Tabs Header -->
      <label class="form-label text-xs font-bold text-espresso mb-1 d-block">Select AI Provider:</label>
      <div class="provider-tabs-grid mb-3">
        ${Object.keys(AI_PROVIDERS).map(pKey => {
          const p = AI_PROVIDERS[pKey];
          const isActive = activeProvider === pKey;
          return `
            <button class="btn ${isActive ? "btn-primary" : "btn-secondary"} text-xs provider-tab-btn" data-provider="${pKey}" style="justify-content: flex-start;">
              <span>${p.icon}</span>
              <span>${p.name}</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Active Provider Form -->
      <div class="card p-3 bg-white-soft border-warm mb-3">
        <div class="flex-between mb-2">
          <div class="flex-row items-center gap-2">
            <span style="font-size: 1.3rem;">${providerMeta.icon}</span>
            <strong class="text-espresso text-sm">${providerMeta.name} Setup</strong>
          </div>
          ${providerMeta.helpUrl ? `
            <a href="${providerMeta.helpUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-terracotta font-bold" style="text-decoration: underline;">
              Get ${providerMeta.name} Key ↗
            </a>
          ` : ""}
        </div>

        <p class="text-xs text-muted mb-3">${providerMeta.helpText}</p>

        <!-- API Key Input (Ollama doesn't strictly need one) -->
        ${activeProvider !== "ollama" ? `
          <div class="form-group mb-3">
            <label class="form-label text-xs font-bold" for="ai-key-input">API Key:</label>
            <div class="flex-row items-center gap-2">
              <input 
                type="${showKey ? "text" : "password"}" 
                id="ai-key-input" 
                class="form-input text-xs" 
                placeholder="${providerMeta.keyPlaceholder}" 
                value="${activeProvider === currentConfig.provider ? escapeHtml(currentConfig.apiKey || "") : ""}"
                style="flex: 1;"
              >
              <button class="btn btn-secondary text-xs" id="btn-toggle-key-visibility" type="button">
                ${showKey ? "Hide" : "Show"}
              </button>
            </div>
            <span class="text-xs text-muted mt-1 d-block">Keys are never shared or sent to any server other than ${providerMeta.name}.</span>
          </div>
        ` : ""}

        <!-- Endpoint Input (for Ollama or Custom) -->
        ${activeProvider === "ollama" || activeProvider === "custom" ? `
          <div class="form-group mb-3">
            <label class="form-label text-xs font-bold" for="ai-endpoint-input">API Endpoint URL:</label>
            <div class="flex-row items-center gap-2">
              <input 
                type="text" 
                id="ai-endpoint-input" 
                class="form-input text-xs" 
                placeholder="${providerMeta.defaultEndpoint || "http://localhost:11434"}" 
                value="${escapeHtml(currentConfig.endpoint || providerMeta.defaultEndpoint || "")}"
                style="flex: 1;"
              >
              ${activeProvider === "ollama" ? `
                <button class="btn btn-secondary text-xs" id="btn-detect-ollama-models" type="button" title="Scan local Ollama for installed models">
                  🔄 Detect Models
                </button>
              ` : ""}
            </div>
            <div id="ollama-detection-status" class="text-xs mt-1">
              ${activeProvider === "ollama" 
                ? '<span class="text-muted">Scanning localhost:11434 for installed models...</span>'
                : '<span class="text-muted">OpenAI-compatible chat completion base URL (e.g. <code>https://api.groq.com/openai/v1</code>).</span>'}
            </div>
          </div>
        ` : ""}

        <!-- Model Selection -->
        <div class="form-group mb-3">
          <label class="form-label text-xs font-bold" for="ai-model-select">Model:</label>
          <div class="flex-row items-center gap-2">
            <select id="ai-model-select" class="form-input text-xs" style="flex: 1;">
              ${(providerMeta.models || [providerMeta.defaultModel]).map(m => `
                <option value="${m}" ${(activeProvider === currentConfig.provider && currentConfig.model === m) || m === providerMeta.defaultModel ? "selected" : ""}>
                  ${m} ${m === providerMeta.defaultModel ? "(Recommended)" : ""}
                </option>
              `).join("")}
              <option value="__custom__">Custom model name...</option>
            </select>
          </div>
          <input 
            type="text" 
            id="ai-model-custom" 
            class="form-input text-xs mt-2 d-none" 
            placeholder="e.g. gpt-4o-2024-08-06 or custom model id"
            value="${escapeHtml(currentConfig.model || "")}"
          >
        </div>

        <!-- Connection Test Area -->
        <div class="flex-between mt-3 pt-2 border-top-warm">
          <button class="btn btn-secondary text-xs" id="btn-test-ai-connection" ${isTesting ? "disabled" : ""}>
            ${isTesting ? "Testing connection..." : "🔌 Test Connection"}
          </button>
          <div id="ai-test-result" class="text-xs"></div>
        </div>
      </div>

      <!-- What AI Enhances in the App -->
      <div class="p-2 bg-oat rounded border-warm text-xs">
        <strong class="text-espresso">✨ What you unlock with AI enabled:</strong>
        <ul class="m-0 mt-1 pl-3 text-muted">
          <li><strong>Step 1:</strong> AI Jargon Slayer & Problem Hypothesis Refiner</li>
          <li><strong>Step 2:</strong> Dynamic Customer Discovery Persona tailored to your exact idea</li>
          <li><strong>Step 2:</strong> Unspoken Pain & Buying Signal extraction from raw interview notes</li>
          <li><strong>Step 3 & 4:</strong> 1-Page Canvas Co-Pilot & Scrappy $0 Test suggestions</li>
          <li><strong>Step 5:</strong> Micro-budget hidden costs & blindspot audit</li>
        </ul>
      </div>
    </div>

    <div class="modal-footer flex-between">
      <div>
        ${currentConfig.enabled ? `
          <button class="btn btn-secondary text-xs text-danger" id="btn-disable-ai">
            Disable AI
          </button>
        ` : ""}
      </div>
      <div class="flex-row items-center gap-2">
        <button class="btn btn-secondary text-xs" id="ai-settings-cancel-btn">Cancel</button>
        <button class="btn btn-primary text-xs" id="btn-save-ai-settings">
          Save & Enable AI ✨
        </button>
      </div>
    </div>
  `;

  attachEvents(container);
}

function attachEvents(container) {
  const close = () => container.closest(".modal-overlay")?.classList.remove("modal-open");
  container.querySelector("#ai-settings-close-btn")?.addEventListener("click", close);
  container.querySelector("#ai-settings-cancel-btn")?.addEventListener("click", close);

  // Toggle Key Visibility
  container.querySelector("#btn-toggle-key-visibility")?.addEventListener("click", () => {
    showKey = !showKey;
    const input = container.querySelector("#ai-key-input");
    const btn = container.querySelector("#btn-toggle-key-visibility");
    if (input) input.type = showKey ? "text" : "password";
    if (btn) btn.textContent = showKey ? "Hide" : "Show";
  });

  // Switch Provider Tabs
  container.querySelectorAll(".provider-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeProvider = e.currentTarget.getAttribute("data-provider");
      renderAiSettingsModal(container);
    });
  });

  // Ollama Model Auto-Detection
  if (activeProvider === "ollama") {
    const runOllamaDetection = async (showFeedback = false) => {
      const endpointInput = container.querySelector("#ai-endpoint-input");
      const statusEl = container.querySelector("#ollama-detection-status");
      const select = container.querySelector("#ai-model-select");
      const endpoint = (endpointInput ? endpointInput.value.trim() : "") || "http://localhost:11434";

      if (showFeedback && statusEl) {
        statusEl.innerHTML = '<span class="text-muted">Scanning localhost:11434 for local models...</span>';
      }

      try {
        const models = await fetchLocalOllamaModels(endpoint);
        if (models && models.length > 0) {
          if (statusEl) {
            statusEl.innerHTML = `<span class="text-success font-bold">🟢 Connected to Ollama! Found ${models.length} model${models.length > 1 ? 's' : ''}: <code>${models.join('</code>, <code>')}</code></span>`;
          }
          if (select) {
            const currentVal = select.value;
            const target = models.includes(currentVal) ? currentVal : models[0];
            select.innerHTML = `
              ${models.map(m => `<option value="${m}" ${m === target ? "selected" : ""}>${m} (Installed Locally)</option>`).join("")}
              <optgroup label="Other Standard Models">
                <option value="llama3.2:latest">llama3.2:latest</option>
                <option value="llama3.2">llama3.2</option>
                <option value="gemma4:12b">gemma4:12b</option>
                <option value="mistral">mistral</option>
                <option value="qwen2.5">qwen2.5</option>
              </optgroup>
              <option value="__custom__">Custom model name...</option>
            `;
            select.value = target;
          }
        } else if (showFeedback && statusEl) {
          statusEl.innerHTML = `<span class="text-danger">⚠️ Could not find models at <code>${escapeHtml(endpoint)}</code>. Make sure Ollama is running.</span>`;
        } else if (statusEl) {
          statusEl.innerHTML = `<span class="text-muted">Default is <code>http://localhost:11434</code>. Click <strong>🔄 Detect Models</strong> to scan.</span>`;
        }
      } catch (err) {
        if (statusEl && showFeedback) {
          statusEl.innerHTML = `<span class="text-danger">⚠️ Could not reach Ollama: ${escapeHtml(err.message)}</span>`;
        }
      }
    };

    container.querySelector("#btn-detect-ollama-models")?.addEventListener("click", () => runOllamaDetection(true));
    // Run initial scan automatically on render
    runOllamaDetection(false);
  }

  // Model select change (handle custom model)
  const modelSelect = container.querySelector("#ai-model-select");
  const modelCustom = container.querySelector("#ai-model-custom");
  modelSelect?.addEventListener("change", (e) => {
    if (e.target.value === "__custom__") {
      modelCustom?.classList.remove("d-none");
      modelCustom?.focus();
    } else {
      modelCustom?.classList.add("d-none");
    }
  });

  // Get current form config
  const getFormConfig = () => {
    const keyInput = container.querySelector("#ai-key-input");
    const endpointInput = container.querySelector("#ai-endpoint-input");
    const selectedModel = modelSelect?.value === "__custom__" 
      ? modelCustom?.value.trim() 
      : modelSelect?.value;

    return {
      provider: activeProvider,
      apiKey: keyInput ? keyInput.value.trim() : "",
      model: selectedModel || AI_PROVIDERS[activeProvider]?.defaultModel,
      endpoint: endpointInput ? endpointInput.value.trim() : "",
      enabled: true
    };
  };

  // Test Connection
  container.querySelector("#btn-test-ai-connection")?.addEventListener("click", async () => {
    const cfg = getFormConfig();
    const resultEl = container.querySelector("#ai-test-result");
    if (resultEl) {
      resultEl.innerHTML = '<span class="text-muted">Connecting...</span>';
    }

    isTesting = true;
    const testBtn = container.querySelector("#btn-test-ai-connection");
    if (testBtn) testBtn.disabled = true;

    try {
      const res = await testAiConnection(cfg);
      if (res.success) {
        resultEl.innerHTML = `<span class="text-success font-bold">✓ ${escapeHtml(res.message)}</span>`;
      } else {
        resultEl.innerHTML = `<span class="text-danger font-bold">✕ ${escapeHtml(res.message)}</span>`;
      }
    } catch (err) {
      resultEl.innerHTML = `<span class="text-danger font-bold">✕ Error: ${escapeHtml(err.message)}</span>`;
    } finally {
      isTesting = false;
      if (testBtn) testBtn.disabled = false;
    }
  });

  // Save & Enable
  container.querySelector("#btn-save-ai-settings")?.addEventListener("click", () => {
    const cfg = getFormConfig();
    if (cfg.provider !== "ollama" && (!cfg.apiKey || cfg.apiKey.length < 3)) {
      alert("Please enter a valid API key for " + AI_PROVIDERS[cfg.provider]?.name);
      return;
    }

    store.saveAiConfig(cfg);
    close();
    alert(`✨ AI Co-Pilot enabled with ${AI_PROVIDERS[cfg.provider]?.name}! Look for the ✨ AI buttons across all 5 steps.`);
  });

  // Disable AI
  container.querySelector("#btn-disable-ai")?.addEventListener("click", () => {
    const current = store.getAiConfig();
    current.enabled = false;
    store.saveAiConfig(current);
    renderAiSettingsModal(container);
    alert("AI Co-Pilot has been disabled. The app will continue in offline template mode.");
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
