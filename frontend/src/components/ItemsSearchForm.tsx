const ItemsSearchForm = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <form>
      { children }
    </form>
  )
}

export default ItemsSearchForm