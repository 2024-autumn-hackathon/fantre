import ItemsPage from "@/features/routes/items/components/ItemsPage"
import getItemsByQuery from "@/features/routes/items/getItemsByQuery"
import { getRequestItems } from "@/utils/getRequest"
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

  const collectionLists = await getRequestItems("lists", new URLSearchParams(), 1, cookieString)
  
  return <ItemsPage
    initialSearchInput={ initialSearchInput }
    initialItemList={ initialItemList }
    initialPageState={ initialPageState }
    seriesName={ seriesName }
    characterName={ characterName }
    collectionLists={ collectionLists }
  />
}

export default initialFetchedItemsPage