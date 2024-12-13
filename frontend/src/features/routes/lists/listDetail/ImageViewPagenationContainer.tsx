import { KeyTypeIsStringObject } from "@/constants"
import PagenationNaviContainer from "@/features/common/pagenation/components/PagenationNaviContainer"
import PageState from "@/features/common/pagenation/PageState"
import { Dispatch, SetStateAction } from "react"
import ImageViewItem from "./ImageViewItem"
import PagenationListGridContainer from "./PagenationListGridContainer"

const ImageViewPagenationContainer = ({
  pageState,
  handleSetPageState,
  itemImageIdList,
  itemImageUrlList,
}: Readonly<{
  pageState: PageState
  handleSetPageState: Dispatch<SetStateAction<PageState>>
  itemImageIdList: KeyTypeIsStringObject[]
  itemImageUrlList: string[]
}>) => {
  const itemIdList = itemImageIdList.map((item, idx) => {
    const [itemId, itemName] = Object.entries(item)[0]
    const imageUrl = itemImageUrlList[idx]

    return (
      <ImageViewItem
        key={ itemId }
        itemId={ itemId }
        imageUrl={ imageUrl }
        itemName={ itemName }
      />
    )
  })
  return (
    <>
      <PagenationListGridContainer>
        { itemIdList }
      </PagenationListGridContainer>
      <PagenationNaviContainer
        pageState={ pageState }
        handleSetPageState={ handleSetPageState }
      />
    </>
    
  )
}

export default ImageViewPagenationContainer