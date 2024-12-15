import PageState from "@/features/common/pagenation/PageState"
import checkIsSearchInputEmpty from "@/utils/checkIsSearchInputEmpty"
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
  if (searchInput.size === 0 ||
    !checkIsSearchInputEmpty(searchInput)
  ) return processData()
  
  const response = await getRequestItems(endpoint, searchInput, pageState.currentPage, cookie)
  
  const result = processData(response)
  return result
}

export default getItemsByQuery