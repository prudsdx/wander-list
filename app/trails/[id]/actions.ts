"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function toggleHiked(id: string, currentValue: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const isHiked = !currentValue

  await supabase
    .from("trails")
    .update({
      is_hiked: isHiked,
      hiked_at: isHiked ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/trails/" + id)
}

export async function deleteTrail(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from("trails").delete().eq("id", id).eq("user_id", user.id)

  redirect("/bucket-list")
}
