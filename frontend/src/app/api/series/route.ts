import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

/**
 * 送信先fastapiエンドポイント
 * /api/series/page/{current_page}
 * 
 */
export async function GET(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const searchParams = request.nextUrl.searchParams
  const pageParam = searchParams.get("currentPage") || 1
  searchParams.delete("currentPage")

  const backendUrl = process.env.BACKEND_API_URL
  const requestUrl = `${ backendUrl }series/page/${ pageParam }?${ searchParams }`

  const response = await fetch(
    requestUrl,
    {
      headers: {
        Authorization: token,
      }
    }
  )

  return response
}