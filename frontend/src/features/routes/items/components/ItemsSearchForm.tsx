
import updateSearchInput from "@/features/routes/items/updateSearchInput"

const ItemsSearchForm = ({
  children,
  handleSetSearchInput,
}: Readonly<{
  children: React.ReactNode
  handleSetSearchInput: React.Dispatch<React.SetStateAction<URLSearchParams>>
}>) => {
  return (
    <form
      className="h-[calc(100%*9/12)] min-h-[calc(64px*9)] flex flex-col justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:h-[calc(100%*5/6)] Y-tab:min-h-[320px]"
      onSubmit={ e => updateSearchInput(e, handleSetSearchInput) }
      id="itemSearch"
    >
      { children }
    </form>
  )
}

export default ItemsSearchForm