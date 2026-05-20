"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function markPlaceVisited(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from("places")
    .update({ is_visited: true, visited_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/bucket-list")
}

export async function markTrailHiked(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from("trails")
    .update({ is_hiked: true, hiked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/bucket-list")
}
