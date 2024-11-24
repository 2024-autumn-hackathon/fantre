import makeLinkList from "../makeLinkList"
import PagenationNavi from "./PagenationNavi"

/**
 * @param endpoint /から始まるエンドポイント名
 * @param searchParamsを渡すとリンクにしてくれる
 * @returns 完成品のリンクコンポーネント
 */
const PagenationNaviContainer = ({
  endpoint,
  searchParams,
}: Readonly<{
  endpoint: string
  searchParams: URLSearchParams
}>) => {
  const currentPage = Number(searchParams.get("currentPage"))
  const maxPage = Number(searchParams.get("maxPage"))
  if (!currentPage || !maxPage) return null


  const linkList = makeLinkList(endpoint, searchParams, currentPage, maxPage)
  const charaList = ["First", (currentPage - 1).toString(), currentPage.toString(), (currentPage + 1).toString(), "Last"]

  const prevLink = linkList[1] === "" ? <span className="block w-8 h-6 select-none" /> :
    <PagenationNavi addClass="w-8" href={ linkList[1] }>{ charaList[1] }</PagenationNavi>
  const nextLink = linkList[3] === "" ? <span className="block w-8 h-6 select-none" /> :
    <PagenationNavi addClass="w-8" href={ linkList[3] }>{ charaList[3] }</PagenationNavi>

  return (
    <ol
      className="flex justify-center h-6 [&>*]:mx-1"
    >
      <PagenationNavi addClass="w-16" href={ linkList[0] }>{ charaList[0] }</PagenationNavi>
      <p className="select-none">...</p>
      { prevLink }
      <p className="block w-8 h-6 bg-my-light-green rounded-full text-sm select-none">{ currentPage }</p>
      { nextLink }
      <p className="select-none">...</p>
      <PagenationNavi addClass="w-16" href={ linkList[4] }>{ charaList[4] }</PagenationNavi>
    </ol>
  )
}

export default PagenationNaviContainer