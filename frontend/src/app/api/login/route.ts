import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_AUTH_URL

/**
 * 送信先fastapiエンドポイント
 * /login
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const formData = await request.formData()
  const requestUrl = `${ backendUrl }login`
  // emailのkeyをusernameとして送る処理
  const requires = ["username", "password"]
  const searchParams = new URLSearchParams()
  for (const form of formData.entries()) {
    const key = form[0] === "email" ? requires[0] : form[0]
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