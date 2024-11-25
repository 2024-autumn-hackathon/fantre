// 長さ4の配列に表示しない場合は0
// 表示する場合はnewCurrentPageになる数値を格納する
const makeLinkManagementList = (
  currentPage: number,
  maxPage: number,
): number[] => {
  const pageNumList = []
  // First
  pageNumList.push(currentPage > 1 ? 1 : 0)
  // Prev
  pageNumList.push(currentPage > 2 ? currentPage - 1 : 0)
  // Next
  pageNumList.push(maxPage - 1 > currentPage ? currentPage + 1 : 0)
  // Last
  pageNumList.push(maxPage > currentPage ? maxPage : 0)

  return pageNumList
}

export default makeLinkManagementList