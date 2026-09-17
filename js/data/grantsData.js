// grantsData.js: Directory of external third-party small business grant and technical support programs.
// Provided strictly for educational information. No grant receipt, funding, or approval is guaranteed.

export const fundingPrograms = [
  {
    id: "prime_cdfi",
    name: "PRIME Grants for Very Small Businesses",
    category: "Small Business Technical Assistance & Micro-Lending",
    provider: "U.S. Small Business Administration & Local Intermediaries",
    amountRange: "Varies by local provider (typically $2,500 to $10,000)",
    equity: "Grant / Technical Assistance (Subject to competitive application)",
    stageTarget: "Very small business or solo founder seeking local support",
    eligibility: [
      "Very small business or aspiring micro-entrepreneur",
      "Focuses on community-based entrepreneurs",
      "Applied through certified local community lenders (CDFIs)"
    ],
    readinessRequirement: "Typically requires an organized description of the business concept and a realistic breakdown of proposed expenditures.",
    actionUrl: "https://www.sba.gov/funding-programs/grants/prime-grants",
    tacticalAdvice: "Contact local Community Development Financial Institutions in your area to ask about their open technical assistance cycles."
  },
  {
    id: "amber_grant",
    name: "The Amber Grant for Women Entrepreneurs",
    category: "Monthly Independent Grant Contest",
    provider: "WomensNet (Independent Organization)",
    amountRange: "$10,000 monthly award ($25,000 annual bonus award)",
    equity: "Independent Award (Competitive judging process)",
    stageTarget: "Early concept, startup, or established small business",
    eligibility: [
      "Women-owned or women-led business ideas",
      "At least 18 years old",
      "Based in the US or Canada"
    ],
    readinessRequirement: "Requires answering short application questions about your story, your concept, and how you would plan to use the award.",
    actionUrl: "https://womensnet.net/amber-grant/",
    tacticalAdvice: "Judges review hundreds of monthly applications; clarity, authenticity, and a grounded plan help an application stand out."
  },
  {
    id: "techfw_thinklab",
    name: "ThinkLab Beginner Startup Program",
    category: "Structured Mentorship & Educational Program",
    provider: "TechFW (Community Non-Profit)",
    amountRange: "8 weeks of educational workshops and coaching",
    equity: "Non-profit educational program (No equity taken)",
    stageTarget: "Early idea stage, non-technical founders welcome",
    eligibility: [
      "Innovative business concept or novel process",
      "Commitment to participating in weekly educational milestones",
      "Willingness to conduct customer discovery"
    ],
    readinessRequirement: "Looks for participants who demonstrate coachability and an open mind toward learning from customers.",
    actionUrl: "https://www.techfw.org/thinklab",
    tacticalAdvice: "Highlight what you have learned from speaking with prospective customers rather than trying to present a finished product."
  },
  {
    id: "fast_forward_micro",
    name: "Small Business Development Centers (SBDC)",
    category: "Public Advising & Regional Competitions",
    provider: "America's SBDC Network (Federal / State Partnership)",
    amountRange: "Free confidential consulting; periodic local competitions vary",
    equity: "Free public service",
    stageTarget: "Founders at any stage, from concept to operating business",
    eligibility: [
      "Open to residents exploring or running a small enterprise",
      "Confidential one-on-one business advising"
    ],
    readinessRequirement: "Willingness to review business basics, simple budgeting, and local permitting considerations.",
    actionUrl: "https://americassbdc.org/",
    tacticalAdvice: "SBDC advisors often know about city and county micro-assistance initiatives that are not widely publicized online."
  },
  {
    id: "us_chamber_dream_big",
    name: "Small Business Community Impact Awards",
    category: "Annual Business Recognition Contest",
    provider: "U.S. Chamber of Commerce",
    amountRange: "$25,000 top award + regional recognition",
    equity: "Contest prize award",
    stageTarget: "Small enterprises active in their local communities",
    eligibility: [
      "For-profit enterprise with demonstrated community contribution",
      "Fewer than 250 employees",
      "Verified operations and customer feedback"
    ],
    readinessRequirement: "Requires evidence of positive community impact and customer references.",
    actionUrl: "https://www.uschamber.com/events/awards/dream-big-awards",
    tacticalAdvice: "Focus your submission on tangible community benefits and customer testimonials."
  }
];

export const readinessChecklist = [
  {
    id: "check_problem",
    label: "A clear description of the core problem",
    stageRequired: 1,
    description: "Can you plainly state who is frustrated and what clumsy way they cope with it today?"
  },
  {
    id: "check_interviews",
    label: "Spoke with at least 5 people who face this situation",
    stageRequired: 2,
    description: "Did you ask 5 people about their past experiences without attempting to pitch them?"
  },
  {
    id: "check_canvas",
    label: "Filled out your 1-page plan",
    stageRequired: 3,
    description: "Have you clearly documented your potential customers and estimated revenue approach?"
  },
  {
    id: "check_cheap_test",
    label: "Ran at least 1 simple exploratory test",
    stageRequired: 4,
    description: "Helped someone by hand, made a simple sign-up page, or observed customer response."
  },
  {
    id: "check_budget",
    label: "An itemized list of planned expenditures",
    stageRequired: 5,
    description: "Can you explain specifically how a modest grant or starter sum would be allocated?"
  }
];
