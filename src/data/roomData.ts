/**
 * Room + item catalog used by the prototype.
 *
 * Each option carries lightweight metadata (cost tier, tone, tags) so the
 * mock AI summary can reason about the user's selections without calling
 * a real AI service.
 */

// ---------- Types ----------

export type CostTier = 'low' | 'medium' | 'high'
export type Tone = 'light' | 'neutral' | 'dark'
export type RoomId = 'kitchen' | 'bathroom' | 'living-room' | 'bedroom' | 'laundry'

export interface Option {
  id: string
  label: string
  cost: CostTier
  tone: Tone
  tags: string[]
}

export interface Item {
  key: string
  label: string
  options: Option[]
}

export interface Room {
  id: RoomId
  name: string
  icon: 'utensils' | 'droplet' | 'sofa' | 'bed' | 'shirt'
}

/** Per-item selection map. Values are option ids. */
export type Selections = Record<string, string>

/** Item resolved against its currently-selected option (if any). */
export interface ResolvedItem {
  key: string
  label: string
  selected: Option | null
}

// ---------- Catalog ----------

export const ROOMS: Room[] = [
  { id: 'kitchen',     name: 'Kitchen',     icon: 'utensils' },
  { id: 'bathroom',    name: 'Bathroom',    icon: 'droplet' },
  { id: 'living-room', name: 'Living Room', icon: 'sofa' },
  { id: 'bedroom',     name: 'Bedroom',     icon: 'bed' },
  { id: 'laundry',     name: 'Laundry',     icon: 'shirt' }
]

// Reusable option presets — referenced from ROOM_ITEMS below.
const FLOORING_OPTIONS: Option[] = [
  { id: 'oak-timber',        label: 'Oak Timber',        cost: 'medium', tone: 'light',   tags: ['timber'] },
  { id: 'walnut-timber',     label: 'Walnut Timber',     cost: 'high',   tone: 'dark',    tags: ['timber'] },
  { id: 'porcelain-tile',    label: 'Porcelain Tile',    cost: 'medium', tone: 'neutral', tags: ['tile'] },
  { id: 'marble-tile',       label: 'Marble Tile',       cost: 'high',   tone: 'light',   tags: ['marble', 'tile'] },
  { id: 'polished-concrete', label: 'Polished Concrete', cost: 'medium', tone: 'dark',    tags: ['concrete'] },
  { id: 'vinyl-plank',       label: 'Vinyl Plank',       cost: 'low',    tone: 'neutral', tags: ['vinyl'] },
  { id: 'wool-carpet',       label: 'Wool Carpet',       cost: 'medium', tone: 'neutral', tags: ['carpet'] }
]

const WALL_FINISH_OPTIONS: Option[] = [
  { id: 'white-paint',      label: 'White Paint',       cost: 'low',    tone: 'light',   tags: ['paint'] },
  { id: 'warm-beige-paint', label: 'Warm Beige Paint',  cost: 'low',    tone: 'light',   tags: ['paint'] },
  { id: 'charcoal-paint',   label: 'Charcoal Paint',    cost: 'low',    tone: 'dark',    tags: ['paint'] },
  { id: 'navy-paint',       label: 'Navy Paint',        cost: 'low',    tone: 'dark',    tags: ['paint'] },
  { id: 'subway-tile',      label: 'White Subway Tile', cost: 'medium', tone: 'light',   tags: ['tile'] },
  { id: 'marble-slab',      label: 'Marble Slab',       cost: 'high',   tone: 'light',   tags: ['marble'] },
  { id: 'timber-panel',     label: 'Timber Panelling',  cost: 'high',   tone: 'dark',    tags: ['timber'] }
]

const BENCHTOP_OPTIONS: Option[] = [
  { id: 'laminate',         label: 'Laminate',             cost: 'low',    tone: 'neutral', tags: [] },
  { id: 'engineered-stone', label: 'Engineered Stone',     cost: 'medium', tone: 'light',   tags: ['stone'] },
  { id: 'marble',           label: 'Marble',               cost: 'high',   tone: 'light',   tags: ['marble', 'stone'] },
  { id: 'granite',          label: 'Granite',              cost: 'high',   tone: 'dark',    tags: ['stone'] },
  { id: 'butcher-block',    label: 'Butcher Block Timber', cost: 'medium', tone: 'light',   tags: ['timber'] },
  { id: 'stainless-steel',  label: 'Stainless Steel',      cost: 'medium', tone: 'neutral', tags: ['metal'] }
]

