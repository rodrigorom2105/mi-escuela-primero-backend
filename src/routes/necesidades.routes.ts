import { Router } from "express"
import { requireAuth } from "../middleware/auth.middleware"
import { makeCreate, makeDelete, makeGetAll, makeGetById, makeUpdate } from "../lib/crud-handlers"
import { addNecesidad, findNecesidadById, listNecesidades, modifyNecesidad, removeNecesidad } from "../services/necesidades.service"

const necesidadesRouter = Router()

necesidadesRouter.get("/", makeGetAll(listNecesidades))
necesidadesRouter.get("/:id", makeGetById(findNecesidadById))
necesidadesRouter.post("/", requireAuth, makeCreate(addNecesidad))
necesidadesRouter.patch("/:id", requireAuth, makeUpdate(modifyNecesidad))
necesidadesRouter.delete("/:id", requireAuth, makeDelete(removeNecesidad))

export { necesidadesRouter }
