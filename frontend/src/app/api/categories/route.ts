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
  const searchParams = new URLSearchParams(formData)
  const requestUrl = `${ backendUrl }categories?${ searchParams }`
  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        Authorization: token,
      }
    }
  )

  return response
}