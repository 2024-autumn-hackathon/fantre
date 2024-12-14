import { KeyTypeIsStringObject } from "@/constants"
import { Dispatch, SetStateAction } from "react"

export const removeItemsFromList = async (
  listId: string,
  itemsToRemove: string[],
  setItemsToRemoveToCollectionList: Dispatch<SetStateAction<string[]>>,
  listItems: KeyTypeIsStringObject[],
  setListItems: Dispatch<SetStateAction<KeyTypeIsStringObject[]>>
) => {
  const headers = new Headers({
    credentials: "include",
    "Content-Type": "application/json",
  })
  const response = await fetch("/api/list-items", {
    method: "DELETE",
    headers,
    body: JSON.stringify({ listId: listId, listItems: itemsToRemove }),
  }).then(res => {
    if (res.status === 200) {
      const newListItems = listItems.filter(
        (item) => {
          const [key] = Object.entries(item)[0]
          return !itemsToRemove.includes(key)
        }
      )
      setListItems(newListItems)
      setItemsToRemoveToCollectionList([])
    } else {
      alert("削除に失敗しました")
    }
  })
}