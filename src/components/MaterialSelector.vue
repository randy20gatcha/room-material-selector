<script setup lang="ts">
import { computed } from 'vue'
import {
  ROOM_ITEMS,
  ROOMS,
  type CostTier,
  type RoomId,
  type Selections
} from '../data/roomData'

const props = defineProps<{
  roomId: RoomId | ''
  selections: Selections
}>()

const emit = defineEmits<{
  (e: 'update:item', payload: { key: string; optionId: string }): void
  (e: 'reset'): void
}>()

const items = computed(() => (props.roomId ? ROOM_ITEMS[props.roomId] : []))
const roomName = computed(() => ROOMS.find(r => r.id === props.roomId)?.name || '')

function setSelection(itemKey: string, optionId: string): void {
  emit('update:item', { key: itemKey, optionId })
}

function costClass(cost: CostTier | undefined): string {
  return cost ? `cost-pill cost-${cost}` : 'cost-pill'
}
</script>

<template>
  <section class="card">
    <header class="card-head with-action">
      <div>
        <h2>2. Materials &amp; furniture</h2>
        <p v-if="roomId">Configure your {{ roomName.toLowerCase() }}.</p>
        <p v-else>Choose a room above to see options.</p>
      </div>
      <button v-if="roomId" type="button" class="btn-ghost" @click="$emit('reset')">
        Reset
      </button>
    </header>

    <div v-if="!roomId" class="empty-state">
      No room selected yet.
    </div>

    <div v-else class="item-list">
      <div v-for="item in items" :key="item.key" class="item-row">
        <label class="item-label" :for="`select-${item.key}`">
          {{ item.label }}
        </label>
        <div class="select-wrap">
          <select
            :id="`select-${item.key}`"
            class="select"
            :value="selections[item.key] || ''"
            @change="setSelection(item.key, ($event.target as HTMLSelectElement).value)"
          >
            <option value="">— Not selected —</option>
            <option
              v-for="opt in item.options"
              :key="opt.id"
              :value="opt.id"
            >
              {{ opt.label }}
            </option>
          </select>

          <span
            v-if="selections[item.key]"
            :class="costClass(item.options.find(o => o.id === selections[item.key])?.cost)"
          >
            {{ item.options.find(o => o.id === selections[item.key])?.cost }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 10px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.item-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0.75rem;
  align-items: center;
}

.item-label {
  font-weight: 500;
  color: var(--text);
}

.select-wrap {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.select {
  flex: 1;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.95rem;
  transition: border-color 0.15s ease;
}

.select:focus {
  outline: none;
  border-color: var(--primary);
}

.cost-pill {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.cost-low    { background: #dcfce7; color: #166534; }
.cost-medium { background: #fef3c7; color: #92400e; }
.cost-high   { background: #fee2e2; color: #991b1b; }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.btn-ghost:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 600px) {
  .item-row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}
</style>
