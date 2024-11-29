import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("set-cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)

  const formData = await request.formData()
  // booleanに変換
  const isNewSeries = formData.get("is_new_series") === "true"
  const isNewCharacter = formData.get("is_new_character") === "true"
  const object = Object.fromEntries(formData.entries())
  object["is_new_series"] = isNewSeries
  object["is_new_character"] = isNewCharacter

  const json = JSON.stringify(object)
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