import { supabase } from "../lib/supabase"

export async function getEscuelas() {
  const { data, error } = await supabase.from("escuelas").select("*")

  if (error) {
    throw error
  }

  return data
}

export async function getEscuelaById(id: number) {
  const { data, error } = await supabase
    .from("escuelas")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
