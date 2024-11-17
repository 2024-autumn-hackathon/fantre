const LinkSet = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <nav
      className="w-full flex flex-col justify-around place-items-center overflow-auto [&>a]:my-2 X-tab:h-3/5 Y-tab:h-3/5 Y-tab:grid Y-tab:grid-cols-2"
    >
      { children }
    </nav>
  )
}

export default LinkSet