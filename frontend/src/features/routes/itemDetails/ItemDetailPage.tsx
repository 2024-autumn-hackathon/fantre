import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import ImageUploadForm from "@/features/common/uploadImage/ImageUploadForm"
import ItemDetails from "./ItemDetails"
import ItemDetailValues from "./ItemDetailValues"

const ItemDetailPage = ({
  initialItemDetail,
  itemId,
  imageSrc = "",
}: Readonly<{
  initialItemDetail: ItemDetailValues
  itemId: string
  imageSrc: string
}>) => {
  const formId = "item-form"
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent={
        <BackgroundImageViewer
          imageSrc={ imageSrc }
        />
      }
      naviContent={
        <>
          <ImageUploadForm
            buttonText="編集項目を確定"
            formId={ formId }
            uploadImageText="My画像を選択"
            addClass="h-full min-h-[calc(64px*8+76px+56px)] flex flex-col justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4"
            imageId="item_image"
            itemId={ itemId }
            endpoint="itemDetail"
          >
            <ItemDetails
              itemDetailValues={ initialItemDetail }
              formId={ formId }
            />
          </ImageUploadForm>
        </>
      }
      footerContent
    />
  )
}

export default ItemDetailPage