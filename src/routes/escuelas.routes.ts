import { Router } from "express"
import {
  createEscuelaController,
  getEscuelaByIdController,
  getEscuelasController,
} from "../controllers/escuelas.controller"

const escuelasRouter = Router()

escuelasRouter.get("/", getEscuelasController)
escuelasRouter.get("/:id", getEscuelaByIdController)
escuelasRouter.post("/", createEscuelaController)

export { escuelasRouter }
