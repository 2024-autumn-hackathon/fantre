"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import { KeyTypeIsStringObject, LOADING_IMAGE_URL as loading } from "@/constants"
import OnClickButton from "@/features/common/OnClickButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PageState from "@/features/common/pagenation/PageState"
import { useEffect, useState } from "react"
import calcImageIdList from "./calcImageIdList"
import ImageViewPagenationContainer from "./ImageViewPagenationContainer"
import { removeItemsFromList } from "./removeItemsFromList"
import TextViewItem from "./TextViewItem"

const ListDetailPage = ({
  listId,
  listDetail,
  maxPage,
}: Readonly<{
  listId: string
  listDetail: KeyTypeIsStringObject[]
  maxPage: number
}>) => {
  const [listItems, setListItems] = useState<KeyTypeIsStringObject[]>(listDetail)
  const [itemsToRemoveToCollectionList, setItemsToRemoveToCollectionList] = useState<string[]>([])
  const [isImageView, setIsImageView] = useState<boolean>(false)
  const [pageState, setPageState] = useState<PageState>({
    currentPage: 1,
    maxPage: maxPage,
  })
  const [itemImageIdList, setItemImageIdList] = useState<KeyTypeIsStringObject[]>([])
  const [itemImageUrlList, setItemImageUrlList] = useState<string[]>([])

  useEffect(() => {
    if (!isImageView) return
    const fetchImageUrl = async () => {
      const imageIdList = calcImageIdList(listItems, pageState.currentPage)
      const imageUrlList: string[] = []
      for (const item of imageIdList) {
        const [itemId] = Object.entries(item)[0]
        const response = await fetch(`/api/getImageUrl?endpoint=images/${ itemId }`)
        const imageUrl = response.status !== 200 ? loading : (await response.json()).split("localhost").join("s3-minio")
        imageUrlList.push(imageUrl)
      }
      setItemImageUrlList(imageUrlList)
      setItemImageIdList(imageIdList)
    }
    fetchImageUrl()
  }, [pageState.currentPage, isImageView])

  const viewContent = () => {
    const collectionListItems = isImageView ? null : listItems.map((listItem) => {
      const [itemId, itemName] = Object.entries(listItem)[0]
      return (
        <PagenationListItem key={ itemId }>
          <TextViewItem
            itemId={ itemId }
            itemName={ itemName }
            itemsToRemoveToCollectionList={ itemsToRemoveToCollectionList }
            setItemsToRemoveToCollectionList={ setItemsToRemoveToCollectionList }
          />
        </PagenationListItem>
      )
    })
    return (
      isImageView ?
        <>
          <ImageViewPagenationContainer
            pageState={ pageState }
            handleSetPageState={ setPageState }
            itemImageIdList={ itemImageIdList }
            itemImageUrlList={ itemImageUrlList }
          />
        </> :
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
        <div className="h-full flex flex-col items-center justify-around">
          <TextViewButton >コレクション一覧を表示中...</TextViewButton>
          {
            isImageView ? null :
              <OnClickButton
                handleClick={ () => removeItemsFromList(listId, itemsToRemoveToCollectionList, setItemsToRemoveToCollectionList, listItems, setListItems) }
              >
                チェック項目をリストから削除
              </OnClickButton>
          }
          <OnClickButton
            handleClick={ () => setIsImageView(!isImageView) }
          >
            { isImageView ? "リストビューに切り替え" : "画像ビューに切り替え" }
          </OnClickButton>
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