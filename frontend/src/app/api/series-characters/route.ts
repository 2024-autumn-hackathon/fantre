import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

/**
 * 送信先fastapiエンドポイント
 * /api/series-characters create内作品とキャラ作成
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)

  const formData = await request.formData()
  const toJsonObject: { [key: string]: string | boolean } = {}
  for (const form of formData.entries()) {
    const key = form[0]
    const value = form[1].toString()
    if (key.startsWith("is")) {
      toJsonObject[key] = value === "true"
    } else {
      toJsonObject[key] = value
    }
  }
  const json = JSON.stringify(toJsonObject)

  const requestUrl = `${ backendUrl }series-characters`
  const response = await fetch(
    requestUrl,
    {
      headers: {
        "Content-Type":"application/json",
        Authorization: token,
      },
      method: "POST",
      body: json
    }
  )

  return response
}