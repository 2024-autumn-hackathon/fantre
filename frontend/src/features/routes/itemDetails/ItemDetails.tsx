import InputButton from "@/components/InputButton"
import ItemDetailValues from "./ItemDetailValues"

const ItemDetails = ({
  itemDetailValues,
}: Readonly<{
  itemDetailValues: ItemDetailValues
}>) => {
  return (
    <>
      <InputButton defaultValue={ itemDetailValues.series_name }/>
      <InputButton defaultValue={ itemDetailValues.character_name }/>
      <InputButton defaultValue={ itemDetailValues.item_name }/>
      <InputButton defaultValue={ itemDetailValues.tags.join(",") }/>
      <InputButton defaultValue={ itemDetailValues.category_name }/>
      <InputButton defaultValue={ itemDetailValues.jan_code }/>
      <InputButton defaultValue={ itemDetailValues.release_date }/>
      <InputButton defaultValue={ itemDetailValues.retailers.join(",") }/>
    </>
  )
}

export default ItemDetails