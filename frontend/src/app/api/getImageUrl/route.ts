import { TOKEN_PREFIX as pre } from "@/constants"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

/**
 * 送信先fastapiエンドポイント
 * /api/images/{item_id}
 * /api/user/bg-images
 */
export async function GET(
  request: NextRequest,
) {
  const cookie = request.cookies.get("fantre") || {value: request.headers.get("cookie")}
  if (!cookie) return Response.error()
  const token = `${ pre }${ cookie.value }`

  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) return Response.error()

  const requestUrl = `${ backendUrl }${ endpoint }`
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