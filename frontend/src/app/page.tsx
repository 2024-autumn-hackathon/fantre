import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import NavigationContent from "@/components/NavigationContent"
import LogoutButton from "@/features/routes/LogoutButton"

const Home = () => {
  return (
    <MonitorLayout
      headerContent={ <LogoutButton/> }
      mainContent={ <BackgroundImageViewer/> }
      navigationContent={ <NavigationContent/> }
      footerContent={ <LinkButton href="/login">ログインへ(仮置き)</LinkButton> }
    />
  )
}

export default Home