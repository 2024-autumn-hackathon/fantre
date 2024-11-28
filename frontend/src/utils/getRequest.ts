// items
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getRequestItems = async (
  endpoint: string,
  searchInput: URLSearchParams,
  currentPage: number,
) => {
  const baseURL = `${ apiBaseUrl }${ endpoint }`
  const newSearchInput = new URLSearchParams(searchInput)
  newSearchInput.append("currentPage", currentPage.toString())
  const requestUrl = `${ baseURL }?${ searchInput }`
  const response = await fetch(requestUrl)
  // .then(res => {
  //   if (!res.ok) {
  //     throw new Error(`接続エラーです: ${res.statusText}`)
  //   }
  // })
  // .catch(e => {
  //   console.error("接続エラー:", e)
  // })
  // 要ネットワークエラー処理と、fetchの返り値の考慮
  return response === undefined ? Response.json({}) : response.json()
}
      
export const getRequestItemsCreate = async (
  endpoint: string,
  choiced?: string,
) => {
  const onlyCharacterParameter = choiced ? `&seriesId=${ choiced }` : ""
  const requestUrl = `${ apiBaseUrl }items/create?endpoint=${ endpoint }${ onlyCharacterParameter }`

  const response = await fetch(requestUrl)

  return response === undefined ? Response.json({}) : response.json()
}