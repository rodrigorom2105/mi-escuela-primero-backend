import "dotenv/config"
import express from "express"
import cors from "cors"
import { escuelasRouter } from "./routes/escuelas.routes"

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
  res.json({ message: "API is running" })
})

app.use("/escuelas", escuelasRouter)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
