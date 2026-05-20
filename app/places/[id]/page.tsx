import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"
import type { Place, PlaceCategory } from "@/types"
import { MapPin, Check } from "lucide-react"
import { PlaceActions } from "./place-actions"

const categoryColors: Record<PlaceCategory, string> = {
  nature: "bg-emerald-100 text-emerald-700",
  culture: "bg-purple-100 text-purple-700",
  adventure: "bg-orange-100 text-orange-700",
  food: "bg-rose-100 text-rose-700",
  beach: "bg-sky-100 text-sky-700",
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function renderPriorityStars(priority: number) {
  return Array.from({ length: 5 })
    .map((_, i) => (i < priority ? "\u2605" : "\u2606"))
    .join("")
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single()

  if (!data || data.user_id !== user.id) {
    redirect("/bucket-list")
  }

  const place = data as Place
  const location = place.city
    ? `${place.city}, ${place.country}`
    : place.country

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Link
          href="/bucket-list"
          className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl">
          {place.image_url ? (
            <img
              src={place.image_url}
              alt={place.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-teal-500">
              <h2 className="px-4 text-center text-2xl font-bold text-white md:text-3xl">
                {place.name}
              </h2>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{place.name}</h1>

          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={categoryColors[place.category]}>
              {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {renderPriorityStars(place.priority)}
            </Badge>
          </div>

          {place.is_visited ? (
            <div className="space-y-1">
              <Badge className="bg-emerald-100 text-emerald-700">
                <Check className="mr-1 h-3 w-3" />
                Visited
              </Badge>
              {place.visited_at && (
                <p className="text-sm text-muted-foreground">
                  Visited on {formatDate(place.visited_at)}
                </p>
              )}
            </div>
          ) : (
            <Badge variant="secondary" className="text-muted-foreground">
              Not Yet Visited
            </Badge>
          )}

          <p className="text-sm text-muted-foreground">
            Added {formatDate(place.created_at)}
          </p>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">My Notes</h2>
            {place.notes ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {place.notes}
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

        <PlaceActions
          id={place.id}
          name={place.name}
          isVisited={place.is_visited}
          layout="desktop"
        />
      </div>

      <PlaceActions
        id={place.id}
        name={place.name}
        isVisited={place.is_visited}
        layout="mobile"
      />
    </div>
  )
}
