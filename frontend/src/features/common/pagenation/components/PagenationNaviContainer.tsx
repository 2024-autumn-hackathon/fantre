const PagenationNaviContainer = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ol
      className="flex justify-center h-6"
    >
      { children }
    </ol>
  )
}

export default PagenationNaviContainer