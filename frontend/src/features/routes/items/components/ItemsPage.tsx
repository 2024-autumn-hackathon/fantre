"use client"

import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TopButton from "@/components/TopButton"
import {
  KeyTypeIsStringObject,
  LOADING_IMAGE_URL as loading,
  SEARCH_INPUT_KEYS as searchKeys,
} from "@/constants"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import { useEffect, useRef, useState } from "react"
import addItemsToCollectionList from "../addItemsToCollectionList"
import getItemsByQuery from "../getItemsByQuery"
import ItemList from "./ItemList"
import ItemListType from "./ItemListType"
import ItemsSearchForm from "./ItemsSearchForm"
import SelectCollectionListButton from "./SelectCollectionListButton"

const ItemsPage = ({
  initialSearchInput,
  initialItemList,
  initialPageState,
  seriesName,
  characterName,
  collectionLists,
  initialImageUrlList,
}: Readonly<{
  initialSearchInput: URLSearchParams
  initialItemList: ItemListType[]
  initialPageState: PageState
  seriesName: string
  characterName: string
  collectionLists: KeyTypeIsStringObject[]
  initialImageUrlList: string[]
}>) => {
  const isFirstRender = useRef(true)
  const [itemList, setItemList] = useState<ItemListType[]>(initialItemList)
  const [searchInput, setSearchInput] = useState<URLSearchParams>(initialSearchInput)
  const [pageState, setPageState] = useState<PageState>(initialPageState)
  const [itemsToAddToCollectionList, setItemsToAddToCollectionList] = useState<string[]>([])
  const [selectList, setSelectList] = useState<string>("default")
  const [currentImageUrlList, setCurrentImageUrlList] = useState<string[]>(initialImageUrlList)

  // searchInputかpageStateの変更を検知するとitemListの再取得を行う
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const fetchData = async () => {
      const response = await getItemsByQuery("items", searchInput, pageState)
      if (response.maxPage && response.maxPage !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: pageState.maxPage}
        newPageState.maxPage = response.maxPage
        setPageState(newPageState)
      }
      setItemList(response.items[0]?.id === "" ? [] : response.items)
    }
    fetchData()
  }, [pageState, searchInput])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const fetchImageUrl = async () => {
      const imageUrlList: string[] = Array(10).fill(loading)
      for (let i=0; i<itemList.length; i++) {
        const itemId = itemList[i].id
        if (itemId === "") return
        const response = await fetch(`/api/getImageUrl?endpoint=images/${ itemId }`)
        const imageUrl = response.status !== 200 ? loading : (await response.json()).split("localhost").join("s3-minio")
        imageUrlList[i] = imageUrl
      }
      setCurrentImageUrlList(imageUrlList)
    }
    fetchImageUrl()
  }, [itemList])

  const viewContent = () => {
    return (
      <>
        <PagenationListContainer>
          <ItemList
            itemList={ itemList }
            itemsToAddToCollectionList={ itemsToAddToCollectionList }
            setItemsToAddToCollectionList={ setItemsToAddToCollectionList }
            currentImageUrlList={ currentImageUrlList }
          />
        </PagenationListContainer>
        <PagenationNaviContainer
          pageState={ pageState }
          handleSetPageState={ setPageState }
        />
      </>
    )
  }

  const naviContent = () => {
    return (
      <>
        <div className="h-full Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4">
          <ItemsSearchForm
            handleSetSearchInput={ setSearchInput }
          >
            <InputButton defaultValue={ seriesName || "" } type="search" inputName={ searchKeys[0] } labelValue="作品名"/>
            <InputButton defaultValue={ characterName || "" } type="search" inputName={ searchKeys[1] } labelValue="キャラ名"/>
            <InputButton type="search" inputName={ searchKeys[2] } labelValue="商品名"/>
            <InputButton type="search" inputName={ searchKeys[3] } labelValue="タグ"/>
            <InputButton type="search" inputName={ searchKeys[4] } labelValue="グッズカテゴリー"/>
            <InputButton type="search" inputName={ searchKeys[5] } pattern="[a-zA-Z0-9]*" labelValue="JANコード"/>
            <InputButton type="date" inputName={ searchKeys[6] } labelValue="発売日"/>
            <InputButton type="search" inputName={ searchKeys[7] } labelValue="購入場所"/>
            <SubmitButton>検索する！</SubmitButton>
          </ItemsSearchForm>
          <div className="min-h-[calc(56px*3)] flex flex-col h-[calc(100%*3/12)]">
            <LinkButton href="/lists" addClass="mt-4 w-60">コレクションリスト作成</LinkButton>
            <form
              onSubmit={ (e) => addItemsToCollectionList(e, itemsToAddToCollectionList, setItemsToAddToCollectionList, setSelectList) }
            >
              <SelectCollectionListButton
                collectionLists={ collectionLists }
                selectList={ selectList }
                setSelectList={ setSelectList }
              />
              <SubmitButton>選択項目をリストに追加</SubmitButton>
            </form>
          </div>
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

export default ItemsPage