import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import TopButton from "@/components/TopButton"
import Checkbox from "@/components/Checkbox"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import TextLinkButton from "@/components/TextLinkButton"
import OnClickButton from "@/features/common/OnClickButton"
import Image from "next/image"

const ListDetailPage = () => {
  const viewContent = (
    <>
      <PagenationListContainer>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ 1
          </TextLinkButton>
          <Checkbox/>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId2">
            グッズ 2
          </TextLinkButton>
          <Checkbox/>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId3">
            グッズ 3
          </TextLinkButton>
          <Checkbox/>
        </PagenationListItem>
      </PagenationListContainer>
      <PagenationNaviContainer>
        <PagenationNavi href="/lists?page=1">1</PagenationNavi>
        <PagenationNavi href="/lists?page=2">2</PagenationNavi>
      </PagenationNaviContainer>

      {/* stateの分岐で画像表示と切り替え */}
      <Image
        fill
        src="/torio.png"
        alt="背景として表示する画像です"
        style={{objectFit:"contain"}}
      />
    </>
  )

  const naviContent = (
    <div className="h-full">
      <div>
        <span>コレクション一覧を表示中・・・</span>
      </div>
      <OnClickButton addClass="h-4/5">チェック項目をリストから削除</OnClickButton>

      {/* stateの分岐で文言の表示を切り替え */}
      <OnClickButton addClass="h-4/5">画像ビューに切り替え</OnClickButton>
      <OnClickButton addClass="h-4/5">テキストビューに切り替え</OnClickButton>
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

export default ListDetailPage