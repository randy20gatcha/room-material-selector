<script setup lang="ts">
import { ref, watch } from 'vue'
import RoomSelector from './components/RoomSelector.vue'
import MaterialSelector from './components/MaterialSelector.vue'
import SelectionSummary from './components/SelectionSummary.vue'
import AISummary from './components/AISummary.vue'
import type { RoomId, Selections } from './data/roomData'

// Currently chosen room id (e.g. 'kitchen').
const roomId = ref<RoomId | ''>('')

// Per-room selections kept in a single map so a user can switch rooms
// without losing their work in another room.
//
// shape: { kitchen: { flooring: 'oak-timber', ... }, bathroom: {...}, ... }
const allSelections = ref<Record<string, Selections>>({})

function selectionsFor(id: RoomId | ''): Selections {
  if (!id) return {}
  if (!allSelections.value[id]) allSelections.value[id] = {}
  return allSelections.value[id]
}

// Make sure a bucket exists for whichever room is currently selected.
watch(
  roomId,
  (id) => {
    if (id && !allSelections.value[id]) allSelections.value[id] = {}
  },
  { immediate: true },
)

function handleItemUpdate({
  key,
  optionId,
}: {
  key: string
  optionId: string
}): void {
  if (!roomId.value) return
  const bucket = { ...selectionsFor(roomId.value) }
  if (optionId) bucket[key] = optionId
  else delete bucket[key]
  // Reactively replace the inner object so Vue picks up deletions.
  allSelections.value = { ...allSelections.value, [roomId.value]: bucket }
}

function handleReset(): void {
  if (!roomId.value) return
  allSelections.value = { ...allSelections.value, [roomId.value]: {} }
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="brand">
        <div class="brand-mark">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12 12 4l9 8" />
            <path d="M5 10v10h14V10" />
            <path d="M10 20v-6h4v6" />
          </svg>
        </div>
        <div>
          <h1>Room Material Selector</h1>
          <p>
            Pick a room, swap materials and furniture, then generate an AI
            design summary.
          </p>
        </div>
      </div>
    </header>

    <main class="layout">
      <div class="col">
        <RoomSelector v-model="roomId" />
        <MaterialSelector
          :room-id="roomId"
          :selections="selectionsFor(roomId)"
          @update:item="handleItemUpdate"
          @reset="handleReset"
        />
      </div>

      <div class="col">
        <SelectionSummary
          :room-id="roomId"
          :selections="selectionsFor(roomId)"
        />
        <AISummary
          :room-id="roomId"
          :selections="selectionsFor(roomId)"
        />
      </div>
    </main>

    <footer class="page-foot">
      <p>
        Prototype only — the AI summary is rule-based, runs locally(inside the
        application only).
      </p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.page-head {
  margin-bottom: 1.75rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.brand-mark svg {
  width: 24px;
  height: 24px;
}

.brand h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}

.brand p {
  margin: 0.2rem 0 0 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.page-foot {
  margin-top: 2.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 880px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
