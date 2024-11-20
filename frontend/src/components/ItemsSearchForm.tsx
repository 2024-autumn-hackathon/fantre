const ItemsSearchForm = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <form
      className="h-[calc(100%*9/12)] min-h-[calc(56px*9)] flex flex-col"
    >
      { children }
    </form>
  )
}

export default ItemsSearchForm