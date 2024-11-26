import ItemSearchResponse from "./ItemSearchResponse"

// 受け取ったデータを加工する、もしくは受け取らなかった場合はからデータを返す
const processData = (
  response?: {message?: string, items?: {id: string, item_name: string}[], all_pages: number}
): ItemSearchResponse => {
  const newResponse: ItemSearchResponse = {items: [{id: "", item_name: ""}], maxPage: 1}
  if (!response) return newResponse
  if (response.items) {
    newResponse.items = response.items
    if (response.all_pages) newResponse.maxPage = response.all_pages
  }
  return newResponse
}

export default processData