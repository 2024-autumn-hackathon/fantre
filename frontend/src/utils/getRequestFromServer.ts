import { cookies } from "next/headers"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

// items/[itemId]
export const getRequestItemDetail = async (
  endpoint: string,
  searchParams: URLSearchParams,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return Response.error()
  const header = new Headers({cookie: cookie.value})

  const requestUrl = `${ apiBaseUrl }${ endpoint }?${ searchParams }`
  const response = await fetch(
    requestUrl,
    {
      headers: header,
    }
  )
  return response.status !== 200 ? null : response.json()
}

export const getRequestByPage = async (
  endpoint: string,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return Response.error()
  const baseURL = `${ apiBaseUrl }${ endpoint }`
  const searchParams = new URLSearchParams([["currentPage", "1"]])
  const requestUrl = `${ baseURL }?${ searchParams }`
  const response = await fetch(requestUrl, {headers: {cookie: `fantre=${cookie.value}`}})
  return response.status !== 200 ? null : response.json()
}

export const getImageUrl = async (
  endpoint: string,
) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return Response.error()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const requestUrl = `${ apiBaseUrl }/getImageUrl?endpoint=${ endpoint }`
  const response = await fetch(
    requestUrl,
    {
      headers: {
        cookie: cookie.value,
      },
    }
  )

  return response?.status === 200 ? await response.json() : null
}

export const getCollectionList = async () => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return Response.error()
  const requestUrl = `${ apiBaseUrl }lists`
  const response = await fetch(requestUrl, {headers: {cookie: `fantre=${cookie.value}`}})
  return response.status !== 200 ? null : response.json()
}