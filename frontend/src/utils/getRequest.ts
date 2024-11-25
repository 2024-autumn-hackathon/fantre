/**
 * 
 * @param endpoint /から続く、先頭と最後の/は不要
 * @param searchInput
 */
export const getRequest = async (
  endpoint: string,
  searchInput: URLSearchParams,
  currentPage: number,
) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
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
  console.log(response)
  return response === undefined ? Response.json({}) : response.json()
}
