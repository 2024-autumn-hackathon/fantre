const NaviContent = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <section
      className="h-full flex flex-col justify-around items-center bg-my-gray rounded-3xl overflow-auto row-start-3 X-mob:row-start-1 X-mob:row-end-2 X-mob:col-start-3 X-tab:row-start-1 X-tab:col-start-3"
    >
      { children }
    </section>
  )
}

export default NaviContent