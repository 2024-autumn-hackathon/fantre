/**
 * 
 * @param children PagenationListItem>{children}</PagenationListItem>
 * @returns ページネーションコンテナ外側
 */
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