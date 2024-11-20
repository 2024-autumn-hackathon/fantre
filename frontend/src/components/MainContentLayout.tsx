import NaviContent from "./NaviContent"
import ViewContent from "./ViewContent"

const MainContentLayout = ({
  viewContent,
  naviContent,
}: Readonly<{
  viewContent: React.ReactNode
  naviContent: React.ReactNode
}>) => {
  return (
    <section
      className="h-full max-h-[calc(100vh-80px)] row-start-2 row-end-3 col-start-2 col-end-3 X-tab:max-h-[calc(100vh-130px)] X-mob:col-end-5 X-tab:col-end-7 grid grid-rows-[5fr_20px_4fr] grid-cols-1 X-mob:grid-rows-1 X-mob:grid-cols-[5fr_20px_4fr] X-tab:grid-rows-1 X-tab:grid-cols-[59fr_20px_32fr]"
    >
      <ViewContent>
        { viewContent }
      </ViewContent>
      <NaviContent>
        { naviContent }
      </NaviContent>
    </section>
  )
}

export default MainContentLayout