import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

export async function GET(
  request: NextRequest,
) {
  // これはapi/items/createにリクエストとしてきたクエリを受け取る
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")
  if (!endpoint) console.error("リクエストを処理できません")

  const seriesId = searchParams.get("seriesId")
  const onlyCharacterEndpoint = seriesId ? `series/${ seriesId }/` : ""
  const requestUrl = `${ backendUrl }${ onlyCharacterEndpoint }${ endpoint }`

  const response = await fetch(requestUrl)
  // エラー処理が必要(空検索は対応済み サーバーエラーなど 未定)
  return response
}

export async function POST(
  request: NextRequest,
) {
  const formData = await request.formData()
  const requestUrl = `${ backendUrl }items`
  const json = JSON.stringify(Object.fromEntries(formData.entries()))

  const response = await fetch(
    requestUrl,
    {
      headers: {"Content-Type":"application/json"},
      method: "POST",
      body: json
    }
  )

  return response
}