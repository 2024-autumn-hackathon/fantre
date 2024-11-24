import processData from "../features/routes/items/processData"
import testResponse from "./testResponse"
// stateのクエリパラメータ変更がトリガーでitemsのデータを取得するための関数
const getItemsByQuery = async (
  searchParams: URLSearchParams,
): Promise<{items: {id: string, item_name: string}[], maxPage: number}> => {
  if (!searchParams.size) return processData()
  // maxPageの除去とmaxPage >= currentPageのチェック
  const newSearchParams = new URLSearchParams(searchParams)
  const maxPage = Number(searchParams.get("maxPage"))
  const currentPage = Number(searchParams.get("currentPage")) || 1
  if (maxPage) {
    newSearchParams.delete("maxPage")
    if (maxPage < currentPage) newSearchParams.set("currentPage", "1")
  }
  // page以外のクエリがない場合は終了
  if (newSearchParams.size === 1) return processData()
  // 以下3行は、入れ替えで固定データとフェッチが切り替わる
  // const response = await getRequest("items", newSearchParams)
  newSearchParams.set("maxPage", "7")
  const response = testResponse(newSearchParams)

  const result = processData(response)
  return result
}

export default getItemsByQuery