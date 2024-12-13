const PagenationListGridContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ul
      className="h-[calc(100%-24px)] grid grid-cols-3 gap-2 p-2"
    >
      { children }
    </ul>
  )
}

export default PagenationListGridContainer