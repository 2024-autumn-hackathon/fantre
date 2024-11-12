import MonitorDecorationsImage from "./MonitorDecorationsImage"
import PowerButtonImage from "./PowerButtonImage"

// 受け取ったchildrenをレスポンシブに配置するレイアウトです
const MonitorLayout = ({
  headerContent,
  mainContent,
  navigationContent,
  footerContent
}: Readonly<{
  headerContent: React.ReactNode
  mainContent: React.ReactNode
  navigationContent: React.ReactNode
  footerContent: React.ReactNode
}>) => {
  return (
    <>
      <section //gridによって要素を配置
        className="grid relative w-full h-full rounded-[50px] bg-[#88FBFF] grid-rows-[40px_5fr_20px_4fr_40px] grid-cols-[20px_30px_1fr_30px_20px] monitor:h-[calc(100%-50px)] monitor:grid-rows-[40px_1fr_40px] monitor:grid-cols-[20px_5fr_54fr_20px_26fr_6fr_20px] wide:grid-rows-[40px_1fr_40px] wide:grid-cols-[50px_5fr_20px_4fr_50px]"
      >
        <section
          className="bg-yellow-500 bg-opacity-50 col-start-3 col-end-4 monitor:col-end-6 wide:col-start-2 wide:col-end-3"
          style={{
            background:"orange",
            opacity:0.5
          }}
        >
          { headerContent }
        </section>
        <section
          className="bg-[#C3D5D6] rounded-[32px] overflow-auto row-start-2 row-end-3 col-start-2 col-end-5 monitor:col-end-4 wide:col-end-3"
        >
          { mainContent }
        </section>
        <section
          className="bg-[#C3D5D6] rounded-[32px] overflow-auto row-start-4 row-end-5 col-start-2 col-end-5 monitor:row-start-2 monitor:row-end-3 monitor:col-start-5 monitor:col-end-7 wide:row-start-2 wide:row-end-3 wide:col-start-4 wide:col-end-5"
        >
          { navigationContent }
        </section>
        <section
          className="row-start-5 col-start-3 col-end-4 monitor:row-start-3 monitor:col-end-6 wide:row-start-1 wide:row-end-2 wide:col-start-4 wide:col-end-5"
          style={{
            background:"orange",
            opacity:0.5
          }}
        >
          { footerContent }
        </section>
        <PowerButtonImage/>
      </section>
      <div className="relative w-full h-[50px] hidden monitor:block">
        <MonitorDecorationsImage/>
      </div>
    </>
  )
}

export default MonitorLayout