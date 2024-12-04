import InputButton from "@/components/InputButton"
import TextViewButton from "@/components/TextViewButton"
import { BACKEND_UPDATE_ITEM_KEYS as keys } from "@/constants"
import ItemDetailValues from "./ItemDetailValues"

const ItemDetails = ({
  itemDetailValues,
  formId,
}: Readonly<{
  itemDetailValues: ItemDetailValues
  formId: string
}>) => {
  return (
    <>
      <InputButton labelValue="作品名" inputName={ keys.series } formId={ formId } defaultValue={ itemDetailValues.series_name }/>
      <InputButton labelValue="キャラ名" inputName={ keys.character } formId={ formId } defaultValue={ itemDetailValues.character_name }/>
      <InputButton labelValue="商品名" inputName={ keys.name } formId={ formId } defaultValue={ itemDetailValues.item_name }/>
      <InputButton labelValue="タグ" inputName={ keys.tags } formId={ formId } defaultValue={ itemDetailValues.tags.join(",") }/>
      <InputButton labelValue="グッズカテゴリー" inputName={ keys.category } formId={ formId } defaultValue={ itemDetailValues.category_name }/>
      <TextViewButton labelText="JANコード">{ itemDetailValues.jan_code }</TextViewButton>
      <TextViewButton labelText="発売日">{ itemDetailValues.release_date }</TextViewButton>
      <InputButton labelValue="購入場所" inputName={ keys.retailers } formId={ formId } defaultValue={ itemDetailValues.retailers.join(",") }/>
    </>
  )
}

export default ItemDetails