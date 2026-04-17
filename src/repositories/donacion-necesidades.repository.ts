import { supabase } from "../lib/supabase"

export async function getDonacionNecesidades() {
  const { data, error } = await supabase.from("donacion_necesidades").select("*")
  if (error) throw error
  return data
}

export async function getDonacionNecesidadById(id: string) {
  const { data, error } = await supabase.from("donacion_necesidades").select("*").eq("id", id).maybeSingle()
  if (error) throw error
  return data
}

export async function createDonacionNecesidad(body: Record<string, unknown>) {
  const { data, error } = await supabase.from("donacion_necesidades").insert(body).select().single()
  if (error) throw error
  return data
}

export async function updateDonacionNecesidad(id: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.from("donacion_necesidades").update(body).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteDonacionNecesidad(id: string) {
  const { error } = await supabase.from("donacion_necesidades").delete().eq("id", id)
  if (error) throw error
}
