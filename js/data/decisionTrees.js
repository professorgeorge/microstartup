// decisionTrees.js: Simple, friendly guides for Money, Finding Customers, and Working Solo.
// Written for ordinary people who want straight answers, not MBA textbook jargon.

export const decisionTrees = {
  finance: {
    title: "Money Guide: Do You Need Money to Start?",
    intro: "Starting small does not require thousands of dollars. The goal right now is to spend as little of your own money as possible until you know people want this.",
    nodes: {
      start: {
        question: "Do you need money right now to prove that people want your idea?",
        options: [
          { text: "No, I can test by talking to people, using pen and paper, or helping manually", next: "zero_dollar_path" },
          { text: "Yes, I need to buy physical materials or build a basic prototype", next: "capital_needed" }
        ]
      },
      zero_dollar_path: {
        type: "outcome",
        badge: "The $0 Test Path",
        summary: "Do not spend your hard-earned money yet. Keep your budget at exactly zero dollars.",
        actionSteps: [
          "Do the work by hand first: use phone calls, text messages, or simple spreadsheets instead of paying for software.",
          "Talk to at least 5 to 10 real people who suffer from the problem to verify they care.",
          "Do not pay for business cards, logos, or legal filings yet. Save that money until people are eager to pay you."
        ]
      },
      capital_needed: {
        question: "How much money do you actually need to test your very first sample?",
        options: [
          { text: "A small amount (under $250 for basic supplies or a web domain)", next: "micro_self_fund" },
          { text: "A medium amount ($1,000 to $5,000 for tools or initial inventory)", next: "micro_grant_path" },
          { text: "A huge amount (over $10,000 for big machines or patents)", next: "high_capital_warning" }
        ]
      },
      micro_self_fund: {
        type: "outcome",
        badge: "Safe Small Budget",
        summary: "Set a strict personal spending limit (for example, $100 or $200) and treat it like an experiment.",
        actionSteps: [
          "Set aside a specific small amount in a separate account so your family bills stay safe.",
          "Rule of thumb: if nobody shows interest after spending that small budget, pause and talk to more people before spending another penny.",
          "Look for free trials and free starter accounts on every tool you use."
        ]
      },
      micro_grant_path: {
        type: "outcome",
        badge: "Free Grants & Community Help",
        summary: "Look for community grants and small business awards that do not have to be paid back.",
        actionSteps: [
          "Finish Step 2 (talk to 5 people) and Step 3 (your 1-page plan) so you have clear answers for grant applications.",
          "Contact your local Small Business Development Center (SBDC) to ask about local neighborhood grants.",
          "Apply for small monthly awards like the Amber Grant."
        ]
      },
      high_capital_warning: {
        type: "outcome",
        badge: "Caution: Simplify First",
        summary: "Needing lots of money on Day 1 is dangerous. Try to find a much simpler way to test the idea first.",
        actionSteps: [
          "Can you sell the service by hand to 3 local clients before buying expensive equipment?",
          "Can you borrow or rent tools for an afternoon instead of buying them outright?",
          "Never put your home, savings, or personal credit at risk for an unproven concept."
        ]
      }
    }
  },

  marketing: {
    title: "Customer Guide: Finding Your First 20 People",
    intro: "You do not need to pay for social media ads. You just need to find where 20 people who have this problem already spend time.",
    nodes: {
      start: {
        question: "Who is the main person who has this headache?",
        options: [
          { text: "Regular everyday people (parents, students, hobbyists, homeowners)", next: "b2c_path" },
          { text: "Local trade workers or small neighborhood shops (plumbers, bakers, mechanics)", next: "smb_path" },
          { text: "Managers at offices or larger companies", next: "enterprise_path" }
        ]
      },
      b2c_path: {
        type: "outcome",
        badge: "Community & Group Search",
        summary: "Find online groups and local gatherings where people complain about this problem.",
        actionSteps: [
          "Look on Reddit or Facebook groups for phrases like: 'Why is [this task] so difficult?' or 'Does anyone have a good way to handle [this]?'",
          "Never drop a link selling your thing right away. Post an honest question asking people how they currently cope.",
          "Reach out with genuine curiosity: people love sharing what bugs them when you listen without interrupting."
        ]
      },
      smb_path: {
        type: "outcome",
        badge: "Friendly Neighborhood Visits",
        summary: "Small business owners are busy, so visit them when they are not rushed.",
        actionSteps: [
          "Drop by local shops in person during slow afternoon hours (like 2 PM on a Tuesday) and politely ask for the owner.",
          "Keep it super short: 'Hi! I am not selling anything. I am working on a tool to make [this chore] easier and wanted to ask how you currently handle it.'",
          "If they have 3 minutes, listen to their biggest complaints. If they are busy, leave a friendly note."
        ]
      },
      enterprise_path: {
        type: "outcome",
        badge: "Professional Inquiries",
        summary: "Reach out politely to people who hold the specific job title.",
        actionSteps: [
          "Search professional networks for people with the exact job role you want to help.",
          "Send a polite 2-sentence note: explain you are doing research on the biggest frustrations with this task and would value their opinion.",
          "Never send a sales pitch. Just ask what takes up the most time in their typical week."
        ]
      }
    }
  },

  team: {
    title: "Partner Guide: Do You Need a Partner or Should You Stay Solo?",
    intro: "A lot of people think they cannot start without a partner. But taking on a partner too early causes lots of disagreements.",
    nodes: {
      start: {
        question: "What is making you feel like you need a partner right now?",
        options: [
          { text: "I do not know how to build software or technical tools", next: "no_code_blocker" },
          { text: "I do not have enough time because of my day job or family", next: "time_blocker" },
          { text: "I feel lonely working alone and want an accountability buddy", next: "accountability_blocker" }
        ]
      },
      no_code_blocker: {
        type: "outcome",
        badge: "You Can Start Without Coding",
        summary: "You do not need a computer programmer to see if people want your idea.",
        actionSteps: [
          "You can test almost every idea with a simple form (like Google Forms), text messages, or phone calls.",
          "If people are truly desperate for your help, they will happily let you help them by hand at first.",
          "Good technical partners are much easier to attract once you can show that 5 real people already want to buy from you."
        ]
      },
      time_blocker: {
        type: "outcome",
        badge: "Small Daily Sprints",
        summary: "You do not need 40 hours a week to make real progress.",
        actionSteps: [
          "Spend just 30 to 45 minutes each day on one small action, like sending two friendly messages to potential customers.",
          "Steady, small daily steps add up much faster than waiting for free weekends that never arrive.",
          "Only bring in a partner if they are willing to put in just as much regular effort as you are."
        ]
      },
      accountability_blocker: {
        type: "outcome",
        badge: "Find a Peer Friend, Not a 50/50 Partner",
        summary: "Do not give away half of your business just to have someone to chat with.",
        actionSteps: [
          "Find another small business owner or maker in your community for a quick 15-minute weekly coffee check-in.",
          "Share what you promised to do this week and check in on each other's progress.",
          "Keep complete ownership of your idea while getting the encouragement you need."
        ]
      }
    }
  }
};
