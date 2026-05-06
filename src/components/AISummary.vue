<script setup lang="ts">
import { ref } from 'vue'
import { generateSummary, type Summary } from '../data/aiSummary'
import type { CostTier, RoomId, Selections } from '../data/roomData'

const props = defineProps<{
  roomId: RoomId | ''
  selections: Selections
}>()

const summary = ref<Summary | null>(null)
const loading = ref(false)

function run(): void {
  loading.value = true
  // Tiny artificial delay so the UI feels like work is happening.
  setTimeout(() => {
    summary.value = generateSummary(props.roomId, props.selections)
    loading.value = false
  }, 350)
}

function clear(): void {
  summary.value = null
}

function costClass(cost: CostTier | null | undefined): string {
  return cost ? `cost-pill cost-${cost}` : 'cost-pill'
}
</script>

<template>
  <section class="card ai-card">
    <header class="card-head with-action">
      <div>
        <h2>4. AI design summary</h2>
        <p>Rule-based mock — runs entirely in the browser.</p>
      </div>
      <div class="ai-actions">
        <button
          type="button"
          class="btn-primary"
          :disabled="!roomId || loading"
          @click="run"
        >
          <span v-if="loading">Analysing…</span>
          <span v-else>Generate AI Summary</span>
        </button>
        <button
          v-if="summary"
          type="button"
          class="btn-ghost"
          @click="clear"
        >
          Clear
        </button>
      </div>
    </header>

    <div v-if="!summary && !loading" class="empty-state">
      Make some selections, then generate a summary.
    </div>

    <div v-if="summary" class="ai-body">
      <div class="ai-headline">
        <p>{{ summary.headline }}</p>
        <span
          v-if="summary.overallCost"
          :class="costClass(summary.overallCost)"
        >
          Overall: {{ summary.overallCost }}
        </span>
      </div>

      <div v-if="summary.selected.length" class="ai-block">
        <h3>Selected</h3>
        <ul>
          <li v-for="row in summary.selected" :key="row.label">
            <strong>{{ row.label }}:</strong>
            {{ row.option.label }}
            <span :class="costClass(row.option.cost)">{{ row.option.cost }}</span>
          </li>
        </ul>
      </div>

      <div v-if="summary.missing.length" class="ai-block">
        <h3>Missing</h3>
        <ul>
          <li v-for="m in summary.missing" :key="m">{{ m }}</li>
        </ul>
      </div>

      <div v-if="summary.issues.length" class="ai-block">
        <h3>Things to note</h3>
        <ul class="bullet">
          <li v-for="issue in summary.issues" :key="issue">{{ issue }}</li>
        </ul>
      </div>

      <div v-if="summary.recommendations.length" class="ai-block">
        <h3>Recommended next actions</h3>
        <ul class="bullet">
          <li v-for="rec in summary.recommendations" :key="rec">{{ rec }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ai-card {
  border-top: 3px solid var(--primary);
}

.ai-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-ghost:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 10px;
}

.ai-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ai-headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: var(--primary-soft);
  border-radius: 10px;
  flex-wrap: wrap;
}

.ai-headline p {
  margin: 0;
  font-weight: 500;
  color: var(--text);
}

.ai-block h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.ai-block ul {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--text);
}

.ai-block ul.bullet li::marker {
  color: var(--primary);
}

.cost-pill {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
  margin-left: 0.4rem;
}

.cost-low    { background: #dcfce7; color: #166534; }
.cost-medium { background: #fef3c7; color: #92400e; }
.cost-high   { background: #fee2e2; color: #991b1b; }
</style>
