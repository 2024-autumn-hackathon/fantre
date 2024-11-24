"use client"

import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TopButton from "@/components/TopButton"
import OnClickButton from "@/features/common/OnClickButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import ItemList from "@/features/routes/items/components/ItemList"
import ItemsSearchForm from "@/features/routes/items/components/ItemsSearchForm"
import SelectCollectionListButton from "@/features/routes/items/components/SelectCollectionListButton"
import getItemsByQuery from "@/utils/getItemsByQuery"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ItemsTest from "./ItemsTest"


const ItemsPage = () => {
  const [itemList, setItemList] = useState<{
    id: string,
    item_name: string
  }[]>([])
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState<URLSearchParams>()
  const router = useRouter()
  const pathName = usePathname()

  // searchInputの更新を検知するとURLをsearchInputのクエリで書き換える
  useEffect(() => {
    router.push(`${pathName}?${searchInput ? searchInput : ""}`)
  }, [searchInput])

  // URLのクエリの変更を検知するとsearchParamsをもとにitemListの取得を行う
  useEffect(() => {
    const fetchData = async () => {
      const response = await getItemsByQuery(searchParams)
      const newSearchParams = new URLSearchParams(searchParams)
      const currentPage = searchParams.get("currentPage")
      const maxPage = response.maxPage
      if (!currentPage || Number(currentPage) > maxPage) newSearchParams.set("currentPage", "1")
      if (maxPage) newSearchParams.set("maxPage", maxPage.toString())
      setSearchInput(newSearchParams)
      setItemList(response.items[0]?.id === "" ? [] : response.items)
    }
    fetchData()
  }, [searchParams])

  const viewContent = () => {
    return (
      <>
        <PagenationListContainer>
          <ItemList
            itemList={ itemList }
          />
        </PagenationListContainer>
        <PagenationNaviContainer
          endpoint="/items"
          searchParams={ searchParams }
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