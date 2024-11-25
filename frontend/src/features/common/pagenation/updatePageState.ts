import PageState from "./PageState"

const updatePageState = (
  pageState: PageState,
  handleSetPageState: React.Dispatch<React.SetStateAction<PageState>>,
  newCurrentPage: number,
) => {
  const newPageState: PageState = { currentPage: newCurrentPage, maxPage: pageState.maxPage }
  handleSetPageState(newPageState)
}

export default updatePageState