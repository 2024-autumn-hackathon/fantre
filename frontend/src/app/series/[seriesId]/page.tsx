import MonitorLayout from "@/components/MonitorLayout"
import TextLinkButton from "@/components/TextLinkButton"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PagenationNavi from "@/features/common/pagenation/components/PagenationNavi"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"

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