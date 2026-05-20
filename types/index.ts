export type PlaceCategory = 'nature' | 'culture' | 'adventure' | 'food' | 'beach'
export type TrailDifficulty = 'easy' | 'moderate' | 'hard' | 'expert'
export type TrailType = 'loop' | 'out-and-back' | 'point-to-point'

export interface Place {
  id: string
  user_id: string
  name: string
  country: string
  city: string | null
  category: PlaceCategory
  notes: string | null
  image_url: string | null
  is_visited: boolean
  visited_at: string | null
  priority: number
  created_at: string
  updated_at: string
}

export interface Trail {
  id: string
  user_id: string
  name: string
  country: string
  region: string | null
  difficulty: TrailDifficulty
  distance_km: number | null
  elevation_m: number | null
  duration_hours: number | null
  trail_type: TrailType | null
  best_season: string | null
  notes: string | null
  image_url: string | null
  is_hiked: boolean
  hiked_at: string | null
  priority: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Used for the mixed list that shows both places and trails together
export type BucketListItem =
  | (Place & { item_type: 'place' })
  | (Trail & { item_type: 'trail' })