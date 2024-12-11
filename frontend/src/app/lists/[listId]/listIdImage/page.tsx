import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import PagenationListContainer from "@/features/common/pagenation/components/PagenationListContainer"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import PagenationNavi from "@/features/common/pagenation/components/PagenationNavi"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import OnClickButton from "@/features/common/OnClickButton"
import Image from "next/image"
import TextViewButton from "@/components/TextViewButton"

const ListDetailPage = () => {
  const viewContent = (
    <>
      <PagenationListContainer>
        <div className="grid grid-cols-3 gap-4">
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
          <PagenationListItem>
            <Image
              src="/torio.png"
              alt="背景として表示する画像です"
              width={300}
              height={300}
            />
          </PagenationListItem>
        </div>
      </PagenationListContainer>
      <PagenationNaviContainer>
        <PagenationNavi href="/lists/1?page=1">1</PagenationNavi>
        <PagenationNavi href="/lists/1?page=2">2</PagenationNavi>
      </PagenationNaviContainer>
    </>
  )

  const naviContent = (
    <>
      <div className="h-full">
        <TextViewButton >コレクション一覧を表示中...</TextViewButton>
        <OnClickButton>テキストビューに切り替え</OnClickButton>
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

export default ListDetailPage