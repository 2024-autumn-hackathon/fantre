import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import TextLinkButton from "@/components/TextLinkButton"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"

// const CharactersPage = ({
const CharactersPage = async (
  context: {
    params: Promise<{
      seriesId: string
    }>
  }
) => {
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
      <PagenationNaviContainer>
        <PagenationNavi href={`/series/${ seriesId }?page=1`}>1</PagenationNavi>
        <PagenationNavi href={`/series/${ seriesId }?page=2`}>2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )
  return (
    <MonitorLayout_SSR
      headerContent={ <TopButton/> }
      viewContent={ viewContent }
      naviContent={ <TextViewButton>キャラ一覧を表示中・・・</TextViewButton> }
      footerContent
    />
  )
}

export default CharactersPage