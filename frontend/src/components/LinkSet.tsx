const LinkSet = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <nav
      className="h-[calc((100vh-150px)*4/9*6/8)] min-h-[calc(56px*6)] flex flex-col justify-around [&>a]:mt-4 [&>a]:mx-auto X-mob:h-[calc((100vh-80px)*6/8)] X-tab:h-[calc((100vh-130px)*6/8)] Y-tab:min-h-[calc(300px*3/5)] Y-tab:h-[calc(((100vh-100px)*4/9-20px)*3/4)] Y-tab:grid Y-tab:grid-cols-2"
    >
      { children }
    </nav>
  )
}

export default LinkSet