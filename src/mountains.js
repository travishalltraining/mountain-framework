// ============================================================
// MOUNTAIN FRAMEWORK — DATA LAYER
// All five mountains, infrastructure checks, diagnostics,
// action steps, coach notes, and carry-forward language.
// ============================================================

export const MOUNTAINS = {
  1: {
    id: 1,
    name: "Escape Chaos",
    tagline: "Stop being the engine. Start being the operator.",
    whoLandsHere:
      "You're running almost everything yourself — coaching, selling, fixing problems, holding the whole place together. Revenue swings, leads slip, and a bad week feels existential. This is where most owners start, and it's not a failure — it's a phase. The work here is getting visibility and stopping the bleeding.",
    summit: [
      "You know your numbers within 5% without looking",
      "You have a weekly scorecard you actually use",
      "Lead response time is consistent, not heroic",
      "You're not the only person who can close a sale",
      "Revenue dips don't feel like emergencies",
    ],
    identityShift:
      "The shift on this mountain isn't about working harder — it's about getting out of reactive mode and into informed mode. You can't fix what you can't see, and right now most of your business is happening in the dark. Build the visibility first. Everything else gets easier.",
    carryForward:
      "Every system you build here is the foundation for the next climb. Your scorecard becomes what your future team will own. Your documented sales process becomes what others can be trained on. Your follow-up sequences become the first systems that run without you holding the pen. Build it now, and the next mountain is climbable. Skip it, and you'll be doing this work again under more pressure.",
  },
  2: {
    id: 2,
    name: "Build a Team That Can Carry Weight",
    tagline: "Stop being the hero. Start being the multiplier.",
    whoLandsHere:
      "You've escaped chaos. You have staff. You've stopped coaching every class. But you've hit a new wall: the team does what they're told but doesn't own results. You still close the important sales because 'no one else can.' Every staff member runs the sales conversation slightly differently. You're constantly rescuing instead of building people who solve problems.",
    summit: [
      "Every staff member owns a number — and knows it",
      "You hold real performance conversations, not just vibes",
      "Sales happens without you closing every important lead",
      "Weekly team rhythm exists (huddle, 1-on-1s, scorecard review)",
      "You can name your funnel bottleneck without looking",
    ],
    identityShift:
      "The biggest shift on this mountain isn't a new system — it's becoming the person who builds people, not just outcomes. As long as you're the best operator in the building, the team will defer to you, and the team will never grow into the weight. The unlock is identity, not tools.",
    carryForward:
      "The work on this mountain compounds. Your defined roles become the org chart your facility leader will inherit. Your weekly 1-on-1s become the rhythm a facility leader will use. Your staff KPIs become what a facility leader will manage instead of you. Your team huddle becomes the operating cadence of the whole gym. Skip this work, and the next mountain — making the gym run without you — becomes impossible.",
  },
  3: {
    id: 3,
    name: "Make One Gym Run Without Me",
    tagline: "Stop being the leader. Start being the owner.",
    whoLandsHere:
      "From the outside, the gym looks healthy. You have a team, a facility leader, consistent revenue. But you're still in it — and you can't figure out why. You get pulled into every meaningful decision. Retention is the silent killer. You're starting to ask: is this it? Do I open another? Or do I just optimize this one?",
    summit: [
      "Your facility leader can run the gym for a full week without you",
      "Decisions happen at the leader level — you don't have to be in every one",
      "Retention is tracked and owned, not just felt",
      "You spend most of your time on strategy and yourself, not operations",
      "You can answer 'why did we win or lose this month' without being in the building",
    ],
    identityShift:
      "The biggest shift on this mountain isn't building more systems — it's trusting the ones you've built. The work here is moving from being the person who runs the gym to being the person who owns it. That shift is harder than it sounds, and it's the foundation of every mountain above this one.",
    carryForward:
      "The systems you build here become the blueprint for everything above. Your facility leader's scorecard becomes the template for every leader you'll hire. Your SOPs become the playbook for the next location. Your defined ownership boundaries become the model for area-level authority. Your retention strategy becomes the brand standard. Get this mountain right, and a second location becomes possible. Skip it, and a second location multiplies the problem.",
  },
  4: {
    id: 4,
    name: "Create Consistency Across Locations",
    tagline: "Stop being the glue. Start being the architect.",
    whoLandsHere:
      "You've done what most never do — you expanded. But one gym performs and the others lag. Each facility leader runs their location differently. Standards exist in your head but not on paper. You suspect your best gym is best because of the leader, not the system — which is terrifying because it means the system doesn't really exist yet.",
    summit: [
      "Every location operates on the same core playbook",
      "Facility leaders meet as a team, not just with you",
      "Cross-location dashboards show variance at a glance",
      "Member experience is consistent across all locations",
      "You can name why a location is winning or losing without being inside",
    ],
    identityShift:
      "The biggest shift on this mountain isn't running more gyms — it's building a system that runs the gyms. Most owners try to scale themselves across locations. It works for a while, then it doesn't. Your best gym is probably best because of a great leader in a decent system. The work is figuring out what's transferable — and making it so.",
    carryForward:
      "What you build here is the operating system of the brand. Your cross-location playbook becomes the manual every new location inherits. Your facility leader team becomes the leadership bench a district manager will lead. Your shared dashboards become the executive reporting layer. Your defined standards become the culture other locations will be onboarded into. Skip this work, and a fourth gym multiplies inconsistency. Build it, and 4+ locations becomes possible.",
  },
  5: {
    id: 5,
    name: "Scale the Brand Beyond the Owner",
    tagline: "Stop being the operator. Start being the institution.",
    whoLandsHere:
      "You've built something significant — multiple locations, multiple leaders, the beginnings of a real brand. But culture drifts as layers increase. You've lost visibility into what's really happening at the floor level. You're asking bigger questions — exit, franchise, sell, hold — without a clear framework. The business doesn't need you anymore, but you haven't decided who you want to be in that reality.",
    summit: [
      "District leadership runs operations without you reaching around them",
      "Culture is documented, taught, and reinforced — not just felt",
      "Leadership development pipeline grows future leaders from within",
      "Strategic plan extends 12–36 months beyond just adding locations",
      "Portfolio-level financials drive decisions, not per-gym revenue",
    ],
    identityShift:
      "The biggest shift on this mountain isn't building more gyms — it's becoming someone the business no longer needs operationally. That sounds like the goal, and it is. But the work here is about brand, leadership depth, culture, and clarity about what you actually want now that you've proven you can build. The questions on this mountain are bigger than systems.",
    carryForward:
      "The work here is about durability. Your district leadership layer becomes succession depth. Your culture work becomes institutional, not personal. Your strategic plan becomes the brand's future, not just yours. Your leadership pipeline becomes what makes the business durable beyond you. This is where ownership becomes legacy — or stalls indefinitely. The difference is the work you do here.",
  },
};

