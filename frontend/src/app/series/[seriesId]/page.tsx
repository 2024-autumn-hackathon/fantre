import CharactersPage from "@/features/routes/series/characters/CharactersPage"
import { getRequestByPage } from "@/utils/getRequestFromServer"

const initialFetchedCharactersPage = async ({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ seriesId: string}>
  searchParams: Promise<{ seriesName: string }>
}>) => {
  const seriesId = (await params).seriesId
  const seriesName = (await searchParams).seriesName
  const response = await getRequestByPage(`series/${ seriesId }/characters`)
  if (!response) return
  const charactersList = response.characters
  const maxPage = response.all_pages
  
  return <CharactersPage
    initialCharactersList={ charactersList }
    maxPage={ maxPage }
    seriesId={ seriesId }
    seriesName={  seriesName}
  />
}

export default initialFetchedCharactersPage