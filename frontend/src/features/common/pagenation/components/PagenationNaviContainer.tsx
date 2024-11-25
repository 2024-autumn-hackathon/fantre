import makeLinkManagementList from "../makeLinkManagementList"
import PageState from "../PageState"
import PagenationNavi from "./PagenationNavi"

/**
 * @param pageState useStateの値
 * @param handleSetPageState useStateの更新関数
 * @returns 完成品のリンクコンポーネント
 */
const PagenationNaviContainer = ({
  pageState,
  handleSetPageState,
}: Readonly<{
  pageState: PageState
  handleSetPageState: React.Dispatch<React.SetStateAction<PageState>>
}>) => {
  const { currentPage, maxPage } = pageState
  const linkManagementList = makeLinkManagementList(currentPage, maxPage)
  const firstLink = linkManagementList[0] === 0 ? null :
    <>
      <PagenationNavi
        addClass="w-16"
        pageState={ pageState }
        handleSetPageState={ handleSetPageState }
        newCurrentPage={ linkManagementList[0] }
        liClass="col-start-2"
      >
        First
      </PagenationNavi>
      <p className="select-none col-start-3">...</p>
    </>

  const prevLink = linkManagementList[1] === 0 ? null :
    <>
      <PagenationNavi
        addClass="w-8"
        pageState={ pageState }
        handleSetPageState={ handleSetPageState }
        newCurrentPage={ linkManagementList[1] }
        liClass="col-start-4"
      >
        { linkManagementList[1].toString() }
      </PagenationNavi>
    </>

  const nextLink = linkManagementList[2] === 0 ? null :
    <>
      <PagenationNavi
        addClass="w-8"
        pageState={ pageState }
        handleSetPageState={ handleSetPageState }
        newCurrentPage={ linkManagementList[2] }
        liClass="col-start-6"
      >
        { linkManagementList[2].toString() }
      </PagenationNavi>
    </>

  const lastLink = linkManagementList[3] === 0 ? null :
    <>
      <p className="select-none col-start-7">...</p>
      <PagenationNavi
        addClass="w-20"
        pageState={ pageState }
        handleSetPageState={ handleSetPageState }
        newCurrentPage={ linkManagementList[3] }
        liClass="col-start-8"
      >
        { `Last.${maxPage}` }
      </PagenationNavi>
    </>

  return (
    <ol
      className="grid h-6 grid-cols-[1fr_120px_24px_repeat(3,48px)_24px_120px_1fr] [&>*]:mx-auto"
    >
      { firstLink }
      { prevLink }
      <p className="block w-8 h-6 bg-my-light-green rounded-full leading-relaxed text-sm select-none col-start-5">{ currentPage }</p>
      { nextLink }
      { lastLink }
    </ol>
  )
}

export default PagenationNaviContainer