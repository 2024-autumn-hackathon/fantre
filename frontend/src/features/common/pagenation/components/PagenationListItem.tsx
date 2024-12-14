/**
 * 
 * @param children
 * @returns li 量産想定
 */
const PagenationListItem = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <li
      className="flex items-center justify-center mt-2 gap-2"
    >
      { children }
    </li>
  )
}

export default PagenationListItem