const CABINETRY_OPTIONS: Option[] = [
  { id: 'matte-white',   label: 'Matte White',   cost: 'low',    tone: 'light', tags: [] },
  { id: 'gloss-white',   label: 'Gloss White',   cost: 'medium', tone: 'light', tags: [] },
  { id: 'oak-veneer',    label: 'Oak Veneer',    cost: 'medium', tone: 'light', tags: ['timber'] },
  { id: 'walnut-veneer', label: 'Walnut Veneer', cost: 'high',   tone: 'dark',  tags: ['timber'] },
  { id: 'navy-shaker',   label: 'Navy Shaker',   cost: 'medium', tone: 'dark',  tags: [] },
  { id: 'matte-black',   label: 'Matte Black',   cost: 'high',   tone: 'dark',  tags: [] }
]

const LIGHTING_OPTIONS: Option[] = [
  { id: 'recessed-led', label: 'Recessed LED Downlights', cost: 'medium', tone: 'neutral', tags: [] },
  { id: 'pendant',      label: 'Pendant Lights',          cost: 'medium', tone: 'neutral', tags: [] },
  { id: 'chandelier',   label: 'Chandelier',              cost: 'high',   tone: 'neutral', tags: [] },
  { id: 'wall-sconces', label: 'Wall Sconces',            cost: 'medium', tone: 'neutral', tags: [] },
  { id: 'floor-lamp',   label: 'Floor Lamp',              cost: 'low',    tone: 'neutral', tags: [] },
  { id: 'table-lamp',   label: 'Table Lamp',              cost: 'low',    tone: 'neutral', tags: [] }
]

const SOFA_OPTIONS: Option[] = [
  { id: 'linen-3-seat',     label: 'Linen 3-Seater',     cost: 'medium', tone: 'light',   tags: ['fabric'] },
  { id: 'leather-3-seat',   label: 'Leather 3-Seater',   cost: 'high',   tone: 'dark',    tags: ['leather'] },
  { id: 'velvet-2-seat',    label: 'Velvet 2-Seater',    cost: 'high',   tone: 'dark',    tags: ['fabric'] },
  { id: 'modular-sectional', label: 'Modular Sectional', cost: 'high',   tone: 'neutral', tags: ['fabric'] }
]

const COFFEE_TABLE_OPTIONS: Option[] = [
  { id: 'oak-coffee',    label: 'Oak Coffee Table',    cost: 'medium', tone: 'light',   tags: ['timber'] },
  { id: 'walnut-coffee', label: 'Walnut Coffee Table', cost: 'high',   tone: 'dark',    tags: ['timber'] },
  { id: 'glass-coffee',  label: 'Glass Coffee Table',  cost: 'medium', tone: 'neutral', tags: ['glass'] },
  { id: 'marble-coffee', label: 'Marble Coffee Table', cost: 'high',   tone: 'light',   tags: ['marble'] }
]

const DINING_CHAIR_OPTIONS: Option[] = [
  { id: 'oak-chair',         label: 'Oak Dining Chair',  cost: 'medium', tone: 'light',   tags: ['timber'] },
  { id: 'upholstered-chair', label: 'Upholstered Chair', cost: 'medium', tone: 'neutral', tags: ['fabric'] },
  { id: 'metal-chair',       label: 'Metal Frame Chair', cost: 'low',    tone: 'dark',    tags: ['metal'] }
]

const BED_OPTIONS: Option[] = [
  { id: 'oak-bed',         label: 'Oak Bed Frame',    cost: 'medium', tone: 'light',   tags: ['timber'] },
  { id: 'walnut-bed',      label: 'Walnut Bed Frame', cost: 'high',   tone: 'dark',    tags: ['timber'] },
  { id: 'upholstered-bed', label: 'Upholstered Bed',  cost: 'high',   tone: 'neutral', tags: ['fabric'] },
  { id: 'metal-bed',       label: 'Metal Bed Frame',  cost: 'low',    tone: 'dark',    tags: ['metal'] }
]

const VANITY_OPTIONS: Option[] = [
  { id: 'matte-white-vanity', label: 'Matte White Vanity', cost: 'low',    tone: 'light', tags: [] },
  { id: 'oak-vanity',         label: 'Oak Vanity',         cost: 'medium', tone: 'light', tags: ['timber'] },
  { id: 'walnut-vanity',      label: 'Walnut Vanity',      cost: 'high',   tone: 'dark',  tags: ['timber'] },
  { id: 'marble-vanity',      label: 'Marble-Top Vanity',  cost: 'high',   tone: 'light', tags: ['marble'] }
]

