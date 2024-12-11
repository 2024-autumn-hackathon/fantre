import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import TextLinkButton from "@/components/TextLinkButton"
import TextViewButton from "@/components/TextViewButton"
import TopButton from "@/components/TopButton"
import { KeyTypeIsStringObject } from "@/constants"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import listFormAction from "./listFormAction"

const ListsPage = ({
  collectionList,
}: Readonly<{
  collectionList: KeyTypeIsStringObject[]
}>) => {
  const viewContent = () => {
    const collectionListItems = []
    for (const collection of collectionList) {
      const [key, value] = Object.entries(collection)[0]
      collectionListItems.push(
        <PagenationListItem key={ key }>
          <TextLinkButton href={ `/lists/${ key }` }>
            { value }
          </TextLinkButton>
        </PagenationListItem>
      )
    }
    return (
      <>
        <PagenationListContainer>
          { collectionListItems }
        </PagenationListContainer>
      </>
    )
  }

  const naviContent = () => {
    return (
      <>
        <div className="h-full">
          <TextViewButton addClass="h-[60px]">コレクションリスト一覧を表示中...</TextViewButton>
          <LinkButton href="/items" addClass="mt-4 w-60">グッズを探す</LinkButton>
          <form
            action={ listFormAction }
          >
            <InputButton inputName="list_name" labelValue="コレクションリスト名"/>
            <SubmitButton>
              コレクションリストを作成
            </SubmitButton>
          </form>
        </div>
      </>
    )
  }

  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent={ viewContent() }
      naviContent={ naviContent() }
      footerContent
    />
  )
}

export default ListsPage