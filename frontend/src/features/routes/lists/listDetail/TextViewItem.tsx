import Checkbox from "@/components/Checkbox"
import TextLinkButton from "@/components/TextLinkButton"
import { Dispatch, SetStateAction } from "react"

const TextViewItem = ({
  itemId,
  itemName,
  itemsToRemoveToCollectionList,
  setItemsToRemoveToCollectionList,
}: Readonly<{
  itemId: string
  itemName: string
  itemsToRemoveToCollectionList: string[]
  setItemsToRemoveToCollectionList: Dispatch<SetStateAction<string[]>>
}>) => {
  return (
    <>
      <TextLinkButton
        href={ `/items/${ itemId }` }
        addClass="w-full"
      >
        { itemName }
      </TextLinkButton>
      <Checkbox
        itemsToAddToCollectionList={ itemsToRemoveToCollectionList }
        setItemsToAddToCollectionList={ setItemsToRemoveToCollectionList }
        itemId={ itemId }
      />
    </>
  )
}

export default TextViewItem