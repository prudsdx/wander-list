import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"
import type { Trail, TrailDifficulty, TrailType } from "@/types"
import {
  Mountain,
  Check,
  Ruler,
  TrendingUp,
  Clock,
  RefreshCw,
  Calendar,
} from "lucide-react"
import { TrailActions } from "./trail-actions"

const difficultyColors: Record<TrailDifficulty, string> = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  hard: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700",
}

const trailTypeLabels: Record<TrailType, string> = {
  loop: "Loop",
  "out-and-back": "Out & Back",
  "point-to-point": "Point to Point",
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDuration(hours: number) {
  if (hours < 24) {
    return `~${hours} hrs`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  if (remainingHours === 0) {
    return `~${days} days`
  }
  return `~${days}d ${remainingHours}h`
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrailDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("trails")
    .select("*")
    .eq("id", id)
    .single()

  if (!data || data.user_id !== user.id) {
    redirect("/bucket-list")
  }

  const trail = data as Trail
  const location = trail.region
    ? `${trail.region}, ${trail.country}`
    : trail.country

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/bucket-list"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back
          </Link>
          <Badge className="bg-emerald-100 text-emerald-700">
            <Mountain className="mr-1 h-3 w-3" />
            Trail
          </Badge>
        </div>

        <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl">
          {trail.image_url ? (
            <img
              src={trail.image_url}
              alt={trail.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-emerald-700">
              <h2 className="px-4 text-center text-2xl font-bold text-white md:text-3xl">
                {trail.name}
              </h2>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{trail.name}</h1>

          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Mountain className="h-4 w-4" />
            {location}
          </p>

          <Badge className={`text-sm ${difficultyColors[trail.difficulty]}`}>
            {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
          </Badge>

          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-medium">
                    {trail.distance_km != null ? `${trail.distance_km} km` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Elevation</p>
                  <p className="font-medium">
                    {trail.elevation_m != null
                      ? `${trail.elevation_m.toLocaleString()} m`
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {trail.duration_hours != null
                      ? formatDuration(trail.duration_hours)
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {trail.trail_type
                      ? trailTypeLabels[trail.trail_type]
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {trail.best_season && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Best:</span>
              <span className="font-medium">{trail.best_season}</span>
            </div>
          )}

          {trail.is_hiked ? (
            <div className="space-y-1">
              <Badge className="bg-emerald-100 text-emerald-700">
                <Check className="mr-1 h-3 w-3" />
                Hiked
              </Badge>
              {trail.hiked_at && (
                <p className="text-sm text-muted-foreground">
                  Hiked on {formatDate(trail.hiked_at)}
                </p>
              )}
            </div>
          ) : (
            <Badge variant="secondary" className="text-muted-foreground">
              Not Yet Hiked
            </Badge>
          )}

          <p className="text-sm text-muted-foreground">
            Added {formatDate(trail.created_at)}
          </p>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">My Notes</h2>
            {trail.notes ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {trail.notes}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No notes yet.
              </p>
            )}
          </div>
        </div>

        <TrailActions
          id={trail.id}
          name={trail.name}
          isHiked={trail.is_hiked}
          layout="desktop"
        />
      </div>

      <TrailActions
        id={trail.id}
        name={trail.name}
        isHiked={trail.is_hiked}
        layout="mobile"
      />
    </div>
  )
}
