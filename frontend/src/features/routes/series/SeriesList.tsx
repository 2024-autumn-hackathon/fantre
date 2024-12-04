import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import SeriesListType from "./SeriesListType"

const SeriesList = ({
  seriesList,
}: Readonly<{
  seriesList: Array<SeriesListType>
}>) => {  
  const seriesListResult = seriesList.map((
    series: SeriesListType
  ) => {
    return (series.id === "" ? null :
      <PagenationListItem
        key={ series.id }
      >
        <TextLinkButton
          href={`series/${ series.id }?seriesName=${ series.series_name }`}
        >
          { series.series_name }
        </TextLinkButton>
      </PagenationListItem>
    )
  })

  return seriesListResult
}

export default SeriesList