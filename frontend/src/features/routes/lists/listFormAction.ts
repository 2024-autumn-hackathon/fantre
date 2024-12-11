"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const listFormAction = async (formData: FormData) => {
  const cookieStore = cookies()
  const cookie = (await cookieStore).get("fantre")
  if (!cookie) return

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const requestUrl = `${ apiBaseUrl }lists`
  
  await fetch(
    requestUrl,
    {
      method: "POST",
      headers: { cookie: `${ cookie.name }=${ cookie.value }` },
      body: formData,
    }
  ).then((response) => {
    if (response.status === 200) {
      redirect("/lists")
    } else {
      // redirect("/error")
    }
    
  })
}

export default listFormAction