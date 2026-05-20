"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Mountain,
  Search,
  Leaf,
  Landmark,
  Compass,
  UtensilsCrossed,
  Umbrella,
  Image as ImageIcon,
} from "lucide-react"

type ItemType = "place" | "trail"
type PlaceCategory = "nature" | "culture" | "adventure" | "food" | "beach"
type TrailDifficulty = "easy" | "moderate" | "hard" | "expert"
type TrailType = "loop" | "out-and-back" | "point-to-point"

interface PlaceForm {
  name: string
  country: string
  city: string
  category: PlaceCategory | ""
  priority: number
  imageUrl: string
  notes: string
  visited: boolean
  dateVisited: string
}

interface TrailForm {
  name: string
  country: string
  region: string
  difficulty: TrailDifficulty | ""
  distance: string
  elevation: string
  duration: string
  trailType: TrailType | ""
  bestSeason: string
  priority: number
  imageUrl: string
  notes: string
  hiked: boolean
  dateHiked: string
}

interface FormErrors {
  name?: string
  country?: string
  category?: string
  difficulty?: string
}

const categoryOptions: { value: PlaceCategory; label: string; icon: React.ReactNode }[] = [
  { value: "nature", label: "Nature", icon: <Leaf className="h-4 w-4" /> },
  { value: "culture", label: "Culture", icon: <Landmark className="h-4 w-4" /> },
  { value: "adventure", label: "Adventure", icon: <Compass className="h-4 w-4" /> },
  { value: "food", label: "Food", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "beach", label: "Beach", icon: <Umbrella className="h-4 w-4" /> },
]

const difficultyOptions: { value: TrailDifficulty; label: string; color: string }[] = [
  { value: "easy", label: "Easy", color: "bg-emerald-500" },
  { value: "moderate", label: "Moderate", color: "bg-yellow-500" },
  { value: "hard", label: "Hard", color: "bg-orange-500" },
  { value: "expert", label: "Expert", color: "bg-red-500" },
]

