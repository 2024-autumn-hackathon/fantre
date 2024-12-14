import PageState from "@/features/common/pagenation/PageState"
import { getRequestItems } from "@/utils/getRequest"
import ItemSearchResponse from "../items/ItemSearchResponse"
import processData from "./processData"
// stateのクエリパラメータ変更がトリガーでitemsのデータを取得するための関数
const getListsByQuery = async (
  searchInput: URLSearchParams,
  pageState: PageState
): Promise<ItemSearchResponse> => {
  if (!searchInput.size) return processData()

  const response = await getRequestItems("items", searchInput, pageState.currentPage)

  const result = processData(response)
  return result
}

export default getListsByQuery