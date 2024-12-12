import { KeyTypeIsStringObject } from "@/constants"
import { Dispatch, SetStateAction } from "react"

const SelectCollectionListButton = ({
  collectionLists,
  selectList,
  setSelectList,
}: {
  collectionLists: KeyTypeIsStringObject[]
  selectList: string
  setSelectList: Dispatch<SetStateAction<string>>
}) => {
  const collectionListNames = collectionLists.map((collectionList) => {
    const [listId, listName] = Object.entries(collectionList)[0]
    return <option key={ listId } value={ listId }>{ listName }</option>
  })
  return (
    <select
      className="mx-auto mt-4 py-2 h-[40px] w-60 rounded-3xl bg-my-orange text-center hover:opacity-80"
      id="list_id"
      name="list-id"
      required
      value={ selectList }
      onChange={ (e) => setSelectList(e.currentTarget.value) }
    >
      <option value="default">追加先リスト選択</option>
      { collectionListNames }
    </select>
  )
}

export default SelectCollectionListButton