export default function AddItemPage() {
  const [itemType, setItemType] = useState<ItemType>("place")
  const [errors, setErrors] = useState<FormErrors>({})

  const [placeForm, setPlaceForm] = useState<PlaceForm>({
    name: "",
    country: "",
    city: "",
    category: "",
    priority: 3,
    imageUrl: "",
    notes: "",
    visited: false,
    dateVisited: "",
  })

  const [trailForm, setTrailForm] = useState<TrailForm>({
    name: "",
    country: "",
    region: "",
    difficulty: "",
    distance: "",
    elevation: "",
    duration: "",
    trailType: "",
    bestSeason: "",
    priority: 3,
    imageUrl: "",
    notes: "",
    hiked: false,
    dateHiked: "",
  })

  const validatePlaceForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!placeForm.name.trim()) newErrors.name = "Name is required"
    if (!placeForm.country.trim()) newErrors.country = "Country is required"
    if (!placeForm.category) newErrors.category = "Please select a category"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateTrailForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!trailForm.name.trim()) newErrors.name = "Name is required"
    if (!trailForm.country.trim()) newErrors.country = "Country is required"
    if (!trailForm.difficulty) newErrors.difficulty = "Please select a difficulty"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSavePlace = () => {
    if (validatePlaceForm()) {
      // Handle save logic
      console.log("Saving place:", placeForm)
    }
  }

  const handleSaveTrail = () => {
    if (validateTrailForm()) {
      // Handle save logic
      console.log("Saving trail:", trailForm)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link href="/bucket-list">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Add to Bucket List</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        {/* Type Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setItemType("place")
              setErrors({})
            }}
            className="text-left"
          >
            <Card
              className={`transition-colors ${
                itemType === "place"
                  ? "border-2 border-primary bg-primary/5"
                  : "hover:border-border/80"
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <p className="font-semibold">Place</p>
                <p className="text-sm text-muted-foreground">
                  Cities, towns, landmarks
                </p>
              </CardContent>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => {
              setItemType("trail")
              setErrors({})
            }}
            className="text-left"
          >
            <Card
              className={`transition-colors ${
                itemType === "trail"
                  ? "border-2 border-emerald-500 bg-emerald-500/5"
                  : "hover:border-border/80"
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Mountain className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-semibold">Trail</p>
                <p className="text-sm text-muted-foreground">
                  Hikes, treks, walks
                </p>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Place Form */}
        {itemType === "place" && (
          <div className="space-y-6">
            {/* Search Button */}
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <Search className="h-4 w-4" />
              Search for a place...
            </Button>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="place-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="place-name"
                  placeholder="e.g., Eiffel Tower"
                  value={placeForm.name}
                  onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="place-country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="place-country"
                    placeholder="e.g., France"
                    value={placeForm.country}
                    onChange={(e) => setPlaceForm({ ...placeForm, country: e.target.value })}
                    aria-invalid={!!errors.country}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="place-city">City/Area</Label>
                  <Input
                    id="place-city"
                    placeholder="e.g., Paris"
                    value={placeForm.city}
                    onChange={(e) => setPlaceForm({ ...placeForm, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setPlaceForm({ ...placeForm, category: cat.value })}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                      placeForm.category === cat.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {cat.icon}
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPlaceForm({ ...placeForm, priority: num })}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      placeForm.priority >= num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="place-image">Image URL</Label>
              <Input
                id="place-image"
                placeholder="https://..."
                value={placeForm.imageUrl}
                onChange={(e) => setPlaceForm({ ...placeForm, imageUrl: e.target.value })}
              />
              {placeForm.imageUrl && (
                <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-secondary">
                  <img
                    src={placeForm.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
              {!placeForm.imageUrl && (
                <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed bg-secondary/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="place-notes">Notes</Label>
              <Textarea
                id="place-notes"
                placeholder="Any additional notes..."
                value={placeForm.notes}
                onChange={(e) => setPlaceForm({ ...placeForm, notes: e.target.value })}
              />
            </div>

            {/* Visited Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="place-visited">Already Visited</Label>
                <Switch
                  id="place-visited"
                  checked={placeForm.visited}
                  onCheckedChange={(checked) =>
                    setPlaceForm({ ...placeForm, visited: checked })
                  }
                />
              </div>
              {placeForm.visited && (
                <div className="space-y-2">
                  <Label htmlFor="place-date-visited">Date Visited</Label>
                  <Input
                    id="place-date-visited"
                    type="date"
                    value={placeForm.dateVisited}
                    onChange={(e) =>
                      setPlaceForm({ ...placeForm, dateVisited: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSavePlace} className="flex-1">
                Save Place
              </Button>
              <Link href="/bucket-list">
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Trail Form */}
        {itemType === "trail" && (
          <div className="space-y-6">
            {/* Search Button */}
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <Search className="h-4 w-4" />
              Search for a trail...
            </Button>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trail-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="trail-name"
                  placeholder="e.g., Pacific Crest Trail"
                  value={trailForm.name}
                  onChange={(e) => setTrailForm({ ...trailForm, name: e.target.value })}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="trail-country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="trail-country"
                    placeholder="e.g., USA"
                    value={trailForm.country}
                    onChange={(e) => setTrailForm({ ...trailForm, country: e.target.value })}
                    aria-invalid={!!errors.country}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trail-region">Region/Park</Label>
                  <Input
                    id="trail-region"
                    placeholder="e.g., California"
                    value={trailForm.region}
                    onChange={(e) => setTrailForm({ ...trailForm, region: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>
                Difficulty <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {difficultyOptions.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setTrailForm({ ...trailForm, difficulty: diff.value })}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                      trailForm.difficulty === diff.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${diff.color}`} />
                    <span className="text-xs font-medium">{diff.label}</span>
                  </button>
                ))}
              </div>
              {errors.difficulty && (
                <p className="text-sm text-destructive">{errors.difficulty}</p>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="trail-distance">Distance (km)</Label>
                <Input
                  id="trail-distance"
                  type="number"
                  placeholder="0"
                  value={trailForm.distance}
                  onChange={(e) => setTrailForm({ ...trailForm, distance: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trail-elevation">Elevation (m)</Label>
                <Input
                  id="trail-elevation"
                  type="number"
                  placeholder="0"
                  value={trailForm.elevation}
                  onChange={(e) => setTrailForm({ ...trailForm, elevation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trail-duration">Duration (hrs)</Label>
                <Input
                  id="trail-duration"
                  type="number"
                  placeholder="0"
                  value={trailForm.duration}
                  onChange={(e) => setTrailForm({ ...trailForm, duration: e.target.value })}
                />
              </div>
            </div>

            {/* Trail Type */}
            <div className="space-y-2">
              <Label htmlFor="trail-type">Trail Type</Label>
              <Select
                value={trailForm.trailType}
                onValueChange={(value) =>
                  setTrailForm({ ...trailForm, trailType: value as TrailType })
                }
              >
                <SelectTrigger id="trail-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loop">Loop</SelectItem>
                  <SelectItem value="out-and-back">Out &amp; Back</SelectItem>
                  <SelectItem value="point-to-point">Point-to-Point</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Best Season */}
            <div className="space-y-2">
              <Label htmlFor="trail-season">Best Season</Label>
              <Input
                id="trail-season"
                placeholder="e.g., Spring, Summer"
                value={trailForm.bestSeason}
                onChange={(e) => setTrailForm({ ...trailForm, bestSeason: e.target.value })}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTrailForm({ ...trailForm, priority: num })}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      trailForm.priority >= num
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border text-muted-foreground hover:border-emerald-500/50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="trail-image">Image URL</Label>
              <Input
                id="trail-image"
                placeholder="https://..."
                value={trailForm.imageUrl}
                onChange={(e) => setTrailForm({ ...trailForm, imageUrl: e.target.value })}
              />
              {trailForm.imageUrl && (
                <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-secondary">
                  <img
                    src={trailForm.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
              {!trailForm.imageUrl && (
                <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed bg-secondary/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="trail-notes">Notes</Label>
              <Textarea
                id="trail-notes"
                placeholder="Any additional notes..."
                value={trailForm.notes}
                onChange={(e) => setTrailForm({ ...trailForm, notes: e.target.value })}
              />
            </div>

            {/* Hiked Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="trail-hiked">Already Hiked</Label>
                <Switch
                  id="trail-hiked"
                  checked={trailForm.hiked}
                  onCheckedChange={(checked) =>
                    setTrailForm({ ...trailForm, hiked: checked })
                  }
                />
              </div>
              {trailForm.hiked && (
                <div className="space-y-2">
                  <Label htmlFor="trail-date-hiked">Date Hiked</Label>
                  <Input
                    id="trail-date-hiked"
                    type="date"
                    value={trailForm.dateHiked}
                    onChange={(e) =>
                      setTrailForm({ ...trailForm, dateHiked: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveTrail}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Save Trail
              </Button>
              <Link href="/bucket-list">
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
