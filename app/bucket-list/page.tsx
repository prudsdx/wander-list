import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type {
  BucketListItem,
  Place,
  PlaceCategory,
  Trail,
  TrailDifficulty,
} from "@/types"
import {
  Plus,
  MapPin,
  Mountain,
  Check,
  Ruler,
  ArrowUp,
  Clock,
  Compass,
  Home,
} from "lucide-react"
import { markPlaceVisited, markTrailHiked } from "./actions"
import { BucketListFilters } from "./bucket-list-filters"

const PLACE_CATEGORIES: PlaceCategory[] = [
  "nature",
  "culture",
  "adventure",
  "food",
  "beach",
]

const TRAIL_DIFFICULTIES: TrailDifficulty[] = [
  "easy",
  "moderate",
  "hard",
  "expert",
]

const categoryColors: Record<PlaceCategory, string> = {
  nature: "bg-emerald-100 text-emerald-700",
  culture: "bg-purple-100 text-purple-700",
  adventure: "bg-orange-100 text-orange-700",
  food: "bg-rose-100 text-rose-700",
  beach: "bg-sky-100 text-sky-700",
}

const difficultyColors: Record<TrailDifficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  moderate: "bg-yellow-100 text-yellow-700",
  hard: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700",
}

type ItemType = "all" | "place" | "trail"
type SortOption = "date" | "az" | "priority"

interface PageProps {
  searchParams: Promise<{
    type?: string
    category?: string
    difficulty?: string
    completed?: string
    sort?: string
  }>
}

function parseType(value?: string): ItemType {
  if (value === "place" || value === "trail" || value === "all") return value
  return "all"
}

function parseCategory(value?: string): PlaceCategory | undefined {
  if (value && PLACE_CATEGORIES.includes(value as PlaceCategory)) {
    return value as PlaceCategory
  }
  return undefined
}

function parseDifficulty(value?: string): TrailDifficulty | undefined {
  if (value && TRAIL_DIFFICULTIES.includes(value as TrailDifficulty)) {
    return value as TrailDifficulty
  }
  return undefined
}

function parseSort(value?: string): SortOption {
  if (value === "az" || value === "priority" || value === "date") return value
  return "date"
}

function sortItems(items: BucketListItem[], sort: SortOption): BucketListItem[] {
  const sorted = [...items]

  if (sort === "az") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sort === "priority") {
    return sorted.sort((a, b) => b.priority - a.priority)
  }

  return sorted.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export default async function BucketListPage({ searchParams }: PageProps) {
  const params = await searchParams
  const typeFilter = parseType(params.type)
  const categoryFilter = parseCategory(params.category)
  const difficultyFilter = parseDifficulty(params.difficulty)
  const showCompleted = params.completed !== "false"
  const sortBy = parseSort(params.sort)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const fetchPlaces = typeFilter !== "trail"
  const fetchTrails = typeFilter !== "place"

  const [placesResult, trailsResult, placesCountResult, trailsCountResult] =
    await Promise.all([
      fetchPlaces
        ? (() => {
            let query = supabase
              .from("places")
              .select("*")
              .eq("user_id", user.id)

            if (categoryFilter) {
              query = query.eq("category", categoryFilter)
            }

            if (!showCompleted) {
              query = query.eq("is_visited", false)
            }

            return query
          })()
        : Promise.resolve({ data: [] as Place[] }),
      fetchTrails
        ? (() => {
            let query = supabase
              .from("trails")
              .select("*")
              .eq("user_id", user.id)

            if (difficultyFilter) {
              query = query.eq("difficulty", difficultyFilter)
            }

            if (!showCompleted) {
              query = query.eq("is_hiked", false)
            }

            return query
          })()
        : Promise.resolve({ data: [] as Trail[] }),
      supabase
        .from("places")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("trails")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ])

  const userPlaces = (placesResult.data ?? []) as Place[]
  const userTrails = (trailsResult.data ?? []) as Trail[]

  const items: BucketListItem[] = sortItems(
    [
      ...userPlaces.map((place) => ({ ...place, item_type: "place" as const })),
      ...userTrails.map((trail) => ({ ...trail, item_type: "trail" as const })),
    ],
    sortBy
  )

  const totalCount = (placesCountResult.count ?? 0) + (trailsCountResult.count ?? 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">My Bucket List</h1>
            <Badge variant="secondary" className="rounded-full">
              {totalCount}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/bucket-list/new">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Suspense fallback={null}>
          <BucketListFilters />
        </Suspense>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) =>
              item.item_type === "place" ? (
                <PlaceCard key={item.id} place={item} />
              ) : (
                <TrailCard key={item.id} trail={item} />
              )
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}

function PlaceCard({ place }: { place: Place & { item_type: "place" } }) {
  const isCompleted = place.is_visited
  const location = place.city
    ? `${place.city}, ${place.country}`
    : place.country

  return (
    <div className="flex flex-col">
      <Link href={`/places/${place.id}`} className="block">
        <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
          {isCompleted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
          <CardContent className="p-3 sm:p-4">
            <Badge className={`mb-2 ${categoryColors[place.category]}`}>
              {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
            </Badge>
            <h3 className="font-semibold leading-tight">{place.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <MapPin className="h-3 w-3" />
              {location}
            </p>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i < place.priority ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>

      {!isCompleted && (
        <form action={markPlaceVisited.bind(null, place.id)} className="mt-2">
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="w-full text-xs"
          >
            Mark Visited
          </Button>
        </form>
      )}
    </div>
  )
}

function TrailCard({ trail }: { trail: Trail & { item_type: "trail" } }) {
  const isCompleted = trail.is_hiked
  const location = trail.region
    ? `${trail.region}, ${trail.country}`
    : trail.country

  const formatDuration = (hours: number | null) => {
    if (hours === null) return "—"
    if (hours >= 24) return `${Math.round(hours / 24)}d`
    return `${hours}h`
  }

  return (
    <div className="flex flex-col">
      <Link href={`/trails/${trail.id}`} className="block">
        <Card className="group relative overflow-hidden bg-emerald-50/50 transition-shadow hover:shadow-md">
          {isCompleted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
          <CardContent className="p-3 sm:p-4">
            <Badge className={difficultyColors[trail.difficulty]}>
              {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
            </Badge>
            <h3 className="mt-2 font-semibold leading-tight">{trail.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <Mountain className="h-3 w-3" />
              {location}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground sm:text-xs">
              <span className="flex items-center gap-0.5">
                <Ruler className="h-3 w-3" />
                {trail.distance_km ?? "—"}km
              </span>
              <span className="flex items-center gap-0.5">
                <ArrowUp className="h-3 w-3" />
                {trail.elevation_m ?? "—"}m
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {formatDuration(trail.duration_hours)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>

      {!isCompleted && (
        <form action={markTrailHiked.bind(null, trail.id)} className="mt-2">
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="w-full text-xs"
          >
            Mark Hiked
          </Button>
        </form>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Compass className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No items yet</h3>
      <p className="mb-4 max-w-xs text-sm text-muted-foreground">
        Start building your bucket list by adding places to visit and trails to
        hike.
      </p>
      <Button asChild>
        <Link href="/bucket-list/new">
          <Plus className="h-4 w-4" />
          Add Your First Item
        </Link>
      </Button>
    </div>
  )
}
