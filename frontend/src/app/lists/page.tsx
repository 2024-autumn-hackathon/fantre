import InputButton from "@/components/InputButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PagenationNavi from "@/features/common/pagenation/components/PagenationNavi"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import TextLinkButton from "@/components/TextLinkButton"
import LinkButton from "@/components/LinkButton"
import TextViewButton from "@/components/TextViewButton"
import SubmitButton from "@/components/SubmitButton"

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
      </PagenationListContainer>
      <PagenationNaviContainer>
        <PagenationNavi href="/lists?page=1">1</PagenationNavi>
        <PagenationNavi href="/lists?page=2">2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )

  const naviContent = (
    <>
      <div className="h-full">
        <TextViewButton addClass="h-[60px]">コレクションリスト一覧を表示中...</TextViewButton>
        <LinkButton href="/items" addClass="mt-4 w-60">グッズを探す</LinkButton>
        <InputButton inputName="list_name" placeholder="コレクションリスト名"/>
        <SubmitButton>コレクションリストを作成</SubmitButton>
      </div>
    </>
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

export default ListsPage