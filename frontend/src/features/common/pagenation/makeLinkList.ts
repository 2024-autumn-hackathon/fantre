// 長さ5の配列にhref用の文字列を格納して返す関数
// 真ん中はリンクなし
const makeLinkList = (
  endpoint: string,
  searchParams: URLSearchParams,
  currentPage: number,
  maxPage: number,
): string[] => {
  const linkList = Array(5).fill(null).map((val, idx) => {
    const toLinkSearchParams = new URLSearchParams(searchParams)
    if (idx === 0) toLinkSearchParams.set("currentPage", "1")
    if (idx === 1) {
      if (currentPage > 2) {
        toLinkSearchParams.set("currentPage", (currentPage - 1).toString())
      } else {
        return ""
      }
    }
    if (idx === 2) return ""
    if (idx === 3) {
      if (currentPage + 1 < maxPage) {
        toLinkSearchParams.set("currentPage", (currentPage + 1).toString())
      } else {
        return ""
      }
    }
    if (idx === 4) toLinkSearchParams.set("currentPage", maxPage.toString())

    return `${ endpoint }?${ toLinkSearchParams }`
  })

  return linkList
}

export default makeLinkList