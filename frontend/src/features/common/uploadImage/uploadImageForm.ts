"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const uploadImageForm = async (
  formData: FormData,
  endpoint: string,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return
  const imageFile = formData.get("bg_image")
  if (!imageFile) return

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const requestUrl = `${ apiBaseUrl }${ endpoint }`

  const cookieKey = cookie.name
  const cookieValue = cookie.value

  const header = new Headers({"Set-Cookie": `${ cookieKey }=${ cookieValue }`})
  await fetch(
    requestUrl,
    {
      method: "POST",
      headers: header,
      body: imageFile,
    }
  ).then(res => {
    if (res.status === 200) {
      redirect("/")
    } else {
      // redirect("/error")
    }
  })

}

export default uploadImageForm