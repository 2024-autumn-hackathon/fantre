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