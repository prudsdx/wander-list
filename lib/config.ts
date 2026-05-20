import type { PlaceCategory, TrailDifficulty } from '@/types'

export const PLACE_CATEGORY_CONFIG: Record<
  PlaceCategory,
  { label: string; color: string; icon: string }
> = {
  nature:    { label: 'Nature',    color: 'bg-green-100 text-green-800',   icon: '🌿' },
  culture:   { label: 'Culture',   color: 'bg-purple-100 text-purple-800', icon: '🏛️' },
  adventure: { label: 'Adventure', color: 'bg-orange-100 text-orange-800', icon: '🧗' },
  food:      { label: 'Food',      color: 'bg-yellow-100 text-yellow-800', icon: '🍜' },
  beach:     { label: 'Beach',     color: 'bg-blue-100 text-blue-800',     icon: '🏖️' },
}

export const TRAIL_DIFFICULTY_CONFIG: Record<
  TrailDifficulty,
  { label: string; color: string; icon: string }
> = {
  easy:     { label: 'Easy',     color: 'bg-green-100 text-green-800',   icon: '🟢' },
  moderate: { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
  hard:     { label: 'Hard',     color: 'bg-orange-100 text-orange-800', icon: '🟠' },
  expert:   { label: 'Expert',   color: 'bg-red-100 text-red-800',       icon: '🔴' },
}

export const TRAIL_TYPE_LABELS: Record<string, string> = {
  'loop':           'Loop',
  'out-and-back':   'Out & Back',
  'point-to-point': 'Point-to-Point',
}

export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Nice to have',
  3: 'Want to go',
  4: 'High',
  5: 'Must go!',
}