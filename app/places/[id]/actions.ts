"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function toggleVisited(id: string, currentValue: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const isVisited = !currentValue

  await supabase
    .from("places")
    .update({
      is_visited: isVisited,
      visited_at: isVisited ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/places/" + id)
}

export async function deletePlace(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from("places").delete().eq("id", id).eq("user_id", user.id)

  redirect("/bucket-list")
}
