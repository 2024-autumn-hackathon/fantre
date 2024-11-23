const PagenationListItem = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <li
      className="flex items-center mt-2"
    >
      { children }
    </li>
  )
}

export default PagenationListItem