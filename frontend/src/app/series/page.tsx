import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import TextLinkButton from "@/components/TextLinkButton"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"

const SeriesPage = () => {
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

      <PagenationNaviContainer>
        <PagenationNavi href="/series?page=1">1</PagenationNavi>
        <PagenationNavi href="/series?page=2">2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )

  const naviContent = (
    <TextViewButton>
      作品一覧を表示中・・・
    </TextViewButton>
  )
  return (
    <MonitorLayout_SSR
      headerContent={ <TopButton/> }
      viewContent={ viewContent }
      naviContent={ naviContent }
      footerContent
    />
  )
}

export default SeriesPage