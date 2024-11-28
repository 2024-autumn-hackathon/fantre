"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TextLinkButton from "@/components/TextLinkButton"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import { useState } from "react"

const SeriesPage = () => {
  const [pageState, setPageState] = useState<PageState>({currentPage: 1, maxPage: 1})
  const viewContent = (
    // 要素を並べて、最終行にページネーションリンクを置く
    <>
      <PagenationListContainer>
        <PagenationListItem>
          <TextLinkButton href="/series/seriesId1">
            作品1だよ
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/series/seriesId2">
            作品2だよ
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/series/seriesId3">
            作品3だよ
          </TextLinkButton>
        </PagenationListItem>
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