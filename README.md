# GMM Mountain Framework

A self-serve diagnostic for gym owners. Determines which of the 5 mountains they're on, where they want to go, and gives layered action steps to make the climb.

Built for [Gym Member Machine](https://www.gymmembermachine.com) coaches and the owners they serve.

---

## What it does

1. Asks the owner basic questions (locations, team, goal)
2. Diagnoses their current mountain using structural + behavioral inputs
3. Checks what infrastructure they already have in place
4. Probes deeper with mountain-specific diagnostics
5. (Multi-location only) Captures cross-location data to surface variance
6. Generates a personalized 8-section report with:
   - Where they are
   - What's in place / what's missing
   - What the summit looks like
   - Layered climb plan (next foothold → quick wins → 30/60/90)
   - Why this work matters beyond this mountain
   - Preview of the next mountain
   - Visual of their climb (current → target)
   - Conversation primer for their next coach call
7. Lets them download an **Owner PDF** to keep
8. Lets them download a **Coach PDF** with extra notes: red flags, coaching angles, lead metric, and the owner's raw answers

Everything runs in the browser. No backend, no database, no user data leaves the device.

---

## Running locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

---

## Building for production

```bash
npm run build
```

Static output lands in `dist/`.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), click **New Project**, import the repo
3. Vercel auto-detects Vite. Hit **Deploy**. Done.
4. Every push to `main` auto-deploys after that

No env variables, no build settings to tweak.

---

## File map

```
src/
├── App.jsx              ← main UI: survey + results
├── main.jsx             ← React entry point
├── index.css            ← Tailwind directives
├── mountains.js         ← 5 mountain definitions + infrastructure + diagnostics
├── actionSteps.js       ← climb plans + coach notes per mountain
├── diagnosis.js         ← routing logic: which mountain are you on?
└── pdfGenerator.js      ← jsPDF-powered owner + coach reports

index.html               ← Vite entry
tailwind.config.js
postcss.config.js
vite.config.js
package.json
```

---

## Editing content

The bulk of the framework lives in three files:

- **`src/mountains.js`** — mountain definitions (name, tagline, "who lands here", summit checklist, identity shift, carry-forward language), per-mountain infrastructure checklist, per-mountain diagnostic questions
- **`src/actionSteps.js`** — next foothold, quick wins, 30/60/90-day plans, and coach-only notes (red flags, coaching angles, lead metric, what to dig into) for each mountain
- **`src/diagnosis.js`** — routing logic (which mountain), goal → mountain mapping, expansion warnings, cross-location variance analysis

To tweak wording, just edit those files. The PDF and UI both read from them directly.

---

## Stack

- **Vite** — fast dev server, zero-config build
- **React 18** — UI
- **Tailwind CSS** — styling
- **jsPDF** — client-side PDF generation
- **lucide-react** — icons

---

## License

Internal use — Gym Member Machine.
