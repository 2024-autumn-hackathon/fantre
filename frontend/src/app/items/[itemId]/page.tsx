import ItemDetailPage from "@/features/routes/itemDetails/ItemDetailPage"
import { getRequestItemDetail } from "@/utils/getRequestFromServer"

const InitialFetchedItemDetailPage = async ({
  params,
}: Readonly<{
  params: Promise<{ itemId: string}>
}>) => {
  const itemId = (await params).itemId
  const searchParams = new URLSearchParams([["itemId",itemId]])
  const initialItemData = await getRequestItemDetail("itemDetail", searchParams)

  return <ItemDetailPage
    initialItemDetail={ initialItemData ||
      {
        item_name: "",
        series_name: "",
        character_name: "",
        category_name: "",
        tags: [""],
        jan_code: "",
        release_date: "",
        retailers: [""],
        own_status: "",
      }
    } />
}

export default InitialFetchedItemDetailPage