"use server"

import updateItemDetail from "@/features/routes/itemDetails/updateItemDetail"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const uploadImage = async (
  formData: FormData,
  imageId: string,
  itemId: string = "",
  endpoint: string,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return
  const cookieValue = cookie.value
  const cookieKey = cookie.name
  const header = new Headers({"Set-Cookie": `${ cookieKey }=${ cookieValue }`})

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const searchParams = new URLSearchParams([["endpoint", endpoint]])
  if (itemId !== "") searchParams.set("itemId", itemId)
  const requestUrl = `${ apiBaseUrl }uploadImage?${ searchParams }`

  // itemDetail用 formData内にあるcustom～の値を使って別のリクエストを送信する
  if (formData.get("custom_item_name")) {
    updateItemDetail(formData, header, apiBaseUrl, itemId)
  }

  const imageFile = formData.get(imageId) as File
  if (!imageFile) return
  if (imageFile.size >= 2**20) return
  const newFormData = new FormData()
  newFormData.set(imageId, imageFile)

  await fetch(
    requestUrl,
    {
      method: "POST",
      headers: header,
      body: newFormData,
    }
  ).then(res => {
    if (res.status === 200) {
      if (endpoint === "top") redirect("/")
      if (endpoint === "itemDetail") redirect(`/items/${ itemId }`)
    } else {
      // redirect("/error")
    }
  })

}

export default uploadImage