"use client"

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
import { useRouter } from "next/navigation"
import { deleteCollectionList } from "./deleteCollectionList"
import listFormAction from "./listFormAction"

const ListsPage = ({
  collectionList,
}: Readonly<{
  collectionList: KeyTypeIsStringObject[]
}>) => {
  const router = useRouter()
  const viewContent = () => {
    const collectionListItems = []
    for (const collection of collectionList) {
      const [key, value] = Object.entries(collection)[0]
      collectionListItems.push(
        <PagenationListItem key={ key }>
          <TextLinkButton href={ `/lists/${ key }` }>
            { value }
          </TextLinkButton>
          <button
            onClick={ () => deleteCollectionList(key, value, router) }
            className="w-16 bg-my-orange rounded-full h-10 ml-2"
            type="button"
          >
            削除
          </button>
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
        <div className="h-full flex flex-col items-center justify-around">
          <TextViewButton addClass="h-[60px] w-80">コレクションリスト一覧を表示中...</TextViewButton>
          <LinkButton href="/items" addClass="mt-4 w-60">グッズを探す</LinkButton>
          <form
            action={ listFormAction }
            className="flex flex-col items-center justify-around h-1/2"
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