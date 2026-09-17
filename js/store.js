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
  },

  care: {
    name: "PawsRoute (Solo Dog Walker & Pet Care)",
    stage1: {
      rawIdea: "I want to help solo dog walkers and pet sitters keep lockbox codes, pet medication rules, and walk update photos organized in one place instead of scattered across 30 customer text threads.",
      targetAudience: "Independent solo dog walkers and neighborhood pet sitters caring for 10 to 25 client pets weekly",
      currentWorkaround: "Searching through endless SMS message history on phone while standing at customer front doors trying to find the front porch lockbox code or alarm PIN",
      tangibleCost: "Forgetting a senior dog's noon medication, losing client keys, or spending 1.5 unpaid hours every evening texting individual walk photo updates to anxious pet parents",
      problemHypothesis: "Solo pet sitters suffer high daily anxiety and risk pet safety because entry codes, feeding schedules, and emergency vet numbers are buried in chat threads, resulting in frantic front-door delays and lost client trust.",
      elevatorPremise: "For solo pet sitters tired of hunting for lockbox codes at the front door, PawsRoute is a private 1-tap client clipboard that displays entry codes, feeding rules, and sends 1-click photo walk updates.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_p1",
          contactName: "Brenda C. (Happy Paws Walking)",
          channel: "Local dog park conversation",
          date: "2026-03-02",
          pastWorkaround: "Relies on phone notes app, but client changed garage door PIN without texting the new code.",
          painScore: 5,
          spentLastMonth: "$0 on software, lost 2 hours waiting in the rain",
          keyQuote: "I walk 18 dogs. When a client changes their garage code and forgets to tell me, my whole afternoon schedule collapses while the dog barks inside.",
          willingToPaySignal: true,
          tags: ["Severe Stress", "Time Sink"]
        },
        {
          id: "int_p2",
          contactName: "Derek V. (Bark & Stroll)",
          channel: "Pet supply bulletin board connection",
          date: "2026-03-04",
          pastWorkaround: "Used Rover, but hates losing 20% of every walk fee from his direct recurring neighborhood clients.",
          painScore: 5,
          spentLastMonth: "$480 in platform commissions taken from his direct clients",
          keyQuote: "Rover is fine for finding a stranger once, but taking 20% every week from Mrs. Higgins whose dog I have walked for 3 years is ridiculous.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Platform Fees"]
        },
        {
          id: "int_p3",
          contactName: "Jenny M. (Purrs & Paws Sitting)",
          channel: "Neighborhood Facebook community post",
          date: "2026-03-06",
          pastWorkaround: "Keeps paper index cards in car glovebox.",
          painScore: 4,
          spentLastMonth: "$0",
          keyQuote: "Owners want a photo update after every single visit. Texting 14 owners individually each day takes 45 minutes of my personal family evening.",
          willingToPaySignal: true,
          tags: ["Time Sink", "Needs Phone Friendly"]
        },
        {
          id: "int_p4",
          contactName: "Frank L. (Occasional walker for sister)",
          channel: "Casual neighborhood chat",
          date: "2026-03-08",
          pastWorkaround: "Just walks his sister's dog on Tuesdays.",
          painScore: 1,
          spentLastMonth: "$0",
          keyQuote: "I just walk one beagle for family. I have no need for a system.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        },
        {
          id: "int_p5",
          contactName: "Samantha D. (Westside Pet Care)",
          channel: "Veterinary clinic bulletin board",
          date: "2026-03-10",
          pastWorkaround: "Tried generic CRM, but it lacked pet allergy and vet fields.",
          painScore: 4,
          spentLastMonth: "$29 on generic field service app (canceled)",
          keyQuote: "If the client can fill out their emergency vet, lockbox code, and food scoops once, and I can tap one button to send a photo report card, I would pay $24/month gladly.",
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
        problem: "Scattered lockbox codes, alarm codes, pet medication rules, and time-consuming manual photo texting across 20+ individual client chats.",
        existingAlternatives: "Paper index cards in glove compartments, 20% Rover/Wag platform fees, or digging through personal text history.",
        customerSegments: "Solo independent dog walkers, cat sitters, and neighborhood pet care operators.",
        earlyAdopters: "Walkers with 10+ recurring weekly clients who manage their own keys and client invoicing.",
        uniqueValueProposition: "Zero platform commission. 1-tap access to gate codes and pet care rules, plus 1-click photo walk report cards.",
        solution: "Lightweight mobile web card where pet parents log emergency vet & key details once; walker taps 1 button to send a cute photo update.",
        channels: "Local dog park bulletin boards, veterinary clinic reception desks, neighborhood pet groups, mobile groomer referrals.",
        revenueStreams: "$24/month flat subscription per solo walker for unlimited pets (zero percentage cut on walks).",
        costStructure: "Photo cloud storage ($10/mo), web hosting ($15/mo), payment processing fees (2.9%).",
        keyMetrics: "Walk report cards sent per active walker, daily active walkers, zero missed medication alerts.",
        unfairAdvantage: "Founder has 4 years of local pet sitting experience and established friendships with 3 local veterinary tech clinics."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Manual Daily Walk Report Card Pilot for Brenda & Derek",
      visitorCount: 22,
      conversionCount: 8,
      preorderCount: 60,
      experimentNotes: "Created simple web link report cards for Brenda's top 5 clients. Pet owners loved the cute 1-click photo summary. Both walkers prepaid $30 for a 2-month pilot.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "Solo walkers confirmed intense daily frustration with scattered text updates and high platform cuts. Multiple walkers paid cash deposits upfront.",
        nextSteps: "Move to Step 5 to configure your starter budget and explore small business grants."
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
        { id: "b1", description: "Domain name and simple web card hosting", amount: 35 },
        { id: "b2", description: "Dog park promotional cards & branded poop bag clips", amount: 50 },
        { id: "b3", description: "Healthy dog treat samples for dog park chats", amount: 30 },
        { id: "b4", description: "Buffer for small initial operating expenses", amount: 60 }
      ],
      selectedFundingTarget: "amber_grant",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 1800,
      pricePerUnit: 24,
      fixedExpenses: 35,
      unitLabel: "active solo walkers"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  farm: {
    name: "SproutBox (Neighborhood Microgreen Subscriptions)",
    stage1: {
      rawIdea: "I want to help urban micro-farmers and indoor growers sell fresh weekly salad greens and microgreen trays directly to local families on recurring subscription without wasting harvest.",
      targetAudience: "Urban indoor farmers and small market gardeners selling fresh salad greens within a 5-mile radius",
      currentWorkaround: "Harvesting based on guesswork, showing up to Saturday farmers markets praying for good weather, and throwing away 35% of unsold perishable greens by Sunday night",
      tangibleCost: "Throwing away $180 in unsold fresh microgreen crops every weekend, plus 6 hours sitting at slow farmers market booths",
      problemHypothesis: "Small local urban growers lose up to a third of their perishable harvest every week because selling at open-air markets is unpredictable, and coordinating weekly doorstep deliveries via Instagram DMs is chaotic.",
      elevatorPremise: "For suburban families who want farm-fresh greens without grocery store plastic, SproutBox provides a simple weekly neighborhood doorstep harvest subscription that eliminates farm food waste.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_f1",
          contactName: "Liam K. (Basement Greens Farm)",
          channel: "Urban agriculture meetup",
          date: "2026-03-01",
          pastWorkaround: "Harvested 40 trays of pea shoots; rain canceled farmers market; had to compost 30 trays.",
          painScore: 5,
          spentLastMonth: "$150 on market booth fees and lost crop seed",
          keyQuote: "Microgreens wilt in 4 days. If I don't have pre-committed buyers before I plant the seeds, I'm just throwing cash in the compost.",
          willingToPaySignal: true,
          tags: ["Severe Waste", "Losing Money"]
        },
        {
          id: "int_f2",
          contactName: "Maya S. (Health Coach & Mom of 3)",
          channel: "School garden committee chat",
          date: "2026-03-03",
          pastWorkaround: "Buys plastic clamshells at supermarket that turn slimy in 48 hours.",
          painScore: 4,
          spentLastMonth: "$28/week on store greens",
          keyQuote: "Store greens are already 10 days old when you buy them. I would love a fresh jar dropped on my porch Tuesday mornings.",
          willingToPaySignal: true,
          tags: ["Customer Demand", "Freshness First"]
        },
        {
          id: "int_f3",
          contactName: "Chef Antoine (Bistro 44 Owner)",
          channel: "Direct restaurant kitchen visit",
          date: "2026-03-05",
          pastWorkaround: "Orders from broadline distributor; herbs arrive bruised and crushed.",
          painScore: 4,
          spentLastMonth: "$220 on broadline distributor produce",
          keyQuote: "If a local grower guarantees Tuesday 9 AM delivery of fresh radish and pea shoots, I will sign a standing monthly purchase order.",
          willingToPaySignal: true,
          tags: ["Commercial Buyer", "Reliable Delivery"]
        },
        {
          id: "int_f4",
          contactName: "Tom H. (Fast food diner)",
          channel: "Coffee shop line chat",
          date: "2026-03-07",
          pastWorkaround: "Rarely eats fresh salads.",
          painScore: 1,
          spentLastMonth: "$0",
          keyQuote: "I mostly eat drive-thru, fresh greens aren't my thing.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        },
        {
          id: "int_f5",
          contactName: "Rachel B. (Suburban Cul-de-Sac Pod Leader)",
          channel: "Neighborhood porch gathering",
          date: "2026-03-09",
          pastWorkaround: "Drives 25 minutes to an organic co-op on weekends.",
          painScore: 5,
          spentLastMonth: "$60 on specialty grocery trips",
          keyQuote: "If you drop off one insulated cooler at my garage on Thursday, 8 neighbors on our street will pick up their weekly jars and pay automatically.",
          willingToPaySignal: true,
          tags: ["Group Buyer", "Wants It Yesterday"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Unsold harvest waste, unpredictable farmers market weather, and plastic grocery store greens rotting in 48 hours.",
        existingAlternatives: "Supermarket plastic clamshells ($4.99/pack, already wilted), sporadic weekend farmers markets, or ad-hoc cash sales.",
        customerSegments: "Health-conscious suburban parents, local independent farm-to-table chefs, neighborhood fitness groups.",
        earlyAdopters: "Families living within 3 miles of the grower who already buy organic produce or belong to a community gym.",
        uniqueValueProposition: "Harvested this morning, on your doorstep by noon. Zero plastic waste in reusable mason jars.",
        solution: "Weekly doorstep microgreen subscription: 2 fresh varieties delivered in sanitized glass jars with porch cooler exchange.",
        channels: "Cul-de-sac neighborhood flyers, community gym sample tastings, local elementary school eco-fair, Nextdoor porch drop announcements.",
        revenueStreams: "$15/week standard family subscription or $55/month standing order.",
        costStructure: "Seeds and organic soil substrate ($1.20/tray), reusable mason jars ($1.50 each one-time), delivery bike/fuel ($15/wk).",
        keyMetrics: "Subscriber churn under 5%, harvest yield efficiency over 92%, average customer lifetime 6+ months.",
        unfairAdvantage: "Zero commercial retail rent (grown in insulated home nursery) and established connection with local fitness studio."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "preorder_deposit",
      experimentName: "Cul-de-Sac 2-Week Porch Harvest Pilot",
      visitorCount: 25,
      conversionCount: 11,
      preorderCount: 165,
      experimentNotes: "Brought 3 freshly cut microgreen sample trays to cul-de-sac block party. 11 families pre-paid $15 for a 2-week trial subscription on the spot.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "11 families paid upfront cash deposits before the seeds were sown. Strong demand for ultra-fresh zero-waste food verified.",
        nextSteps: "Move to Step 5 to check your starter supply budget and apply for USDA or local sustainable micro-grants."
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
        { id: "b1", description: "24 Reusable wide-mouth mason jars and custom waterproof lid labels", amount: 45 },
        { id: "b2", description: "Organic seed sampler (sunflower, pea, radish, broccoli)", amount: 35 },
        { id: "b3", description: "Insulated porch cooler bags", amount: 40 },
        { id: "b4", description: "Delivery route flyer prints", amount: 20 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 1500,
      pricePerUnit: 55,
      fixedExpenses: 80,
      unitLabel: "monthly doorstep subscribers"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  tutor: {
    name: "TutorSync (Solo Tutor & Music Coach)",
    stage1: {
      rawIdea: "I want to help solo private academic tutors and music teachers stop losing hundreds of dollars from last-minute cancellations, awkward payment chasing, and forgotten homework.",
      targetAudience: "Solo private math tutors, language teachers, and music instructors teaching 8 to 25 weekly students",
      currentWorkaround: "Texting parents the night before sessions, collecting cash in crumpled envelopes, and feeling guilty when parents cancel 20 minutes before a session",
      tangibleCost: "Losing 3 unbilled cancellation slots per week worth $150 to $250, plus 3 hours each Sunday evening sending awkward Venmo reminder texts",
      problemHypothesis: "Independent tutors lose up to 25% of their weekly income because families cancel last-minute without payment, and tutors lack a professional, automated policy system to collect upfront lesson deposits.",
      elevatorPremise: "For solo private tutors tired of awkward payment reminders and empty canceled slots, TutorSync is a 1-link parent booking portal with automatic reminder texts and upfront monthly reservations.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_u1",
          contactName: "David H. (High School Chemistry Tutor)",
          channel: "Library study room chat",
          date: "2026-03-02",
          pastWorkaround: "Drove 25 minutes across town, parent texted 10 minutes prior that son had soccer practice.",
          painScore: 5,
          spentLastMonth: "$0, lost $180 in unbilled late cancellations",
          keyQuote: "I sat in their driveway and got a text saying 'sorry forgot soccer'. I earned $0 and burned half a tank of gas. It happens every single week.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Severe Stress"]
        },
        {
          id: "int_u2",
          contactName: "Maria T. (Piano & Violin Instructor)",
          channel: "Local music teachers guild meetup",
          date: "2026-03-04",
          pastWorkaround: "Asks for checks at lesson end in front of the kids.",
          painScore: 4,
          spentLastMonth: "$0",
          keyQuote: "Asking for checks in front of an 8-year-old student feels undignified. Parents say 'I forgot my checkbook' and I wait 3 weeks to get paid.",
          willingToPaySignal: true,
          tags: ["Social Friction", "Late Payments"]
        },
        {
          id: "int_u3",
          contactName: "Brian S. (SAT Test Prep Tutor)",
          channel: "Freelance educators forum",
          date: "2026-03-06",
          pastWorkaround: "Tried using Calendly + Stripe, but found setting up multiple Zoom links and lesson notes too complicated.",
          painScore: 4,
          spentLastMonth: "$24/mo on disjointed software tools",
          keyQuote: "I need something simple: one link where parents see available hours, pay monthly upfront, and get a 2-sentence note on what to practice.",
          willingToPaySignal: true,
          tags: ["Tried Other Tools", "Needs Simplicity"]
        },
        {
          id: "int_u4",
          contactName: "Claire P. (Full-time public school teacher)",
          channel: "School teachers lounge conversation",
          date: "2026-03-08",
          pastWorkaround: "Does not tutor privately on the side.",
          painScore: 1,
          spentLastMonth: "$0",
          keyQuote: "I grade papers until 8 PM, I do not take on private students.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "Wrong Audience"]
        },
        {
          id: "int_u5",
          contactName: "Anita G. (Spanish Language Coach)",
          channel: "Community college bulletin board",
          date: "2026-03-10",
          pastWorkaround: "Switched to requiring monthly payments on the 1st.",
          painScore: 5,
          spentLastMonth: "$0",
          keyQuote: "When I required parents to pay on the 1st of the month for 4 sessions, late cancellations dropped by 80% immediately!",
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
        problem: "Last-minute parent cancellations, awkward payment chasing, and forgotten student practice homework.",
        existingAlternatives: "Awkward Venmo requests, paper checks, or rigid corporate tutoring platforms that take a 30% cut (Wyzant).",
        customerSegments: "Solo private academic tutors (STEM, SAT, reading) and private music/arts instructors.",
        earlyAdopters: "Tutors with at least 8 weekly students who currently drive to students' homes or teach over Zoom.",
        uniqueValueProposition: "Keep 100% of your hourly rate. Automated lesson reminders, upfront monthly session reservations, and student lesson notes.",
        solution: "Simple booking link: parents reserve recurring monthly slots, card is billed on the 1st, and tutor taps 2 bullet points for the parent after each session.",
        channels: "School PTA newsletters, library tutoring corkboards, parent WhatsApp groups, music store bulletin boards.",
        revenueStreams: "$19/month flat fee per tutor, or $160/year.",
        costStructure: "Web hosting ($15/mo), SMS notification fees ($5/mo), payment gateway fees (2.9%).",
        keyMetrics: "Cancellation rate under 5%, on-time payment rate over 95%, average weekly booked hours.",
        unfairAdvantage: "Founder has 6 years of private tutoring experience and personal recommendation network across 4 school districts."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Monthly Advance Billing Pilot for David & Maria",
      visitorCount: 18,
      conversionCount: 7,
      preorderCount: 95,
      experimentNotes: "Created simple 1-page monthly billing agreements for David's 5 chemistry students. All 5 families happily agreed to pay on the 1st via automated link. Zero cancellations occurred that month.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "Parents accepted upfront monthly booking without pushback, and tutors eliminated unbilled late cancellations immediately.",
        nextSteps: "Proceed to Step 5 to review the minimal starter budget and apply for education micro-grants."
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
        { id: "b1", description: "Domain & booking page builder", amount: 30 },
        { id: "b2", description: "SMS gateway credit pool for parent appointment reminders", amount: 25 },
        { id: "b3", description: "PTA newsletter sponsorship ad", amount: 40 },
        { id: "b4", description: "Buffer fund for initial setup", amount: 55 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 2200,
      pricePerUnit: 50,
      fixedExpenses: 40,
      unitLabel: "weekly tutoring hours"
    },
    completedMissions: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"],
    hasCompletedSimulator: true
  },

  repair: {
    name: "PedalFix (Mobile Bicycle & Small Gear Tune-Up)",
    stage1: {
      rawIdea: "I want to help busy families get their neglected bicycles, lawnmowers, and strollers tuned and repaired right in their own driveway without wrestling them into a car trunk.",
      targetAudience: "Suburban families and commuters with 2 to 5 flat-tire bikes or small engine gear sitting unused in the garage",
      currentWorkaround: "Letting flat bikes sit in the garage for 2 years because hoisting 4 bikes onto a car rack and waiting 3 weeks at an expensive bike shop is too painful",
      tangibleCost: "Paying $120+ per bike at downtown specialty shops, plus losing sunny summer weekends when kids can't ride",
      problemHypothesis: "Millions of suburban families have bicycles sitting idle in garages because transporting bulky bikes to traditional bike shops is an enormous hassle and wait times are weeks long.",
      elevatorPremise: "For busy parents with flat-tire bikes rotting in the garage, PedalFix is a mobile driveway tune-up service that fixes gears, brakes, and tires on-site in 45 minutes while you stay inside.",
      isCompleted: true
    },
    stage2: {
      interviews: [
        {
          id: "int_r1",
          contactName: "Mark B. (Suburban Father of 3)",
          channel: "Driveway chat while walking dogs",
          date: "2026-03-01",
          pastWorkaround: "Has 4 bikes with flat tires and slipping chains that haven't been ridden in 2 years.",
          painScore: 5,
          spentLastMonth: "$0 in 2 years because loading 4 bikes into an SUV was impossible",
          keyQuote: "The bikes have been flat since 2023. If someone pulls up in my driveway on a Saturday and tunes them all up for $140, I would hand over the cash in two seconds.",
          willingToPaySignal: true,
          tags: ["High Friction", "Wants It Yesterday"]
        },
        {
          id: "int_r2",
          contactName: "Lisa K. (Triathlon Racer)",
          channel: "Specialty bike shop parking lot",
          date: "2026-03-03",
          pastWorkaround: "Uses master mechanic at downtown racing boutique.",
          painScore: 1,
          spentLastMonth: "$350 on carbon frame tune-up",
          keyQuote: "I only let a master certified mechanic touch my $6,000 racing bike.",
          willingToPaySignal: false,
          tags: ["Wrong Target", "High End Niche"]
        },
        {
          id: "int_r3",
          contactName: "Dan C. (Suburban Commuter)",
          channel: "Train station bicycle rack",
          date: "2026-03-05",
          pastWorkaround: "Brake pads wore out; had to take Uber to work for 4 days.",
          painScore: 5,
          spentLastMonth: "$75 on Uber rides while bike was unusable",
          keyQuote: "I couldn't ride to the station for a week. A 20-minute on-site brake pad swap saved my daily commute.",
          willingToPaySignal: true,
          tags: ["Losing Money", "Daily Commute"]
        },
        {
          id: "int_r4",
          contactName: "Sarah W. (Neighborhood HOA Board Member)",
          channel: "HOA community newsletter meeting",
          date: "2026-03-07",
          pastWorkaround: "Helped organize a neighborhood safety day.",
          painScore: 4,
          spentLastMonth: "$0",
          keyQuote: "If you set up your mobile repair stand at the neighborhood park on Saturday, 30 families will line up for brake adjustments and safety checks.",
          willingToPaySignal: true,
          tags: ["Community Partner", "High Volume"]
        },
        {
          id: "int_r5",
          contactName: "Greg M. (Retired DIY tinkerer)",
          channel: "Neighborhood garage sale",
          date: "2026-03-09",
          pastWorkaround: "Maintains his own tools and fixes his own chains in the basement.",
          painScore: 1,
          spentLastMonth: "$0",
          keyQuote: "I have my own bike stand and grease. I enjoy wrenching on my own bike.",
          willingToPaySignal: false,
          tags: ["Zero Interest", "DIY Mechanic"]
        }
      ],
      targetGoal: 20,
      minGateGoal: 5,
      isCompleted: true
    },
    stage3: {
      canvas: {
        problem: "Bulky bikes trapped in garages with flat tires; hassle of loading them into cars; 3-week delays at retail bike shops.",
        existingAlternatives: "Traditional retail bike shops ($90-$150/tune-up + 2 week wait), DIY YouTube struggles, or abandoning bikes in the garage.",
        customerSegments: "Suburban families with multiple children, recreational commuters, neighborhood retiree cyclists.",
        earlyAdopters: "Neighborhood families with 2+ bikes needing basic spring tune-ups (tubes, cables, chain lubrication, brake adjustments).",
        uniqueValueProposition: "We come to your driveway. Complete safety inspection, gear tuning, and new tubes in 45 minutes while you relax at home.",
        solution: "Mobile repair service van/trailer with mobile workstand and standardized packages ($45 single bike, $129 family 3-bike bundle).",
        channels: "Cul-de-sac driveway yard signs while working, elementary school bike-to-school day flyers, neighborhood Nextdoor posts.",
        revenueStreams: "Driveway tune-up packages ($45-$129), inner tube and tire sales, accessory add-ons (lights, bells, helmets).",
        costStructure: "Replacement tubes, cables, brake pads ($8/bike wholesale), mobile tool kit ($120 one-time), van fuel ($20/wk).",
        keyMetrics: "Average revenue per driveway stop ($95+), same-day repeat booking referrals, 100% 5-star Google review rating.",
        unfairAdvantage: "Mobile on-site presence turns every driveway job into 3 immediate neighbor bookings who walk over to ask questions."
      },
      isCompleted: true
    },
    stage4: {
      selectedExperimentId: "concierge_test",
      experimentName: "Saturday Morning Driveway Tune-Up Pilot on Maple Street",
      visitorCount: 14,
      conversionCount: 6,
      preorderCount: 210,
      experimentNotes: "Set up bike repair stand in Mark's driveway. While working on his 3 family bikes, 3 neighbors walked over with their kids' bikes. Repaired 6 bikes in 4 hours and collected $210 in cash.",
      evaluatorResult: {
        verdict: "GREEN: Clear Go Ahead Signal",
        badgeClass: "badge-success",
        explanation: "Everyday suburban families eagerly paid for driveway convenience. On-site work generated spontaneous neighborhood word-of-mouth.",
        nextSteps: "Move to Step 5 to outline a portable tool kit budget and explore local small business loans."
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
        { id: "b1", description: "Portable heavy-duty bike repair stand", amount: 55 },
        { id: "b2", description: "Bulk inner tubes (assorted sizes) and chain lubricant", amount: 45 },
        { id: "b3", description: "Neighborhood flyer printouts and magnetic vehicle sign", amount: 35 },
        { id: "b4", description: "Replacement cable and brake pad buffer fund", amount: 45 }
      ],
      selectedFundingTarget: "prime_cdfi",
      isCompleted: true
    },
    napkinMath: {
      targetMonthlyIncome: 2400,
      pricePerUnit: 95,
      fixedExpenses: 120,
      unitLabel: "driveway tune-up stops"
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
