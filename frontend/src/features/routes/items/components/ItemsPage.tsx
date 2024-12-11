"use client"

import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TopButton from "@/components/TopButton"
import { KeyTypeIsStringObject } from "@/constants"
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
}: Readonly<{
  initialSearchInput: URLSearchParams
  initialItemList: ItemListType[]
  initialPageState: PageState
  seriesName: string
  characterName: string
  collectionLists: KeyTypeIsStringObject[]
}>) => {
  const isFirstRender = useRef(true)
  const [itemList, setItemList] = useState<ItemListType[]>(initialItemList)
  const [searchInput, setSearchInput] = useState<URLSearchParams>(initialSearchInput)
  const [pageState, setPageState] = useState<PageState>(initialPageState)
  const [itemsToAddToCollectionList, setItemsToAddToCollectionList] = useState<string[]>([])

  // searchInputかpageStateの変更を検知するとitemListの再取得を行う
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const fetchData = async () => {
      const response = await getItemsByQuery("items", searchInput, pageState)
      console.log(response)
      if (response.maxPage && response.maxPage !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: pageState.maxPage}
        newPageState.maxPage = response.maxPage
        setPageState(newPageState)
      }
      console.log("---------", response)
      setItemList(response.items[0]?.id === "" ? [] : response.items)
    }
    fetchData()
  }, [pageState, searchInput])

  const viewContent = () => {
    return (
      <>
        <PagenationListContainer>
          <ItemList
            itemList={ itemList }
            itemsToAddToCollectionList={ itemsToAddToCollectionList }
            setItemsToAddToCollectionList={ setItemsToAddToCollectionList }
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
            <InputButton defaultValue={ seriesName || "" } type="search" inputName="series_name" labelValue="作品名"/>
            <InputButton defaultValue={ characterName || "" } type="search" inputName="character_name" labelValue="キャラ名"/>
            <InputButton type="search" inputName="item_name" labelValue="商品名"/>
            <InputButton type="search" inputName="tags" labelValue="タグ"/>
            <InputButton type="search" inputName="category_id" labelValue="グッズカテゴリー"/>
            <InputButton type="search" inputName="jan_code" pattern="[a-zA-Z0-9]*" labelValue="JANコード"/>
            <InputButton type="date" inputName="release_date" labelValue="発売日"/>
            <InputButton type="search" inputName="retailers" labelValue="購入場所"/>
            <SubmitButton>検索する！</SubmitButton>
          </ItemsSearchForm>
          <div className="min-h-[calc(56px*3)] flex flex-col h-[calc(100%*3/12)]">
            <LinkButton href="/lists" addClass="mt-4 w-60">コレクションリスト作成</LinkButton>
            <form
              onSubmit={ (e) => addItemsToCollectionList(e, itemsToAddToCollectionList) }
            >
              <SelectCollectionListButton collectionLists={ collectionLists }/>
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