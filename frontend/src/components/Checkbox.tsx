import { Dispatch, SetStateAction } from "react"

const Checkbox = ({
  itemsToAddToCollectionList,
  setItemsToAddToCollectionList,
  itemId,
}: Readonly<{
  itemsToAddToCollectionList: string[]
  setItemsToAddToCollectionList: Dispatch<SetStateAction<string[]>>
  itemId: string
}>) => {
  return (
    <input
      type="checkbox"
      className="block h-8 aspect-square"
      checked={ itemsToAddToCollectionList.includes(itemId) }
      onChange={
        (e) => {
          if (itemsToAddToCollectionList.includes(itemId)) {
            setItemsToAddToCollectionList(itemsToAddToCollectionList.filter((id) => id !== itemId))
          } else {
            setItemsToAddToCollectionList([...itemsToAddToCollectionList, itemId])
          }
        }
      }
    />
  )
}

export default Checkbox