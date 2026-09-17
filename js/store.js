// store.js: Central state management for the Micro-Startup Compass PWA.
// Fully persistent via localStorage with multiple relatable everyday examples and confidence scoring.

const STORAGE_KEY = "micro_startup_compass_v1";

export const DEFAULT_MISSIONS = [
  {
    id: "m1",
    stage: 1,
    title: "1. Name the Headache in Plain Words",
    desc: "Describe what real people struggle with without using fancy buzzwords.",
    duration: "10 mins"
  },
  {
    id: "m2",
    stage: 1,
    title: "2. The Jargon Purge",
    desc: "Review your problem statement to remove words like 'disrupt' or 'revolutionary'.",
    duration: "10 mins"
  },
  {
    id: "m3",
    stage: 2,
    title: "3. Pick Your First 3 Contacts",
    desc: "Write down 3 specific people or places where people deal with this headache.",
    duration: "10 mins"
  },
  {
    id: "m4",
    stage: 2,
    title: "4. Send 2 Friendly Inquiry Texts",
    desc: "Use the 1-Click Script Generator in Step 2 to send two non-salesy messages.",
    duration: "15 mins"
  },
  {
    id: "m5",
    stage: 2,
    title: "5. Log Your First Direct Quote",
    desc: "Record one memorable quote of someone describing their past frustration.",
    duration: "15 mins"
  },
  {
    id: "m6",
    stage: 3,
    title: "6. Run Your Pocket Napkin Math",
    desc: "Calculate how many customers you need per week to reach your income goal.",
    duration: "10 mins"
  },
  {
    id: "m7",
    stage: 3,
    title: "7. Auto-Fill Your 1-Page Plan",
    desc: "Transfer your problem and customer insights directly into the 1-page canvas.",
    duration: "15 mins"
  },
  {
    id: "m8",
    stage: 4,
    title: "8. Choose a Safe $0 Test",
    desc: "Pick a simple test like helping 3 people by hand or setting up a 1-page signup.",
    duration: "10 mins"
  },
  {
    id: "m9",
    stage: 4,
    title: "9. Observe Your First 3 Test Reactions",
    desc: "Record whether people eagerly accepted your manual help or signed up.",
    duration: "15 mins"
  },
  {
    id: "m10",
    stage: 5,
    title: "10. Check Starter Budget & Print Flyer",
    desc: "Keep initial expenses under $250 and print a community notice or summary.",
    duration: "15 mins"
  }
];

