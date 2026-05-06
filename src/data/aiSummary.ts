/**
 * Mock "AI" summary engine.
 *
 * Pure function — given a room and the user's selected options, returns
 * a structured summary the UI can render. No external API calls.
 */

import {
  ROOM_ITEMS,
  findOption,
  type CostTier,
  type Option,
  type RoomId,
  type Selections
} from './roomData'

const COST_WEIGHT: Record<CostTier, number> = { low: 1, medium: 2, high: 3 }

export interface SelectedRow {
  label: string
  option: Option
}

export interface Summary {
  headline: string
  overallCost: CostTier | null
  selected: SelectedRow[]
  missing: string[]
  issues: string[]
  recommendations: string[]
}

interface ResolvedSlot {
  key: string
  label: string
  option: Option | null
}

export function generateSummary(
  roomId: RoomId | '',
  selections: Selections
): Summary {
  if (!roomId) {
    return {
      headline: 'Pick a room to get started.',
      overallCost: null,
      selected: [],
      missing: [],
      issues: [],
      recommendations: ['Select a room type from the list to begin designing.']
    }
  }

  const itemDefs = ROOM_ITEMS[roomId] || []
  const roomLabel = roomId.replace('-', ' ')

  // Resolve every selection slot into either an option object or null.
  const resolved: ResolvedSlot[] = itemDefs.map(item => {
    const optionId = selections[item.key]
    const option = optionId ? findOption(roomId, item.key, optionId) : null
    return { key: item.key, label: item.label, option }
  })

  const selected = resolved.filter(
    (r): r is ResolvedSlot & { option: Option } => r.option !== null
  )
  const missing = resolved.filter(r => r.option === null)

  // ---- overall cost tier ----
  let overallCost: CostTier | null = null
  if (selected.length > 0) {
    const avg =
      selected.reduce((sum, r) => sum + COST_WEIGHT[r.option.cost], 0) / selected.length
    if (avg <= 1.4)      overallCost = 'low'
    else if (avg <= 2.3) overallCost = 'medium'
    else                 overallCost = 'high'
  }

  // ---- design / compatibility issues ----
  const issues: string[] = []

  // 1. Marble selection → flag premium cost.
  const marblePicks = selected.filter(r => r.option.tags.includes('marble'))
  if (marblePicks.length > 0) {
    const names = marblePicks
      .map(r => `${r.option.label} (${r.label.toLowerCase()})`)
      .join(', ')
    issues.push(`Marble can lift the budget significantly — you've chosen it for: ${names}.`)
  }

  // 2. Premium appliances → flag higher cost.
  const premiumAppliancePick = selected.find(r => r.option.tags.includes('premium'))
  if (premiumAppliancePick) {
    issues.push(
      'Premium appliances will push the overall kitchen cost up — make sure that fits the budget.'
    )
  }

  // 3. Dark flooring + dark wall finish → room may feel darker.
  const flooring = resolved.find(r => r.key === 'flooring')?.option ?? null
  const wall = resolved.find(r => r.key === 'wallFinish')?.option ?? null
  if (flooring && wall && flooring.tone === 'dark' && wall.tone === 'dark') {
    issues.push(
      'Both the flooring and wall finish are dark — the room may feel dim. Consider lighter walls or extra lighting.'
    )
  }

  // 4. Lots of high-cost picks → flag.
  const highCount = selected.filter(r => r.option.cost === 'high').length
  if (highCount >= 3) {
    issues.push(
      `${highCount} premium-tier finishes selected — expect the overall fit-out to land in the high-cost tier.`
    )
  }

  // 5. Cabinetry + benchtop tone clash (both very dark or matching marble).
  const benchtop = resolved.find(r => r.key === 'benchtop')?.option ?? null
  const cabinetry = resolved.find(r => r.key === 'cabinetry')?.option ?? null
  if (benchtop && cabinetry && benchtop.tone === 'dark' && cabinetry.tone === 'dark') {
    issues.push(
      'Dark benchtop paired with dark cabinetry can feel heavy — a lighter splashback or bright lighting helps balance it.'
    )
  }

  // ---- recommendations ----
  const recommendations: string[] = []

  // 6. Missing lighting is a strong recommendation.
  const lightingMissing = missing.find(r => r.key === 'lighting')
  if (lightingMissing) {
    recommendations.push('Add a lighting selection — the room feels unfinished without one.')
  }

  // 7. Anything else missing → recommend filling it in.
  missing
    .filter(r => r.key !== 'lighting')
    .forEach(r =>
      recommendations.push(
        `Choose a ${r.label.toLowerCase()} to complete the ${roomLabel} scheme.`
      )
    )

  // 8. Soft styling tip if everything is the same tone.
  const tones = new Set(
    selected.map(r => r.option.tone).filter(t => t && t !== 'neutral')
  )
  if (selected.length >= 3 && tones.size === 1) {
    const onlyTone = [...tones][0]
    recommendations.push(
      `The palette is heavily ${onlyTone}-toned — consider one contrasting accent piece for visual interest.`
    )
  }

  // 9. If no selections at all yet.
  if (selected.length === 0) {
    recommendations.push(
      `Start by picking a flooring and wall finish to set the ${roomLabel}'s tone.`
    )
  }

  // ---- headline ----
  let headline: string
  if (selected.length === 0) {
    headline = `No selections yet for the ${roomLabel}.`
  } else if (missing.length === 0) {
    headline = `Your ${roomLabel} scheme is complete — overall cost tier: ${overallCost}.`
  } else {
    headline = `${selected.length} of ${resolved.length} items selected for the ${roomLabel} — overall cost tier so far: ${overallCost}.`
  }

  return {
    headline,
    overallCost,
    selected: selected.map(r => ({ label: r.label, option: r.option })),
    missing: missing.map(r => r.label),
    issues,
    recommendations
  }
}
