import { signIn, signUp } from "../repositories/auth.repository"

export async function registerUser(email: string, password: string) {
  return signUp(email, password)
}

export async function loginUser(email: string, password: string) {
  return signIn(email, password)
}
