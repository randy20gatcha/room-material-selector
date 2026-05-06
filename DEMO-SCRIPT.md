# Demo Script — Room Material Selector

A read-aloud walkthrough you can use while screen-sharing the running app. Roughly **3–4 minutes** at a natural pace. Stage cues in `[brackets]` tell you what to click or point to.

---

## 1. Opening (~20s)

> "Hi — I'd like to walk you through a small **Vue 3 + TypeScript** prototype I put together. It's a lightweight tool that lets a user pick a room type, swap materials and furniture for that room, and then generate an AI-style design summary of their choices.
>
> It's not meant to be a full interior design platform — my goal was to demonstrate clean component architecture, type-safe state, and a touch of rule-based intelligence, all in a small, deployable footprint."

---

## 2. UI Walkthrough (~90s)

`[Click the Kitchen tile]`

> "At the top I have five room types — kitchen, bathroom, living room, bedroom, and laundry. I'll start with the kitchen."

`[Point to the Materials & furniture panel]`

> "Each room exposes a small list of selection slots — flooring, wall finish, benchtop, cabinetry, appliance tier, and lighting. Each one is a dropdown, and as soon as I pick something, a coloured cost pill appears next to it — green for low-cost, amber for medium, red for high."

`[Pick: Oak Timber flooring → White Paint walls → Marble benchtop]`

> "I've picked oak timber flooring, white paint walls, and a marble benchtop. Watch the panel on the right — it updates live as I make changes."

`[Point to Current selections card]`

> "This card shows my current selections — what's chosen, the tone of each option, and what's still missing. Right now I haven't picked cabinetry, an appliance tier, or lighting yet, so those are flagged."

---

## 3. AI Summary (~60s)

`[Click "Generate AI Summary"]`

> "Now I'll click **Generate AI Summary**. This isn't calling an external AI service — everything runs locally in the browser using a rule-based engine. But the output is structured the way you'd expect from a real design assistant."

`[Point to the AI output]`

> "It gives me an overall cost tier, lists what I've selected, what's missing, and surfaces design notes. For example, it's flagging that marble can lift the budget significantly. And because I haven't picked lighting yet, the top recommendation is to add one — the room would feel unfinished without it."

`[Switch to Bedroom → pick Walnut flooring → Charcoal walls → Generate AI Summary]`

> "Let me show another rule. I'll switch to the bedroom, pick walnut flooring and charcoal walls — both are dark-toned. When I regenerate the summary, it warns me the room may feel dim and suggests lighter walls or extra lighting. That's the kind of compatibility check that's easy to add as the catalog grows."

---

## 4. Tech & Architecture (~60s)

> "Under the hood — **Vue 3** with the Composition API, **TypeScript** in strict mode, and **Vite** as the build tool. No CSS framework — just plain CSS variables for theming, which keeps the bundle small. The whole production build is about 80 kilobytes gzipped."

> "There are four components: a `RoomSelector`, a `MaterialSelector`, a live `SelectionSummary`, and the `AISummary` card. They all communicate through a single `App.vue` that holds per-room selections in a typed state object — so when I switch rooms, my work in the previous room isn't lost."

> "All the room data — rooms, items, options, plus metadata like cost tier and tone — lives in a single typed catalog at `src/data/roomData.ts`. Adding a new room or material is just adding entries to that file; the UI picks them up automatically."

> "The AI logic in `src/data/aiSummary.ts` is a pure function. It takes the room id and selections, and returns a structured summary object. Because it's pure, it's trivial to unit test, and easy to swap for a real LLM call later with the same input and output shape."

---

## 5. Wrap-up (~20s)

> "It's set up to deploy on **Vercel** as a static site — the config is already in the repo, so it builds and deploys in under a minute.
>
> The whole project is small enough to read in one sitting, but the structure scales: more rooms, more materials, more AI rules — or eventually a real LLM call — all slot in cleanly. Happy to walk through any part in more detail."

---

## Quick reference — talking points by section

If you'd rather adlib, these are the beats to hit:

| Section | Key beats |
|---|---|
| Opening | Vue 3 + TypeScript prototype, pick a room, swap materials, AI summary |
| UI walkthrough | 5 room types, per-room slots, live cost pills, live summary panel |
| AI summary | Browser-only rule engine, cost tier, marble flag, missing-lighting nudge, dark-on-dark warning |
| Architecture | 4 components, single typed state, data-driven catalog, pure-function AI |
| Wrap-up | Vercel deploy, ~80 KB bundle, easy to extend or swap in a real LLM |

## Optional Q&A prep

- **"Why rule-based and not a real LLM?"** Keeps the prototype self-contained, deterministic, and free to run. The function signature matches what an LLM call would look like, so swapping it in is a one-file change.
- **"How would you scale this?"** Move the catalog to a backend, add image previews per option, persist selections per user, and replace the rule engine with an LLM that takes the same selections payload.
- **"Why no Tailwind / UI library?"** The prototype is small enough that plain CSS keeps the bundle tiny and the styling easy to read. I'd reach for a library on a larger project.
- **"Why TypeScript strict?"** It catches `RoomId` typos and missing item keys at compile time — important once the catalog grows.
- **"How are state updates handled?"** Selections are stored per-room in a single reactive map in `App.vue`. The components stay presentational — they emit events upward and receive props downward.
