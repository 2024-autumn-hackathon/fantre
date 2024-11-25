import Checkbox from "@/components/Checkbox"
import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import ShowItemImageButton from "./ShowItemImageButton"

const ItemList = ({
  itemList,
}: Readonly<{
  itemList: {id: string, item_name: string}[]
}>) => {  
  const itemListResult = itemList.map((
    obj: {id: string, item_name: string}
  ) => {
    return (
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