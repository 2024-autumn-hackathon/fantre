import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopNaviContent from "@/components/TopNaviContent"
import LogoutButton from "@/features/routes/top/components/LogoutButton"

const Home = () => {
  return (
    <MonitorLayout
      headerContent={ <LogoutButton/> }
      viewContent={ <BackgroundImageViewer/> }
      naviContent={ <TopNaviContent/> }
      footerContent={ <LinkButton addClass="mr-0" href="/login">ログインへ(仮置き)</LinkButton> }
    />
  )
}

export default Home