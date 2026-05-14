// ============================================================
// PDF GENERATOR
// Generates owner-facing PDF and coach-facing PDF (with notes)
// Uses jsPDF (client-side, no backend needed)
// ============================================================

import jsPDF from "jspdf";
import { MOUNTAINS, DIAGNOSTICS } from "./mountains";
import { ACTION_STEPS, COACH_NOTES } from "./actionSteps";
import { GOAL_LABELS, METRIC_LABELS } from "./diagnosis";

// ---- COLORS (matching GMM brand) ----
const COLORS = {
  navy: [12, 26, 61], // #0c1a3d
  blue: [29, 78, 216], // blue-700
  yellow: [253, 224, 71], // yellow-300
  stoneText: [68, 64, 60],
  stoneLight: [120, 113, 108],
  bgLight: [238, 242, 248], // #eef2f8
  bgWhite: [255, 255, 255],
  emerald: [4, 120, 87],
  amber: [180, 83, 9],
  rose: [190, 18, 60],
};

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ============================================================
// SHARED PDF BUILDER
// ============================================================
function buildPDF({
  data,
  currentMountain,
  targetMountain,
  inPlace,
  partial,
  missing,
  visionAnswer,
  expansionWarning,
  locationVariance,
  includeCoachNotes = false,
}) {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: "portrait",
  });

  const ctx = {
    doc,
    y: MARGIN,
    pageNum: 1,
  };

  const current = MOUNTAINS[currentMountain];
  const target = targetMountain ? MOUNTAINS[targetMountain] : null;
  const actions = ACTION_STEPS[currentMountain];
  const coachNotes = COACH_NOTES[currentMountain];

  // ===== COVER =====
  drawCover(ctx, current, currentMountain, targetMountain, data.goal, includeCoachNotes);
  newPage(ctx);

  // ===== SECTION 1: Where you are =====
  drawSectionHeader(ctx, "Section 1", "Where You Are", current.name);
  drawParagraph(ctx, current.whoLandsHere);
  drawCallout(ctx, "The Identity Shift", current.identityShift, COLORS.yellow);
  if (visionAnswer) {
    drawCallout(
      ctx,
      "In your own words",
      `"${visionAnswer}"`,
      COLORS.blue,
      true
    );
  }
  ensureSpace(ctx, 40);

  // ===== SECTION 2: Infrastructure =====
  drawSectionHeader(ctx, "Section 2", "What's Already In Place");
  drawParagraph(
    ctx,
    "Here's a snapshot of the systems and habits you have, partially have, and don't have yet."
  );
  drawInfrastructureSummary(ctx, inPlace, partial, missing);
  ensureSpace(ctx, 40);

  // ===== SECTION 3: Summit =====
  drawSectionHeader(ctx, "Section 3", "What Success Looks Like");
  drawParagraph(
    ctx,
    `You've summited ${current.name} when these things are true:`
  );
  current.summit.forEach((item) => {
    drawBullet(ctx, item, "flag");
  });
  ensureSpace(ctx, 40);

  // ===== SECTION 4: Climb Plan =====
  drawSectionHeader(ctx, "Section 4", "Your Climb Plan");

  // Next foothold (highlighted box)
  drawHighlightBox(ctx, "The Next Foothold", actions.nextFoothold);

  drawSubheader(ctx, "Quick Wins — This Week");
  actions.quickWins.forEach((s) => drawBullet(ctx, s));

  drawSubheader(ctx, "30-Day Moves");
  actions.thirtyDay.forEach((s) => drawBullet(ctx, s));

  drawSubheader(ctx, "60-Day Moves");
  actions.sixtyDay.forEach((s) => drawBullet(ctx, s));

  drawSubheader(ctx, "90-Day Moves");
  actions.ninetyDay.forEach((s) => drawBullet(ctx, s));

  ensureSpace(ctx, 40);

  // ===== SECTION 5: Carry-forward =====
  drawSectionHeader(ctx, "Section 5", "Why This Matters Beyond This Mountain");
  drawParagraph(ctx, current.carryForward);
  ensureSpace(ctx, 40);

  // ===== Expansion Warning (if applicable) =====
  if (expansionWarning) {
    ensureSpace(ctx, 120);
    drawWarningBox(ctx, expansionWarning.headline, expansionWarning.body);
  }

  // ===== Cross-Location Variance =====
  if (locationVariance && locationVariance.length > 0) {
    ensureSpace(ctx, 100);
    drawSectionHeader(ctx, "Your Data", "What Your Locations Are Telling You");
    drawParagraph(
      ctx,
      "Variance is the best diagnostic at this level. Here's where it's biggest:"
    );
    locationVariance.slice(0, 3).forEach((v) => drawVarianceItem(ctx, v));
  }

  // ===== SECTION 6: Next Mountain Preview =====
  if (target && targetMountain > currentMountain && currentMountain < 5) {
    ensureSpace(ctx, 150);
    const next = MOUNTAINS[currentMountain + 1];
    drawSectionHeader(ctx, "Section 6", "What's Coming Next", next.name);
    drawParagraph(ctx, next.whoLandsHere);
    drawSubheader(ctx, "What you'll work toward");
    next.summit.slice(0, 3).forEach((item) => drawBullet(ctx, item));
  }

  // ===== SECTION 7: Conversation Primer =====
  ensureSpace(ctx, 150);
  drawSectionHeader(ctx, "Section 7", "Your Next Conversation");
  drawParagraph(
    ctx,
    "When you meet with your GMM coach, these are the three things they'll want to dig into first:"
  );
  coachNotes.digInOn.forEach((item, i) =>
    drawNumberedBullet(ctx, i + 1, item)
  );

  // ===== COACH-ONLY ADDENDUM =====
  if (includeCoachNotes) {
    newPage(ctx);
    drawCoachAddendumCover(ctx, currentMountain, current);
    newPage(ctx);

    drawSectionHeader(ctx, "Coach Notes", "Red Flags");
    drawParagraph(
      ctx,
      "Things to probe on your first call. Based on what the owner reported.",
      true
    );
    coachNotes.redFlags.forEach((f) => drawBullet(ctx, f, "alert"));

    ensureSpace(ctx, 50);
    drawSectionHeader(ctx, "Coach Notes", "Coaching Angles");
    coachNotes.coachingAngles.forEach((a) => drawBullet(ctx, a));

    ensureSpace(ctx, 80);
    drawSectionHeader(ctx, "Coach Notes", "Which Metric to Lead With");
    drawHighlightBox(ctx, "Lead Metric", coachNotes.leadMetric);

    // Raw answers dump
    newPage(ctx);
    drawSectionHeader(ctx, "Coach Reference", "Raw Owner Responses");
    drawParagraph(ctx, "Full set of answers from the owner's submission.", true);
    drawRawAnswers(ctx, data, currentMountain);
  }

  // Footer on every page
  addFootersToAllPages(doc, includeCoachNotes);

  return doc;
}

