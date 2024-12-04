import Checkbox from "@/components/Checkbox"
import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"

import ItemListType from "./ItemListType"
import ShowItemImageButton from "./ShowItemImageButton"

const ItemList = ({
  itemList,
}: Readonly<{
  itemList: ItemListType[]
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
        <Checkbox/>
        <ShowItemImageButton/>
      </PagenationListItem>
    )
  })

  return itemListResult
}

export default ItemList