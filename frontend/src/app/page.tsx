import MonitorLayout from "@/components/MonitorLayout"
import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import LogoutButton from "@/features/routes/LogoutButton"
import NavigationContent from "@/components/NavigationContent"

const Home = () => {
  return (
    <MonitorLayout
      headerContent={ <LogoutButton/> }
      mainContent={ <BackgroundImageViewer/> }
      navigationContent={ <NavigationContent/> }
      footerContent
    />
  )
}

export default Home