// ============================================================
// INFRASTRUCTURE CHECKS — per mountain
// Each carries forward; higher mountains include lower checks
// ============================================================

export const INFRASTRUCTURE = {
  1: [
    { id: "scorecard", label: "Weekly scorecard or dashboard you actually look at" },
    { id: "crm", label: "CRM where every lead lives" },
    { id: "sales_process", label: "Documented sales process" },
    { id: "lead_response_standard", label: "Lead response time standard" },
    { id: "no_show_followup", label: "No-show follow-up sequence" },
    { id: "unsold_followup", label: "Unsold-lead follow-up sequence" },
    { id: "churn_tracking", label: "Weekly churn tracking" },
    { id: "cost_per_lead", label: "Knowledge of your monthly cost per lead" },
  ],
  2: [
    // All Mountain 1 carry over
    { id: "scorecard", label: "Weekly scorecard or dashboard you actually look at" },
    { id: "crm", label: "CRM where every lead lives" },
    { id: "sales_process", label: "Documented sales process" },
    { id: "lead_response_standard", label: "Lead response time standard" },
    { id: "no_show_followup", label: "No-show follow-up sequence" },
    { id: "unsold_followup", label: "Unsold-lead follow-up sequence" },
    { id: "churn_tracking", label: "Weekly churn tracking" },
    { id: "cost_per_lead", label: "Knowledge of your monthly cost per lead" },
    // New for Mountain 2
    { id: "defined_roles", label: "Defined roles for each staff member (written, not just understood)" },
    { id: "one_on_ones", label: "Regular 1-on-1s with your staff" },
    { id: "staff_kpis", label: "Each staff member has clear KPIs they own" },
    { id: "team_huddle", label: "Team huddle or weekly meeting rhythm" },
    { id: "training_process", label: "Training process for new hires (not just shadowing)" },
    { id: "team_visibility", label: "Team has access to the same numbers you do" },
    { id: "performance_evaluation", label: "Way to evaluate staff performance beyond gut feel" },
    { id: "financial_dashboard", label: "Financial dashboard beyond revenue (margin, CAC, LTV)" },
  ],
  3: [
    // Carry-over
    { id: "scorecard", label: "Weekly scorecard or dashboard you actually look at" },
    { id: "crm", label: "CRM where every lead lives" },
    { id: "sales_process", label: "Documented sales process" },
    { id: "lead_response_standard", label: "Lead response time standard" },
    { id: "no_show_followup", label: "No-show follow-up sequence" },
    { id: "unsold_followup", label: "Unsold-lead follow-up sequence" },
    { id: "churn_tracking", label: "Weekly churn tracking" },
    { id: "cost_per_lead", label: "Knowledge of your monthly cost per lead" },
    { id: "defined_roles", label: "Defined roles for each staff member" },
    { id: "one_on_ones", label: "Regular 1-on-1s with your staff" },
    { id: "staff_kpis", label: "Each staff member has clear KPIs they own" },
    { id: "team_huddle", label: "Team huddle or weekly meeting rhythm" },
    { id: "training_process", label: "Training process for new hires" },
    { id: "team_visibility", label: "Team has access to the same numbers you do" },
    { id: "performance_evaluation", label: "Way to evaluate staff performance beyond gut feel" },
    { id: "financial_dashboard", label: "Financial dashboard beyond revenue (margin, CAC, LTV)" },
    // New for Mountain 3
    { id: "leader_scorecard", label: "Your facility leader has their own scorecard they own" },
    { id: "leader_meeting", label: "Standing weekly meeting with your facility leader (real agenda)" },
    { id: "retention_strategy", label: "Retention strategy (not just acquisition)" },
    { id: "member_engagement", label: "You track member engagement (attendance, milestones, frequency)" },
    { id: "referral_system", label: "Referral system that runs without you pushing it" },
    { id: "quarterly_planning", label: "Quarterly or annual planning rhythm" },
    { id: "documented_sops", label: "Documented SOPs for the main parts of the business" },
    { id: "ownership_boundaries", label: "Clear definition of what facility leader owns vs. what you own" },
    { id: "leader_owns_financials", label: "Your facility leader owns the financial dashboard (margin, CAC, LTV)" },
  ],
  4: [
    // Carry-over (abbreviated — same as Mountain 3)
    { id: "scorecard", label: "Weekly scorecard or dashboard you actually look at" },
    { id: "sales_process", label: "Documented sales process" },
    { id: "defined_roles", label: "Defined roles for each staff member" },
    { id: "staff_kpis", label: "Each staff member has clear KPIs they own" },
    { id: "team_huddle", label: "Team huddle or weekly meeting rhythm" },
    { id: "performance_evaluation", label: "Way to evaluate staff performance beyond gut feel" },
    { id: "financial_dashboard", label: "Financial dashboard (margin, CAC, LTV)" },
    { id: "leader_scorecard", label: "Each facility leader has their own scorecard" },
    { id: "leader_meeting", label: "Standing weekly meeting with each facility leader" },
    { id: "retention_strategy", label: "Retention strategy" },
    { id: "quarterly_planning", label: "Quarterly or annual planning rhythm" },
    { id: "documented_sops", label: "Documented SOPs for main parts of the business" },
    { id: "ownership_boundaries", label: "Clear definition of what facility leaders own vs. what you own" },
    // New for Mountain 4
    { id: "standard_playbook", label: "Standard operating playbook that applies across all locations" },
    { id: "location_dashboards", label: "Location-level dashboards to compare gyms side by side" },
    { id: "leader_team_meeting", label: "Regular leadership meeting with all facility leaders together" },
    { id: "leader_onboarding", label: "Defined onboarding process for new facility leaders" },
    { id: "consistent_kpis", label: "Roles, expectations, and KPIs are identical across locations" },
    { id: "brand_standards", label: "Shared brand standards (member experience, programming, culture)" },
    { id: "cross_location_reporting", label: "Cross-location reporting cadence (weekly, monthly, quarterly)" },
    { id: "model_gym", label: "A clear 'model' gym for others to learn from" },
    { id: "centralized_vs_local", label: "Clear definition of what's centralized vs. what each location owns" },
    { id: "exit_plan_4", label: "A long-term ownership plan (sell, hold, franchise, partner)" },
  ],
  5: [
    // Carry-over (abbreviated)
    { id: "standard_playbook", label: "Standard operating playbook across all locations" },
    { id: "location_dashboards", label: "Location-level dashboards" },
    { id: "leader_team_meeting", label: "Regular meeting with all facility leaders together" },
    { id: "leader_onboarding", label: "Defined onboarding process for new facility leaders" },
    { id: "consistent_kpis", label: "Roles, expectations, KPIs are identical across locations" },
    { id: "brand_standards", label: "Shared brand standards" },
    { id: "cross_location_reporting", label: "Cross-location reporting cadence" },
    { id: "centralized_vs_local", label: "Clear definition of what's centralized vs. what each location owns" },
    // New for Mountain 5
    { id: "district_manager", label: "District manager or area leader running operations" },
    { id: "district_owns_pnl", label: "Your district leader owns a P&L (not just operations)" },
    { id: "executive_reporting", label: "Executive-level reporting (portfolio-wide, not just per location)" },
    { id: "leadership_pipeline", label: "Leadership development pipeline — growing future leaders from within" },
    { id: "documented_culture", label: "Defined company culture that's written, taught, and reinforced" },
    { id: "strategic_plan", label: "Strategic plan for the next 12–36 months beyond more locations" },
    { id: "portfolio_financials", label: "Financial visibility at the portfolio level (combined P&L, unit economics)" },
    { id: "exit_plan_5", label: "Defined exit / long-term ownership plan (sell, hold, franchise, partner)" },
    { id: "peer_group", label: "Regular time with peers at your level outside the business" },
  ],
};

