"use client"
import TextLinkButton from "@/components/TextLinkButton"
import PagenationListItem from "@/features/common/pagenation/components/PagenationListItem"
import CharactersListType from "./CharactersListType"

const CharactersList = ({
  charactersList,
  seriesName,
}: Readonly<{
  charactersList: Array<CharactersListType>
  seriesName: string
}>) => {
  const charactersListResult = charactersList.map((
    character: CharactersListType
  ) => {
    return (character.id === "" ? null :
      <PagenationListItem
        key={ character.id }
      >
        <TextLinkButton
          href={ `/items?seriesName=${ seriesName }&characterName=${ character.character_name }` }
        >
          { character.character_name }
        </TextLinkButton>
      </PagenationListItem>
    )
  })

  return charactersListResult
}

export default CharactersList