// ============================================================
// DRAWING PRIMITIVES
// ============================================================
function newPage(ctx) {
  ctx.doc.addPage();
  ctx.pageNum++;
  ctx.y = MARGIN;
}

function ensureSpace(ctx, needed) {
  if (ctx.y + needed > PAGE_H - MARGIN - 30) {
    newPage(ctx);
  }
}

function setFill(ctx, color) {
  ctx.doc.setFillColor(color[0], color[1], color[2]);
}
function setText(ctx, color) {
  ctx.doc.setTextColor(color[0], color[1], color[2]);
}
function setDraw(ctx, color) {
  ctx.doc.setDrawColor(color[0], color[1], color[2]);
}

function drawCover(ctx, current, currentMountain, targetMountain, goal, isCoach) {
  const { doc } = ctx;

  // Background
  setFill(ctx, COLORS.bgLight);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top accent bars
  setFill(ctx, COLORS.yellow);
  doc.rect(MARGIN, 80, 80, 6, "F");
  setFill(ctx, COLORS.blue);
  doc.rect(MARGIN + 84, 80, CONTENT_W - 84, 6, "F");

  // GMM Eyebrow
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(ctx, COLORS.blue);
  doc.text("GYM MEMBER MACHINE", MARGIN, 120);

  // Title
  doc.setFontSize(48);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.navy);
  doc.text("THE MOUNTAIN", MARGIN, 200);
  doc.text("FRAMEWORK", MARGIN, 250);

  // Coach addendum label
  if (isCoach) {
    setFill(ctx, COLORS.yellow);
    doc.rect(MARGIN, 280, 200, 30, "F");
    doc.setFontSize(11);
    setText(ctx, COLORS.navy);
    doc.text("COACH VERSION", MARGIN + 14, 300);
  }

  // Diagnosis box
  setFill(ctx, COLORS.bgWhite);
  setDraw(ctx, COLORS.navy);
  doc.setLineWidth(1);
  doc.rect(MARGIN, 360, CONTENT_W, 200, "FD");

  // Side accent
  setFill(ctx, COLORS.blue);
  doc.rect(MARGIN, 360, 6, 200, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.blue);
  doc.text("YOUR DIAGNOSIS", MARGIN + 30, 395);

  doc.setFontSize(28);
  setText(ctx, COLORS.navy);
  doc.text(current.name.toUpperCase(), MARGIN + 30, 430, { maxWidth: CONTENT_W - 60 });

  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  setText(ctx, COLORS.stoneText);
  const taglineLines = doc.splitTextToSize(current.tagline, CONTENT_W - 60);
  doc.text(taglineLines, MARGIN + 30, 470);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setText(ctx, COLORS.stoneLight);
  doc.text("CURRENT", MARGIN + 30, 520);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.navy);
  doc.text(`Mountain ${currentMountain}`, MARGIN + 30, 540);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.stoneLight);
  doc.text("GOAL", MARGIN + 250, 520);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.navy);
  const goalText = doc.splitTextToSize(GOAL_LABELS[goal] || "Not specified", 250);
  doc.text(goalText, MARGIN + 250, 540);

  // Footer note
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.stoneLight);
  doc.text(
    isCoach
      ? "Coach version — includes red flags, coaching angles, and the owner's raw responses."
      : "Your personal diagnostic. Share this with your GMM coach before your next call.",
    MARGIN,
    PAGE_H - 80,
    { maxWidth: CONTENT_W }
  );

  ctx.y = PAGE_H - MARGIN;
}

