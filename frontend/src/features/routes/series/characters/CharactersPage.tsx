"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import { getRequestItems } from "@/utils/getRequest"
import { useEffect, useRef, useState } from "react"
import CharactersList from "./CharactersList"
import CharactersListType from "./CharactersListType"

const CharactersPage = ({
  initialCharactersList,
  maxPage,
  seriesId,
  seriesName,
}: Readonly<{
  initialCharactersList: CharactersListType[],
  maxPage: number,
  seriesId: string
  seriesName: string
}>) => {
  const isFirstRender = useRef(true)
  const [charactersList, setCharactersList] = useState<CharactersListType[]>(initialCharactersList)
  const [pageState, setPageState] = useState<PageState>({currentPage: 1, maxPage: maxPage})

  // pageStateの変更を検知するとSeriesListの再取得を行う
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false 
      return
    }
    const fetchData = async () => {
      const response = await getRequestItems(`series/${seriesId}/characters`, new URLSearchParams(), pageState.currentPage)
      if (!response) return
      if (response.all_pages && response.all_pages !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: response.all_pages}
        setPageState(newPageState)
      }
      setCharactersList(response.characters[0]?.id === "" ? [] : response.characters)
    }
    fetchData()
  }, [pageState])

  const viewContent = (
    <>
      <PagenationListContainer>
        <CharactersList
          charactersList={ charactersList }
          seriesName={ seriesName }
        />
      </PagenationListContainer>
      <PagenationNaviContainer
        pageState={ pageState }
        handleSetPageState={ setPageState }
      />
    </>
  )
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent={ viewContent }
      naviContent={
        <div className="flex h-full items-center">
          <TextViewButton>キャラ一覧を表示中・・・</TextViewButton>
        </div>
      }
      footerContent
    />
  )
}

export default CharactersPage