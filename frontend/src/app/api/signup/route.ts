import { BACKEND_AUTH_KEYS as keys } from "@/constants"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_AUTH_URL

/**
 * 送信先fastapiエンドポイント
 * /signup
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const formData = await request.formData()
  const requestUrl = `${ backendUrl }signup`
  const requires = [keys.email, keys.name, keys.pass1, keys.pass2]
  const searchParams = new URLSearchParams()
  for (const form of formData.entries()) {
    const key = form[0]
    const value = form[1].toString()
    if (requires.includes(key)) searchParams.append(key, value)
  }
  if (searchParams.size < requires.length) return

  const response = await fetch(
    requestUrl,
    {
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      method: "POST",
      body: searchParams.toString(),
    }
  )

  return response
}