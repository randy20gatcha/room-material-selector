# Room Material Selector

## Project overview

A lightweight Vue 3 + TypeScript prototype that lets a user:

- Pick a room type — kitchen, bathroom, living room, bedroom, or laundry.
- Configure a small list of mock materials and furniture for that room (flooring, wall finish, benchtop, cabinetry, sofa, table, chair, bed, lighting, etc.).
- See a live summary of the room and its current selections.
- Click **Generate AI Summary** for a rule-based, AI-style write-up — overall cost tier, missing items, design notes, and recommended next actions.

The "AI" is a deterministic rule engine that runs entirely in the browser. No external API calls, no API keys.

## Technologies used

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript** (strict mode)
- **Vite** (dev server + production bundler)
- **vue-tsc** (type-checking before build)
- **Plain CSS** with CSS variables (no Tailwind / no UI library)
- **Vercel** for deployment (config included)

## Setup instructions

Prerequisites:

- Node.js **18+** and npm (check with `node -v` and `npm -v`)
- Git (only if cloning from a repo)

Steps:

```bash
# 1. Get the project
git clone <your-repo-url> room-material-selector
cd room-material-selector

# 2. Install dependencies
npm install
```

That's it — no environment variables, no `.env` file, no backend to configure.

## How to run the application locally

```bash
npm run dev # Start dev server (Vite, hot reload) # Open http://localhost:5173

```

## Assumptions made

- **The AI is mocked.** A pure function in `src/data/aiSummary.ts` returns a structured summary. The shape matches what a real LLM call would return, so swapping it for a serverless `/api/summarize` endpoint is a one-file change.
- **The catalog is illustrative.** Materials, furniture, and cost tiers (low / medium / high) are demo data. There are no real prices, suppliers, or images.
- **Cost tiers are relative, not absolute.** "High" means premium-tier within the catalog; the engine averages tiers to produce an overall tier, not a dollar figure.
- **Session-only state.** Selections live in memory. Reloading the page clears them. A real app would persist per user.
- **Single user, single browser tab.** No auth, no multi-user collaboration.
- **Per-room isolation.** Switching rooms preserves work in the previous room within the same session.
- **Modern browsers only.** Targeted at evergreen Chrome / Firefox / Safari / Edge — no IE polyfills.

## Simple testing instructions

There's no automated test suite yet. To verify the app manually:

1. Run `npm run dev` and open the local URL.
2. **Room switching** — Click each of the five room tiles. The selection panel on the left should swap to that room's items and the live summary on the right should update.
3. **Selection updates** — Pick options from the dropdowns. Each pick should:
   - Show a coloured cost pill (green / amber / red) next to the dropdown.
   - Update the _Current selections_ card on the right immediately.
4. **AI summary — basic** — Click **Generate AI Summary**. It should display headline, overall cost tier, selected items, missing items, issues, and recommendations.
5. **AI summary — rule checks** (each should produce the noted output):
   - Pick **marble** anywhere → the issues list flags marble's higher cost.
   - Leave **lighting** unselected → the recommendations list nudges you to add lighting first.
   - In the bedroom, pick **dark** flooring (e.g. walnut) **and** **dark** walls (e.g. charcoal) → issues list warns the room may feel dim.
   - Pick three or more high-cost options → issues list flags the premium fit-out.
   - Pick everything from a room → headline reads "scheme is complete" with the overall cost tier.
6. **Reset** — Click _Reset_ in the materials panel. All selections for the current room clear; other rooms keep their state.
7. **Responsive layout** — Resize the browser narrow (≤880 px). The two-column layout collapses into a single column.

## Limitations and possible improvements

Current limitations:

- The AI is rule-based, not a real model — it follows a small set of hand-written rules.
- No persistence — selections are lost on reload.
- No images or 3D previews — text labels only.
- No automated tests.
- The catalog is illustrative; not connected to any supplier data.
- No user accounts, sharing, or collaboration.

Possible improvements (in rough priority order):

- **Swap in a real LLM** via a Vercel serverless function that wraps Anthropic or OpenAI. The `Summary` interface stays the same — only `aiSummary.ts` and a new `api/summarize.ts` change.
- **Add automated tests** with Vitest for the rule engine (it's a pure function — easy to cover) and Vue Test Utils for component behaviour.
- **Persist selections** — start with `localStorage`, later move to a backend with named "design scenarios" the user can save and revisit.
- **Image previews** for each material/furniture option, even simple thumbnails.
- **Export** — generate a PDF or shareable link summarising the chosen scheme.
- **Room comparison** — view two rooms side-by-side or compare two saved scenarios.
- **Real catalog integration** — connect to a supplier API for live pricing and availability.
