import MainContentLayout from "./MainContentLayout"
import MonitorLayout from "./MonitorLayout"

// MainContentLayoutがSSRでよい場合のレイアウトです
const MonitorLayout_SSR = ({
  headerContent,
  viewContent,
  naviContent,
  footerContent
}: Readonly<{
  headerContent: React.ReactNode
  viewContent: React.ReactNode
  naviContent: React.ReactNode
  footerContent: React.ReactNode
}>) => {
  return (
    <MonitorLayout
      headerContent={ headerContent }
      footerContent={ footerContent }
    >
      <MainContentLayout
        // これらがCSRである必要がある場合は渡すものをCSRで作成して使用する
        viewContent={ viewContent }
        naviContent={ naviContent }
      />
    </MonitorLayout>
  )
}

export default MonitorLayout_SSR