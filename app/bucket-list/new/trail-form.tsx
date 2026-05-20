"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { TrailAutocomplete } from "@/components/TrailAutocomplete"
import type { TrailSuggestion } from "@/lib/trails-search"
import { createClient } from "@/lib/supabase/client"
import type { TrailDifficulty, TrailType } from "@/types"
import { Image as ImageIcon } from "lucide-react"

interface TrailFormValues {
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

const defaultValues: TrailFormValues = {
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
}

const difficultyOptions: {
  value: TrailDifficulty
  label: string
  color: string
}[] = [
  { value: "easy", label: "Easy", color: "bg-emerald-500" },
  { value: "moderate", label: "Moderate", color: "bg-yellow-500" },
  { value: "hard", label: "Hard", color: "bg-orange-500" },
  { value: "expert", label: "Expert", color: "bg-red-500" },
]

interface TrailFormProps {
  onChangeType: () => void
}

export function TrailForm({ onChangeType }: TrailFormProps) {
  const router = useRouter()
  const form = useForm<TrailFormValues>({ defaultValues })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const hiked = watch("hiked")
  const imageUrl = watch("imageUrl")
  const priority = watch("priority")
  const difficulty = watch("difficulty")
  const trailType = watch("trailType")
  const bestSeason = watch("bestSeason")

  const handleTrailSelect = (suggestion: TrailSuggestion) => {
    setValue("name", suggestion.name, { shouldDirty: true, shouldValidate: true })
    setValue("region", suggestion.region, { shouldDirty: true })
    setValue("country", suggestion.country, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!values.difficulty) {
      setError("difficulty", { message: "Please select a difficulty" })
      return
    }

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Something went wrong.")
        return
      }

      const distanceKm =
        values.distance.trim() === "" ? null : Number(values.distance)
      const durationHours =
        values.duration.trim() === "" ? null : Number(values.duration)
      const elevationM =
        values.elevation.trim() === "" ? null : Number(values.elevation)

      const { error } = await supabase.from("trails").insert({
        user_id: user.id,
        name: values.name.trim(),
        country: values.country.trim(),
        region: values.region.trim() || null,
        difficulty: values.difficulty,
        distance_km: distanceKm,
        elevation_m: elevationM,
        duration_hours: durationHours,
        trail_type: values.trailType || null,
        best_season: values.bestSeason.trim() || null,
        notes: values.notes.trim() || null,
        image_url: values.imageUrl.trim() || null,
        is_hiked: values.hiked,
        hiked_at: values.hiked
          ? values.dateHiked
            ? new Date(values.dateHiked).toISOString()
            : new Date().toISOString()
          : null,
        priority: values.priority,
      })

      if (error) {
        toast.error("Something went wrong.")
        return
      }

      toast.success("Trail saved!")
      router.push("/bucket-list")
    } catch {
      toast.error("Something went wrong.")
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Button type="button" variant="ghost" size="sm" onClick={onChangeType}>
        Change type
      </Button>

      <TrailAutocomplete onSelect={handleTrailSelect} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="trail-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="trail-name"
            placeholder="e.g., Pacific Crest Trail"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
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
              aria-invalid={!!errors.country}
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && (
              <p className="text-sm text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="trail-region">Region/Park</Label>
            <Input
              id="trail-region"
              placeholder="e.g., California"
              {...register("region")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Difficulty <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {difficultyOptions.map((diff) => (
            <button
              key={diff.value}
              type="button"
              onClick={() =>
                setValue("difficulty", diff.value, { shouldValidate: true })
              }
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                difficulty === diff.value
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
          <p className="text-sm text-destructive">{errors.difficulty.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="trail-distance">Distance (km)</Label>
          <Input
            id="trail-distance"
            type="number"
            placeholder="0"
            {...register("distance")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trail-elevation">Elevation (m)</Label>
          <Input
            id="trail-elevation"
            type="number"
            placeholder="0"
            {...register("elevation")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trail-duration">Duration (hrs)</Label>
          <Input
            id="trail-duration"
            type="number"
            placeholder="0"
            {...register("duration")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trail-type">Trail Type</Label>
        <Select
          value={trailType}
          onValueChange={(value) => setValue("trailType", value as TrailType)}
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

      <div className="space-y-2">
        <Label htmlFor="trail-season">Best Season</Label>
        <Select
          value={bestSeason || undefined}
          onValueChange={(value) => setValue("bestSeason", value)}
        >
          <SelectTrigger id="trail-season">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Spring">Spring</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
            <SelectItem value="Autumn">Autumn</SelectItem>
            <SelectItem value="Winter">Winter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setValue("priority", num)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                priority >= num
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border text-muted-foreground hover:border-emerald-500/50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trail-image">Image URL</Label>
        <Input
          id="trail-image"
          placeholder="https://..."
          {...register("imageUrl")}
        />
        {imageUrl ? (
          <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-secondary">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed bg-secondary/50">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="trail-notes">Notes</Label>
        <Textarea
          id="trail-notes"
          placeholder="Any additional notes..."
          {...register("notes")}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="trail-hiked">Already Hiked</Label>
          <Switch
            id="trail-hiked"
            checked={hiked}
            onCheckedChange={(checked) => setValue("hiked", checked)}
          />
        </div>
        {hiked && (
          <div className="space-y-2">
            <Label htmlFor="trail-date-hiked">Date Hiked</Label>
            <Input
              id="trail-date-hiked"
              type="date"
              {...register("dateHiked")}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          Save Trail
        </Button>
        <Link href="/bucket-list">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}
