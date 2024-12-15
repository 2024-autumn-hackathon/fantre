import {
  IMAGE_FORMAT_ALLOW_LIST as allowedImages,
  TOKEN_PREFIX as pre,
} from "@/constants"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

/**
 * 送信先fastapiエンドポイント
 * /api/user/bg-images
 * /api/image/{item_id}
 */
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  if (!cookie) return Response.error()
  const token = `${ pre }${ cookie }`
  const itemId = request.nextUrl.searchParams.get("itemId")
  const endpoint = request.nextUrl.searchParams.get("endpoint") || ""
  const recipientInformation: { [key: string]: { formKey: string, endpoint: string } } = {
    top: {
      formKey: "bg_image",
      endpoint: "user/bg-images",
    },
    itemDetail: {
      formKey: "item_image",
      endpoint: `image/${ itemId }`,
    },
    itemCreate: {
      formKey: "item_image",
      endpoint: `image/${ itemId }`,
    },
  }
  const formKey = recipientInformation[endpoint].formKey
  const apiEndpoint = recipientInformation[endpoint].endpoint
  const formData = await request.formData()
  const imageFile = formData.get(formKey) as File
  if (!imageFile.size ||
    !allowedImages.includes(imageFile.type) ||
    imageFile.size >= 2**20
  ) return Response.error()
  const requestUrl = `${ backendUrl }${ apiEndpoint }`
  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    }
  )

  return response
}