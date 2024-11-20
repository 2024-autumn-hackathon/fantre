import MonitorDecorationsImage from "./MonitorDecorationsImage"
import PowerButtonImage from "./PowerButtonImage"

/**
 * このレイアウトを呼び出されるレイアウト
 * childrenに、SSR or CSRの使用する方のMainContenLayoutを入れて使用する
 * そのpropsもSSRかCSRか選択して使用する
 */
const MonitorLayout = ({
  headerContent,
  children,
  footerContent
}: Readonly<{
  headerContent: React.ReactNode
  children: React.ReactNode
  footerContent: React.ReactNode
}>) => {
  // メイン配置グリッドその他を定義
  const containerBaseClass = "grid relative w-full h-full rounded-[50px] bg-my-light-blue grid-rows-[40px_1fr_40px] grid-cols-[20px_1fr_20px]"
  const container_X_mob = "X-mob:grid-cols-[50px_5fr_20px_4fr_50px]"
  const container_X_tab = "X-tab:h-[calc(100%-50px)] X-tab:grid-rows-[40px_1fr_40px] X-tab:grid-cols-[20px_5fr_54fr_20px_26fr_6fr_20px]"

  return (
    <>
      <section
        className={`${ containerBaseClass } ${ container_X_mob } ${ container_X_tab }`}
      >
        <section
          className="flex items-center justify-end col-start-2 col-end-3 X-tab:col-start-3 X-tab:col-end-6 X-mob:col-start-4 X-mob:col-end-5"
        >
          { headerContent }
        </section>
        { children }
        <section
          className="row-start-3 col-start-2 col-end-3 X-tab:col-start-3 X-tab:row-start-3 X-tab:col-end-6 X-mob:row-start-1 X-mob:row-end-2 X-mob:col-start-2 X-mob:col-end-3"
        >
          { footerContent }
        </section>
        <PowerButtonImage/>
      </section>
      <div className="relative w-full h-[50px] hidden X-tab:block">
        <MonitorDecorationsImage/>
      </div>
    </>
  )
}

export default MonitorLayout