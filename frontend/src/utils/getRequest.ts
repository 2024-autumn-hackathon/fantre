import { KeyTypeIsStringObject } from "@/constants"

// items
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getRequestItems = async (
  endpoint: string,
  searchInput: URLSearchParams,
  currentPage: number,
  cookie: string = "",
) => {
  const baseURL = `${ apiBaseUrl }${ endpoint }`
  const newSearchInput = new URLSearchParams(searchInput)
  newSearchInput.set("currentPage", currentPage.toString())
  const requestUrl = `${ baseURL }?${ newSearchInput }`
  const response = cookie === "" ?
    await fetch(requestUrl) :
    await fetch(requestUrl, { headers: { cookie: cookie } })
  return response.status !== 200 ? null : response.json()
}
      
export const getRequestItemsCreate = async (
  endpoint: string,
  choiced?: string,
): Promise<KeyTypeIsStringObject | null> => {
  const onlyCharacterParameter = choiced ? `&seriesId=${ choiced }` : ""
  const requestUrl = `${ apiBaseUrl }items/create?endpoint=${ endpoint }${ onlyCharacterParameter }`

  const response = await fetch(requestUrl)

  return response.status !== 200 ? null : response.json()
}