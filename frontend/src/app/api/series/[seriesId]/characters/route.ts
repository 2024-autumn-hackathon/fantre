import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

type Params = Promise<{ seriesId: string }>

/**
 * 送信先fastapiエンドポイント
 * /api/series/{series_id}/characters/page/{current_page}
 * 
 */
export async function GET(
  request: NextRequest,
  segmentData: { params: Params },
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const searchParams = request.nextUrl.searchParams
  const pageParam = searchParams.get("currentPage") || 1
  const params = await segmentData.params
  const seriesId = params.seriesId
  const backendUrl = process.env.BACKEND_API_URL
  const requestUrl = `${ backendUrl }series/${ seriesId }/characters/page/${ pageParam }`

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