import Checkbox from "@/components/Checkbox"
import InputButton from "@/components/InputButton"
import ItemsSearchForm from "@/components/ItemsSearchForm"
import LinkButton from "@/components/LinkButton"
import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import PagenationListContainer from "@/components/PagenationListContainer"
import PagenationListItem from "@/components/PagenationListItem"
import PagenationNavi from "@/components/PagenationNavi"
import PagenationNaviContainer from "@/components/PagenationNaviContainer"
import SelectCollectionListButton from "@/components/SelectCollectionListButton"
import SubmitButton from "@/components/SubmitButton"
import TextLinkButton from "@/components/TextLinkButton"
import TopButton from "@/components/TopButton"
import OnClickButton from "@/features/common/OnClickButton"

const ItemsPage = () => {
  const viewContent = (
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

  const naviContent = (
    <div className="h-full Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4">
      <ItemsSearchForm>
        <InputButton inputName="series_name" placeholder="作品名"/>
        <InputButton inputName="character_name" placeholder="キャラ名"/>
        <InputButton inputName="item_name" placeholder="商品名"/>
        <InputButton inputName="category_id" placeholder="タグ"/>
        <InputButton inputName="tags" placeholder="グッズカテゴリー"/>
        <InputButton inputName="jan_code" placeholder="JANコード"/>
        <InputButton inputName="release_date" placeholder="発売日"/>
        <InputButton inputName="retailers" placeholder="購入場所"/>
        <SubmitButton>検索する！</SubmitButton>
      </ItemsSearchForm>
      <div className="min-h-[calc(56px*3)] flex flex-col h-[calc(100%*3/12)]">
        <LinkButton href="/lists" addClass="mt-4 w-60">コレクションリスト作成</LinkButton>
        <SelectCollectionListButton/>
        <OnClickButton addClass="mt-4 w-60">選択項目をリストに追加</OnClickButton>
      </div>
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

export default ItemsPage