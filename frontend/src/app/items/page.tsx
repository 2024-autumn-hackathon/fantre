import Checkbox from "@/components/Checkbox"
import InputButton from "@/components/InputButton"
import ItemsSearchForm from "@/components/ItemsSearchForm"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import SelectCollectionListButton from "@/components/SelectCollectionListButton"
import TextLinkButton from "@/components/TextLinkButton"
import TopButton from "@/components/TopButton"
import OnClickButton from "@/features/common/OnClickButton"

const ItemsPage = () => {
  const mainContent = (
    <>
      <PagenationListContainer>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ1だよおおおおおおおおおおお
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ2だよおおおおおおおおおおおおおおおおお
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ3だよ
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ3だよ
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ3だよ
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
        </PagenationListItem>
        <PagenationListItem>
          <TextLinkButton href="/items/itemId1">
            グッズ3だよ
          </TextLinkButton>
          <Checkbox/>
          <OnClickButton addClass="h-4/5">画像を表示</OnClickButton>
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
        <PagenationNavi href="/items?page=1">1</PagenationNavi>
        <PagenationNavi href="/items?page=2">2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )

  const navigationContent = (
    <>
      <ItemsSearchForm>
        <InputButton placeholder="作品名"/>
        <InputButton placeholder="キャラ名"/>
        <InputButton placeholder="商品名"/>
        <InputButton placeholder="タグ"/>
        <InputButton placeholder="グッズカテゴリー"/>
        <InputButton placeholder="JANコード"/>
        <InputButton placeholder="発売日"/>
        <InputButton placeholder="購入場所"/>        
      </ItemsSearchForm>    
      <LinkButton href="/lists" addClass="m-auto mt-4 w-60">コレクションリスト作成</LinkButton>
      <SelectCollectionListButton/>
      <OnClickButton addClass="m-auto mt-4 w-60">選択項目をリストに追加</OnClickButton>
    </>
  )
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      mainContent={ mainContent }
      navigationContent={ navigationContent }
      footerContent
    />
  )
}

export default ItemsPage