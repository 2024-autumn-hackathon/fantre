"use client"

import InputButton from "@/components/InputButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import LinkButton from "@/components/LinkButton"
import TextViewButton from "@/components/TextViewButton"
import SubmitButton from "@/components/SubmitButton"
import { useEffect, useState } from "react"
import PageState from "@/features/common/pagenation/PageState"
import getListsByQuery from "@/features/routes/lists/getListsByQuery"

const ListsPage = () => {
  const [listList, setListList] = useState<{
    id: string,
    list_name: string
  }[]>([])
  const [searchInput, setSearchInput] = useState<URLSearchParams>(new URLSearchParams())
  const [pageState, setPageState] = useState<PageState>({currentPage: 1, maxPage: 1})

  useEffect(() => {
    const fetchData = async () => {
      const response = await getListsByQuery(searchInput, pageState)
      if (response.maxPage && response.maxPage !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: pageState.maxPage}
        newPageState.maxPage = response.maxPage
        setPageState(newPageState)
      }
      setListList(response.items[0]?.id === "" ? [] : response.items)
    }
    fetchData()
  }, [pageState, searchInput])


  const viewContent = () => {
    return (
      <>
        <PagenationListContainer>
          <ListList
            listList={ listList }
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
        <div className="h-full">
          <TextViewButton addClass="h-[60px]">コレクションリスト一覧を表示中...</TextViewButton>
          <LinkButton href="/items" addClass="mt-4 w-60">グッズを探す</LinkButton>
          <InputButton inputName="list_name" placeholder="コレクションリスト名"/>
          <SubmitButton>コレクションリストを作成</SubmitButton>
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

export default ListsPage