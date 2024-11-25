"use client"

import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TopButton from "@/components/TopButton"
import OnClickButton from "@/features/common/OnClickButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import ItemList from "@/features/routes/items/components/ItemList"
import ItemsSearchForm from "@/features/routes/items/components/ItemsSearchForm"
import SelectCollectionListButton from "@/features/routes/items/components/SelectCollectionListButton"
import getItemsByQuery from "@/features/routes/items/getItemsByQuery"
import { useEffect, useState } from "react"
import ItemsTest from "./ItemsTest"


const ItemsPage = () => {
  const [itemList, setItemList] = useState<{
    id: string,
    item_name: string
  }[]>([])
  const [searchInput, setSearchInput] = useState<URLSearchParams>(new URLSearchParams())
  const [pageState, setPageState] = useState<PageState>({currentPage: 1, maxPage: 99})

  // searchInputかpageStateの変更を検知するとitemListの取得を行う
  useEffect(() => {
    const fetchData = async () => {
      const response = await getItemsByQuery(searchInput, pageState)
      if (response.maxPage && response.maxPage !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: pageState.maxPage}
        newPageState.maxPage = response.maxPage
        setPageState(newPageState)
      }
      setItemList(response.items[0]?.id === "" ? [] : response.items)
    }
    fetchData()
    console.log(searchInput, pageState)
  }, [pageState, searchInput])

  const viewContent = () => {
    return (
      <>
        <PagenationListContainer>
          <ItemList
            itemList={ itemList }
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
            <InputButton type="search" inputName="series_name" placeholder="作品名"/>
            <InputButton type="search" inputName="character_name" placeholder="キャラ名"/>
            <InputButton type="search" inputName="item_name" placeholder="商品名"/>
            <InputButton type="search" inputName="tags" placeholder="タグ"/>
            <InputButton type="text" inputName="category_id" placeholder="グッズカテゴリー"/>
            <InputButton type="search" inputName="jan_code" pattern="[a-zA-Z0-9]*" placeholder="JANコード"/>
            <InputButton type="date" inputName="release_date" placeholder="発売日"/>
            <InputButton type="search" inputName="retailers" placeholder="購入場所"/>
            <SubmitButton>検索する！</SubmitButton>
          </ItemsSearchForm>
          <div className="min-h-[calc(56px*3)] flex flex-col h-[calc(100%*3/12)]">
            <LinkButton href="/lists" addClass="mt-4 w-60">コレクションリスト作成</LinkButton>
            <SelectCollectionListButton/>
            <OnClickButton addClass="mt-4 w-60">選択項目をリストに追加</OnClickButton>
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
      footerContent= { <ItemsTest/> }
    />
  )
}

export default ItemsPage