const APPLIANCE_OPTIONS: Option[] = [
  { id: 'budget-appliances',  label: 'Budget Appliances',    cost: 'low',    tone: 'neutral', tags: [] },
  { id: 'mid-appliances',     label: 'Mid-Range Appliances', cost: 'medium', tone: 'neutral', tags: [] },
  { id: 'premium-appliances', label: 'Premium Appliances',   cost: 'high',   tone: 'neutral', tags: ['premium'] }
]

/**
 * Per-room item list. Each item is one selection slot the user fills.
 * `key` is used as the property name in the selection state.
 */
export const ROOM_ITEMS: Record<RoomId, Item[]> = {
  kitchen: [
    { key: 'flooring',   label: 'Flooring',         options: FLOORING_OPTIONS },
    { key: 'wallFinish', label: 'Wall Finish',      options: WALL_FINISH_OPTIONS },
    { key: 'benchtop',   label: 'Benchtop',         options: BENCHTOP_OPTIONS },
    { key: 'cabinetry',  label: 'Cabinetry Finish', options: CABINETRY_OPTIONS },
    { key: 'appliances', label: 'Appliance Tier',   options: APPLIANCE_OPTIONS },
    { key: 'lighting',   label: 'Lighting',         options: LIGHTING_OPTIONS }
  ],
  bathroom: [
    { key: 'flooring',   label: 'Flooring',    options: FLOORING_OPTIONS },
    { key: 'wallFinish', label: 'Wall Finish', options: WALL_FINISH_OPTIONS },
    { key: 'vanity',     label: 'Vanity',      options: VANITY_OPTIONS },
    { key: 'benchtop',   label: 'Vanity Top',  options: BENCHTOP_OPTIONS },
    { key: 'lighting',   label: 'Lighting',    options: LIGHTING_OPTIONS }
  ],
  'living-room': [
    { key: 'flooring',    label: 'Flooring',     options: FLOORING_OPTIONS },
    { key: 'wallFinish',  label: 'Wall Finish',  options: WALL_FINISH_OPTIONS },
    { key: 'sofa',        label: 'Sofa',         options: SOFA_OPTIONS },
    { key: 'coffeeTable', label: 'Coffee Table', options: COFFEE_TABLE_OPTIONS },
    { key: 'diningChair', label: 'Accent Chair', options: DINING_CHAIR_OPTIONS },
    { key: 'lighting',    label: 'Lighting',     options: LIGHTING_OPTIONS }
  ],
  bedroom: [
    { key: 'flooring',   label: 'Flooring',        options: FLOORING_OPTIONS },
    { key: 'wallFinish', label: 'Wall Finish',     options: WALL_FINISH_OPTIONS },
    { key: 'bed',        label: 'Bed Frame',       options: BED_OPTIONS },
    { key: 'cabinetry',  label: 'Wardrobe Finish', options: CABINETRY_OPTIONS },
    { key: 'lighting',   label: 'Lighting',        options: LIGHTING_OPTIONS }
  ],
  laundry: [
    { key: 'flooring',   label: 'Flooring',         options: FLOORING_OPTIONS },
    { key: 'wallFinish', label: 'Wall Finish',      options: WALL_FINISH_OPTIONS },
    { key: 'benchtop',   label: 'Benchtop',         options: BENCHTOP_OPTIONS },
    { key: 'cabinetry',  label: 'Cabinetry Finish', options: CABINETRY_OPTIONS },
    { key: 'lighting',   label: 'Lighting',         options: LIGHTING_OPTIONS }
  ]
}

// ---------- Helpers ----------

/** Look up a single option object by item key + option id. */
export function findOption(
  roomId: RoomId,
  itemKey: string,
  optionId: string
): Option | null {
  const items = ROOM_ITEMS[roomId] || []
  const item = items.find(i => i.key === itemKey)
  if (!item) return null
  return item.options.find(o => o.id === optionId) || null
}

/** Resolve every selected option for a room into rich objects. */
export function resolveSelections(
  roomId: RoomId,
  selections: Selections
): ResolvedItem[] {
  const items = ROOM_ITEMS[roomId] || []
  return items.map(item => ({
    key: item.key,
    label: item.label,
    selected: selections[item.key]
      ? item.options.find(o => o.id === selections[item.key]) || null
      : null
  }))
}
