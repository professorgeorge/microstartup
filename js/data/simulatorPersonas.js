// simulatorPersonas.js: Personas and dialogue trees for the Customer Discovery Conversation Simulator.
// Teaches lay founders how to avoid the solution pitch trap and uncover true past behavior.

export const SIMULATOR_PERSONAS = [
  {
    id: "persona_dave_plumber",
    name: "Dave (Solo Residential Plumber)",
    role: "Independent Plumber with 1 truck",
    avatar: "🔧",
    badge: "Rushed Trade Contractor",
    context: "You catch Dave leaning against his truck outside a plumbing supply counter at 6:45 AM. He is holding a receipt and checking his phone.",
    initialGreeting: "Morning. I've only got about two minutes before I gotta head out to my first leak call. What's going on?",
    turns: [
      {
        turnNumber: 1,
        questionPrompt: "How do you open the conversation?",
        choices: [
          {
            id: "t1_pitch",
            type: "pitch",
            label: "🔴 The Solution Pitch",
            text: "Hi Dave! I'm building an AI auto-text app that answers your missed calls while you're under a sink. Would you pay $50 a month for that?",
            personaReply: "Look, I get fifty spam sales calls a week from tech guys promising to 'grow my business'. I don't need any more monthly software bills, man.",
            scoreImpact: 0,
            coachNote: "⚠️ Pitch Trap: You triggered Dave's defense shields immediately! Never pitch a solution or ask for hypothetical money upfront. You sound like every other telemarketer."
          },
          {
            id: "t1_vague",
            type: "vague",
            label: "🟡 The Vague Question",
            text: "Hi Dave! Do you find that answering the phone while working on pipes is annoying?",
            personaReply: "Yeah, I guess so. It's just part of being a plumber, you know? Nothing you can do about it.",
            scoreImpact: 1,
            coachNote: "😐 Vague Question: Asking an obvious yes/no opinion question ('Is it annoying?') gets you a polite shrug. You didn't learn anything specific about his actual habits."
          },
          {
            id: "t1_discovery",
            type: "discovery",
            label: "🟢 The Past-Behavior Question",
            text: "Morning Dave! Quick question from the trenches: When was the last time a customer called while both your hands were full under a sink? Walk me through what you did.",
            personaReply: "Oh man, literally yesterday afternoon! I was soldering a joint in a crawlspace. Heard my phone vibrating on the bucket, couldn't reach it. By the time I crawled out, they'd left no voicemail and dialed the next guy on Google.",
            scoreImpact: 3,
            coachNote: "🌟 Masterclass: You anchored Dave in a specific recent memory ('yesterday afternoon'). Instead of arguing about software, he instantly shared a raw, relatable experience!"
          }
        ]
      },
      {
        turnNumber: 2,
        questionPrompt: "How do you dig deeper into his past workaround?",
        choices: [
          {
            id: "t2_pitch",
            type: "pitch",
            label: "🔴 The Solution Pitch",
            text: "My app would text them back in 5 seconds asking for a photo of the leak. Don't you think that would save you a ton of money?",
            personaReply: "Maybe, but customers around here are old-school. They want to hear a human voice. I doubt an automated robot text would work.",
            scoreImpact: 0,
            coachNote: "⚠️ Premature Selling: As soon as you described your feature, Dave started imagining why it won't work. Keep the spotlight entirely on him!"
          },
          {
            id: "t2_vague",
            type: "vague",
            label: "🟡 The Vague Question",
            text: "Why don't you just hire an answering service to pick up your phone?",
            personaReply: "Answering services charge $300 a month and sound like robots from India. They don't know the difference between a running toilet and a burst main pipe.",
            scoreImpact: 2,
            coachNote: "👍 Good direction: Asking about alternatives reveals what he dislikes about existing solutions, though asking 'What did you actually try?' is even sharper."
          },
          {
            id: "t2_discovery",
            type: "discovery",
            label: "🟢 The Cost & Workaround Question",
            text: "That hurts. What have you tried in the past to deal with that, and what has that headache actually cost you in lost jobs?",
            personaReply: "I tried having my nephew answer calls on Saturday mornings. Paid him $400 a month, but he kept sleeping until 11 AM! I reckon I lose at least three good emergency jobs a month—that's easily $2,000 in gross revenue slipping through my fingers.",
            scoreImpact: 3,
            coachNote: "🌟 Golden Discovery: He just gave you the magic numbers! He already spent $400/mo on a clumsy workaround (nephew) and loses $2,000/mo in real cash. You now have solid financial proof of pain!"
          }
        ]
      },
      {
        turnNumber: 3,
        questionPrompt: "How do you close the conversation respectfully?",
        choices: [
          {
            id: "t3_pitch",
            type: "pitch",
            label: "🔴 The Aggressive Close",
            text: "Give me your credit card or email right now and I'll put you on our early VIP pre-order list for next month!",
            personaReply: "Woah, hold your horses. I said I was heading to a job. I gotta get in my truck. Have a good one.",
            scoreImpact: 0,
            coachNote: "⚠️ Pushy Sales Close: You turned a great conversation into an awkward sales trap at the last second. He walked away uncomfortable."
          },
          {
            id: "t3_vague",
            type: "vague",
            label: "🟡 The Polite Handshake",
            text: "Thanks for the chat Dave! Have a great day at your job!",
            personaReply: "You too, buddy. See ya around.",
            scoreImpact: 1,
            coachNote: "😐 Missed Opportunity: Polite, but you didn't ask for permission to stay in touch or show him a rough test later."
          },
          {
            id: "t3_discovery",
            type: "discovery",
            label: "🟢 The Gracious Future Gate",
            text: "Dave, that is super helpful and respects your time. If I end up sketching a super simple, free test to fix that exact crawlspace problem, could I shoot you a 30-second screenshot to get your honest thoughts before I do anything else?",
            personaReply: "Yeah, totally! Here's my cell number. If it actually stops me from losing $800 jobs without having to talk while under a sink, I'll definitely take a look. Text me later this week.",
            scoreImpact: 3,
            coachNote: "🌟 Perfect Close: Low-pressure, respectful of his time, and Dave voluntarily gave you his cell phone number to see early drafts!"
          }
        ]
      }
    ],
    voicePitch: 0.85,
    voiceRate: 0.95,
    debrief: {
      keyQuote: "I paid my nephew $400 a month to answer calls, but he slept until 11 AM. I lose $2,000 every month in emergency jobs when I'm under a house.",
      topTakeaway: "Tradespeople hate software pitches, but they happily share dollar figures when you ask about specific past emergencies.",
      sampleInterviewEntry: {
        id: "sim_dave_plumber",
        contactName: "Dave M. (Solo Residential Plumber)",
        channel: "Simulator Practice: Supply House Parking Lot",
        pastWorkaround: "Paid nephew $400/mo, missed emergency calls while under sinks",
        painScore: 5,
        spentLastMonth: "$400/mo on nephew + $120 Google ads",
        keyQuote: "I paid my nephew $400 a month to answer calls, but he slept until 11 AM. I lose $2,000 every month in emergency jobs when I'm under a house.",
        willingToPaySignal: true,
        tags: ["Simulator Practice", "Losing Money", "Trade Contractor"]
      }
    }
  },
  {
    id: "persona_linda_friend",
    name: "Linda (The 'Polite Friend' Danger Zone)",
    role: "Friendly neighbor & acquaintance",
    avatar: "🤝",
    badge: "The Polite False-Positive Trap",
    context: "You run into Linda at the neighborhood coffee shop. She is always nice, very supportive, and never wants to hurt anyone's feelings.",
    initialGreeting: "Oh hi! It's so wonderful to see you! How are things going? What are you working on lately?",
    turns: [
      {
        turnNumber: 1,
        questionPrompt: "How do you frame your question to a friendly acquaintance?",
        choices: [
          {
            id: "t1_pitch",
            type: "pitch",
            label: "🔴 The Friend Pitch (The Compliment Trap)",
            text: "I'm thinking of starting an organic spice subscription box for home cooks! Do you think that's a good idea? Would you buy one?",
            personaReply: "Oh wow, that is such an amazing idea! You are so creative! I would totally buy that, absolutely! You should definitely do it!",
            scoreImpact: 0,
            coachNote: "⚠️ DANGER: The Classic False Positive! Friends will ALWAYS tell you your idea is amazing because they love you and want to encourage you. This compliment is worth exactly zero dollars."
          },
          {
            id: "t1_vague",
            type: "vague",
            label: "🟡 The Generic Question",
            text: "Do you like cooking with good quality spices at home?",
            personaReply: "Oh definitely, good spices make everything taste better! Who doesn't love cooking good food?",
            scoreImpact: 1,
            coachNote: "😐 Generic Opinion: Everyone agrees good spices taste better. This tells you nothing about whether she actually buys gourmet spices or uses supermarket salt."
          },
          {
            id: "t1_discovery",
            type: "discovery",
            label: "🟢 The Behavior Check",
            text: "Thanks Linda! Quick question: When was the last time you bought specialty cooking spices or ingredients? Walk me through what you bought.",
            personaReply: "Hmm... let me think. Honestly, I bought a big jar of garlic powder at Costco about nine months ago, and I mostly just use whatever is in the supermarket aisle. I don't really cook fancy meals often.",
            scoreImpact: 3,
            coachNote: "🌟 Truth Unlocked: Notice the stark difference! If you pitched, she said 'I'd totally buy!' But when you asked what she ACTUALLY bought, she revealed she uses Costco garlic powder from 9 months ago. You just saved yourself $5,000 on a product she would never actually purchase!"
          }
        ]
      },
      {
        turnNumber: 2,
        questionPrompt: "How do you investigate her true spending habits?",
        choices: [
          {
            id: "t2_pitch",
            type: "pitch",
            label: "🔴 Trying to Convince Her",
            text: "Well, our spice boxes will have fresh imported Turkish oregano and smoked paprika! Doesn't that sound way better than Costco?",
            personaReply: "Oh sure, it sounds delicious! I'm sure lots of other people will buy it.",
            scoreImpact: 0,
            coachNote: "⚠️ Never Argue: You're trying to convince a non-customer to become a customer. When people say 'I'm sure *other* people will buy it', that's code for 'I will never buy this.'"
          },
          {
            id: "t2_vague",
            type: "vague",
            label: "🟡 The Hypothetical Pricing",
            text: "How much would you pay for an artisanal monthly spice kit? $15 or $25?",
            personaReply: "Oh, maybe $20? That seems reasonable for nice spices.",
            scoreImpact: 1,
            coachNote: "⚠️ Hypothetical Math: Asking someone what they 'would' pay when they don't even buy the category is useless fantasy data."
          },
          {
            id: "t2_discovery",
            type: "discovery",
            label: "🟢 Identifying the True Audience",
            text: "That makes total sense. Who is the person in your friend group who is truly obsessed with cooking and spends real money on artisanal ingredients?",
            personaReply: "Oh! My brother-in-law Kevin! He makes his own sourdough, orders whole smoked brisket rubs from Texas, and spends hundreds at kitchen specialty stores. You should talk to him!",
            scoreImpact: 3,
            coachNote: "🌟 Referral Gold: Instead of trying to force Linda to buy, you used her to find an authentic early adopter with high passion and real spending habits!"
          }
        ]
      },
      {
        turnNumber: 3,
        questionPrompt: "How do you follow up on the referral?",
        choices: [
          {
            id: "t3_pitch",
            type: "pitch",
            label: "🔴 The Hard Sell Ask",
            text: "Tell Kevin to follow my Instagram page and buy a box right away!",
            personaReply: "Uh, sure, I'll mention it next time I see him at Thanksgiving.",
            scoreImpact: 0,
            coachNote: "⚠️ Forgotten Promise: Asking someone to sell on your behalf never works. Thanksgiving is 6 months away."
          },
          {
            id: "t3_vague",
            type: "vague",
            label: "🟡 The Passive Note",
            text: "Thanks Linda, that's good to know. I'll look for foodies online.",
            personaReply: "Good luck with your business! Bye!",
            scoreImpact: 1,
            coachNote: "😐 Weak follow-through: You had an exact named person (Kevin) and let it slip."
          },
          {
            id: "t3_discovery",
            type: "discovery",
            label: "🟢 The Warm Intro Request",
            text: "Would you be comfortable sending Kevin a quick 1-line text introducing us? Just saying I'm doing a quick 2-minute study on where home foodies source their specialty rubs?",
            personaReply: "Oh sure, I can text him right now while we're waiting for our lattes! Kevin loves talking about his barbecue rubs.",
            scoreImpact: 3,
            coachNote: "🌟 Warm Connection Unlocked: Linda texts Kevin right in front of you. You turned a polite non-buyer into a direct bridge to your ideal target customer!"
          }
        ]
      }
    ],
    voicePitch: 1.25,
    voiceRate: 1.05,
    debrief: {
      keyQuote: "I buy Costco garlic powder once a year, but my brother-in-law Kevin spends hundreds of dollars on custom artisanal meat rubs.",
      topTakeaway: "Polite friends will praise your idea to be nice. Ask what they actually bought in the last 6 months, and use them to find real passionate buyers.",
      sampleInterviewEntry: {
        id: "sim_linda_friend",
        contactName: "Linda (Friendly Neighbor / Acquaintance)",
        channel: "Simulator Practice: Neighborhood Coffee Shop",
        pastWorkaround: "Uses Costco garlic powder once a year, rarely cooks gourmet",
        painScore: 1,
        spentLastMonth: "$0 (buys bulk grocery store spices once a year)",
        keyQuote: "I buy Costco garlic powder once a year, but my brother-in-law Kevin spends hundreds of dollars on custom artisanal meat rubs.",
        willingToPaySignal: false,
        tags: ["Simulator Practice", "False Positive", "Referral Bridge"]
      }
    }
  },
  {
    id: "persona_sarah_baker",
    name: "Sarah (The Overwhelmed Cottage Baker)",
    role: "Home baker making custom cakes",
    avatar: "🎂",
    badge: "Solo Maker in Distress",
    context: "You chat with Sarah at her weekend farmers market booth while her hands are dusting powdered sugar on brownies.",
    initialGreeting: "Hi there! Welcome to Sweet Petal Bakes. The chocolate chip cookies are fresh out of the oven!",
    turns: [
      {
        turnNumber: 1,
        questionPrompt: "How do you start exploring her custom order workflow?",
        choices: [
          {
            id: "t1_pitch",
            type: "pitch",
            label: "🔴 The Feature Pitch",
            text: "Hi! I'm creating an all-in-one baker management ERP platform with calendar integrations. Do you want to sign up?",
            personaReply: "ERP? That sounds super complicated. Honestly, I can barely keep up with my oven timer. I don't need any confusing tech stuff.",
            scoreImpact: 0,
            coachNote: "⚠️ Jargon Terror: Words like 'ERP platform' intimidate everyday makers. Keep your language grounded in her daily kitchen reality."
          },
          {
            id: "t1_vague",
            type: "vague",
            label: "🟡 The Compliment",
            text: "Your cakes look so pretty! Do you do custom orders often?",
            personaReply: "Thank you! Yes, I do custom birthday and anniversary cakes on weekends.",
            scoreImpact: 1,
            coachNote: "😐 Polite conversation, but you haven't opened up any discussion around problems or friction yet."
          },
          {
            id: "t1_discovery",
            type: "discovery",
            label: "🟢 The Story of Chaos",
            text: "Your cakes look incredible! Quick question: When a customer orders a custom cake, how do they usually send you their flavor and allergy requests?",
            personaReply: "Ugh, don't get me started! They send messages everywhere: some on Instagram DMs, some on WhatsApp, some text my personal cell. Last week a bride changed her filling from lemon to raspberry in an Instagram DM at midnight. I missed it and baked lemon. I had to remake the entire cake in tears.",
            scoreImpact: 3,
            coachNote: "🌟 Deep Emotional Resonance: By asking about the communication channel, Sarah opened up about a heart-wrenching real-world breakdown that cost her sleep and money."
          }
        ]
      },
      {
        turnNumber: 2,
        questionPrompt: "How do you investigate the financial and time cost?",
        choices: [
          {
            id: "t2_pitch",
            type: "pitch",
            label: "🔴 The Solution Pitch",
            text: "You need a form builder that costs $29 a month! I can set one up for you.",
            personaReply: "I tried a Google Form before. Customers ignored it and kept sending DMs anyway. It didn't solve anything.",
            scoreImpact: 0,
            coachNote: "⚠️ Premature Selling: Jumping straight to a paid form ignores the fact that she already tried forms and customers resisted them."
          },
          {
            id: "t2_vague",
            type: "vague",
            label: "🟡 The General Question",
            text: "How much time do you spend managing messages every week?",
            personaReply: "A lot. At least a few hours answering back-and-forth questions.",
            scoreImpact: 1,
            coachNote: "😐 General answer: 'A few hours' is helpful, but finding out about actual lost money or deposits is where real purchasing intent lies."
          },
          {
            id: "t2_discovery",
            type: "discovery",
            label: "🟢 The Deposit & Cancellation Cost",
            text: "That midnight remake sounds awful. Beyond the stress, what did that mistake cost you in ingredients, and how do you handle customer deposits when they cancel?",
            personaReply: "That ruined lemon cake cost me $85 in organic butter, eggs, and vanilla, plus four hours of unpaid panic. And worse: people often order a cake and cancel the day before, after I already bought the fruit! If I had a way to lock in a 50% non-refundable deposit before buying butter, that alone would save my business.",
            scoreImpact: 3,
            coachNote: "🌟 Concrete Value Proposition: She explicitly told you what she would pay for: 'A way to lock in a 50% non-refundable deposit before buying butter!' That is your exact product focus."
          }
        ]
      },
      {
        turnNumber: 3,
        questionPrompt: "How do you wrap up with a lightweight test offer?",
        choices: [
          {
            id: "t3_pitch",
            type: "pitch",
            label: "🔴 The Complex Commitment",
            text: "Let's sign a contract today where I build you a full custom website for $500.",
            personaReply: "I don't have $500 right now. I'm just a small cottage baker trying to pay for ingredients.",
            scoreImpact: 0,
            coachNote: "⚠️ Over-Scoping: Asking for a $500 custom contract scares off a cautious home maker."
          },
          {
            id: "t3_vague",
            type: "vague",
            label: "🟡 The Vague Goodbye",
            text: "Good luck with your cakes Sarah, I'll buy a brownie next time.",
            personaReply: "Thanks, have a good weekend!",
            scoreImpact: 1,
            coachNote: "😐 Missed chance to run a zero-dollar manual experiment."
          },
          {
            id: "t3_discovery",
            type: "discovery",
            label: "🟢 The Low-Risk Concierge Offer",
            text: "Sarah, what if for your next 2 weekend custom orders, I manually set up a simple 1-link custom quote card with an automated 50% deposit button for free, just to see if it stops the DM chaos? Zero cost to you.",
            personaReply: "Wait, seriously? You would set that up for me? Yes! I have a birthday inquiry coming in tomorrow. If you can help me collect the deposit upfront, I'd kiss your feet!",
            scoreImpact: 3,
            coachNote: "🌟 Concierge Test Unlocked: You just secured your very first manual 'Do-It-By-Hand' test! You will test the solution tomorrow with zero software code written."
          }
        ]
      }
    ],
    voicePitch: 1.1,
    voiceRate: 1.0,
    debrief: {
      keyQuote: "That ruined cake cost me $85 in butter and eggs, and four hours of unpaid panic. If I could collect a 50% deposit before buying ingredients, that alone saves me.",
      topTakeaway: "Makers are terrified of complicated software, but eager to try a simple 1-link deposit safeguard that protects their weekend sanity.",
      sampleInterviewEntry: {
        id: "sim_sarah_baker",
        contactName: "Sarah (Cottage Custom Baker)",
        channel: "Simulator Practice: Farmers Market Booth",
        pastWorkaround: "DMs across Instagram & WhatsApp, paper sticky notes, frantic midnight remakes",
        painScore: 5,
        spentLastMonth: "$85 wasted on ruined ingredients + 4 hours unpaid panic",
        keyQuote: "That ruined cake cost me $85 in butter and eggs, and four hours of unpaid panic. If I could collect a 50% deposit before buying ingredients, that alone saves me.",
        willingToPaySignal: true,
        tags: ["Simulator Practice", "Severe Stress", "Home Maker"]
      }
    }
  },
  {
    id: "persona_maria_homeowner",
    name: "Maria (The Pragmatic Homeowner)",
    role: "Suburban homeowner & parent",
    avatar: "🏡",
    badge: "Frugal Neighborhood Resident",
    context: "You see Maria raking leaves in her front yard on a Saturday morning. Her trash cans are sitting near the driveway.",
    initialGreeting: "Morning! Just trying to get these leaves bagged before the wind picks up. What brings you by the neighborhood?",
    turns: [
      {
        turnNumber: 1,
        questionPrompt: "How do you inquire about neighborhood home maintenance?",
        choices: [
          {
            id: "t1_pitch",
            type: "pitch",
            label: "🔴 The Service Pitch",
            text: "Hi Maria! I'm starting an on-demand curbside trash can sanitizing business. Will you pay $25 a month for me to spray your cans?",
            personaReply: "Twenty-five dollars a month just to spray plastic garbage cans? No way, that's way too expensive. I have a garden hose.",
            scoreImpact: 0,
            coachNote: "⚠️ Immediate Price Resistance: When you lead with price before uncovering pain, people compare your price to free water from their garden hose."
          },
          {
            id: "t1_vague",
            type: "vague",
            label: "🟡 The General Chat",
            text: "Nice weather today! Is yard work a lot of hassle for you?",
            personaReply: "Oh yeah, it never ends. Always something to fix.",
            scoreImpact: 1,
            coachNote: "😐 Small talk: Friendly, but gives you zero actionable information."
          },
          {
            id: "t1_discovery",
            type: "discovery",
            label: "🟢 The Seasonal Pain Inquiry",
            text: "Morning Maria! Beautiful yard. Quick question: During the peak of July summer heat, what's your least favorite chore when dealing with the outdoor cans and yard bins?",
            personaReply: "Ugh, opening the green trash bin when it's ninety degrees outside! It smells like rotten meat, flies swarm out, and last summer there were maggots crawling on the lid. I tried spraying it with the hose, but dirty water splashed all over my shoes. I almost threw up.",
            scoreImpact: 3,
            coachNote: "🌟 Vivid Emotional Pain: Maria just described visceral disgust (maggots, splash-back on shoes). This is intense, emotional pain that she hates dealing with!"
          }
        ]
      },
      {
        turnNumber: 2,
        questionPrompt: "How do you explore what she currently does about it?",
        choices: [
          {
            id: "t2_pitch",
            type: "pitch",
            label: "🔴 The Pitch Re-Attack",
            text: "See? That's why you need my 200-degree high-pressure wash truck!",
            personaReply: "Well, maybe once or twice in the summer, but I still wouldn't pay for a whole year.",
            scoreImpact: 1,
            coachNote: "⚠️ Don't force an annual commitment when the problem is seasonally concentrated."
          },
          {
            id: "t2_vague",
            type: "vague",
            label: "🟡 The Chemical Question",
            text: "Have you tried pouring bleach into the bin?",
            personaReply: "I did, but the bleach fumes gave me a headache and my dog got near it.",
            scoreImpact: 2,
            coachNote: "👍 Good workaround investigation: Proves she tried bleach and hated the toxic fumes and pet risk."
          },
          {
            id: "t2_discovery",
            type: "discovery",
            label: "🟢 The Frequency & Triggers",
            text: "When that happened last summer, how many times did you have to deal with that, and did you ever consider paying someone to sanitize it?",
            personaReply: "It happened three times between June and August. My neighbor actually hired a pressure washing guy, but he charged eighty dollars for one visit! If someone did it right at the curb on trash day for ten or fifteen bucks during the hot months, I would hand them cash every single time.",
            scoreImpact: 3,
            coachNote: "🌟 Clear Pricing Benchmark: She hates $80 one-off charges, but happily declared: 'If someone did it right at the curb on trash day for $15 in the summer, I would hand them cash every time!' You now have your target pricing model."
          }
        ]
      },
      {
        turnNumber: 3,
        questionPrompt: "How do you close with an easy demonstration?",
        choices: [
          {
            id: "t3_pitch",
            type: "pitch",
            label: "🔴 The Brochure Pitch",
            text: "Take my business card and visit my website when summer comes.",
            personaReply: "Okay, thanks. (Puts card in pocket where it will be washed and ruined)",
            scoreImpact: 0,
            coachNote: "⚠️ Passive Brush-Off: Business cards are where early startup leads go to die."
          },
          {
            id: "t3_vague",
            type: "vague",
            label: "🟡 The General Question",
            text: "Do you think other neighbors on Elm Street would like this?",
            personaReply: "Maybe, everyone complains about the flies in July.",
            scoreImpact: 1,
            coachNote: "😐 General opinion: Better to secure a specific pilot test."
          },
          {
            id: "t3_discovery",
            type: "discovery",
            label: "🟢 The Free Pilot Demonstration",
            text: "Maria, this Tuesday is trash day. I'm testing my eco-friendly wash setup on my own bins. What if I wash and deodorize your two cans on Tuesday morning completely for free, and you just tell me if the scent holds up?",
            personaReply: "Really? You would do that? Wow, absolutely! They'll be out on the curb by 7 AM. If they actually smell like lemon instead of garbage, I'll tell the whole neighborhood HOA group!",
            scoreImpact: 3,
            coachNote: "🌟 Community Pilot Secured: Free 10-minute demonstration on Tuesday unlocks a vocal neighborhood advocate who will share in the HOA group!"
          }
        ]
      }
    ],
    voicePitch: 1.0,
    voiceRate: 0.98,
    debrief: {
      keyQuote: "Opening the bin in 90-degree heat had flies and maggots. If someone sanitized it at the curb for $15 in the summer, I would hand them cash every time.",
      topTakeaway: "Frugal homeowners reject big expensive contracts, but gladly pay affordable seasonal fees for gross chores they despise.",
      sampleInterviewEntry: {
        id: "sim_maria_homeowner",
        contactName: "Maria (Suburban Homeowner)",
        channel: "Simulator Practice: Neighborhood Front Yard",
        pastWorkaround: "Garden hose with dirty water splashback, bleach fumes that sickened dog",
        painScore: 4,
        spentLastMonth: "$0 currently (neighbor spent $80 on pressure washer)",
        keyQuote: "Opening the bin in 90-degree heat had flies and maggots. If someone sanitized it at the curb for $15 in the summer, I would hand them cash every time.",
        willingToPaySignal: true,
        tags: ["Simulator Practice", "Hate Doing It", "Seasonal Service"]
      }
    }
  }
];
