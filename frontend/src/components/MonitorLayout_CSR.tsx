import MainContentLayout_CSR from "./MainContentLayoutCSR"
import MonitorLayout from "./MonitorLayout"

/**
 * 基本的にはCSRは末端で処理する
 * useStateによって書き換える場所がviewにあって
 * 操作の場所がnaviにある場合などに使う
 */
const MonitorLayout_CSR = ({
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
      {/* 以下CSR */}
      <MainContentLayout_CSR
        viewContent={ viewContent }
        naviContent={ naviContent }
      />
    </MonitorLayout>
  )
}

export default MonitorLayout_CSR