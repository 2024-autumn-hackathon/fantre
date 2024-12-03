import {
  BACKEND_UPDATE_ITEM_KEYS as keys,
  TOKEN_PREFIX as pre
} from "@/constants"
import makeToken from "@/utils/makeToken"
import { NextRequest } from "next/server"

const backendUrl = process.env.BACKEND_API_URL

export async function GET(
  request: NextRequest,
) {
  const cookie = request.headers.get("cookie")
  console.log(cookie)
  if (!cookie) return Response.error()
  const token = `${ pre }${ cookie }`

  const searchParams = request.nextUrl.searchParams
  const itemId = searchParams.get("itemId")
  if (!itemId) return Response.error()

  const requestUrl = `${ backendUrl }items/${ itemId }`

  const response = await fetch(
    requestUrl,
    {
      headers: {
        Authorization: token,
      }
    }
  )
  return response
}

// itemDetailの更新用api
export async function POST(
  request: NextRequest,
) {
  const cookie = request.headers.get("set-cookie")
  if (!cookie) return Response.error()
  const token = makeToken(cookie)
  const formData = await request.formData()
  
  const itemId = request.nextUrl.searchParams.get("item_id")
  if (!itemId)  return Response.error()

  const requestUrl = `${ backendUrl }items/${ itemId }`
  const arrayTypeList = [keys.tags, keys.retailers]
  const formToObjectToArray = Object.entries(Object.fromEntries(formData.entries()))
  const newObject: {[key: string]: string | string[]} = {}
  formToObjectToArray.forEach(ary => {
    const key = ary[0]
    const value = ary[1].toString()
    if (value !== "") {
      if (arrayTypeList.includes(key)) {
        newObject[key] = value.split(",")
      } else {
        newObject[key] = value
      }
    }
  })
  const jsonData = JSON.stringify(newObject)

  const response = await fetch(
    requestUrl,
    {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: jsonData,
    }
  )

  return response
}