// testingPlaybook.js: Step 4: Simple, low-cost tests to explore whether people might be interested.
// Written in plain English without strong promises or business guarantees.

export const testingPlaybook = [
  {
    id: "concierge_test",
    name: "The Do-It-By-Hand Test",
    cost: "$0",
    effortHours: "4 to 8 hours",
    bestFor: "Services, matching people, organizing things, or tasks done by hand",
    summary: "Try helping a few people by hand using phone calls, emails, or notes to see what they find helpful before building software or tools.",
    steps: [
      "Find 3 people who face this problem and are open to trying a manual workaround.",
      "Offer to help them by hand for free or a nominal fee in exchange for honest feedback.",
      "Carry out the task yourself without any fancy tools.",
      "Observe what helped them and where they were indifferent."
    ],
    signalMetric: "Do at least 2 out of the 3 people express interest in having you help them again?"
  },
  {
    id: "fake_door_landing",
    name: "The Simple 1-Page Sign-Up Test",
    cost: "$0 (or $10 for a domain name)",
    effortHours: "2 to 3 hours",
    bestFor: "Websites, apps, guides, or digital tools",
    summary: "Create a simple, free 1-page website that explains your idea with a button to gauge interest.",
    steps: [
      "Build a free 1-page site using a free tool like Carrd, Notion, or Google Sites.",
      "Describe the headache, your proposed idea, and an estimated price point.",
      "Place a button that invites interested visitors to join an early notification list.",
      "Share the link with people who match your potential audience."
    ],
    signalMetric: "Observing whether several visitors choose to enter their email address gives a preliminary sense of interest."
  },
  {
    id: "cold_dm_sprint",
    name: "The 25 Friendly Messages Test",
    cost: "$0",
    effortHours: "2 to 3 hours",
    bestFor: "Local trade businesses, freelance ideas, consulting, or specialized tools",
    summary: "Send 25 polite inquiries to learn how people currently cope with this task.",
    steps: [
      "Write a short, friendly 3-sentence note: acknowledge they are busy and ask 1 simple question.",
      "Do not attempt to sell or pitch anything.",
      "Ask: 'What is the most frustrating part of handling [task X] in your typical routine?'",
      "Notice how many people share stories of genuine frustration."
    ],
    signalMetric: "Receiving several thoughtful replies about common frustrations indicates you are looking in an active area."
  },
  {
    id: "preorder_deposit",
    name: "The Small $10 Deposit Test",
    cost: "$0",
    effortHours: "1 hour setup",
    bestFor: "Physical products, premium tools, or special workshops",
    summary: "Invite interested people to place a small, refundable deposit to measure genuine intent.",
    steps: [
      "Set up a simple payment link using a standard provider like Stripe or PayPal.",
      "Offer: 'We are planning a small first batch. Place a refundable $10 deposit if you would like an early spot.'",
      "Only offer this to people who previously noted that they experience this problem.",
      "If they hesitate, politely ask what questions or doubts they have."
    ],
    signalMetric: "If a few people place a deposit, it suggests potential willingness to pay, though future commercial success is never assured."
  }
];

export const signalEvaluator = {
  calculateSignal(data) {
    const { interviewsLogged, highPainCount, experimentConversions, visitorsOrOutreach } = data;
    
    const conversionRate = visitorsOrOutreach > 0 ? (experimentConversions / visitorsOrOutreach) * 100 : 0;
    
    if (interviewsLogged >= 5 && highPainCount >= 3 && (experimentConversions >= 3 || conversionRate >= 7.0)) {
      return {
        verdict: "GREEN: Encouraging Early Signal",
        badgeClass: "badge-success",
        explanation: "Several people confirmed experiencing this frustration, and a few took an active exploratory step. While this does not guarantee commercial success, it suggests you may proceed to plan a cautious next step.",
        nextSteps: "Review Step 5 to outline a conservative starter budget and explore potential grant programs."
      };
    } else if (interviewsLogged >= 3 && (highPainCount >= 1 || experimentConversions >= 1)) {
      return {
        verdict: "YELLOW: Mixed or Unclear Signal",
        badgeClass: "badge-warning",
        explanation: "Some mild interest was observed, but people are not showing strong urgency. Proceeding to build now could risk spending time on something people find optional rather than necessary.",
        nextSteps: "Check the 'Encourager & Fix-It Guide' to narrow your audience or explore a more pressing angle."
      };
    } else {
      return {
        verdict: "RED: Low Early Response",
        badgeClass: "badge-danger",
        explanation: "Very few people expressed interest during this initial test. Catching low interest early helps avoid spending personal funds on an idea that lacks demand.",
        nextSteps: "Consider pausing further development, exploring a different audience segment, or testing an alternative idea."
      };
    }
  }
};
