"use server"

import updateItemDetail from "@/features/routes/itemDetails/updateItemDetail"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const uploadImageAndForm = async (
  formData: FormData,
  imageId: string,
  itemId: string = "",
  endpoint: string,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return
  const header = new Headers({"Cookie": cookie.value})

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const searchParams = new URLSearchParams([["endpoint", endpoint]])
  if (itemId !== "") searchParams.set("itemId", itemId)

  // itemDetail用 formData内にあるcustom～の値を使って別のリクエストを送信する
  if (formData.get("custom_item_name")) {
    updateItemDetail(formData, header, apiBaseUrl, itemId)
  }

  // createItem専用
  let createdItemId = ""
  if (endpoint === "itemCreate") {
    const createItemFormData = new FormData()
    for (const [key, value] of formData.entries()) {
      if (value !== "") createItemFormData.set(key, value.toString())
    }
    const response = await fetch(
      `${ apiBaseUrl }items/create`,
      {
        method: "POST",
        headers: header,
        body: createItemFormData,
      }
    )
    if (response.status !== 200) return 500
    const responseJson = await response.json()
    createdItemId = responseJson._id
    searchParams.set("itemId", createdItemId)
  }
  const imageFile = formData.get(imageId) as File
  if (imageFile.size === 0 && endpoint === "itemCreate") return redirect(`/items/${ createdItemId }`)
  if (imageFile.size === 0) return createdItemId
  if (imageFile.size >= 2**20) return
  const newFormData = new FormData()
  newFormData.set(imageId, imageFile)
  const requestUrl = `${ apiBaseUrl }uploadImage?${ searchParams }`
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
      if (endpoint === "itemCreate") return redirect(`/items/${ createdItemId }`)
    } else {
      if (endpoint === "items/create") return 206
    }
  })

}

export default uploadImageAndForm