function drawCoachAddendumCover(ctx, currentMountain, current) {
  const { doc } = ctx;
  setFill(ctx, COLORS.navy);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  setFill(ctx, COLORS.yellow);
  doc.rect(MARGIN, 120, 80, 6, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.yellow);
  doc.text("FOR THE COACH", MARGIN, 160);

  doc.setFontSize(40);
  setText(ctx, COLORS.bgWhite);
  doc.text("COACHING", MARGIN, 240);
  doc.text("NOTES", MARGIN, 290);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.bgLight);
  doc.text(
    `Mountain ${currentMountain} — ${current.name}`,
    MARGIN,
    330
  );

  doc.setFontSize(11);
  setText(ctx, COLORS.bgLight);
  const intro = doc.splitTextToSize(
    "What follows is for you — the coach. Red flags to probe on the first call, coaching angles for this specific mountain, the lead metric to anchor your conversation around, and the owner's raw responses for reference.",
    CONTENT_W
  );
  doc.text(intro, MARGIN, 400);

  ctx.y = PAGE_H - MARGIN;
}

function drawSectionHeader(ctx, eyebrow, title, subtitle) {
  ensureSpace(ctx, 80);
  const { doc } = ctx;

  // Blue tab accent
  setFill(ctx, COLORS.blue);
  doc.rect(MARGIN, ctx.y, 3, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setText(ctx, COLORS.blue);
  doc.text(eyebrow.toUpperCase(), MARGIN + 12, ctx.y + 12);

  ctx.y += 24;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.navy);
  const titleLines = doc.splitTextToSize(title.toUpperCase(), CONTENT_W);
  doc.text(titleLines, MARGIN, ctx.y);
  ctx.y += titleLines.length * 24;

  if (subtitle) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "italic");
    setText(ctx, COLORS.stoneText);
    const subLines = doc.splitTextToSize(subtitle, CONTENT_W);
    doc.text(subLines, MARGIN, ctx.y);
    ctx.y += subLines.length * 16;
  }

  ctx.y += 8;
}

