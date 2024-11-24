import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
) {
  // これはapi/items/にリクエストとしてきたものを受け取る
  const searchParams = request.nextUrl.searchParams
  // searchParamsから必要ないパラメータを削除
  const maxPage = searchParams.get("maxPage")
  if (maxPage) searchParams.delete("maxPage")
  const pageParam = searchParams.get("currentPage") || 1
  // max >= currentではない場合はpage1でリクエスト
  const checkedPageParam = pageParam > (maxPage || 0) ? 1 : pageParam
  searchParams.delete("currentPage")

  const backendUrl = process.env.BACKEND_API_URL
  const requestUrl = `${ backendUrl }items/page/${ checkedPageParam }?${ searchParams }`

  const response = await fetch(requestUrl)
  // エラー処理が必要(空検索は対応済み サーバーエラーなど 未定)
  return response
}