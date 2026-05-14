import { useState, useMemo, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Mountain,
  Users,
  Building2,
  Target,
  Sparkles,
  FileDown,
  Info,
  Flag,
  TrendingUp,
} from "lucide-react";
import { MOUNTAINS, INFRASTRUCTURE, DIAGNOSTICS } from "./mountains";
import { ACTION_STEPS, COACH_NOTES, LOCATION_METRICS } from "./actionSteps";
import {
  diagnoseMountain,
  GOAL_TO_MOUNTAIN,
  GOAL_LABELS,
  analyzeLocationVariance,
  METRIC_LABELS,
  shouldShowExpansionWarning,
  getExpansionWarning,
} from "./diagnosis";
import { generateOwnerPDF, generateCoachPDF } from "./pdfGenerator";

// ============================================================
// STAFF ROLE DEFINITIONS — with info icon tooltips
// ============================================================
const STAFF_ROLES = [
  {
    id: "facility_leader",
    label: "Facility leader / manager",
    description:
      "Runs the day-to-day of the gym. Owns the location's performance. Manages other staff.",
  },
  {
    id: "head_coach",
    label: "Head coach",
    description:
      "Leads the coaching team. Owns coaching quality, schedule, and coach development.",
  },
  {
    id: "coach",
    label: "Coach",
    description: "Delivers classes/sessions. Reports to head coach or owner.",
  },
  {
    id: "front_desk",
    label: "Front desk / admin",
    description:
      "Handles check-ins, basic admin, member-facing support, sometimes lead intake.",
  },
  {
    id: "sales_closer",
    label: "Sales / closer",
    description:
      "Owns the sales conversation. Books and closes leads. Sometimes combined with the facility leader in smaller gyms.",
  },
  {
    id: "district_leader",
    label: "District / area leader",
    description:
      "Manages multiple facility leaders. Operates above the gym level. Typically only present in multi-location operations.",
  },
  {
    id: "other",
    label: "Other",
    description:
      "Anyone who doesn't fit above — maintenance, marketing specialists, etc.",
  },
];

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    basics: {
      locations: "",
      years_in_business: "",
      member_count: "",
    },
    staff: {},
    goal: "",
    infrastructure: {},
    diagnostic: {},
    locationData: [],
  });

  const totalSteps = useMemo(() => {
    // Calculated dynamically based on whether they're Mountain 4+
    // 0: Basics, 1: Staff (if any), 2: Goal, 3: Infrastructure, 4: Diagnostics, 5: Cross-location (if 4+), 6: Results
    const baseSteps = 5; // basics, goal, infrastructure, diagnostic, results
    const totalStaff = sumStaffCount(data.staff);
    const hasStaff = totalStaff > 0;
    const locations = parseInt(data.basics.locations) || 1;
    const isMultiLocation = locations >= 2;
    return baseSteps + (hasStaff ? 1 : 0) + (isMultiLocation ? 1 : 0);
  }, [data.basics.locations, data.staff]);

  // Determine current mountain (used for filtering questions on each step)
  const currentMountain = useMemo(() => {
    if (!data.basics.locations) return 1;
    return diagnoseMountain(data.basics, data.staff).mountain;
  }, [data.basics, data.staff]);

  const targetMountain = useMemo(
    () => GOAL_TO_MOUNTAIN[data.goal] || currentMountain,
    [data.goal, currentMountain]
  );

  // ---- Update helpers ----
  const updateBasics = (field, value) =>
    setData((d) => ({ ...d, basics: { ...d.basics, [field]: value } }));
  const updateStaff = (role, value) =>
    setData((d) => ({ ...d, staff: { ...d.staff, [role]: value } }));
  const updateInfrastructure = (id, value) =>
    setData((d) => ({ ...d, infrastructure: { ...d.infrastructure, [id]: value } }));
  const updateDiagnostic = (id, value) =>
    setData((d) => ({ ...d, diagnostic: { ...d.diagnostic, [id]: value } }));
  const updateLocationData = (idx, field, value) =>
    setData((d) => {
      const next = [...(d.locationData || [])];
      next[idx] = { ...(next[idx] || {}), [field]: value };
      return { ...d, locationData: next };
    });

  // Build dynamic step list
  const steps = useMemo(() => {
    const list = ["basics"];
    if (parseInt(data.basics.locations) >= 0 || data.basics.locations === "") {
      // Always show staff once basics are set — we'll guard it ourselves
      list.push("staff");
    }
    list.push("goal");
    list.push("infrastructure");
    list.push("diagnostic");
    const locations = parseInt(data.basics.locations) || 1;
    if (locations >= 2) {
      list.push("locationData");
    }
    list.push("results");
    return list;
  }, [data.basics.locations]);

  const currentStep = steps[step] || "results";

  const canProceed = useMemo(() => {
    if (currentStep === "basics") {
      return data.basics.locations && data.basics.years_in_business && data.basics.member_count;
    }
    if (currentStep === "staff") {
      return true; // Optional — owner may have no staff
    }
    if (currentStep === "goal") {
      return !!data.goal;
    }
    if (currentStep === "infrastructure") {
      const items = INFRASTRUCTURE[currentMountain] || INFRASTRUCTURE[1];
      return items.every((item) => data.infrastructure[item.id] !== undefined);
    }
    if (currentStep === "diagnostic") {
      const items = DIAGNOSTICS[currentMountain] || DIAGNOSTICS[1];
      return items.every((item) => {
        const v = data.diagnostic[item.id];
        if (item.type === "checkbox") return Array.isArray(v) && v.length > 0;
        return v !== undefined && v !== "";
      });
    }
    return true;
  }, [currentStep, data, currentMountain]);

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen text-stone-900"
      style={{ backgroundColor: "#eef2f8" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Big+Shoulders+Display:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { font-family: "Archivo", sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Header />

        <ProgressBar
          step={step}
          steps={steps}
          totalSteps={steps.length - 1}
        />

        <div className="space-y-6 mb-10">
          {currentStep === "basics" && (
            <BasicsStep data={data.basics} update={updateBasics} />
          )}

          {currentStep === "staff" && (
            <StaffStep
              staff={data.staff}
              update={updateStaff}
              locations={parseInt(data.basics.locations) || 1}
            />
          )}

          {currentStep === "goal" && (
            <GoalStep
              goal={data.goal}
              update={(v) => setData((d) => ({ ...d, goal: v }))}
            />
          )}

          {currentStep === "infrastructure" && (
            <InfrastructureStep
              mountain={currentMountain}
              values={data.infrastructure}
              update={updateInfrastructure}
            />
          )}

          {currentStep === "diagnostic" && (
            <DiagnosticStep
              mountain={currentMountain}
              values={data.diagnostic}
              update={updateDiagnostic}
            />
          )}

          {currentStep === "locationData" && (
            <LocationDataStep
              numLocations={parseInt(data.basics.locations) || 2}
              data={data.locationData}
              update={updateLocationData}
            />
          )}

          {currentStep === "results" && (
            <ResultsStep
              data={data}
              currentMountain={currentMountain}
              targetMountain={targetMountain}
            />
          )}
        </div>

        {currentStep !== "results" && (
          <NavButtons
            onBack={step > 0 ? goBack : null}
            onNext={goNext}
            canProceed={canProceed}
            isLast={step === steps.length - 2}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header() {
  return (
    <header className="mb-10">
      <p
        className="text-blue-700 text-sm font-bold uppercase tracking-[0.2em] mb-3"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        Gym Member Machine
      </p>
      <h1
        className="text-5xl md:text-7xl leading-[0.95] mb-5 uppercase"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          letterSpacing: "-0.005em",
          color: "#0c1a3d",
        }}
      >
        The Mountain
        <br />
        Framework
      </h1>
      <p
        className="text-stone-700 text-base md:text-lg max-w-2xl mb-3 leading-relaxed"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        Every gym owner is on a mountain. Some are escaping chaos. Some are
        building a team. Some are running multiple locations. This tool figures
        out which mountain you're on, what summit you're climbing toward, and
        the next moves to make the climb.
      </p>
      <p
        className="text-stone-700 text-base max-w-2xl leading-relaxed"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        Answer honestly. No one's grading you. The whole point is to see clearly
        so the climb gets easier 💪
      </p>
      <div className="flex items-center gap-1 mt-8">
        <div className="h-1 w-16 bg-yellow-300" />
        <div className="h-1 flex-1 bg-blue-700" />
      </div>
    </header>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================
function ProgressBar({ step, steps, totalSteps }) {
  const isResults = steps[step] === "results";
  const percent = isResults ? 100 : ((step + 1) / steps.length) * 100;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs uppercase tracking-wider text-stone-500 font-bold"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {isResults ? "Your Results" : `Step ${step + 1} of ${steps.length - 1}`}
        </span>
        <span
          className="text-xs uppercase tracking-wider text-stone-500"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {Math.round(percent)}%
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded overflow-hidden">
        <div
          className="h-full bg-blue-700 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// SECTION CARD (reusable)
// ============================================================
function SectionCard({ title, description, children, className = "" }) {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 ${className}`}
    >
      <div className="absolute top-0 left-8 w-1 h-7 bg-blue-700 rounded-b" />
      <h2
        className="text-3xl md:text-4xl mb-3 uppercase leading-tight"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          color: "#0c1a3d",
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-stone-600 mb-6 leading-relaxed"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

// ============================================================
// STEP 1: BASICS
// ============================================================
function BasicsStep({ data, update }) {
  return (
    <SectionCard
      title="The Basics"
      description="Just a few quick questions to set the stage. This determines which questions you'll see next."
    >
      <div className="grid md:grid-cols-3 gap-4">
        <NumberInput
          label="How many locations do you have?"
          value={data.locations}
          onChange={(v) => update("locations", v)}
          placeholder="1"
        />
        <NumberInput
          label="Years in business?"
          value={data.years_in_business}
          onChange={(v) => update("years_in_business", v)}
          placeholder="3"
        />
        <NumberInput
          label="Approximate active members (across all locations)"
          value={data.member_count}
          onChange={(v) => update("member_count", v)}
          placeholder="150"
        />
      </div>
    </SectionCard>
  );
}

function NumberInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span
        className="block text-sm font-semibold mb-2 text-stone-700"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {label}
      </span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: "#0c1a3d",
        }}
      />
    </label>
  );
}

// ============================================================
// STEP 2: STAFF
// ============================================================
function StaffStep({ staff, update, locations }) {
  // Hide district leader role unless 2+ locations
  const visibleRoles = STAFF_ROLES.filter(
    (r) => r.id !== "district_leader" || locations >= 2
  );

  const totalStaff = sumStaffCount(staff);

  return (
    <SectionCard
      title="Your Team"
      description="How many people do you have in each role? Leave blank or enter 0 if a role doesn't apply. (If you have zero staff, just click Continue.)"
    >
      <div className="space-y-3">
        {visibleRoles.map((role) => (
          <StaffRoleInput
            key={role.id}
            role={role}
            value={staff[role.id] || ""}
            onChange={(v) => update(role.id, v)}
          />
        ))}
      </div>
      {totalStaff > 0 && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p
            className="text-sm text-stone-700"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            Total team size: <strong>{totalStaff}</strong>
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function StaffRoleInput({ role, value, onChange }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2">
        <span
          className="font-semibold text-stone-800"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {role.label}
        </span>
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info size={14} className="text-stone-400 cursor-help" />
          {showTooltip && (
            <div
              className="absolute z-30 left-0 top-full mt-1.5 bg-slate-900 text-stone-50 text-xs rounded-md p-2.5 w-64 shadow-lg leading-relaxed"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              {role.description}
            </div>
          )}
        </div>
      </div>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: "#0c1a3d",
        }}
      />
    </div>
  );
}

function sumStaffCount(staff) {
  if (!staff) return 0;
  return Object.values(staff).reduce((s, v) => s + (parseInt(v) || 0), 0);
}

// ============================================================
// STEP 3: GOAL
// ============================================================
function GoalStep({ goal, update }) {
  const options = [
    { id: "owner_operator", label: GOAL_LABELS.owner_operator, desc: "You love being in the gym and want a healthy, well-run single location you operate yourself." },
    { id: "run_itself", label: GOAL_LABELS.run_itself, desc: "You want a single location that runs without your day-to-day involvement so you have time freedom." },
    { id: "two_three", label: GOAL_LABELS.two_three, desc: "You want to expand to a small portfolio of gyms — 2 or 3 locations." },
    { id: "four_plus", label: GOAL_LABELS.four_plus, desc: "You want to build a real brand with 4+ locations, leadership layers, and significant scale." },
    { id: "not_sure", label: GOAL_LABELS.not_sure, desc: "You haven't decided yet, and that's okay — we'll focus on what's directly in front of you." },
  ];

  return (
    <SectionCard
      title="Where You Want to Go"
      description="What's the long-term goal for your business? Pick the one closest to what you want, even if it's not exact."
    >
      <div className="space-y-3">
        {options.map((opt) => (
          <GoalOption
            key={opt.id}
            option={opt}
            selected={goal === opt.id}
            onClick={() => update(opt.id)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function GoalOption({ option, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border-2 rounded-lg p-4 transition-all ${
        selected
          ? "border-blue-700 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {selected ? (
            <CheckCircle2 size={20} className="text-blue-700" />
          ) : (
            <Circle size={20} className="text-stone-300" />
          )}
        </div>
        <div className="flex-1">
          <div
            className="font-semibold mb-1"
            style={{ fontFamily: '"Archivo", sans-serif', color: "#0c1a3d" }}
          >
            {option.label}
          </div>
          <div
            className="text-sm text-stone-600 leading-relaxed"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            {option.desc}
          </div>
        </div>
      </div>
    </button>
  );
}

// ============================================================
// STEP 4: INFRASTRUCTURE CHECK
// ============================================================
function InfrastructureStep({ mountain, values, update }) {
  const items = INFRASTRUCTURE[mountain] || INFRASTRUCTURE[1];
  return (
    <SectionCard
      title="What's Already In Place"
      description="For each item below, mark whether you have it, sort of have it, or don't have it yet. Be honest — this is the foundation for the action steps."
    >
      <div className="space-y-2">
        {items.map((item) => (
          <InfrastructureRow
            key={item.id}
            item={item}
            value={values[item.id]}
            onChange={(v) => update(item.id, v)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function InfrastructureRow({ item, value, onChange }) {
  const options = [
    { id: "yes", label: "Yes" },
    { id: "kind_of", label: "Kind of" },
    { id: "no", label: "No" },
  ];
  return (
    <div className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <p
        className="font-medium text-stone-800 flex-1"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {item.label}
      </p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all uppercase tracking-wide ${
              value === opt.id
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-stone-600 hover:bg-slate-200"
            }`}
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// STEP 5: DIAGNOSTIC
// ============================================================
function DiagnosticStep({ mountain, values, update }) {
  const items = DIAGNOSTICS[mountain] || DIAGNOSTICS[1];
  return (
    <SectionCard
      title="A Few More Questions"
      description="These help us understand where you actually are — not just structurally, but in practice."
    >
      <div className="space-y-6">
        {items.map((item) => (
          <DiagnosticQuestion
            key={item.id}
            item={item}
            value={values[item.id]}
            onChange={(v) => update(item.id, v)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function DiagnosticQuestion({ item, value, onChange }) {
  if (item.type === "single") {
    return (
      <div>
        <p
          className="font-semibold mb-3 text-stone-800"
          style={{ fontFamily: '"Archivo", sans-serif', color: "#0c1a3d" }}
        >
          {item.question}
        </p>
        <div className="space-y-2">
          {item.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`w-full text-left border-2 rounded-lg p-3 transition-all flex items-center gap-3 ${
                value === opt
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              {value === opt ? (
                <CheckCircle2 size={18} className="text-blue-700 shrink-0" />
              ) : (
                <Circle size={18} className="text-stone-300 shrink-0" />
              )}
              <span className="text-stone-800">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (item.type === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div>
        <p
          className="font-semibold mb-3"
          style={{ fontFamily: '"Archivo", sans-serif', color: "#0c1a3d" }}
        >
          {item.question}
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          {item.options.map((opt) => {
            const checked = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const next = checked ? arr.filter((x) => x !== opt) : [...arr, opt];
                  onChange(next);
                }}
                className={`text-left border-2 rounded-lg p-3 transition-all flex items-center gap-3 ${
                  checked
                    ? "border-blue-700 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                style={{ fontFamily: '"Archivo", sans-serif' }}
              >
                {checked ? (
                  <CheckCircle2 size={18} className="text-blue-700 shrink-0" />
                ) : (
                  <Circle size={18} className="text-stone-300 shrink-0" />
                )}
                <span className="text-stone-800 text-sm">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (item.type === "text") {
    return (
      <div>
        <p
          className="font-semibold mb-3"
          style={{ fontFamily: '"Archivo", sans-serif', color: "#0c1a3d" }}
        >
          {item.question}
        </p>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          style={{ fontFamily: '"Archivo", sans-serif' }}
          placeholder="Be honest — there's no right answer."
        />
      </div>
    );
  }
  return null;
}

// ============================================================
// STEP 6 (Mountain 4+ only): CROSS-LOCATION DATA
// ============================================================
function LocationDataStep({ numLocations, data, update }) {
  return (
    <SectionCard
      title="Location-by-Location Numbers"
      description="If you have these numbers handy, fill them in for each location. The report becomes a lot sharper when it can see variance across your gyms. Optional — you can skip and still get a useful result."
    >
      <div className="space-y-6">
        {Array.from({ length: numLocations }).map((_, idx) => (
          <LocationCard
            key={idx}
            idx={idx}
            data={data[idx] || {}}
            update={(field, value) => update(idx, field, value)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function LocationCard({ idx, data, update }) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
      <input
        type="text"
        value={data.name || ""}
        onChange={(e) => update("name", e.target.value)}
        placeholder={`Location ${idx + 1} name (optional)`}
        className="w-full border-0 bg-transparent text-lg font-bold mb-3 focus:outline-none uppercase tracking-wide"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          color: "#0c1a3d",
        }}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {LOCATION_METRICS.map((metric) => (
          <label key={metric.id} className="block">
            <span
              className="block text-xs uppercase tracking-wider text-stone-500 font-bold mb-1"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              {metric.label}
            </span>
            <input
              type="number"
              step="any"
              value={data[metric.id] || ""}
              onChange={(e) => update(metric.id, e.target.value)}
              placeholder="—"
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 bg-white"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: "#0c1a3d",
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// NAV BUTTONS
// ============================================================
function NavButtons({ onBack, onNext, canProceed, isLast }) {
  return (
    <div className="flex justify-between items-center mt-8">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-stone-600 hover:text-stone-900 font-bold uppercase tracking-wider text-sm"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="bg-blue-700 text-white px-8 py-4 font-bold text-sm uppercase tracking-wider rounded hover:bg-blue-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-700 inline-flex items-center gap-2"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {isLast ? "See My Results" : "Continue"} <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ============================================================
// RESULTS (full 8-section owner-facing report)
// ============================================================
function ResultsStep({ data, currentMountain, targetMountain }) {
  const ownerPDFRef = useRef(null);
  const coachPDFRef = useRef(null);

  const current = MOUNTAINS[currentMountain];
  const target = targetMountain ? MOUNTAINS[targetMountain] : null;
  const actions = ACTION_STEPS[currentMountain];
  const coachNotes = COACH_NOTES[currentMountain];
  const expansionWarning = shouldShowExpansionWarning(currentMountain, targetMountain)
    ? getExpansionWarning(currentMountain)
    : null;

  const infrastructure = INFRASTRUCTURE[currentMountain] || [];
  const inPlace = infrastructure.filter((i) => data.infrastructure[i.id] === "yes");
  const partial = infrastructure.filter((i) => data.infrastructure[i.id] === "kind_of");
  const missing = infrastructure.filter((i) => data.infrastructure[i.id] === "no");

  // Filter action steps — only show steps that address gaps in infrastructure
  const visionAnswer =
    data.diagnostic.vision ||
    data.diagnostic.team_running ||
    data.diagnostic.time_freedom ||
    data.diagnostic.consistency_meaning ||
    data.diagnostic.five_year_vision;

  const locationVariance = useMemo(() => {
    if (currentMountain >= 4 && data.locationData?.length > 0) {
      return analyzeLocationVariance(data.locationData);
    }
    return null;
  }, [currentMountain, data.locationData]);

  const handleDownloadOwner = async () => {
    await generateOwnerPDF({
      data,
      currentMountain,
      targetMountain,
      inPlace,
      partial,
      missing,
      visionAnswer,
      expansionWarning,
      locationVariance,
    });
  };

  const handleDownloadCoach = async () => {
    await generateCoachPDF({
      data,
      currentMountain,
      targetMountain,
      inPlace,
      partial,
      missing,
      visionAnswer,
      expansionWarning,
      locationVariance,
    });
  };

  return (
    <div className="space-y-6">
      {/* HERO */}
      <ResultsHero
        currentMountain={currentMountain}
        targetMountain={targetMountain}
        goal={data.goal}
      />

      {/* DOWNLOAD CTAs */}
      <div className="bg-blue-700 text-white rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3
              className="text-2xl mb-1 uppercase"
              style={{
                fontFamily: '"Big Shoulders Display", sans-serif',
                fontWeight: 900,
              }}
            >
              Take this with you
            </h3>
            <p
              className="text-blue-100"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              Download your report and share it with your coach.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadOwner}
              className="bg-white text-blue-700 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded hover:bg-blue-50 transition-colors inline-flex items-center gap-2 justify-center"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              <FileDown size={16} /> My Report
            </button>
            <button
              onClick={handleDownloadCoach}
              className="bg-yellow-300 text-blue-900 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded hover:bg-yellow-200 transition-colors inline-flex items-center gap-2 justify-center"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              <FileDown size={16} /> Coach Version
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: WHERE YOU ARE */}
      <ResultsSection
        eyebrow="Section 1"
        title="Where You Are"
        subtitle={current.name}
      >
        <p
          className="text-stone-700 leading-relaxed mb-5"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {current.whoLandsHere}
        </p>
        <div className="border-l-4 border-yellow-300 bg-yellow-50 p-4 rounded-r">
          <p
            className="text-stone-800 leading-relaxed italic"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            {current.identityShift}
          </p>
        </div>
        {visionAnswer && (
          <div className="mt-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <p
              className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              In your own words
            </p>
            <p
              className="text-stone-800 leading-relaxed"
              style={{
                fontFamily: '"Archivo", sans-serif',
                color: "#0c1a3d",
              }}
            >
              "{visionAnswer}"
            </p>
          </div>
        )}
      </ResultsSection>

      {/* SECTION 2: WHAT'S ALREADY IN PLACE */}
      <ResultsSection
        eyebrow="Section 2"
        title="What's Already In Place"
        subtitle="Here's what you've built so far — and what's still ahead."
      >
        <div className="grid md:grid-cols-3 gap-4">
          <InfrastructureColumn
            title="Solid"
            count={inPlace.length}
            items={inPlace}
            bg="bg-emerald-50"
            border="border-emerald-200"
            text="text-emerald-900"
            badge="bg-emerald-700 text-white"
          />
          <InfrastructureColumn
            title="Partial"
            count={partial.length}
            items={partial}
            bg="bg-amber-50"
            border="border-amber-200"
            text="text-amber-900"
            badge="bg-amber-600 text-white"
          />
          <InfrastructureColumn
            title="Missing"
            count={missing.length}
            items={missing}
            bg="bg-rose-50"
            border="border-rose-200"
            text="text-rose-900"
            badge="bg-rose-700 text-white"
          />
        </div>
      </ResultsSection>

      {/* SECTION 3: WHAT SUCCESS LOOKS LIKE */}
      <ResultsSection
        eyebrow="Section 3"
        title="What Success Looks Like On This Mountain"
        subtitle={`You've summited ${current.name} when these things are true:`}
      >
        <ul className="space-y-3">
          {current.summit.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 items-start"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              <Flag size={18} className="text-blue-700 shrink-0 mt-0.5" />
              <span className="text-stone-800 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </ResultsSection>

      {/* SECTION 4: YOUR CLIMB PLAN */}
      <ResultsSection
        eyebrow="Section 4"
        title="Your Climb Plan"
        subtitle="A staged set of moves. Start with the next foothold. Don't try to do everything at once."
      >
        {/* NEXT FOOTHOLD */}
        <div className="bg-blue-700 text-white rounded-xl p-6 mb-6">
          <p
            className="text-xs uppercase tracking-[0.2em] text-blue-200 font-bold mb-2"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            The Next Foothold
          </p>
          <p
            className="text-lg md:text-xl leading-relaxed font-medium"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            {actions.nextFoothold}
          </p>
        </div>

        <ActionStepGroup title="Quick Wins — This Week" items={actions.quickWins} />
        <ActionStepGroup title="30-Day Moves" items={actions.thirtyDay} />
        <ActionStepGroup title="60-Day Moves" items={actions.sixtyDay} />
        <ActionStepGroup title="90-Day Moves" items={actions.ninetyDay} />
      </ResultsSection>

      {/* SECTION 5: WHY THIS WORK MATTERS BEYOND THIS MOUNTAIN */}
      <ResultsSection
        eyebrow="Section 5"
        title="Why This Work Matters Beyond This Mountain"
        subtitle="Every system you build here is the foundation for the next climb."
      >
        <p
          className="text-stone-700 leading-relaxed"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {current.carryForward}
        </p>
      </ResultsSection>

      {/* EXPANSION WARNING */}
      {expansionWarning && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={24} className="text-amber-700 shrink-0 mt-1" />
            <h3
              className="text-2xl md:text-3xl uppercase"
              style={{
                fontFamily: '"Big Shoulders Display", sans-serif',
                fontWeight: 900,
                color: "#0c1a3d",
              }}
            >
              {expansionWarning.headline}
            </h3>
          </div>
          <p
            className="text-stone-800 leading-relaxed"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            {expansionWarning.body}
          </p>
        </div>
      )}

      {/* CROSS-LOCATION VARIANCE INSIGHT */}
      {locationVariance && locationVariance.length > 0 && (
        <ResultsSection
          eyebrow="Your Data"
          title="What Your Locations Are Telling You"
          subtitle="Variance across locations is the best diagnostic at this level. Here's where it's biggest:"
        >
          <div className="space-y-3">
            {locationVariance.slice(0, 3).map((insight, i) => (
              <VarianceCard key={i} insight={insight} />
            ))}
          </div>
        </ResultsSection>
      )}

      {/* SECTION 6: PREVIEW OF NEXT MOUNTAIN */}
      {target && targetMountain > currentMountain && (
        <ResultsSection
          eyebrow="Section 6"
          title="What's Coming Next"
          subtitle={
            currentMountain + 1 === targetMountain
              ? `Your next climb: ${MOUNTAINS[currentMountain + 1].name}`
              : `Beyond this mountain — the path to ${target.name}`
          }
        >
          {currentMountain + 1 <= 5 && (
            <NextMountainPreview mountain={MOUNTAINS[currentMountain + 1]} />
          )}
        </ResultsSection>
      )}

      {/* SECTION 7: THE PATH VISUAL */}
      <ResultsSection
        eyebrow="Section 7"
        title="Your Climb"
        subtitle={
          targetMountain && targetMountain > currentMountain
            ? `From where you are to where you want to be — ${targetMountain - currentMountain} ${targetMountain - currentMountain === 1 ? "mountain" : "mountains"} ahead.`
            : "You're already on your target mountain. The work here is depth, not height — mastery, not movement."
        }
      >
        <PathVisual current={currentMountain} target={targetMountain || currentMountain} />
      </ResultsSection>

      {/* SECTION 8: COACH CONVERSATION PRIMER */}
      <ResultsSection
        eyebrow="Section 8"
        title="Your Next Conversation"
        subtitle="When you meet with your GMM coach, these are the three things they'll want to dig into first."
      >
        <ul className="space-y-3">
          {coachNotes.digInOn.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 items-start"
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              <div
                className="bg-blue-700 text-white rounded-full w-7 h-7 flex items-center justify-center shrink-0 font-bold text-sm"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {i + 1}
              </div>
              <span className="text-stone-800 leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </ResultsSection>

      {/* Bottom CTAs again */}
      <div className="bg-white border-2 border-blue-700 rounded-xl p-6 md:p-8 text-center">
        <Sparkles size={24} className="text-blue-700 mx-auto mb-3" strokeWidth={2} />
        <h3
          className="text-2xl md:text-3xl uppercase mb-3"
          style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900,
            color: "#0c1a3d",
          }}
        >
          Ready to climb?
        </h3>
        <p
          className="text-stone-700 max-w-xl mx-auto mb-6 leading-relaxed"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          Save your report and share it with your GMM coach. They'll walk through it
          with you on your next call.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownloadOwner}
            className="bg-blue-700 text-white px-6 py-3 font-bold text-sm uppercase tracking-wider rounded hover:bg-blue-800 transition-colors inline-flex items-center gap-2 justify-center"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            <FileDown size={16} /> Download My Report
          </button>
          <button
            onClick={handleDownloadCoach}
            className="bg-yellow-300 text-blue-900 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded hover:bg-yellow-200 transition-colors inline-flex items-center gap-2 justify-center"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            <FileDown size={16} /> Send to Coach
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS — supporting components
// ============================================================
function ResultsHero({ currentMountain, targetMountain, goal }) {
  const current = MOUNTAINS[currentMountain];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-5">
        <Mountain size={200} strokeWidth={1.5} className="text-blue-700" />
      </div>
      <p
        className="text-blue-700 text-xs font-bold uppercase tracking-[0.25em] mb-4"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        Your Diagnosis
      </p>
      <h2
        className="text-4xl md:text-6xl mb-3 uppercase leading-[0.95]"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          color: "#0c1a3d",
        }}
      >
        {current.name}
      </h2>
      <p
        className="text-stone-600 text-lg mb-6"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {current.tagline}
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <p
            className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            You're on
          </p>
          <p
            className="text-xl font-bold"
            style={{
              fontFamily: '"Archivo", sans-serif',
              color: "#0c1a3d",
            }}
          >
            Mountain {currentMountain}
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <p
            className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Your goal
          </p>
          <p
            className="text-xl font-bold leading-tight"
            style={{
              fontFamily: '"Archivo", sans-serif',
              color: "#0c1a3d",
            }}
          >
            {GOAL_LABELS[goal] || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultsSection({ eyebrow, title, subtitle, children }) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="absolute top-0 left-8 w-1 h-7 bg-blue-700 rounded-b" />
      <p
        className="text-blue-700 text-xs font-bold uppercase tracking-[0.2em] mb-2"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-2xl md:text-3xl mb-2 uppercase leading-tight"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          color: "#0c1a3d",
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className="text-stone-600 mb-6 leading-relaxed"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

function InfrastructureColumn({ title, count, items, bg, border, text, badge }) {
  return (
    <div className={`${bg} ${border} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <p
          className={`font-bold uppercase tracking-wider text-sm ${text}`}
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {title}
        </p>
        <span
          className={`${badge} text-xs font-bold rounded-full px-2.5 py-0.5`}
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {count}
        </span>
      </div>
      {items.length === 0 ? (
        <p
          className="text-xs text-stone-500 italic"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          Nothing here.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`text-sm ${text} leading-snug`}
              style={{ fontFamily: '"Archivo", sans-serif' }}
            >
              · {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionStepGroup({ title, items }) {
  return (
    <div className="mb-5">
      <p
        className="text-xs uppercase tracking-[0.15em] text-stone-500 font-bold mb-3"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        {title}
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 items-start text-stone-800 leading-relaxed"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            <span className="text-blue-700 font-bold shrink-0 mt-0.5">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VarianceCard({ insight }) {
  const isHigh = insight.isHighVariance;
  return (
    <div
      className={`border-l-4 rounded-r p-4 ${
        isHigh
          ? "border-rose-500 bg-rose-50"
          : "border-amber-400 bg-amber-50"
      }`}
    >
      <p
        className="text-xs uppercase tracking-wider font-bold mb-1"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: isHigh ? "#9f1239" : "#92400e",
        }}
      >
        {METRIC_LABELS[insight.metric]}
        {isHigh && " — HIGH VARIANCE"}
      </p>
      <p
        className="text-stone-800 leading-relaxed"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        <strong>{insight.best}</strong> ({insight.bestValue}) vs.{" "}
        <strong>{insight.worst}</strong> ({insight.worstValue}). That's a spread
        of {insight.spread.toFixed(1)} ({insight.spreadPct.toFixed(0)}% variance).
      </p>
    </div>
  );
}

function NextMountainPreview({ mountain }) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
      <h4
        className="text-xl mb-2 uppercase"
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          color: "#0c1a3d",
        }}
      >
        {mountain.name}
      </h4>
      <p
        className="text-stone-600 italic mb-4"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {mountain.tagline}
      </p>
      <p
        className="text-stone-700 leading-relaxed mb-4"
        style={{ fontFamily: '"Archivo", sans-serif' }}
      >
        {mountain.whoLandsHere}
      </p>
      <div className="bg-white border border-slate-200 rounded p-3">
        <p
          className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          What you'll be working toward
        </p>
        <ul
          className="space-y-1.5"
          style={{ fontFamily: '"Archivo", sans-serif' }}
        >
          {mountain.summit.slice(0, 3).map((item, i) => (
            <li key={i} className="text-sm text-stone-700 flex gap-2">
              <span className="text-blue-700">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PathVisual({ current, target }) {
  // Only show mountains from current to target (inclusive)
  const mountainsToShow = [];
  const start = Math.min(current, target);
  const end = Math.max(current, target);
  for (let i = start; i <= end; i++) {
    mountainsToShow.push(i);
  }

  // For single-mountain case (current = target), show just that one mountain
  if (mountainsToShow.length === 1) {
    return (
      <div className="flex justify-center py-6">
        <SingleMountainNode mountain={mountainsToShow[0]} isCurrent isTarget />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {mountainsToShow.map((m, idx) => (
          <div key={m} className="flex items-center flex-1 min-w-0">
            <SingleMountainNode
              mountain={m}
              isCurrent={m === current}
              isTarget={m === target}
            />
            {idx < mountainsToShow.length - 1 && (
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-700 to-blue-300 mx-2 min-w-[20px]" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-700" />
          <span
            className="uppercase tracking-wider text-stone-600"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            You are here
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flag size={12} className="text-yellow-600" />
          <span
            className="uppercase tracking-wider text-stone-600"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Your goal
          </span>
        </div>
      </div>
    </div>
  );
}

function SingleMountainNode({ mountain, isCurrent, isTarget }) {
  const m = MOUNTAINS[mountain];
  return (
    <div className="flex flex-col items-center text-center min-w-0">
      <div
        className={`relative w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
          isCurrent ? "bg-blue-700 ring-4 ring-blue-200" : "bg-slate-300"
        }`}
      >
        <Mountain size={26} className="text-white" strokeWidth={2} />
        {isTarget && !isCurrent && (
          <Flag
            size={14}
            className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-300"
          />
        )}
        {isTarget && isCurrent && (
          <Flag
            size={14}
            className="absolute -top-1 -right-1 text-yellow-300 fill-yellow-300"
          />
        )}
      </div>
      <p
        className="text-xs uppercase tracking-wider font-bold text-stone-500"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        Mountain {mountain}
      </p>
      <p
        className="text-sm font-bold mt-1 leading-tight max-w-[120px]"
        style={{
          fontFamily: '"Archivo", sans-serif',
          color: "#0c1a3d",
        }}
      >
        {m.name}
      </p>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="mt-20 pt-8 border-t border-slate-300">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-700 text-white px-3 py-1.5 rounded">
              <span
                className="text-xs font-black uppercase tracking-[0.15em]"
                style={{ fontFamily: '"Archivo", sans-serif' }}
              >
                GMM
              </span>
            </div>
            <span
              className="font-bold uppercase tracking-wider text-sm"
              style={{
                fontFamily: '"Archivo", sans-serif',
                color: "#0c1a3d",
              }}
            >
              Gym Member Machine
            </span>
          </div>
          <p
            className="text-sm text-stone-600 max-w-md leading-relaxed"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            The Mountain Framework helps gym owners diagnose where they are,
            see where they're going, and find the next move that matters.
            Built for GMM coaches and the owners they serve.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <a
            href="https://www.gymmembermachine.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 text-sm font-bold uppercase tracking-wider transition-colors"
            style={{ fontFamily: '"Archivo", sans-serif' }}
          >
            gymmembermachine.com →
          </a>
          <span
            className="text-xs text-stone-400"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Mountain Framework Diagnostic · v1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
