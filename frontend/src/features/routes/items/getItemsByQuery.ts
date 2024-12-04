import PageState from "@/features/common/pagenation/PageState"
// import testResponse from "@/utils/testResponse"
import { getRequestItems } from "@/utils/getRequest"
import ItemSearchResponse from "./ItemSearchResponse"
import processData from "./processData"
// stateのクエリパラメータ変更がトリガーでitemsのデータを取得するための関数
const getItemsByQuery = async (
  endpoint: string,
  searchInput: URLSearchParams,
  pageState: PageState,
  cookie: string = "",
): Promise<ItemSearchResponse> => {
  if (!searchInput.size) return processData()
  // 以下2行は、入れ替えで固定データとフェッチが切り替わる
  const response = await getRequestItems(endpoint, searchInput, pageState.currentPage, cookie)
  // const response = testResponse(searchInput, pageState.currentPage)
  const result = processData(response)
  console.log(result,"~~~~~~~~~~~~~~~~",response)
  return result
}

export default getItemsByQuery