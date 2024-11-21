import Checkbox from "@/components/Checkbox"
import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TextLinkButton from "@/components/TextLinkButton"
import TopButton from "@/components/TopButton"
import OnClickButton from "@/features/common/OnClickButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PagenationNavi from "@/features/common/pagenation/components/PagenationNavi"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import ItemsSearchForm from "@/features/routes/items/components/ItemsSearchForm"
import SelectCollectionListButton from "@/features/routes/items/components/SelectCollectionListButton"

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
    <>
      <ItemsSearchForm>
        <InputButton inputName="series_name" placeholder="作品名"/>
        <InputButton addClass="col-start-2" inputName="character_name" placeholder="キャラ名"/>
        <InputButton inputName="item_name" placeholder="商品名"/>
        <InputButton inputName="category_id" placeholder="タグ"/>
        <InputButton inputName="tags" placeholder="グッズカテゴリー"/>
        <InputButton inputName="jan_code" placeholder="JANコード"/>
        <InputButton inputName="release_date" placeholder="発売日"/>
        <InputButton inputName="retailers" placeholder="購入場所"/>
        <SubmitButton addClass="Y-tab:col-start-1 Y-tab:col-end-3">検索する！</SubmitButton>
      </ItemsSearchForm>
      <div
        className="min-h-[calc(56px*3)] flex flex-col h-[calc(100%*3/12)] justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:h-[calc(100%*2/7)] Y-tab:min-h-[112px]"
      >
        <LinkButton href="/lists" addClass="mt-4 w-60">コレクションリスト作成</LinkButton>
        <SelectCollectionListButton/>
        <OnClickButton addClass="mt-4 w-60 Y-tab:col-start-2">選択項目をリストに追加</OnClickButton>
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

export default ItemsPage