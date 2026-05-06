<script setup lang="ts">
import { computed } from 'vue'
import {
  ROOMS,
  resolveSelections,
  type RoomId,
  type Selections
} from '../data/roomData'

const props = defineProps<{
  roomId: RoomId | ''
  selections: Selections
}>()

const roomName = computed(() => ROOMS.find(r => r.id === props.roomId)?.name || '—')
const rows = computed(() => (props.roomId ? resolveSelections(props.roomId, props.selections) : []))
const filledCount = computed(() => rows.value.filter(r => r.selected).length)
</script>

<template>
  <section class="card">
    <header class="card-head">
      <h2>3. Current selections</h2>
      <p v-if="roomId">{{ filledCount }} of {{ rows.length }} items selected.</p>
      <p v-else>Live summary will appear once a room is chosen.</p>
    </header>

    <div class="summary-room">
      <span class="summary-room-label">Room</span>
      <strong>{{ roomName }}</strong>
    </div>

    <ul v-if="roomId" class="summary-list">
      <li v-for="row in rows" :key="row.key" class="summary-row">
        <span class="summary-key">{{ row.label }}</span>
        <span v-if="row.selected" class="summary-value">
          {{ row.selected.label }}
          <em class="tone-tag">{{ row.selected.tone }}</em>
        </span>
        <span v-else class="summary-value muted">Not selected</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.summary-room {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: var(--primary-soft);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.summary-room-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: var(--primary);
  font-weight: 600;
}

.summary-room strong {
  font-size: 1.05rem;
  color: var(--text);
}

.summary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.95rem;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-key {
  color: var(--text-muted);
}

.summary-value {
  font-weight: 500;
  text-align: right;
}

.summary-value.muted {
  color: var(--text-muted);
  font-style: italic;
  font-weight: 400;
}

.tone-tag {
  font-style: normal;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin-left: 0.4rem;
}
</style>
