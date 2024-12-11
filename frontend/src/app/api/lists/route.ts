import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL
/**
 * 送信先fastapiエンドポイント
 * /api/lists
 * 
 */
export async function GET(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const requestUrl = `${ backendUrl }lists`
  const response = await fetch(
    requestUrl,
    {
      headers: {
        Authorization: token,
      },
    }
  )
  return response
}

/**
 * 送信先fastapiエンドポイント
 * /api/lists
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const formData = await request.formData()
  const listName = formData.get("list_name")?.toString()
  if (!listName) return Response.error()
  const listNameBody = `list_name=${ encodeURIComponent(listName) }`

  const requestUrl = `${ backendUrl }lists`

  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: listNameBody,
    }
  )

  return response
}