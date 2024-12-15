import { LOADING_IMAGE_URL as loading } from "@/constants"
import ItemsPage from "@/features/routes/items/components/ItemsPage"
import getCategoryList from "@/features/routes/items/getCategoryList"
import getItemsByQuery from "@/features/routes/items/getItemsByQuery"
import { getRequestItems } from "@/utils/getRequest"
import { getImageUrl } from "@/utils/getRequestFromServer"
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

  const categoryListObject = await getCategoryList(cookie.value)
  const collectionLists = await getRequestItems("lists", new URLSearchParams(), 1, cookieString)

  const initialImageUrlList: string[] = Array(10).fill(loading)
  for (let i=0; i<initialItemList.length; i++) {
    if (initialItemList[i].id === "") break
    const endpoint = `images/${ initialItemList[i].id }`
    const initialImageUrl = await getImageUrl(endpoint) || loading
    const minioUrl = initialImageUrl === loading ? loading : initialImageUrl.split("localhost").join("s3-minio")
    initialImageUrlList[i] = minioUrl
  }
  
  return <ItemsPage
    initialSearchInput={ initialSearchInput }
    initialItemList={ initialItemList }
    initialPageState={ initialPageState }
    seriesName={ seriesName }
    characterName={ characterName }
    collectionLists={ collectionLists }
    initialImageUrlList={ initialImageUrlList }
    categoryListObject={ categoryListObject }
  />
}

export default initialFetchedItemsPage