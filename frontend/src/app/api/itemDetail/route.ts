import { TOKEN_PREFIX as pre } from "@/constants"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  console.log(cookie)
  if (!cookie) return Response.error()
  const token = `${ pre }${ cookie }`

  const searchParams = request.nextUrl.searchParams
  const itemId = searchParams.get("itemId")
  if (!itemId) return Response.error()

  const backendUrl = process.env.BACKEND_API_URL
  const requestUrl = `${ backendUrl }items/${ itemId }`

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