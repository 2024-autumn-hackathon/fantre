"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const logoutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("fantre")

  redirect("/login")
}

export default logoutAction