function drawSubheader(ctx, text) {
  ensureSpace(ctx, 40);
  const { doc } = ctx;
  ctx.y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.stoneLight);
  doc.text(text.toUpperCase(), MARGIN, ctx.y);
  ctx.y += 16;
}

function drawParagraph(ctx, text, smaller = false) {
  if (!text) return;
  ensureSpace(ctx, 60);
  const { doc } = ctx;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(smaller ? 10 : 11);
  setText(ctx, COLORS.stoneText);
  const lines = doc.splitTextToSize(text, CONTENT_W);
  lines.forEach((line) => {
    ensureSpace(ctx, 16);
    doc.text(line, MARGIN, ctx.y);
    ctx.y += smaller ? 13 : 15;
  });
  ctx.y += 6;
}

function drawBullet(ctx, text, icon = "arrow") {
  if (!text) return;
  ensureSpace(ctx, 30);
  const { doc } = ctx;

  const markerColor =
    icon === "alert" ? COLORS.rose : icon === "flag" ? COLORS.blue : COLORS.blue;
  const marker = icon === "flag" ? "›" : icon === "alert" ? "!" : "→";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(ctx, markerColor);
  doc.text(marker, MARGIN, ctx.y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText(ctx, COLORS.stoneText);
  const lines = doc.splitTextToSize(text, CONTENT_W - 18);
  lines.forEach((line, i) => {
    ensureSpace(ctx, 16);
    doc.text(line, MARGIN + 18, ctx.y);
    if (i < lines.length - 1) ctx.y += 14;
  });
  ctx.y += 18;
}

function drawNumberedBullet(ctx, num, text) {
  ensureSpace(ctx, 30);
  const { doc } = ctx;

  // Number badge
  setFill(ctx, COLORS.blue);
  doc.circle(MARGIN + 9, ctx.y - 4, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(ctx, COLORS.bgWhite);
  doc.text(String(num), MARGIN + 9, ctx.y - 1, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText(ctx, COLORS.stoneText);
  const lines = doc.splitTextToSize(text, CONTENT_W - 28);
  lines.forEach((line, i) => {
    ensureSpace(ctx, 16);
    doc.text(line, MARGIN + 28, ctx.y);
    if (i < lines.length - 1) ctx.y += 14;
  });
  ctx.y += 22;
}

function drawCallout(ctx, label, text, accent, isQuote = false) {
  if (!text) return;
  ensureSpace(ctx, 80);
  const { doc } = ctx;
  const startY = ctx.y;

  // Calculate height
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, CONTENT_W - 30);
  const boxH = 28 + lines.length * 14 + 12;

  // Background
  setFill(ctx, isQuote ? [239, 246, 255] : [254, 252, 232]);
  doc.rect(MARGIN, ctx.y, CONTENT_W, boxH, "F");

  // Left accent bar
  setFill(ctx, accent);
  doc.rect(MARGIN, ctx.y, 4, boxH, "F");

  // Label
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.stoneLight);
  doc.text(label.toUpperCase(), MARGIN + 16, ctx.y + 16);

  // Body
  doc.setFontSize(11);
  doc.setFont("helvetica", isQuote ? "italic" : "normal");
  setText(ctx, COLORS.navy);
  let textY = ctx.y + 32;
  lines.forEach((line) => {
    doc.text(line, MARGIN + 16, textY);
    textY += 14;
  });

  ctx.y += boxH + 14;
}

function drawHighlightBox(ctx, label, text) {
  ensureSpace(ctx, 100);
  const { doc } = ctx;
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(text, CONTENT_W - 40);
  const boxH = 30 + lines.length * 16 + 16;

  setFill(ctx, COLORS.blue);
  doc.rect(MARGIN, ctx.y, CONTENT_W, boxH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setText(ctx, [191, 219, 254]); // blue-200
  doc.text(label.toUpperCase(), MARGIN + 20, ctx.y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setText(ctx, COLORS.bgWhite);
  let textY = ctx.y + 40;
  lines.forEach((line) => {
    doc.text(line, MARGIN + 20, textY);
    textY += 16;
  });

  ctx.y += boxH + 14;
}

function drawWarningBox(ctx, headline, body) {
  ensureSpace(ctx, 120);
  const { doc } = ctx;
  doc.setFontSize(11);
  const bodyLines = doc.splitTextToSize(body, CONTENT_W - 30);
  const headLines = doc.splitTextToSize(headline, CONTENT_W - 30);
  const boxH = 30 + headLines.length * 20 + bodyLines.length * 14 + 20;

  setFill(ctx, [254, 243, 199]); // amber-100
  setDraw(ctx, [217, 119, 6]); // amber-600
  doc.setLineWidth(1.5);
  doc.rect(MARGIN, ctx.y, CONTENT_W, boxH, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.amber);
  doc.text("⚠  IMPORTANT", MARGIN + 16, ctx.y + 18);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setText(ctx, COLORS.navy);
  let hy = ctx.y + 38;
  headLines.forEach((l) => {
    doc.text(l, MARGIN + 16, hy);
    hy += 20;
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.stoneText);
  let by = hy + 4;
  bodyLines.forEach((l) => {
    doc.text(l, MARGIN + 16, by);
    by += 14;
  });

  ctx.y += boxH + 14;
}

function drawInfrastructureSummary(ctx, inPlace, partial, missing) {
  const { doc } = ctx;
  ensureSpace(ctx, 200);

  const colW = (CONTENT_W - 20) / 3;
  const startY = ctx.y;

  drawInfraColumn(
    ctx,
    "SOLID",
    inPlace,
    COLORS.emerald,
    [209, 250, 229],
    MARGIN,
    startY,
    colW
  );
  drawInfraColumn(
    ctx,
    "PARTIAL",
    partial,
    COLORS.amber,
    [254, 243, 199],
    MARGIN + colW + 10,
    startY,
    colW
  );
  drawInfraColumn(
    ctx,
    "MISSING",
    missing,
    COLORS.rose,
    [254, 226, 226],
    MARGIN + (colW + 10) * 2,
    startY,
    colW
  );

  // Calculate max height used
  const maxItems = Math.max(inPlace.length, partial.length, missing.length);
  const colHeight = 50 + maxItems * 14;
  ctx.y = startY + colHeight + 16;
}

function drawInfraColumn(ctx, label, items, accent, bg, x, y, w) {
  const { doc } = ctx;
  const maxItems = Math.max(items.length, 1);
  const h = 50 + maxItems * 14;

  setFill(ctx, bg);
  doc.rect(x, y, w, h, "F");

  // Top border
  setFill(ctx, accent);
  doc.rect(x, y, w, 4, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setText(ctx, accent);
  doc.text(label, x + 10, y + 22);

  doc.setFontSize(11);
  doc.text(`${items.length}`, x + w - 20, y + 22);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setText(ctx, accent);
  let textY = y + 42;
  items.forEach((item) => {
    const lines = doc.splitTextToSize(`· ${item.label}`, w - 20);
    lines.forEach((line) => {
      doc.text(line, x + 10, textY);
      textY += 10;
    });
    textY += 2;
  });
}

function drawVarianceItem(ctx, v) {
  ensureSpace(ctx, 60);
  const { doc } = ctx;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setText(ctx, v.isHighVariance ? COLORS.rose : COLORS.amber);
  const label = `${METRIC_LABELS[v.metric].toUpperCase()}${v.isHighVariance ? " — HIGH VARIANCE" : ""}`;
  doc.text(label, MARGIN, ctx.y);
  ctx.y += 14;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.stoneText);
  const text = `${v.best} (${v.bestValue}) vs. ${v.worst} (${v.worstValue}). Spread: ${v.spread.toFixed(1)} (${v.spreadPct.toFixed(0)}% variance).`;
  const lines = doc.splitTextToSize(text, CONTENT_W);
  lines.forEach((line) => {
    doc.text(line, MARGIN, ctx.y);
    ctx.y += 13;
  });
  ctx.y += 10;
}

function drawRawAnswers(ctx, data, currentMountain) {
  const { doc } = ctx;
  ensureSpace(ctx, 40);

  drawSubheader(ctx, "Basics");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setText(ctx, COLORS.stoneText);
  doc.text(`Locations: ${data.basics.locations}`, MARGIN, ctx.y);
  ctx.y += 13;
  doc.text(`Years in business: ${data.basics.years_in_business}`, MARGIN, ctx.y);
  ctx.y += 13;
  doc.text(`Active members: ${data.basics.member_count}`, MARGIN, ctx.y);
  ctx.y += 13;
  doc.text(`Long-term goal: ${GOAL_LABELS[data.goal] || "—"}`, MARGIN, ctx.y);
  ctx.y += 18;

  // Staff
  drawSubheader(ctx, "Team Composition");
  const staffEntries = Object.entries(data.staff || {}).filter(
    ([, v]) => parseInt(v) > 0
  );
  if (staffEntries.length === 0) {
    doc.text("No staff entered.", MARGIN, ctx.y);
    ctx.y += 14;
  } else {
    staffEntries.forEach(([role, count]) => {
      ensureSpace(ctx, 16);
      doc.text(`· ${role.replace(/_/g, " ")}: ${count}`, MARGIN, ctx.y);
      ctx.y += 13;
    });
  }
  ctx.y += 8;

  // Diagnostic answers
  drawSubheader(ctx, "Diagnostic Responses");
  const questions = DIAGNOSTICS[currentMountain] || [];
  questions.forEach((q) => {
    ensureSpace(ctx, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setText(ctx, COLORS.navy);
    const qLines = doc.splitTextToSize(`Q: ${q.question}`, CONTENT_W);
    qLines.forEach((l) => {
      ensureSpace(ctx, 14);
      doc.text(l, MARGIN, ctx.y);
      ctx.y += 12;
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(ctx, COLORS.stoneText);
    const answer = data.diagnostic[q.id];
    let answerText = "—";
    if (Array.isArray(answer)) answerText = answer.join(", ");
    else if (answer) answerText = String(answer);

    const aLines = doc.splitTextToSize(`A: ${answerText}`, CONTENT_W);
    aLines.forEach((l) => {
      ensureSpace(ctx, 14);
      doc.text(l, MARGIN, ctx.y);
      ctx.y += 12;
    });
    ctx.y += 6;
  });
}

function addFootersToAllPages(doc, isCoach) {
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 113, 108);
    doc.text(
      `GMM Mountain Framework${isCoach ? " · Coach Version" : ""}`,
      MARGIN,
      PAGE_H - 25
    );
    doc.text(`Page ${i} of ${total}`, PAGE_W - MARGIN, PAGE_H - 25, {
      align: "right",
    });
  }
}

// ============================================================
// PUBLIC API
// ============================================================
export async function generateOwnerPDF(args) {
  const doc = buildPDF({ ...args, includeCoachNotes: false });
  const filename = `mountain-framework-${MOUNTAINS[args.currentMountain].name
    .toLowerCase()
    .replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}

export async function generateCoachPDF(args) {
  const doc = buildPDF({ ...args, includeCoachNotes: true });
  const filename = `mountain-framework-coach-${MOUNTAINS[args.currentMountain].name
    .toLowerCase()
    .replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}
