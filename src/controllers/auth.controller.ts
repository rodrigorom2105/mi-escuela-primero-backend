import { Request, Response } from "express"
import { loginUser, registerUser } from "../services/auth.service"

export async function registerController(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" })
    }

    const data = await registerUser(email, password)
    return res.status(201).json({ user: data.user })
  } catch (error: any) {
    console.error("Error registering user:", error)
    return res.status(400).json({ error: error.message ?? "Failed to register user" })
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" })
    }

    const data = await loginUser(email, password)
    return res.json({ access_token: data.session?.access_token })
  } catch (error: any) {
    console.error("Error logging in:", error)
    return res.status(401).json({ error: error.message ?? "Invalid credentials" })
  }
}
