import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

/**
 * 送信先fastapiエンドポイント
 * /api/categories
 * 
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("set-cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)

  const formData = await request.formData()
  const formDataToArray = Object.entries(Object.fromEntries(formData.entries()))
  const formArrayToBeString = formDataToArray.map(ary => [ary[0], ary[1].toString()])
  const searchParams = new URLSearchParams(formArrayToBeString)
  const requestUrl = `${ backendUrl }categories?${ searchParams }`
  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        Authorization: token,
      }
    }
  )

  return response
}