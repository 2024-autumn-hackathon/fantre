"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import { getRequestItems } from "@/utils/getRequest"
import { useEffect, useRef, useState } from "react"
import SeriesList from "./SeriesList"
import SeriesListType from "./SeriesListType"

const SeriesPage = ({
  initialSeriesList,
  initialPageState,
}: Readonly<{
  initialSeriesList: SeriesListType[]
  initialPageState: PageState
}>) => {
  const isFirstRender = useRef(true)
  const [seriesList, setSeriesList] = useState<SeriesListType[]>(initialSeriesList)
  const [pageState, setPageState] = useState<PageState>(initialPageState)

  // pageStateの変更を検知するとSeriesListの再取得を行う
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false 
      return
    }
    const fetchData = async () => {
      const response = await getRequestItems("series", new URLSearchParams(), pageState.currentPage)
      if (!response) return
      if (response.all_pages && response.all_pages !== pageState.maxPage) {
        const newPageState: PageState = {currentPage: pageState.currentPage, maxPage: response.all_pages}
        setPageState(newPageState)
      }
      setSeriesList(response.series[0]?.id === "" ? [] : response.series)
    }
    fetchData()
  }, [pageState])
  
  const viewContent = (
    // 要素を並べて、最終行にページネーションリンクを置く
    <>
      <PagenationListContainer>
        <SeriesList seriesList={ seriesList }/>
      </PagenationListContainer>

      <PagenationNaviContainer
        pageState={ pageState }
        handleSetPageState={ setPageState }
      />
    </>
  )

  const naviContent = (
    <div className="flex h-full items-center">
      <TextViewButton>
        作品一覧を表示中・・・
      </TextViewButton>
    </div>
  )
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent={ viewContent }
      naviContent={ naviContent }
      footerContent
    />
  )
}

export default SeriesPage