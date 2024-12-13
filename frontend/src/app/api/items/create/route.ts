import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

/**
 * 送信先fastapiエンドポイント
 * /api/series 作品一覧全取得
 * /api/series/{series_id}/characters 作品内キャラクター一覧全取得
 */
export async function GET(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  // これはapi/items/createにリクエストとしてきたクエリを受け取る
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")
  if (!endpoint) console.error("リクエストを処理できません")

  const seriesId = searchParams.get("seriesId")
  const onlyCharacterEndpoint = seriesId ? `series/${ seriesId }/` : ""
  const requestUrl = `${ backendUrl }${ onlyCharacterEndpoint }${ endpoint }`

  const response = await fetch(
    requestUrl,
    {
      headers:{
        Authorization: token,
      },
    })
  // エラー処理が必要(空検索は対応済み サーバーエラーなど 未定)
  return response
}

/**
 * 送信先fastapiエンドポイント
 * /api/items アイテム作成
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  console.log(cookie)
  if (!cookie) return Response.error()
  const token = makeToken(cookie)

  const formData = await request.formData()
  const requestUrl = `${ backendUrl }items`
  const json = JSON.stringify(Object.fromEntries(formData.entries()))

  const response = await fetch(
    requestUrl,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      method: "POST",
      body: json
    }
  )

  return response
}