# Room Material Selector

A lightweight Vue 3 + **TypeScript** + Vite prototype where a user can:

- Select a room type (kitchen, bathroom, living room, bedroom, laundry).
- Change a small list of mock materials and furniture (flooring, wall finish, benchtop, cabinetry, sofa, table, chair, bed, lighting, etc.).
- See a live summary of the room and its current selections.
- Click **Generate AI Summary** to get a rule-based, AI-style write-up — cost tier, missing items, design issues, recommended next actions. No external AI service is used.

## Stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript (strict mode)
- Vite
- Plain CSS (no Tailwind / UI libraries — easy to read and modify)
- Ready to deploy to Vercel as a static site

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build         # type-check (vue-tsc) then bundle (vite build)
npm run preview       # optional — preview the production build
npm run type-check    # type-check only, no bundle
```

The production build lands in `dist/`.

## Deploy to Vercel

The repo already includes a `vercel.json`, so deployment is one of:

**Option A — Vercel Dashboard**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Import the repo on https://vercel.com.
3. Vercel auto-detects Vite. Defaults are fine:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel        # follow the prompts (link/create project)
vercel --prod # deploy production build
```

## Project layout

```
room-material-selector/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── env.d.ts
├── vite.config.ts
├── vercel.json
├── README.md
└── src/
    ├── main.ts
    ├── App.vue
    ├── style.css
    ├── components/
    │   ├── RoomSelector.vue
    │   ├── MaterialSelector.vue
    │   ├── SelectionSummary.vue
    │   └── AISummary.vue
    └── data/
        ├── roomData.ts     # rooms + items + options + metadata, fully typed
        └── aiSummary.ts    # rule-based mock AI engine, fully typed
```

## TypeScript notes

- Strict mode is on (`tsconfig.json` extends `@vue/tsconfig/tsconfig.dom.json`).
- The data layer exports the core types you'll likely reuse: `RoomId`, `Room`, `Item`, `Option`, `CostTier`, `Tone`, `Selections`, `ResolvedItem`.
- `aiSummary.ts` exports `Summary` and `SelectedRow` — the shape returned by `generateSummary()`.
- Components use the type-only form of `defineProps` / `defineEmits`:

```ts
defineProps<{ roomId: RoomId | ''; selections: Selections }>()
defineEmits<{ (e: 'reset'): void }>()
```

- `env.d.ts` has the Vite client reference and the `*.vue` shim so TypeScript understands `.vue` imports.

## How the mock AI works

`src/data/aiSummary.ts` is a pure function. It looks at the user's
selections and produces:

- An overall cost tier (low / medium / high) averaged from each pick.
- Issues — e.g. marble pushes cost up, dark flooring + dark walls feel
  dim, dark benchtop + dark cabinetry feels heavy, 3+ premium picks
  flagged.
- Missing items — anything the user hasn't chosen yet, with a strong
  recommendation when lighting is missing.
- Recommendations — next steps and palette tips.

To extend it, edit the rules in `generateSummary()` or add new option
metadata (cost tier, tone, tags) in `roomData.ts`.

## Adding rooms or items

Everything lives in `src/data/roomData.ts`:

- `ROOMS` — list of room ids, names, icons.
- `ROOM_ITEMS` — per room, the selection slots and the option list each
  slot offers.

Add a new option object with `cost`, `tone`, and any `tags` you want the
AI rules to look for, and it shows up in the UI automatically. If you
add a new `RoomId`, update the union type at the top of `roomData.ts`
and TypeScript will tell you everywhere else that needs an entry.
