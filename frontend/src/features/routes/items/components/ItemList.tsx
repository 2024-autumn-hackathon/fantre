import Checkbox from "@/components/Checkbox"
import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"

import { Dispatch, SetStateAction } from "react"
import ItemListType from "./ItemListType"
import ShowItemImageButton from "./ShowItemImageButton"

const ItemList = ({
  itemList,
  itemsToAddToCollectionList,
  setItemsToAddToCollectionList,
}: Readonly<{
  itemList: ItemListType[]
  itemsToAddToCollectionList: string[]
  setItemsToAddToCollectionList: Dispatch<SetStateAction<string[]>>
}>) => {
  const itemListResult = itemList.map((
    obj: ItemListType
  ) => {
    return (obj.id === "" ? null :
      <PagenationListItem
        key={ obj.id }
      >
        <TextLinkButton
          href={`items/${ obj.id }`}
        >
          { obj.item_name }
        </TextLinkButton>
        <Checkbox
          itemsToAddToCollectionList={ itemsToAddToCollectionList }
          setItemsToAddToCollectionList={ setItemsToAddToCollectionList }
          itemId={ obj.id }
        />
        <ShowItemImageButton/>
      </PagenationListItem>
    )
  })

  return itemListResult
}

export default ItemList