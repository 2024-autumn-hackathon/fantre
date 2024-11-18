import InputButton from "@/components/InputButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import ImageUploadForm from "@/features/common/ImageUploadForm"

const ItemDetailPage = () => {
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      mainContent
      navigationContent={
        <>
          <ImageUploadForm
            buttonText="編集項目を確定"
            formId="item_create"
            uploadImageText="My画像を選択"
          >
            <InputButton defaultValue="作品名"/>
            <InputButton defaultValue="キャラ名"/>
            <InputButton defaultValue="商品名"/>
            <InputButton defaultValue="タグ"/>
            <InputButton defaultValue="グッズカテゴリー"/>
            <InputButton defaultValue="JANコード"/>
            <InputButton defaultValue="発売日"/>
            <InputButton defaultValue="購入場所"/>
          </ImageUploadForm>
        </>
      }
      footerContent
    />
  )
}

export default ItemDetailPage