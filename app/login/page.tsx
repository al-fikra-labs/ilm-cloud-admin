import { cookies } from "next/headers"
import { LoginPage } from "./login"
import { redirect } from "next/navigation"
import { api } from "@/lib/api"

export default async function Login() {

  // try {
  const cookie = await cookies()
  const token = cookie.get("token")?.value
  if (!token) {
    return (
      <LoginPage />
    )
  }
  let admin = null
  try {
    admin = await api.getProfile(token)
  } catch (error) {
    return <LoginPage />
  }
  if (admin) {
    redirect("/")
  } else return <LoginPage />
}
