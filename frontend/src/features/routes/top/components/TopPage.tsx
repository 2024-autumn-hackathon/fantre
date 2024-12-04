import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import MonitorLayout from "@/components/MonitorLayout"
import TopNaviContent from "@/components/TopNaviContent"
import LogoutButton from "@/features/routes/top/components/LogoutButton"

const TopPage = ({
  imageSrc,
}: Readonly<{
  imageSrc: string
}>) => {
  return (
    <MonitorLayout
      headerContent={ <LogoutButton/> }
      viewContent={
        <BackgroundImageViewer
          imageSrc={ imageSrc }
        />
      }
      naviContent={ <TopNaviContent/> }
      footerContent
    />
  )
}

export default TopPage