// ============================================================
// DIAGNOSTIC QUESTIONS — behavioral, per mountain
// ============================================================

export const DIAGNOSTICS = {
  1: [
    {
      id: "hats",
      type: "checkbox",
      question:
        "In a typical week, which of these hats do you personally wear? (Check all that apply)",
      options: [
        "Coaching classes / sessions",
        "Sales / closing leads",
        "Lead follow-up",
        "Social media",
        "Admin / paperwork",
        "Cleaning",
        "Programming",
        "Hiring",
        "Payroll / finances",
        "Other",
      ],
    },
    {
      id: "time_off",
      type: "single",
      question:
        "When was the last time you took 3+ consecutive days off without checking your phone?",
      options: [
        "This month",
        "Last 3 months",
        "Last 6 months",
        "Last year",
        "Longer than a year",
        "I genuinely can't remember",
      ],
    },
    {
      id: "lead_response",
      type: "single",
      question: "If a lead came in right now, who would respond first?",
      options: [
        "Me, within minutes",
        "Me, within an hour",
        "Me, eventually",
        "Someone else, within minutes",
        "Someone else, within an hour",
        "Honestly? Maybe nobody right away",
      ],
    },
    {
      id: "revenue_dip",
      type: "single",
      question: "When revenue dips, what's your first instinct?",
      options: [
        "Get more leads",
        "Look at the funnel and find the leak",
        "Talk to the team",
        "Cut expenses",
        "Run a promo / discount",
        "Panic a little",
        "Not sure",
      ],
    },
    {
      id: "decision_style",
      type: "single",
      question: "How do you make business decisions?",
      options: [
        "Mostly by gut",
        "Mostly by numbers",
        "Both — depends on the decision",
        "I don't really 'decide,' I react",
      ],
    },
    {
      id: "firefighting",
      type: "single",
      question: "How often do you feel like you're putting out fires vs. running planned plays?",
      options: [
        "Almost always firefighting",
        "Mostly firefighting",
        "About half and half",
        "Mostly running planned plays",
        "Almost always planned plays",
      ],
    },
    {
      id: "vision",
      type: "text",
      question:
        "In your own words, what's the #1 thing you want to be true a year from now that isn't true today?",
    },
  ],
  2: [
    {
      id: "underperformance",
      type: "single",
      question: "When a staff member underperforms, what's your first move?",
      options: [
        "Have a direct conversation with them",
        "Do the task myself — it's faster",
        "Hope it gets better on its own",
        "Vent to someone else",
        "Review the numbers with them",
        "Not sure",
      ],
    },
    {
      id: "faster_myself",
      type: "single",
      question:
        "How often do you find yourself doing a task because 'it's faster than explaining it'?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
    },
    {
      id: "vacation_break",
      type: "text",
      question:
        "If you took a 2-week vacation tomorrow, what would break first?",
    },
    {
      id: "who_closes",
      type: "single",
      question: "Who closes your biggest / highest-intent leads?",
      options: [
        "Me — every time",
        "Me — most of the time",
        "My closer / sales team",
        "It depends",
        "We don't differentiate between leads",
      ],
    },
    {
      id: "staff_numbers",
      type: "single",
      question: "Does every staff member know what number they're personally responsible for?",
      options: [
        "Yes — all of them",
        "Some of them",
        "No, not really",
        "I haven't thought about it that way",
      ],
    },
    {
      id: "performance_conversation",
      type: "single",
      question:
        "When was the last time you held a real performance conversation with a struggling staff member?",
      options: [
        "This week",
        "This month",
        "This quarter",
        "Longer than that",
        "I avoid those conversations",
      ],
    },
    {
      id: "coaching_vs_doing",
      type: "single",
      question: "What do you spend more time on — coaching your team or doing the work yourself?",
      options: [
        "Mostly coaching the team",
        "About half and half",
        "Mostly doing the work myself",
        "Almost all doing the work",
      ],
    },
    {
      id: "team_running",
      type: "text",
      question:
        "In your own words — what does 'the team running without me' actually look like?",
    },
  ],
  3: [
    {
      id: "decisions_without_you",
      type: "single",
      question:
        "In the last 30 days, how many decisions did your facility leader make without consulting you?",
      options: [
        "Most of them",
        "About half",
        "Very few",
        "None — I make all the calls",
        "I'm not sure",
      ],
    },
    {
      id: "member_complaint",
      type: "single",
      question: "If a member complained directly to you tomorrow, what would you do?",
      options: [
        "Handle it myself",
        "Route it to my facility leader and stay out",
        "Route it and follow up to make sure it's handled",
        "Handle it but tell the leader after",
        "Depends on the complaint",
      ],
    },
    {
      id: "time_split",
      type: "single",
      question:
        "What percentage of your week is spent on the current gym vs. thinking about the future, growth, or yourself?",
      options: [
        "90%+ on the gym",
        "Mostly on the gym, some on the future",
        "About half and half",
        "Mostly on the future, some on the gym",
        "Almost entirely on the future / strategy",
      ],
    },
    {
      id: "retention_review",
      type: "single",
      question: "When was the last time you reviewed retention data — not just member count?",
      options: [
        "This week",
        "This month",
        "This quarter",
        "Longer than that",
        "I don't really review retention specifically",
      ],
    },
    {
      id: "leader_role",
      type: "single",
      question: "Does your facility leader coach the team, or just manage tasks?",
      options: [
        "Real coaching — they develop people",
        "Mostly task management",
        "Honestly, I'm not sure",
        "I'm still doing most of the coaching",
      ],
    },
    {
      id: "best_month_why",
      type: "single",
      question:
        "If the gym had its best month ever next month, would you know exactly why?",
      options: ["Yes", "Mostly", "Somewhat", "No"],
    },
    {
      id: "relationship_to_business",
      type: "single",
      question: "What's your relationship with the business right now?",
      options: ["Energized", "Content", "Restless", "Drained", "Stuck"],
    },
    {
      id: "time_freedom",
      type: "text",
      question:
        "If the gym truly ran without you, what would you do with that time?",
    },
  ],
  4: [
    {
      id: "most_time_location",
      type: "single",
      question: "Which location takes up the most of your time?",
      options: [
        "My best-performing one",
        "My worst-performing one",
        "They're about equal",
        "It depends on the week",
        "I'm not sure",
      ],
    },
    {
      id: "sales_process_consistency",
      type: "single",
      question:
        "If I asked each of your facility leaders to describe how the sales process works, would I hear the same answer?",
      options: [
        "Yes — same answer",
        "Mostly the same",
        "No — they each do it differently",
        "I honestly don't know",
      ],
    },
    {
      id: "best_location_why",
      type: "text",
      question:
        "Why is your best-performing location actually performing best? (Be honest — leader, system, market, luck, or some mix?)",
    },
    {
      id: "underperforming_response",
      type: "single",
      question: "When a location underperforms, what's your first move?",
      options: [
        "Jump in and operate it myself",
        "Work with the leader to diagnose it",
        "Look at the numbers first",
        "Replace the leader",
        "Not sure",
      ],
    },
    {
      id: "leaders_meet",
      type: "single",
      question: "Do your facility leaders meet with each other regularly, or only with you?",
      options: [
        "Regularly, as a team",
        "Only with me, separately",
        "Occasionally",
        "Not at all",
      ],
    },
    {
      id: "member_experience",
      type: "single",
      question: "How different are the member experiences at your locations?",
      options: [
        "Nearly identical",
        "Somewhat consistent",
        "Pretty different",
        "Very different",
      ],
    },
    {
      id: "consistency_meaning",
      type: "text",
      question:
        "In your own words — what does 'consistency across locations' actually mean for you?",
    },
  ],
  5: [
    {
      id: "around_district",
      type: "single",
      question:
        "How often do you go around your district leader to deal directly with a facility leader or staff member?",
      options: ["Regularly", "Sometimes", "Rarely", "Never", "I'm not sure"],
    },
    {
      id: "floor_visit",
      type: "single",
      question:
        "When was the last time you visited a gym floor for reasons other than a problem?",
      options: ["This week", "This month", "This quarter", "Longer than that"],
    },
    {
      id: "successors",
      type: "single",
      question:
        "If a strong facility leader left tomorrow, do you have someone internally ready to step up?",
      options: [
        "Yes — at most locations",
        "At some locations",
        "No",
        "I'm not sure",
      ],
    },
    {
      id: "culture_read",
      type: "single",
      question: "What's your honest read on the culture across your locations?",
      options: [
        "Consistent and strong",
        "Mostly consistent",
        "Drifting",
        "Varies a lot by location",
        "I'm not sure",
      ],
    },
    {
      id: "time_allocation",
      type: "single",
      question: "How is your week roughly split?",
      options: [
        "Mostly operations",
        "Mostly strategy",
        "Mostly on myself / outside the business",
        "About even across all three",
      ],
    },
    {
      id: "five_year_vision",
      type: "text",
      question:
        "When you imagine the business in 5 years, what does it look like?",
    },
    {
      id: "avoided_decision",
      type: "text",
      question:
        "What's the biggest decision you're avoiding right now?",
    },
  ],
};
