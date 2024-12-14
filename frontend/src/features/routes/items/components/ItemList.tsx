import Checkbox from "@/components/Checkbox"
import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"

import { Dispatch, SetStateAction } from "react"
import ItemImageViewer from "./ItemImageViewer"
import ItemListType from "./ItemListType"

const ItemList = ({
  itemList,
  itemsToAddToCollectionList,
  setItemsToAddToCollectionList,
  currentImageUrlList,
}: Readonly<{
  itemList: ItemListType[]
  itemsToAddToCollectionList: string[]
  setItemsToAddToCollectionList: Dispatch<SetStateAction<string[]>>
  currentImageUrlList: string[]
}>) => {
  const itemListResult = itemList.map((
    obj: ItemListType,
    idx: number,
  ) => {
    return (obj.id === "" ? null :
      <PagenationListItem
        key={ obj.id }
      >
        <TextLinkButton
          href={`items/${ obj.id }`}
          addClass="w-[calc(100%-168px)]"
        >
          { obj.item_name }
        </TextLinkButton>
        <Checkbox
          itemsToAddToCollectionList={ itemsToAddToCollectionList }
          setItemsToAddToCollectionList={ setItemsToAddToCollectionList }
          itemId={ obj.id }
        />
        <ItemImageViewer
          imageUrl={ currentImageUrlList[idx] }
        />
      </PagenationListItem>
    )
  })

  return itemListResult
}

export default ItemList