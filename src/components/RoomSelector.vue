<script setup lang="ts">
import { ROOMS, type RoomId } from '../data/roomData'

defineProps<{
  modelValue: RoomId | ''
}>()

defineEmits<{
  (e: 'update:modelValue', value: RoomId): void
}>()

// Inline SVG icon paths so we don't pull in an icon library.
const ICONS: Record<string, string> = {
  utensils: 'M7 2v8a3 3 0 0 0 3 3v9M7 2v8a3 3 0 0 1-3 3v9M11 2v8M17 2c-1.1 0-2 .9-2 2v8h4V4c0-1.1-.9-2-2-2zM17 12v10',
  droplet:  'M12 2.5s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z',
  sofa:     'M3 11v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M3 11a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v3h10v-3a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2M7 14h10',
  bed:      'M3 7v12M21 19V11a3 3 0 0 0-3-3H3M3 14h18M7 11h4',
  shirt:    'M16 3h-3l-1 2-1-2H8L4 6l2 3h2v11h8V9h2l2-3z'
}
</script>

<template>
  <section class="card">
    <header class="card-head">
      <h2>1. Choose a room</h2>
      <p>Pick the space you'd like to design.</p>
    </header>

    <div class="room-grid">
      <button
        v-for="room in ROOMS"
        :key="room.id"
        type="button"
        class="room-tile"
        :class="{ active: modelValue === room.id }"
        @click="$emit('update:modelValue', room.id)"
      >
        <svg
          class="room-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path :d="ICONS[room.icon]" />
        </svg>
        <span>{{ room.name }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.room-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
}

.room-tile:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.room-tile.active {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary);
}

.room-icon {
  width: 28px;
  height: 28px;
}
</style>
