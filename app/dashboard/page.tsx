import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Mountain,
  Globe,
  CheckCircle,
  MapPin,
  Footprints,
  Flag,
  Plus,
  Home,
  Compass,
  ChevronRight,
} from "lucide-react"

const PLACE_CATEGORIES: PlaceCategory[] = [
  "nature",
  "culture",
  "adventure",
  "food",
  "beach",
]

const TRAIL_DIFFICULTIES: {
  key: TrailDifficulty
  name: string
  color: string
}[] = [
  { key: "easy", name: "Easy", color: "bg-emerald-100 text-emerald-700" },
  { key: "moderate", name: "Moderate", color: "bg-yellow-100 text-yellow-700" },
  { key: "hard", name: "Hard", color: "bg-orange-100 text-orange-700" },
  { key: "expert", name: "Expert", color: "bg-red-100 text-red-700" },
]

function formatCategoryName(category: PlaceCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function getItemLocation(item: BucketListItem): string {
  if (item.item_type === "place") {
    return item.city ? `${item.city}, ${item.country}` : item.country
  }
  return item.region ? `${item.region}, ${item.country}` : item.country
}

function isItemCompleted(item: BucketListItem): boolean {
  return item.item_type === "place" ? item.is_visited : item.is_hiked
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: places }, { data: trails }] = await Promise.all([
    supabase.from("places").select("*").eq("user_id", user.id),
    supabase.from("trails").select("*").eq("user_id", user.id),
  ])

  const userPlaces = (places ?? []) as Place[]
  const userTrails = (trails ?? []) as Trail[]

  const placesTotal = userPlaces.length
  const placesVisited = userPlaces.filter((p) => p.is_visited).length
  const placesRemaining = placesTotal - placesVisited

  const trailsTotal = userTrails.length
  const trailsHiked = userTrails.filter((t) => t.is_hiked).length
  const trailsRemaining = trailsTotal - trailsHiked

  const categoryBreakdown = PLACE_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = userPlaces.filter((p) => p.category === category).length
      return acc
    },
    {} as Record<PlaceCategory, number>
  )

  const difficultyBreakdown = TRAIL_DIFFICULTIES.reduce(
    (acc, { key }) => {
      acc[key] = userTrails.filter((t) => t.difficulty === key).length
      return acc
    },
    {} as Record<TrailDifficulty, number>
  )

  const recentItems: BucketListItem[] = [
    ...userPlaces.map((place) => ({ ...place, item_type: "place" as const })),
    ...userTrails.map((trail) => ({ ...trail, item_type: "trail" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4)

  const placesProgress =
    placesTotal > 0 ? Math.round((placesVisited / placesTotal) * 100) : 0
  const trailsProgress =
    trailsTotal > 0 ? Math.round((trailsHiked / trailsTotal) * 100) : 0

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-6">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold">Wander List</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/bucket-list/new">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Places Stats */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Places
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <Globe className="mb-2 h-5 w-5 text-primary" />
                <p className="text-2xl font-bold">{placesTotal}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-0">
              <CardContent className="p-4">
                <CheckCircle className="mb-2 h-5 w-5 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-700">{placesVisited}</p>
                <p className="text-xs text-muted-foreground">Visited</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-0">
              <CardContent className="p-4">
                <MapPin className="mb-2 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{placesRemaining}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trails Stats */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Footprints className="h-4 w-4" />
            Trails
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <Mountain className="mb-2 h-5 w-5 text-primary" />
                <p className="text-2xl font-bold">{trailsTotal}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-0">
              <CardContent className="p-4">
                <Footprints className="mb-2 h-5 w-5 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-700">{trailsHiked}</p>
                <p className="text-xs text-muted-foreground">Hiked</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-0">
              <CardContent className="p-4">
                <Flag className="mb-2 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{trailsRemaining}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                Places: {placesVisited} of {placesTotal} visited
              </span>
              <span className="text-muted-foreground">{placesProgress}%</span>
            </div>
            <Progress value={placesProgress} className="h-2" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                Trails: {trailsHiked} of {trailsTotal} hiked
              </span>
              <span className="text-muted-foreground">{trailsProgress}%</span>
            </div>
            <Progress
              value={trailsProgress}
              className="h-2 [&>[data-slot=progress-indicator]]:bg-emerald-500"
            />
          </div>
        </section>

        {/* Breakdown Pills */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-medium">Place Categories</h3>
              <div className="flex flex-wrap gap-2">
                {PLACE_CATEGORIES.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {formatCategoryName(category)}
                    <span className="text-muted-foreground">
                      {categoryBreakdown[category]}
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-medium">Trail Difficulties</h3>
              <div className="flex flex-wrap gap-2">
                {TRAIL_DIFFICULTIES.map((difficulty) => (
                  <span
                    key={difficulty.key}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${difficulty.color}`}
                  >
                    {difficulty.name}
                    <span className="opacity-70">
                      {difficultyBreakdown[difficulty.key]}
                    </span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recently Added */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recently Added</h2>
            <Link
              href="/bucket-list"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {recentItems.map((item) => (
              <Card key={item.id} className="min-w-[160px] flex-shrink-0">
                <CardContent className="p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className={
                        item.item_type === "place"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    >
                      {item.item_type === "place" ? "Place" : "Trail"}
                    </Badge>
                    {isItemCompleted(item) && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getItemLocation(item)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/bucket-list"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs">All</span>
          </Link>
          <Link
            href="/bucket-list?type=place"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Places</span>
          </Link>
          <Link
            href="/bucket-list?type=trail"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Mountain className="h-5 w-5" />
            <span className="text-xs">Trails</span>
          </Link>
          <Link
            href="/bucket-list/new"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
