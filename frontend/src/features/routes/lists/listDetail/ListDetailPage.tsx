"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import { KeyTypeIsStringObject } from "@/constants"
import OnClickButton from "@/features/common/OnClickButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import { useState } from "react"
import ImageViewItem from "./ImageViewItem"
import { removeItemsFromList } from "./removeItemsFromList"
import TextViewItem from "./TextViewItem"

const ListDetailPage = ({
  listId,
  listDetail,
}: Readonly<{
  listId: string
  listDetail: KeyTypeIsStringObject[]
}>) => {
  const [listItems, setListItems] = useState<KeyTypeIsStringObject[]>(listDetail)
  const [itemsToRemoveToCollectionList, setItemsToRemoveToCollectionList] = useState<string[]>([])
  const [isImageView, setIsImageView] = useState<boolean>(false)
  const viewContent = () => {
    const collectionListItems = listItems.map((listItem) => {
      const [itemId, itemName] = Object.entries(listItem)[0]
      return (
        <PagenationListItem key={ itemId }>
          {
            isImageView ?
              <ImageViewItem itemId={ itemId } /> :
              <TextViewItem
                itemId={ itemId }
                itemName={ itemName }
                itemsToRemoveToCollectionList={ itemsToRemoveToCollectionList }
                setItemsToRemoveToCollectionList={ setItemsToRemoveToCollectionList }
              />
          }
        </PagenationListItem>
      )
    })
    return (
      <>
        <PagenationListContainer>
          { collectionListItems }
        </PagenationListContainer>
      </>
    )
  }

  const naviContent = () => {
    return (
      <>
        <div className="h-full">
          <TextViewButton >コレクション一覧を表示中...</TextViewButton>
          <OnClickButton
            handleClick={ () => removeItemsFromList(listId, itemsToRemoveToCollectionList, setItemsToRemoveToCollectionList, listItems, setListItems) }
          >
            チェック項目をリストから削除
          </OnClickButton>
          <OnClickButton>画像ビューに切り替え</OnClickButton>
        </div>
      </>
    )
  }

  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent={ viewContent() }
      naviContent={ naviContent() }
      footerContent
    />
  )
}

export default ListDetailPage