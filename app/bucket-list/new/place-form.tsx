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
import { PlaceAutocomplete } from "@/components/PlaceAutocomplete"
import type { PlaceSuggestion } from "@/lib/geocode"
import { createClient } from "@/lib/supabase/client"
import type { PlaceCategory } from "@/types"
import {
  Compass,
  Image as ImageIcon,
  Landmark,
  Leaf,
  Umbrella,
  UtensilsCrossed,
} from "lucide-react"

interface PlaceFormValues {
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

const defaultValues: PlaceFormValues = {
  name: "",
  country: "",
  city: "",
  category: "",
  priority: 3,
  imageUrl: "",
  notes: "",
  visited: false,
  dateVisited: "",
}

const categoryOptions: {
  value: PlaceCategory
  label: string
  icon: React.ReactNode
}[] = [
  { value: "nature", label: "Nature", icon: <Leaf className="h-4 w-4" /> },
  { value: "culture", label: "Culture", icon: <Landmark className="h-4 w-4" /> },
  { value: "adventure", label: "Adventure", icon: <Compass className="h-4 w-4" /> },
  { value: "food", label: "Food", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "beach", label: "Beach", icon: <Umbrella className="h-4 w-4" /> },
]

interface PlaceFormProps {
  onChangeType: () => void
}

export function PlaceForm({ onChangeType }: PlaceFormProps) {
  const router = useRouter()
  const form = useForm<PlaceFormValues>({ defaultValues })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const visited = watch("visited")
  const imageUrl = watch("imageUrl")
  const priority = watch("priority")
  const category = watch("category")

  const handlePlaceSelect = (suggestion: PlaceSuggestion) => {
    setValue("name", suggestion.name, { shouldDirty: true, shouldValidate: true })
    setValue("city", suggestion.city, { shouldDirty: true })
    setValue("country", suggestion.country, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!values.category) {
      setError("category", { message: "Please select a category" })
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

      const { error } = await supabase.from("places").insert({
        user_id: user.id,
        name: values.name.trim(),
        country: values.country.trim(),
        city: values.city.trim() || null,
        category: values.category,
        notes: values.notes.trim() || null,
        image_url: values.imageUrl.trim() || null,
        is_visited: values.visited,
        visited_at: values.visited
          ? values.dateVisited
            ? new Date(values.dateVisited).toISOString()
            : new Date().toISOString()
          : null,
        priority: values.priority,
      })

      if (error) {
        toast.error("Something went wrong.")
        return
      }

      toast.success("Place saved!")
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

      <PlaceAutocomplete onSelect={handlePlaceSelect} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="place-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="place-name"
            placeholder="e.g., Eiffel Tower"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
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
            <Label htmlFor="place-city">City/Area</Label>
            <Input
              id="place-city"
              placeholder="e.g., Paris"
              {...register("city")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Category <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {categoryOptions.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() =>
                setValue("category", cat.value, { shouldValidate: true })
              }
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                category === cat.value
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
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
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
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="place-image">Image URL</Label>
        <Input
          id="place-image"
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
        <Label htmlFor="place-notes">Notes</Label>
        <Textarea
          id="place-notes"
          placeholder="Any additional notes..."
          {...register("notes")}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="place-visited">Already Visited</Label>
          <Switch
            id="place-visited"
            checked={visited}
            onCheckedChange={(checked) => setValue("visited", checked)}
          />
        </div>
        {visited && (
          <div className="space-y-2">
            <Label htmlFor="place-date-visited">Date Visited</Label>
            <Input
              id="place-date-visited"
              type="date"
              {...register("dateVisited")}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          Save Place
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
