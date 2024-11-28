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

// const CharactersPage = ({
const CharactersPage = async (
  context: {
    params: Promise<{
      seriesId: string
    }>
  }
) => {
  const [pageState, setPageState] = useState<PageState>({currentPage: 1, maxPage: 1})
  const { seriesId } = await context.params
  const viewContent = (
    <>
      <PagenationListContainer>
        <PagenationListItem>
          <TextLinkButton href={`/items?seriesId=${ seriesId }&characterId=characterId1`}>
            キャラ1だよ
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href={`/items?seriesId=${ seriesId }&characterId=characterId2`}>
            キャラ2だよ
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href={`/items?seriesId=${ seriesId }&characterId=characterId3`}>
            キャラ3だよ
          </TextLinkButton>
        </PagenationListItem>
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