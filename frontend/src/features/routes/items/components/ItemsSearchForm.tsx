const ItemsSearchForm = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <form
      className="h-[calc(100%*9/12)] min-h-[calc(56px*9)] flex flex-col justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:h-[calc(100%*5/7)] Y-tab:min-h-[280px]"
    >
      { children }
    </form>
  )
}

export default ItemsSearchForm