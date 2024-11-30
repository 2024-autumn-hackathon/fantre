"use client"

import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import ImageUploadForm from "@/features/common/uploadImage/ImageUploadForm"
import { useState } from "react"
import ItemDetails from "./ItemDetails"
import ItemDetailValues from "./ItemDetailValues"

const ItemDetailPage = ({
  initialItemDetail,
}: Readonly<{
  initialItemDetail: ItemDetailValues
}>) => {
  const [itemDetailValues, setItemDetailValues] = useState<ItemDetailValues>(initialItemDetail)
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent
      naviContent={
        <>
          <ImageUploadForm
            buttonText="編集項目を確定"
            formId="item_create"
            uploadImageText="My画像を選択"
            addClass="h-full flex flex-col justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4"
          >
            <ItemDetails
              itemDetailValues={ itemDetailValues }
            />
          </ImageUploadForm>
        </>
      }
      footerContent
    />
  )
}

export default ItemDetailPage