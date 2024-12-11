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
