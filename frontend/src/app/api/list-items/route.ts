import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL
/**
 * 送信先fastapiエンドポイント
 * /api/lists
 * リストの中身更新
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const formData = await request.formData()
  const listId = formData.get("list-id")?.toString()
  const listItems = formData.get("listItems")?.toString()
  if (!listId || !listItems) return Response.error()
  const requestUrl = `${ backendUrl }list-items`
  const urlEncodedList = `list_id=${ encodeURIComponent(listId) }&item_id=${ encodeURIComponent(listItems) }`
  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedList,
    }
  )

  return Response.json(response.status)
}

export async function DELETE(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  console.log("cookie", cookie)
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const jsonData = await request.json()
  console.log("jsonData", jsonData)
  const listId = jsonData.listId
  const listItems = jsonData.listItems
  if (!listId || !listItems) return Response.error()
  const requestUrl = `${ backendUrl }list-items`
  const urlEncodedList = `list_id=${ encodeURIComponent(listId) }&item_id=${ encodeURIComponent(listItems) }`
  console.log("urlEncodedList", urlEncodedList)
  const response = await fetch(
    requestUrl,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedList,
    }
  )
  return response
}