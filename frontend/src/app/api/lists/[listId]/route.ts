import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL
/**
 * 送信先fastapiエンドポイント
 * /api/lists/[listId]
 * 
 */
export async function GET(
  request: NextRequest,
  segmentData: {
    params: Promise<{
      listId: string,
    }>,
  },
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const params = await segmentData.params
  const listId = params.listId
  const requestUrl = `${ backendUrl }lists/${ listId }`
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

export async function DELETE(
  request: NextRequest,
  segmentData: {
    params: Promise<{
      listId: string,
    }>,
  },
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const params = await segmentData.params
  const listId = params.listId
  const requestUrl = `${ backendUrl }lists/${ listId }`
  const response = await fetch(
    requestUrl,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }
  )
  return response
}
