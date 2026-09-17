# 🧭 Micro-Startup Compass

> **A Simple, Stage-Gated Operating System for Everyday Innovators, Makers, and Micro-Scale Entrepreneurs.**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Capable-forest.svg)](manifest.json)
[![Zero Telemetry](https://img.shields.io/badge/Privacy-Local%20Device%20Storage-blue.svg)](#privacy--architecture)

**Micro-Startup Compass** is a practical, stage-gated web application designed to help first-time founders, tradespeople, home bakers, solo makers, and creative freelancers take an early concept from vague intuition to customer-verified reality—**without burning through savings, getting trapped in Silicon Valley buzzwords, or writing 40-page business plans.**

---

## 👨‍🏫 Conceptualization & Academic Leadership

* **Conceptualization and Development Credit:** **[Professor Babu George](https://www.linkedin.com/in/beingbabu/)**
* **Connect on LinkedIn:** [https://www.linkedin.com/in/beingbabu/](https://www.linkedin.com/in/beingbabu/)

---

## 💡 Core Philosophy

1. **Stage-Gated, Not Domain-Gated:** Rather than bouncing randomly between marketing, legal, and finance, founders follow a structured, proven progression: Clarify Problem $\rightarrow$ Talk to People $\rightarrow$ 1-Page Plan $\rightarrow$ Free Quick Tests $\rightarrow$ Next Steps & Grants.
2. **$0 Pre-Build Validation:** Never build an app or buy bulk inventory before confirming willingness to pay. Every test can be run with paper notes, conversations, phone calls, or manual assistance.
3. **15-Minute Daily Momentum:** Big business plans cause burnout. One 15-minute micro-action per day builds real commercial momentum.
4. **Local Device Storage:** All notes, interviews, and financial calculations are stored locally in your browser (`localStorage`). There are no accounts, paywalls, tracking scripts, or central databases.

---

## ✨ Features & Architecture

### 🗺️ The 5 Core Steps
* **Step 1: Clarify the Problem** — Jargon-free problem framing, testable hypotheses, and the **Everyday Goldmine Finder** (4 zones: Chores People Hate, Slow Contractors, Forgotten Specialties, Community Gaps) with 12 starter seeds.
* **Step 2: Talk to Real People** — 1-Click Outreach Script Generator (SMS, WhatsApp, Community Posts, In-Person Openers), customer interview notes tracker with buying signal flags, and the safe-practice **Conversation Simulator**.
* **Step 3: One-Page Plan** — A simplified Lean Canvas designed for trades and solo makers, integrated with **Pocket Napkin Math** (*"I just need 2 sales a day to hit my income goal"*).
* **Step 4: Quick Free Tests** — Structured zero-dollar smoke tests (Pre-Orders, Letters of Intent, Curbside Demos) to prove commitment before spending capital.
* **Step 5: Next Steps & Starter Grants** — A transparent 30-day budget under $500, **Break-Even Velocity** calculator, and a directory of free, non-dilutive small business grants.

### ⚡ Superpowers & Engagement Tools
* **⚡ 15-Minute Daily Founder Missions:** A persistent daily progress drawer offering 10 bite-sized founder tasks across all 5 steps.
* **🎮 Customer Discovery Conversation Simulator:** Rehearse customer discovery in private against realistic simulated personas (Dave the skeptical plumber, Sarah the overwhelmed baker, Linda the 'polite friend' danger zone, Maria the pragmatic homeowner) with browser Speech Synthesis audio and real-time coaching debriefs.
* **🌟 Everyday Innovator Stories (Hall of Fame):** Grounded case studies of real micro-founders who launched for under $100 (mobile knife sharpeners, cottage baker order hubs, neighborhood tool sheds).
* **🏅 8 Visual Founder Milestone Badges:** Celebrate real-world micro-wins (The Jargon Slayer, The Empathetic Listener, The Napkin Mathematician, The Zero-Dollar Scientist).
* **📄 Summary & Community Flyer Export:** Turn the entire workbook into a clean executive summary or a print-ready community flyer with one click.
* **💡 The Encourager & Setback Fixer:** Built-in tactical diagnoses and copyable scripts for when people ghost, say prices are too high, or friends give polite lies.
* **✨ Optional Bring-Your-Own-Key AI Co-Pilot:** Connect your own API key (**Google Gemini**, **OpenAI**, **Anthropic Claude**, **xAI Grok**, or **local Ollama models**) for on-demand brainstorming, custom persona generation, and interview note signal extraction. The app remains completely functional offline without an API key.

---

## 🚀 Running Locally

This application is built using standard Vanilla Web technologies (HTML5, CSS3, ES Modules, Service Worker) with **zero build steps, zero npm installs, and zero external runtime dependencies**.

### Option A: Python HTTP Server (Built into Windows/Mac/Linux)
```bash
# Clone the repository
git clone https://github.com/professorgeorge/microstartup.git
cd microstartup

# Start local server
python -m http.server 8085
```
Open your browser to: **`http://localhost:8085`**

### Option B: Node.js `npx serve`
```bash
npx -y serve -p 8085 .
```

---

## 🌐 Publishing to GitHub Pages

To make the app live at **`https://professorgeorge.github.io/microstartup/`**:

1. Go to your GitHub repository: [https://github.com/professorgeorge/microstartup](https://github.com/professorgeorge/microstartup)
2. Click on **Settings** $\rightarrow$ **Pages** (in the left sidebar under *Code and automation*).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1–2 minutes, GitHub will publish your site at:
   `https://professorgeorge.github.io/microstartup/`

---

## 📱 Installing as a Mobile PWA

Micro-Startup Compass is a certified Progressive Web App:
* **iOS (iPhone/iPad):** Open the URL in Safari, tap the **Share** button $\rightarrow$ tap **Add to Home Screen**.
* **Android:** Open the URL in Chrome, tap the **Three Dots** menu $\rightarrow$ tap **Install App** or **Add to Home Screen**.
* **Desktop (Chrome/Edge):** Click the **Install App** icon in the browser address bar.

---

## 🔒 Privacy & Architecture

* **Client-Side Operation:** All data stays on your device in standard `localStorage`.
* **Zero Telemetry:** No cookies, no tracking pixels, and no analytics databases.
* **Direct AI Connections:** If you configure an optional AI provider, requests travel directly from your browser to that provider's official API endpoint. API keys are stored solely in your local browser.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
