import SeriesPage from "@/features/routes/series/SeriesPage"
import { getRequestByPage } from "@/utils/getRequestFromServer"

const InitialFetchedSeriesPage = async () => {
  const response = await getRequestByPage("series")
  if (!response) {
    // redirect("/error")
  }
  const initialSeriesList = response.series
  const maxPage = response.all_pages
  const initialPageState = {
    currentPage: 1,
    maxPage: maxPage,
  }

  return <SeriesPage
    initialSeriesList={ initialSeriesList }
    initialPageState={ initialPageState }
  />
}

export default InitialFetchedSeriesPage