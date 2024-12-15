import ListsPage from "@/features/routes/lists/ListsPage"
import { getCollectionList } from "@/utils/getRequestFromServer"

const InitialFetchedListsPage = async () => {
  const collectionList = (await getCollectionList()) || []

  return <ListsPage collectionList={ collectionList }/>
}

export default InitialFetchedListsPage