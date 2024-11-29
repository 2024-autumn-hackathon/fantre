import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
) {
  // これはapi/items/にリクエストとしてきたものを受け取る
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)

  const searchParams = request.nextUrl.searchParams
  const pageParam = searchParams.get("currentPage") || 1
  searchParams.delete("currentPage")

  const backendUrl = process.env.BACKEND_API_URL
  const requestUrl = `${ backendUrl }items/page/${ pageParam }?${ searchParams }`

  const response = await fetch(
    requestUrl,
    {
      headers: {
        Authorization: token,
      }
    }
  )
  // エラー処理が必要(空検索は対応済み サーバーエラーなど 未定)
  return response
}