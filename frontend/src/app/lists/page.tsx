import InputButton from "@/components/InputButton"
import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import TopButton from "@/components/TopButton"
import Checkbox from "@/components/Checkbox"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import TextLinkButton from "@/components/TextLinkButton"
import OnClickButton from "@/features/common/OnClickButton"


const ListsPage = () => {

  const viewContent = (
    <>
      <PagenationListContainer>
        <PagenationListItem>
          <TextLinkButton href="/lists/1">
            list 1
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/lists/2">
            list 2
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/lists/3">
            list 3
          </TextLinkButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ3だよ
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
      </PagenationListContainer>
      <PagenationNaviContainer>
        <PagenationNavi href="/lists?page=1">1</PagenationNavi>
        <PagenationNavi href="/lists?page=2">2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )

  const naviContent = (
    <div className="h-full">
      <div>
        <span>コレクションリスト一覧を表示中・・・</span>
      </div>
      <InputButton defaultValue="グッズを探す"/>
      <InputButton defaultValue="コレクションリスト名"/>
      <InputButton defaultValue="コレクションリストを作成"/>
    </div>
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

export default ListsPage