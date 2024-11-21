"use client"

import dynamic from "next/dynamic"

const MainContentLayoutCSR = dynamic(() => import("./MainContentLayout"), {ssr: false})
const MainContentLayout_CSR = ({
  viewContent,
  naviContent,
}: Readonly<{
  viewContent: React.ReactNode
  naviContent: React.ReactNode
}>) => {
  return (
    <MainContentLayoutCSR
      viewContent={ viewContent }
      naviContent={ naviContent }
    />
  )
}
export default MainContentLayout_CSR