import {
  IMAGE_FORMAT_ALLOW_LIST as allowedImages,
} from "@/constants"
import makeToken from "@/utils/makeToken"
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
  const cookie = request.headers.get("set-cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
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
  }
  const formKey = recipientInformation[endpoint].formKey
  const apiEndpoint = recipientInformation[endpoint].endpoint
  const formData = await request.formData()
  const imageFile = formData.get(formKey) as File
  if (!imageFile.size || !allowedImages.includes(imageFile.type)) return Response.error()
  const requestUrl = `${ backendUrl }${ apiEndpoint }`
  // 第三引数に拡張子付きのfile名が必須
  // formData.set("bg_image", imageFile, `Next${ extensions[imageFile.type] }`)
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