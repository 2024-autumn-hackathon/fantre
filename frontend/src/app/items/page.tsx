import ItemsPage from "@/features/routes/items/components/ItemsPage"
import getItemsByQuery from "@/features/routes/items/getItemsByQuery"
import { cookies } from "next/headers"

const initialFetchedItemsPage = async ({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    seriesName: string,
    characterName: string,
  }>
}>) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) return
  const cookieString = `fantre=${ cookie.value }`

  const { seriesName, characterName } = await searchParams
  const initialSearchInput = seriesName ?
    new URLSearchParams([
      ["series_name", seriesName],
      ["character_name", characterName],
    ]) :
    new URLSearchParams()
  const initialPageState = { currentPage: 1, maxPage: 1 }
  const response = await getItemsByQuery(
    "items",
    initialSearchInput,
    initialPageState,
    cookieString,
  )
  const initialItemList = response.items
  initialPageState.maxPage = response.maxPage
  
  return <ItemsPage
    initialSearchInput={ initialSearchInput }
    initialItemList={ initialItemList }
    initialPageState={ initialPageState }
    seriesName={ seriesName }
    characterName={ characterName }
  />
}

export default initialFetchedItemsPage