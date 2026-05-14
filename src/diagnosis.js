// ============================================================
// MOUNTAIN DIAGNOSIS LOGIC
// Maps survey answers → current mountain + target mountain
// ============================================================

// ---- Long-term goal → target mountain mapping ----
export const GOAL_TO_MOUNTAIN = {
  owner_operator: 1, // "Just be a great owner-operator who loves the day-to-day"
  run_itself: 3, // "Own the facility but have it run without me"
  two_three: 4, // "Own 2-3 locations"
  four_plus: 5, // "Own 4+ locations / build a brand"
  not_sure: null, // Not sure — we'll let the report handle this
};

export const GOAL_LABELS = {
  owner_operator: "Be a great owner-operator who loves the day-to-day",
  run_itself: "Own the facility but have it run without me",
  two_three: "Own 2–3 locations",
  four_plus: "Own 4+ locations / build a brand",
  not_sure: "I'm not sure yet",
};

// ============================================================
// CURRENT MOUNTAIN DIAGNOSIS
// Structural gate (location + staff) sets the floor.
// Behavioral diagnostics confirm or adjust within range.
// ============================================================
export function diagnoseMountain(basics, staffBreakdown) {
  const locations = parseInt(basics.locations) || 1;
  const totalStaff = sumStaff(staffBreakdown);
  const hasFacilityLeader =
    (staffBreakdown.facility_leader || 0) > 0;
  const hasDistrictLeader =
    (staffBreakdown.district_leader || 0) > 0;

  // ---- Mountain 5: 4+ locations ----
  if (locations >= 4) {
    return { mountain: 5, reason: "4+ locations" };
  }

  // ---- Mountain 4: 2-3 locations ----
  if (locations >= 2) {
    return { mountain: 4, reason: "Multiple locations" };
  }

  // ---- Single location, but with district-level leadership? Edge case ----
  if (hasDistrictLeader) {
    return { mountain: 5, reason: "District leadership in place" };
  }

  // ---- Mountain 3: Single location with facility leader + 5+ staff ----
  if (hasFacilityLeader && totalStaff >= 5) {
    return { mountain: 3, reason: "Facility leader in place + meaningful team" };
  }

  // ---- Mountain 2: 3+ staff with at least some leadership structure ----
  const hasLeadershipRole =
    hasFacilityLeader ||
    (staffBreakdown.head_coach || 0) > 0 ||
    (staffBreakdown.sales_closer || 0) > 0;

  if (totalStaff >= 3 && hasLeadershipRole) {
    return { mountain: 2, reason: "Team with named leadership roles" };
  }

  if (totalStaff >= 3) {
    return { mountain: 2, reason: "Team forming (3+ staff)" };
  }

  // ---- Mountain 1: Default — solo or near-solo ----
  return { mountain: 1, reason: "Owner-operator with minimal staff" };
}

function sumStaff(breakdown) {
  if (!breakdown) return 0;
  return Object.values(breakdown).reduce((s, v) => s + (parseInt(v) || 0), 0);
}

// ============================================================
// VARIANCE ANALYSIS — for Mountain 4+ cross-location data
// Identifies the location with the biggest spread on key metrics
// ============================================================
export function analyzeLocationVariance(locationData) {
  if (!locationData || locationData.length < 2) return null;

  const metrics = ["lead_to_close", "show_to_sale", "monthly_churn", "members", "net_growth_90"];
  const insights = [];

  metrics.forEach((metric) => {
    const values = locationData
      .map((loc, idx) => ({
        idx,
        name: loc.name || `Location ${idx + 1}`,
        value: parseFloat(loc[metric]),
      }))
      .filter((v) => !isNaN(v.value));

    if (values.length < 2) return;

    const max = Math.max(...values.map((v) => v.value));
    const min = Math.min(...values.map((v) => v.value));
    const spread = max - min;
    const avg = values.reduce((s, v) => s + v.value, 0) / values.length;
    const spreadPct = avg !== 0 ? (spread / avg) * 100 : 0;

    const topLocation = values.find((v) => v.value === max);
    const bottomLocation = values.find((v) => v.value === min);

    // For churn, lower is better — flip the framing
    const isInverted = metric === "monthly_churn";
    const best = isInverted ? bottomLocation : topLocation;
    const worst = isInverted ? topLocation : bottomLocation;

    insights.push({
      metric,
      best: best.name,
      bestValue: best.value,
      worst: worst.name,
      worstValue: worst.value,
      spread,
      spreadPct,
      isHighVariance: spreadPct > 30, // >30% variance is meaningful
    });
  });

  // Sort by variance — biggest variance first
  insights.sort((a, b) => b.spreadPct - a.spreadPct);

  return insights;
}

// ============================================================
// METRIC LABELS for cross-location display
// ============================================================
export const METRIC_LABELS = {
  members: "Active members",
  lead_to_close: "Lead-to-close %",
  show_to_sale: "Show-to-sale %",
  monthly_churn: "Monthly churn %",
  net_growth_90: "Net growth (90d)",
};

// ============================================================
// EXPANSION WARNING — fires when owner is on Mountain 3 but
// targeting Mountain 4+, OR on Mountain 4 but targeting Mountain 5
// ============================================================
export function shouldShowExpansionWarning(currentMountain, targetMountain) {
  if (!targetMountain) return false;
  if (currentMountain === 3 && targetMountain >= 4) return true;
  if (currentMountain === 4 && targetMountain >= 5) return true;
  return false;
}

export function getExpansionWarning(currentMountain) {
  if (currentMountain === 3) {
    return {
      headline: "A word before you expand",
      body: "Before you expand to a second location, make sure this gym can truly run without you. The most common reason multi-location growth stalls is unfinished work on this mountain. A second gym built on the work you haven't done yet multiplies what's not working — it doesn't fix it. The work to make this one gym run independently is the same work that makes a second gym possible. Climb this mountain first, and the next one becomes a real option.",
    };
  }
  if (currentMountain === 4) {
    return {
      headline: "A word before you expand again",
      body: "Before you expand to a fourth location, make sure the gyms you have now perform consistently. The most common reason multi-location growth stalls — or breaks — is unfinished work on this mountain. A fourth gym built on top of inconsistency multiplies the inconsistency. The work to build a real system across 2–3 locations is the same work that makes 4+ possible. Skip it, and the next gym becomes the one that breaks you.",
    };
  }
  return null;
}