export const SAMPLE_TEMPLATES = {
  plumber: {
    name: "PlumbSync (Solo Plumber Assistant)",
    stage1: {
      rawIdea: "I want to help solo residential plumbers capture emergency customer calls while working with both hands full under a sink.",
      targetAudience: "Solo residential plumbers who drive their own truck without an office receptionist",
      currentWorkaround: "Scribbling phone numbers on napkins while driving, or missing calls under the sink where customers hang up and call someone else",
      tangibleCost: "Losing 3 weekend emergency calls worth $1,800 to $3,200 in gross revenue every month",
      problemHypothesis: "Solo residential plumbers lose over $2,000 monthly in emergency weekend jobs because answering the phone while under a sink or driving is impossible, and callers hang up immediately on voicemail.",
      elevatorPremise: "For solo residential plumbers who miss emergency jobs while on the road, PlumbSync is an instant text-message triage service that captures customer dispatch details without hiring a full-time receptionist.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_1",
          contactName: "Dave M. (Southside Plumbing)",
          channel: "Supply shop parking lot chat",
          date: "2026-03-02",
          pastWorkaround: "Wife tried answering calls on Saturday mornings, but gave up because it caused arguments.",
          painScore: 5,
          spentLastMonth: "$120 on Google ads that mostly went to missed calls",
          keyQuote: "If I am soldering a pipe under a house, I can not pick up the phone. By the time I crawl out, they already hired someone else.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Tried Family Help"]
        },
        {
          id: "int_2",
          contactName: "Marcus T. (Reliable Rooter)",
          channel: "Cold phone call from Google Maps",
          date: "2026-03-04",
          pastWorkaround: "Used a generic call center answering service, but they took 4 hours to send notification texts.",
          painScore: 4,
          spentLastMonth: "$250 on a call center service that misclassified jobs",
          keyQuote: "Call centers sound like robots and do not know the difference between a dripping faucet and a flooded basement.",
          willingToPaySignal: true,
          tags: ["Tried Other Tools", "Slow Notification"]
        },
        {
          id: "int_3",
          contactName: "Kevin L. (Lone Star Drain)",
          channel: "Local trade forum advice thread",
          date: "2026-03-06",
          pastWorkaround: "Just lets phone ring. Says he has enough builder contract work during the week.",
          painScore: 2,
          spentLastMonth: "$0",
          keyQuote: "I do not want emergency calls at 9 PM on Sunday. I want to watch the game.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        },
        {
          id: "int_4",
          contactName: "Carlos R. (Apex Plumbing)",
          channel: "In-person breakfast counter conversation",
          date: "2026-03-08",
          pastWorkaround: "Hired nephew to sit by the phone, but nephew kept sleeping through morning calls.",
          painScore: 5,
          spentLastMonth: "$400 paid to nephew",
          keyQuote: "I need something that immediately texts them 'I am on a job, send a photo of the leak and I will call you in 7 minutes.'",
          willingToPaySignal: true,
          tags: ["Losing Money", "Wants It Yesterday"]
        },
        {
          id: "int_5",
          contactName: "Greg P. (Master Tech Plumbing)",
          channel: "Plumber association directory",
          date: "2026-03-10",
          pastWorkaround: "Uses iPhone auto-reply text, but customers ignore it because it does not ask for address or urgency.",
          painScore: 4,
          spentLastMonth: "$0 on software, lost estimated $1,500 in lost calls",
          keyQuote: "If it can ask for the address and if water is actively gushing, I would pay $50 a month without blinking.",
          willingToPaySignal: true,
          tags: ["Wants It Yesterday", "Will Pay Monthly"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Solo plumbers miss urgent emergency calls while working with hands full or driving. Callers hang up on voicemail and call the next competitor on Google.",
        existingAlternatives: "Generic answering call centers ($250/mo, slow notification), hiring family members, or standard phone auto-replies.",
        customerSegments: "Independent solo residential plumbing contractors with 1 to 2 trucks.",
        earlyAdopters: "Plumbers actively advertising 24/7 emergency service who currently handle dispatching on their personal mobile phones.",
        uniqueValueProposition: "Helps solo plumbers catch urgent emergency calls quickly. Automated SMS inquiry captures leak details and location before the caller dials another company.",
        solution: "Lightweight auto-text assistant that triggers upon missed phone call: asks 3 questions (address, leak location, shutoff status), and pings plumber with high-priority alert.",
        channels: "Direct visits to plumbing wholesale supply houses at 6:30 AM; state contractor licensing registries; regional plumbing trade forums.",
        revenueStreams: "$49 to $99/month flat subscription per truck with zero per-minute penalty fees.",
        costStructure: "Phone messaging costs ($0.01/call), lightweight server hosting, zero paid ads initially.",
        keyMetrics: "Missed-call capture rate, response time under 60 seconds, monthly emergency jobs saved.",
        unfairAdvantage: "Direct relationships with local trade parts suppliers and proprietary 3-question plumbing triage flow."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Manual SMS Dispatch for Dave and Marcus",
      visitorCount: 12,
      conversionCount: 4,
      preorderCount: 50,
      experimentNotes: "Ran manual SMS forwarding for Dave for 1 weekend. Caught 3 emergency leak jobs. Dave gave us $50 cash as a tip.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "People have confirmed that this problem hurts, and several took real action (signing up or offering money). You are ready to start building your simple first version!",
        nextSteps: "Move to Step 5 to look at your starter budget and check out free grants."
      },
      isCompleted: true
    },
    stage5: {
      readinessChecks: {
        check_problem: true,
        check_interviews: true,
        check_canvas: true,
        check_cheap_test: true,
        check_budget: true
      },
      microBudgetItems: [
        { id: "b1", description: "Phone number and initial text message pool", amount: 40 },
        { id: "b2", description: "Domain name and simple web page hosting", amount: 30 },
        { id: "b3", description: "Supply house coffee / donuts for plumber chats", amount: 65 },
        { id: "b4", description: "Buffer for emergency small expenses", amount: 100 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 2500,
      pricePerUnit: 49,
      fixedExpenses: 50,
      unitLabel: "plumber trucks"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  baker: {
    name: "CrumbCount (Custom Cake Order Organizer)",
    stage1: {
      rawIdea: "I want to help home bakers stop losing custom cake order details scattered across Instagram DMs, text messages, and sticky notes.",
      targetAudience: "Home bakers selling custom birthday and wedding cakes from their home kitchen",
      currentWorkaround: "Taking screenshots of Instagram DMs, scrolling through messy text message threads, and scribbling dietary allergies on paper envelopes",
      tangibleCost: "Making 1 wrong flavor cake per month costs $120 in ingredients, plus 8 hours of unpaid panic remaking it",
      problemHypothesis: "Home bakers experience severe stress and lost profits because custom order details and flavor changes are scattered across DMs and texts, leading to ruined cakes and frantic last-minute remakes.",
      elevatorPremise: "For home bakers overwhelmed by messy DMs, CrumbCount is a single custom order link that locks in flavor, date, allergen notes, and pickup times in one tidy place.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_b1",
          contactName: "Sarah J. (Sweet Petal Bakery)",
          channel: "Local bakers Facebook group",
          date: "2026-03-01",
          pastWorkaround: "Uses a paper spiral notebook on kitchen counter, but husband spilled milk on it.",
          painScore: 5,
          spentLastMonth: "$0",
          keyQuote: "A bride changed her filling to raspberry in a DM 3 weeks ago. I forgot to check that chat and made vanilla. I cried for two hours.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Severe Stress"]
        },
        {
          id: "int_b2",
          contactName: "Elena R. (Elena's Custom Treats)",
          channel: "Instagram direct message",
          date: "2026-03-03",
          pastWorkaround: "Tried using Excel, but hated opening a laptop while hands were covered in flour.",
          painScore: 4,
          spentLastMonth: "$15 on a general planner that lacked cake fields",
          keyQuote: "I just need a link I can put in my bio where they have to pick date and allergies before asking for a quote.",
          willingToPaySignal: true,
          tags: ["Tried Other Tools", "Needs Phone Friendly"]
        },
        {
          id: "int_b3",
          contactName: "Chloe M. (Little Whisk Bakes)",
          channel: "Farmers market neighbor booth",
          date: "2026-03-05",
          pastWorkaround: "Sends a Google Form, but customers ignore it and keep messaging on WhatsApp.",
          painScore: 4,
          spentLastMonth: "$0",
          keyQuote: "If customers do not fill it out, I spend 30 minutes going back and forth asking basic questions.",
          willingToPaySignal: true,
          tags: ["Wants It Yesterday", "Customer Resistance"]
        },
        {
          id: "int_b4",
          contactName: "Beth K. (Corner Cookies)",
          channel: "Farmers market vendor meetup",
          date: "2026-03-07",
          pastWorkaround: "Only sells standard cookies in batches, doesn't do custom designs.",
          painScore: 1,
          spentLastMonth: "$0",
          keyQuote: "I make 20 chocolate chip boxes and sell out. I do not do custom orders.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        },
        {
          id: "int_b5",
          contactName: "Tina H. (Sugar Bloom Kitchen)",
          channel: "Cake decorating class chat",
          date: "2026-03-09",
          pastWorkaround: "Keeps notes on her phone notes app, lost track of deposit payments.",
          painScore: 5,
          spentLastMonth: "$80 lost when customer canceled after cake was baked",
          keyQuote: "If it can collect a 50% non-refundable deposit before I buy the butter, that alone pays for it.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Deposit Problem"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Custom cake orders, dates, inspiration photos, and allergy notes get lost across Instagram, Facebook, and text messages.",
        existingAlternatives: "Paper notebooks on floury counters, messy DM threads, or complicated desktop software.",
        customerSegments: "Home-based custom bakers and cottage food operators.",
        earlyAdopters: "Bakers handling 3 to 10 custom cake orders every weekend.",
        uniqueValueProposition: "Helps prevent flavor mix-ups and lost order notes. A dedicated custom order link for your bio that keeps dates, allergy notes, and deposit status organized.",
        solution: "Mobile-friendly cake quote builder with automated reminders and 50% deposit link.",
        channels: "Local cottage baker Facebook communities, pastry supply stores, cake decorating Instagram hashtags.",
        revenueStreams: "$19/month flat fee for unlimited orders.",
        costStructure: "Web hosting ($15/mo), payment processing fees (2.9%), free starter tools.",
        keyMetrics: "Orders submitted per baker, zero mistaken cake flavor reports.",
        unfairAdvantage: "Founder is an experienced home baker who understands cottage food laws and kitchen workflow."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Google Form + Manual Deposit Collection for Sarah and Tina",
      visitorCount: 15,
      conversionCount: 6,
      preorderCount: 40,
      experimentNotes: "Built a customized order form for Sarah. 4 brides ordered through it smoothly with zero confusion.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "People have confirmed that this problem hurts, and several took real action (signing up or offering money). You are ready to start building your simple first version!",
        nextSteps: "Move to Step 5 to look at your starter budget and check out free grants."
      },
      isCompleted: true
    },
    stage5: {
      readinessChecks: {
        check_problem: true,
        check_interviews: true,
        check_canvas: true,
        check_cheap_test: true,
        check_budget: true
      },
      microBudgetItems: [
        { id: "b1", description: "Domain name and simple website builder", amount: 35 },
        { id: "b2", description: "Sample order receipt printer ribbon or test supplies", amount: 45 },
        { id: "b3", description: "Coffee meetup treats for baker interviews", amount: 40 },
        { id: "b4", description: "Buffer fund", amount: 80 }
      ],
      selectedFundingTarget: "amber_grant",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 1200,
      pricePerUnit: 25,
      fixedExpenses: 20,
      unitLabel: "custom cake orders"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  civic: {
    name: "Oakridge ToolShare (Community Lending Shed)",
    stage1: {
      rawIdea: "I want to help apartment dwellers and neighborhood residents borrow yard and home repair tools for free instead of buying expensive items used once a year.",
      targetAudience: "Neighborhood homeowners and apartment renters who lack storage space or funds for specialized maintenance tools",
      currentWorkaround: "Knocking awkwardly on neighbors doors, renting from big box stores for $75 per day with steep deposits, or neglecting home repairs",
      tangibleCost: "Spending $250 on a pressure washer used once a year, or facing neighborhood code fines for overgrown trees",
      problemHypothesis: "Neighborhood residents waste money buying rarely used power tools or leave home maintenance undone because commercial rentals are expensive and no trusted local sharing system exists.",
      elevatorPremise: "For neighborhood residents with occasional repair projects, Oakridge ToolShare is a volunteer-run lending shed providing free access to maintenance tools through a simple library card system.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_c1",
          contactName: "Maria G. (Elm Street Resident)",
          channel: "Neighborhood porch conversation",
          date: "2026-03-02",
          pastWorkaround: "Borrowed a neighbor weed trimmer, but cord snapped and caused an awkward disagreement.",
          painScore: 5,
          spentLastMonth: "$65 to hire a landscaper just to trim one sidewalk edge",
          keyQuote: "I felt terrible after the trimmer broke. I wish our neighborhood had a shared tool shed with clear check-out rules.",
          willingToPaySignal: true,
          tags: ["Social Friction", "High Cost"]
        },
        {
          id: "int_c2",
          contactName: "Robert P. (Retired Woodworker)",
          channel: "Community center chess morning",
          date: "2026-03-04",
          pastWorkaround: "Has 35 duplicate tools sitting in his garage gathering dust.",
          painScore: 3,
          spentLastMonth: "$0",
          keyQuote: "I would happily donate six good drills and a miter saw if I knew young homeowners would learn to fix their houses.",
          willingToPaySignal: true,
          tags: ["Tool Donor", "Community Asset"]
        },
        {
          id: "int_c3",
          contactName: "Marcus T. (HOA Committee Chair)",
          channel: "Monthly civic association meetup",
          date: "2026-03-06",
          pastWorkaround: "Struggled with liability concerns when neighbors shared ladders informally.",
          painScore: 4,
          spentLastMonth: "$0",
          keyQuote: "If you have a volunteer check-in system and liability waiver at the community center, we can offer the storage room rent free.",
          willingToPaySignal: true,
          tags: ["Space Partner", "Needs Waiver"]
        },
        {
          id: "int_c4",
          contactName: "Danielle S. (Apartment Tenant)",
          channel: "Local dog park conversation",
          date: "2026-03-08",
          pastWorkaround: "Used a table knife as a screwdriver to assemble a bookshelf because she owns zero tools.",
          painScore: 5,
          spentLastMonth: "$0 (too intimidated by hardware stores)",
          keyQuote: "In a studio apartment, I cannot store a drill. I just need to borrow one for two hours on a Sunday.",
          willingToPaySignal: true,
          tags: ["Zero Storage", "First Time DIY"]
        },
        {
          id: "int_c5",
          contactName: "James B. (New Homeowner)",
          channel: "Hardware store parking lot chat",
          date: "2026-03-10",
          pastWorkaround: "Buys everything brand new on credit cards.",
          painScore: 1,
          spentLastMonth: "$450 on power tools",
          keyQuote: "I like owning all my own brand new tools in matching cases.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Costly single-use tools, lack of apartment storage, and hesitation to borrow from neighbors informally.",
        existingAlternatives: "Commercial tool rental shops ($75/day), big box hardware purchases, hiring expensive handymen for 10-minute tasks.",
        customerSegments: "Neighborhood residents, apartment renters, local DIY volunteers, fixed-income homeowners.",
        earlyAdopters: "Community garden volunteers and suburban homeowners with weekend fence or garden upkeep.",
        uniqueValueProposition: "Free community tool lending that saves neighbors hundreds of dollars while building local self-reliance.",
        solution: "Community center storage closet with Saturday morning volunteer hours, basic safety checks, and an easy checkout ledger.",
        channels: "Neighborhood bulletin boards, community center newsletter, civic association Facebook group, local library flyer.",
        revenueStreams: "Voluntary annual suggested donations ($20/year), local civic grants, hardware store sponsorship.",
        costStructure: "Safety goggles, cleaning rags, replacement drill bits ($25/mo), liability insurance waiver forms ($50 one-time).",
        keyMetrics: "Total monthly tool loans, tools returned clean and on time (target 98%), active volunteer librarians.",
        unfairAdvantage: "Secured free community center storage closet and retired woodworker volunteer advisor."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Saturday Pop-Up Tool Lending Table at Community Center Lobby",
      visitorCount: 32,
      conversionCount: 16,
      preorderCount: 125,
      experimentNotes: "Set up 10 personal and donated tools on folding tables. 16 neighbors registered for lending cards, 9 borrowed tools and returned them Sunday clean. Collected $125 in voluntary donations.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "High community engagement and safe return of borrowed tools prove strong local trust and practical demand. People gladly gave small voluntary contributions.",
        nextSteps: "Proceed to Step 5 to outline a volunteer budget and apply for local community development micro-grants."
      },
      isCompleted: true
    },
    stage5: {
      readinessChecks: {
        check_problem: true,
        check_interviews: true,
        check_canvas: true,
        check_cheap_test: true,
        check_budget: true
      },
      microBudgetItems: [
        { id: "b1", description: "Heavy-duty clear storage bins and barcode labels", amount: 45 },
        { id: "b2", description: "Safety goggles, ear plugs, and tool disinfectant wipes", amount: 35 },
        { id: "b3", description: "Printed borrower cards and liability waiver clipboard", amount: 20 },
        { id: "b4", description: "Replacement blade and drill bit buffer fund", amount: 75 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 600,
      pricePerUnit: 20,
      fixedExpenses: 35,
      unitLabel: "annual tool memberships"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  tech: {
    name: "BriefBridge (Client Scope Assistant for Freelancers)",
    stage1: {
      rawIdea: "I want to help solo freelance web developers and designers turn messy client voice notes, emails, and chats into clear project scopes automatically.",
      targetAudience: "Solo digital freelancers and creative consultants who manage client proposals on their own",
      currentWorkaround: "Listening to 10-minute client voice notes multiple times while typing notes into Google Docs, often missing key deliverable boundaries",
      tangibleCost: "Spending 4 unpaid hours drafting each project proposal and losing $500 to $1,500 on scope creep when clients ask for extra revisions",
      problemHypothesis: "Solo creative freelancers waste 15+ unpaid hours each month deciphering scattered client voice notes and emails, leading to unbilled scope creep and delayed proposal turnaround.",
      elevatorPremise: "For solo freelancers tired of unbilled scope creep, BriefBridge transforms rambling client voice notes and emails into clean, signed scope agreements in five minutes.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_t1",
          contactName: "Alex N. (Freelance UI Designer)",
          channel: "Designers Slack community",
          date: "2026-03-01",
          pastWorkaround: "Types notes while listening to WhatsApp voice notes on 1.5x speed.",
          painScore: 5,
          spentLastMonth: "$0",
          keyQuote: "Clients send five 3-minute voice notes on Sunday night. Deciphering what they actually want takes two hours before I even design anything.",
          willingToPaySignal: true,
          tags: ["Time Sink", "Voice Memo Chaos"]
        },
        {
          id: "int_t2",
          contactName: "Priya K. (WordPress Developer)",
          channel: "Virtual freelancer meetup",
          date: "2026-03-03",
          pastWorkaround: "Missed that a client wanted multi-currency support buried in an email thread. Had to build it for free.",
          painScore: 5,
          spentLastMonth: "$1,200 in unbilled dev hours",
          keyQuote: "Scope creep eats my profits. If a tool clearly summarized deliverable limits in writing for the client to click approve, I would pay immediately.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Scope Creep"]
        },
        {
          id: "int_t3",
          contactName: "Jason T. (Copywriter)",
          channel: "Twitter / X direct message",
          date: "2026-03-05",
          pastWorkaround: "Sends a 7-question Google Form, but clients find it rigid and skip questions.",
          painScore: 4,
          spentLastMonth: "$19 on Typeform",
          keyQuote: "Clients want to talk and ramble. If I can just let them ramble and the tool extracts the requirements, that solves the friction.",
          willingToPaySignal: true,
          tags: ["Client Friction", "Tried Forms"]
        },
        {
          id: "int_t4",
          contactName: "Megan L. (Agency Owner with 12 Staff)",
          channel: "LinkedIn mutual connection",
          date: "2026-03-07",
          pastWorkaround: "Employs two full-time account managers to attend intake calls.",
          painScore: 1,
          spentLastMonth: "$6,000 on account management salaries",
          keyQuote: "We have human staff handle intake calls. This is not a problem for an agency our size.",
          willingToPaySignal: false,
          tags: ["Wrong Target", "Agency Scale"]
        },
        {
          id: "int_t5",
          contactName: "Dan S. (Shopify Consultant)",
          channel: "Indie Hackers forum discussion",
          date: "2026-03-09",
          pastWorkaround: "Uses a complex CRM but hates how heavy and slow it feels on mobile.",
          painScore: 4,
          spentLastMonth: "$49 on enterprise CRM (planning to cancel)",
          keyQuote: "I just need a clean 1-page agreement that highlights what is included and what costs extra.",
          willingToPaySignal: true,
          tags: ["Tool Fatigue", "Needs Simplicity"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Unstructured client voice notes and emails lead to hours of manual note taking, missed deliverables, and unbilled scope creep.",
        existingAlternatives: "Manual typing in Google Docs, rigid questionnaires clients refuse to fill out, expensive enterprise CRM systems.",
        customerSegments: "Solo creative freelancers, independent digital marketers, contract web developers.",
        earlyAdopters: "Freelancers billing $50 to $120 per hour who send at least 2 custom client proposals per week.",
        uniqueValueProposition: "Paste any client audio memo or email thread and receive a structured, client-ready scope outline in 60 seconds.",
        solution: "Lightweight web tool that transcribes client audio, groups requirements into deliverables and exclusions, and produces a 1-click confirmation link.",
        channels: "Freelance Slack groups, independent contractor forums, design newsletters, LinkedIn posts sharing scope breakdown templates.",
        revenueStreams: "$15/month solo starter plan, or $120 annual subscription.",
        costStructure: "Speech-to-text API sandbox ($25/mo), server hosting ($15/mo), domain and payment fees ($15/mo).",
        keyMetrics: "Number of scopes generated per active freelancer, proposal acceptance rate, trial to paid conversion.",
        unfairAdvantage: "Founder is an active freelance consultant with an existing community of 350 design peers."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "smoke_page",
      experimentName: "Manual 15-Minute Scope Formatting for 5 Slack Freelancers",
      visitorCount: 38,
      conversionCount: 12,
      preorderCount: 75,
      experimentNotes: "Posted in a design Slack: offered to manually turn messy client emails into clean scope documents within 15 minutes for free. 12 freelancers submitted materials, and 5 pre-paid a $15 deposit for early software access.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "Freelancers eagerly provided real client communications, and multiple people paid cash deposits upfront. Willingness to pay has been confirmed before coding.",
        nextSteps: "Proceed to Step 5 to review the minimal starter budget and apply for tech micro-grants."
      },
      isCompleted: true
    },
    stage5: {
      readinessChecks: {
        check_problem: true,
        check_interviews: true,
        check_canvas: true,
        check_cheap_test: true,
        check_budget: true
      },
      microBudgetItems: [
        { id: "b1", description: "Domain name and landing page web hosting", amount: 25 },
        { id: "b2", description: "Transcription and speech processing sandbox API credits", amount: 35 },
        { id: "b3", description: "Database and user auth starter plan", amount: 20 },
        { id: "b4", description: "Coffee chat stipend for initial user feedback sessions", amount: 50 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 3000,
      pricePerUnit: 29,
      fixedExpenses: 65,
      unitLabel: "active subscribers"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  }
};

const DEFAULT_PROJECT = {
  id: "proj_default",
  name: "My New Idea",
  updatedAt: new Date().toISOString(),
  currentStage: 1,
  unlockedStages: [1],
  
  stage1: {
    rawIdea: "",
    targetAudience: "",
    currentWorkaround: "",
    tangibleCost: "",
    problemHypothesis: "",
    elevatorPremise: "",
    isCompleted: false
  },
  
  stage2: {
    interviews: [],
    targetGoal: 20,
    minGateGoal: 5,
    isCompleted: false
  },
  
  stage3: {
    canvas: {
      problem: "",
      existingAlternatives: "",
      customerSegments: "",
      earlyAdopters: "",
      uniqueValueProposition: "",
      solution: "",
      channels: "",
      revenueStreams: "",
      costStructure: "",
      keyMetrics: "",
      unfairAdvantage: ""
    },
    isCompleted: false
  },
  
  stage4: {
    selectedExperimentId: "concierge_test",
    experimentName: "",
    visitorCount: 0,
    conversionCount: 0,
    preorderCount: 0,
    experimentNotes: "",
    evaluatorResult: null,
    isCompleted: false
  },
  
  stage5: {
    readinessChecks: {},
    microBudgetItems: [
      { id: "b1", description: "Domain name and basic web hosting (1 year)", amount: 35 },
      { id: "b2", description: "Free tiers for starter software tools", amount: 0 },
      { id: "b3", description: "Coffee cards or modest incentives for customer chats", amount: 50 },
      { id: "b4", description: "Safe contingency buffer", amount: 100 }
    ],
    selectedFundingTarget: null,
    isCompleted: false
  },
  
  napkinMath: {
    targetMonthlyIncome: 1500,
    pricePerUnit: 35,
    fixedExpenses: 25,
    unitLabel: "orders / clients"
  },
  completedMissions: [],
  hasCompletedSimulator: false,
  completedPersonas: [],

  activeAlchemistScenarioId: null,
  activeDecisionTreeTab: "finance",
  decisionTreePath: {
    finance: ["start"],
    marketing: ["start"],
    team: ["start"]
  }
};

class Store {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const loaded = JSON.parse(raw);
          if (!loaded.napkinMath) {
            loaded.napkinMath = JSON.parse(JSON.stringify(DEFAULT_PROJECT.napkinMath));
          }
          if (!loaded.completedMissions) {
            loaded.completedMissions = [];
          }
          if (typeof loaded.hasCompletedSimulator === "undefined") {
            loaded.hasCompletedSimulator = false;
          }
          if (!loaded.completedPersonas) {
            loaded.completedPersonas = [];
          }
          return loaded;
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROJECT));
  }

  saveState() {
    try {
      this.state.updatedAt = new Date().toISOString();
      this.recalculateGates();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  recalculateGates() {
    const s = this.state;
    const unlocked = [1];

    if (s.stage1.problemHypothesis && s.stage1.problemHypothesis.trim().length > 10) {
      s.stage1.isCompleted = true;
      unlocked.push(2);
    } else {
      s.stage1.isCompleted = false;
    }

    if (s.stage2.interviews && s.stage2.interviews.length >= s.stage2.minGateGoal) {
      s.stage2.isCompleted = true;
      if (unlocked.includes(2)) unlocked.push(3);
    } else {
      s.stage2.isCompleted = false;
    }

    const c = s.stage3.canvas || {};
    if (c.problem && c.customerSegments && c.uniqueValueProposition && c.solution) {
      s.stage3.isCompleted = true;
      if (unlocked.includes(3)) unlocked.push(4);
    } else {
      s.stage3.isCompleted = false;
    }

    if (s.stage4.evaluatorResult || s.stage4.conversionCount > 0 || (s.stage4.experimentNotes && s.stage4.experimentNotes.length > 15)) {
      s.stage4.isCompleted = true;
      if (unlocked.includes(4)) unlocked.push(5);
    } else {
      s.stage4.isCompleted = false;
    }

    s.unlockedStages = unlocked;
  }

  getConfidenceScore() {
    const s = this.state;
    let score = 0;
    
    // Stage 1: Problem defined (20%)
    if (s.stage1.isCompleted) score += 20;
    
    // Stage 2: 5 interviews = 20%, 10 = 25%, 20 = 30%
    const intCount = (s.stage2.interviews || []).length;
    if (intCount >= 20) score += 30;
    else if (intCount >= 10) score += 25;
    else if (intCount >= 5) score += 20;
    else score += Math.round((intCount / 5) * 15);
    
    // Stage 3: 1-Page plan completed (20%)
    if (s.stage3.isCompleted) score += 20;
    
    // Stage 4: Test run and evaluated (20%)
    if (s.stage4.isCompleted) score += 20;
    
    // Stage 5: Budget set and readiness items checked (10%)
    const checks = Object.values(s.stage5.readinessChecks || {}).filter(Boolean).length;
    if (checks >= 3) score += 10;
    else score += checks * 3;
    
    return Math.min(100, score);
  }

  loadTemplate(templateKey) {
    const tmpl = SAMPLE_TEMPLATES[templateKey] || SAMPLE_TEMPLATES.plumber;
    this.state = {
      ...DEFAULT_PROJECT,
      ...tmpl,
      id: "proj_sample_" + templateKey,
      unlockedStages: [1, 2, 3, 4, 5],
      currentStage: 1
    };
    this.saveState();
  }

  toggleMission(missionId) {
    if (!this.state.completedMissions) {
      this.state.completedMissions = [];
    }
    const idx = this.state.completedMissions.indexOf(missionId);
    if (idx >= 0) {
      this.state.completedMissions.splice(idx, 1);
    } else {
      this.state.completedMissions.push(missionId);
    }
    this.saveState();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    }
  }

  isMissionCompleted(missionId) {
    return (this.state.completedMissions || []).includes(missionId);
  }

  getMissionStats() {
    const completed = (this.state.completedMissions || []).length;
    const total = DEFAULT_MISSIONS.length;
    const pct = Math.round((completed / total) * 100);
    return { completed, total, pct };
  }

  updateNapkinMath(fields) {
    if (!this.state.napkinMath) {
      this.state.napkinMath = { targetMonthlyIncome: 1500, pricePerUnit: 35, fixedExpenses: 25, unitLabel: "clients" };
    }
    this.state.napkinMath = { ...this.state.napkinMath, ...fields };
    this.saveState();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    }
  }

  completeSimulation(result) {
    this.state.hasCompletedSimulator = true;
    if (!this.state.completedPersonas) {
      this.state.completedPersonas = [];
    }
    if (result && result.personaId && !this.state.completedPersonas.includes(result.personaId)) {
      this.state.completedPersonas.push(result.personaId);
    }
    this.saveState();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:state-updated"));
    }
  }

  addPracticeInterviewToStage2(entry) {
    if (!this.state.stage2) {
      this.state.stage2 = { interviews: [] };
    }
    if (!this.state.stage2.interviews) {
      this.state.stage2.interviews = [];
    }
    // Prevent duplicate entries by id
    const alreadyExists = this.state.stage2.interviews.some(i => i.id === entry.id);
    if (!alreadyExists) {
      this.state.stage2.interviews.unshift({
        ...entry,
        date: new Date().toISOString().split("T")[0]
      });
      this.saveState();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("app:state-updated"));
      }
      return true;
    }
    return false;
  }

  getNapkinMathCalculations() {
    const nm = this.state.napkinMath || { targetMonthlyIncome: 1500, pricePerUnit: 35, fixedExpenses: 25 };
    const target = Math.max(0, Number(nm.targetMonthlyIncome) || 0);
    const price = Math.max(1, Number(nm.pricePerUnit) || 1);
    const expenses = Math.max(0, Number(nm.fixedExpenses) || 0);
    const totalNeeded = target + expenses;
    const customersNeededMonth = Math.ceil(totalNeeded / price);
    const customersNeededWeek = (customersNeededMonth / 4.3).toFixed(1);
    const customersNeededDay = (customersNeededMonth / 21.5).toFixed(1);

    // Feasibility verdict
    let verdict = "";
    let badgeClass = "badge-success";
    if (customersNeededDay <= 3) {
      verdict = `Highly reachable! Satisfying ~${customersNeededDay} ${nm.unitLabel || "clients"} per working day hits your goal.`;
      badgeClass = "badge-success";
    } else if (customersNeededDay <= 8) {
      verdict = `Moderate pace: you will need ~${customersNeededDay} ${nm.unitLabel || "clients"} per day. Consider slight packaging or bundles.`;
      badgeClass = "badge-accent";
    } else {
      verdict = `High volume alert: needing ${customersNeededMonth} orders/mo means lots of marketing. Can you raise the price or offer a higher-value service?`;
      badgeClass = "badge-warning";
    }

    return {
      target,
      price,
      expenses,
      totalNeeded,
      customersNeededMonth,
      customersNeededWeek,
      customersNeededDay,
      unitLabel: nm.unitLabel || "clients",
      verdict,
      badgeClass
    };
  }

  getAiConfig() {
    const defaultCfg = {
      provider: "gemini",
      apiKey: "",
      model: "gemini-1.5-flash",
      endpoint: "",
      enabled: false
    };
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("micro_startup_ai_config_v1");
        if (raw) {
          return { ...defaultCfg, ...JSON.parse(raw) };
        }
      }
    } catch (e) {
      console.warn("Failed to read AI config:", e);
    }
    return defaultCfg;
  }

  saveAiConfig(cfg) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("micro_startup_ai_config_v1", JSON.stringify(cfg));
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("app:ai-config-updated", { detail: cfg }));
      }
    } catch (e) {
      console.error("Failed to save AI config:", e);
    }
  }

  isAiConfigured() {
    const cfg = this.getAiConfig();
    if (!cfg || !cfg.enabled) return false;
    if (cfg.provider === "ollama") return true; // Local endpoint doesn't require key
    return !!(cfg.apiKey && cfg.apiKey.trim().length > 3);
  }

  resetToFresh() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_PROJECT));
    this.saveState();
  }

  exportData() {
    return JSON.stringify(this.state, null, 2);
  }

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.stage1) {
        this.state = parsed;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON import:", e);
    }
    return false;
  }
}

export const store = new Store();
