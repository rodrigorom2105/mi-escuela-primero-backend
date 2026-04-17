import { createNecesidad, deleteNecesidad, getNecesidadById, getNecesidades, updateNecesidad } from "../repositories/necesidades.repository"

export const listNecesidades = () => getNecesidades()
export const findNecesidadById = (id: number) => getNecesidadById(id)
export const addNecesidad = (body: Record<string, unknown>) => createNecesidad(body)
export const modifyNecesidad = (id: number, body: Record<string, unknown>) => updateNecesidad(id, body)
export const removeNecesidad = (id: number) => deleteNecesidad(id)
