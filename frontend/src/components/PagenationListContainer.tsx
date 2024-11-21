const PagenationListContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ul
      className="h-[calc(100%-24px)] overflow-auto"
    >
      { children }
    </ul>
  )
}

export default PagenationListContainer