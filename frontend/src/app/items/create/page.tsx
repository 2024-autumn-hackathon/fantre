import InputButton from "@/components/InputButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import ImageUploadForm from "@/features/common/ImageUploadForm"
import ClickAndInputButton from "@/features/routes/create/components/ClickAndInputButton"

const ItemCreatePage = () => {
  return (
    <MonitorLayout
      headerContent={ <TopButton/> }
      viewContent
      naviContent={
        <>
          <ImageUploadForm
            buttonText="登録!"
            formId="item_create"
            uploadImageText="アップロード画像を選択"
            addClass="h-full flex flex-col justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4"
          >
            <ClickAndInputButton inputName="series_name">作品名</ClickAndInputButton>
            <ClickAndInputButton inputName="character_name">キャラ名</ClickAndInputButton>
            <InputButton placeholder="商品名"/>
            <InputButton placeholder="タグ"/>
            <ClickAndInputButton inputName="category_name">グッズカテゴリー</ClickAndInputButton>
            <InputButton placeholder="JANコード"/>
            <InputButton placeholder="発売日"/>
            <InputButton placeholder="購入場所"/>
          </ImageUploadForm>
        </>
      }
      footerContent
    />
  )
}

export default ItemCreatePage