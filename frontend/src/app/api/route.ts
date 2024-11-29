import {
  IMAGE_FORMAT_ALLOW_LIST as allowedImages,
  MIME_TO_EXTENSION as extensions,
} from "@/constants"
import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("set-cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const imageFile = await request.blob()

  if (!imageFile.size || !allowedImages.includes(imageFile.type)) return Response.error()
  const requestUrl = `${ backendUrl }user/bg-images`
  const formData = new FormData()
  // 第三引数に拡張子付きのfile名が必須
  formData.append("bg_image", imageFile, `Next${ extensions[imageFile.type] }`)
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