"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Mountain } from "lucide-react"
import type { PlaceCategory, TrailDifficulty } from "@/types"

type ItemType = "all" | "place" | "trail"
type SortOption = "date" | "az" | "priority"

const PLACE_CATEGORIES: ("all" | PlaceCategory)[] = [
  "all",
  "nature",
  "culture",
  "adventure",
  "food",
  "beach",
]

const TRAIL_DIFFICULTIES: ("all" | TrailDifficulty)[] = [
  "all",
  "easy",
  "moderate",
  "hard",
  "expert",
]

const categoryColors: Record<"all" | PlaceCategory, string> = {
  all: "bg-secondary text-secondary-foreground",
  nature: "bg-emerald-100 text-emerald-700",
  culture: "bg-purple-100 text-purple-700",
  adventure: "bg-orange-100 text-orange-700",
  food: "bg-rose-100 text-rose-700",
  beach: "bg-sky-100 text-sky-700",
}

const difficultyColors: Record<"all" | TrailDifficulty, string> = {
  all: "bg-secondary text-secondary-foreground",
  easy: "bg-emerald-100 text-emerald-700",
  moderate: "bg-yellow-100 text-yellow-700",
  hard: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700",
}

export function BucketListFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab = (searchParams.get("type") ?? "all") as ItemType
  const categoryFilter = (searchParams.get("category") ?? "all") as
    | "all"
    | PlaceCategory
  const difficultyFilter = (searchParams.get("difficulty") ?? "all") as
    | "all"
    | TrailDifficulty
  const showCompleted = searchParams.get("completed") !== "false"
  const sortBy = (searchParams.get("sort") ?? "date") as SortOption

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }

    const query = params.toString()
    router.push(query ? `/bucket-list?${query}` : "/bucket-list")
  }

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => updateParams({ type: value })}
        className="mb-4"
      >
        <TabsList className="h-12 w-full grid grid-cols-3">
          <TabsTrigger value="all" className="text-base">
            All
          </TabsTrigger>
          <TabsTrigger value="place" className="gap-1.5 text-base">
            <MapPin className="h-4 w-4" />
            Places
          </TabsTrigger>
          <TabsTrigger value="trail" className="gap-1.5 text-base">
            <Mountain className="h-4 w-4" />
            Trails
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6 space-y-3">
        {(activeTab === "all" || activeTab === "place") && (
          <div className="flex flex-wrap gap-2">
            {PLACE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateParams({ category: cat })}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? categoryColors[cat]
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {(activeTab === "all" || activeTab === "trail") && (
          <div className="flex flex-wrap gap-2">
            {TRAIL_DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => updateParams({ difficulty: diff })}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  difficultyFilter === diff
                    ? difficultyColors[diff]
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {diff === "all"
                  ? "All Difficulties"
                  : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={(checked) =>
                updateParams({ completed: checked ? undefined : "false" })
              }
            />
            <label htmlFor="show-completed" className="text-sm text-muted-foreground">
              Show Completed
            </label>
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
