import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import LinkButton from "@/components/LinkButton"
import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import TopNaviContent from "@/components/TopNaviContent"
import LogoutButton from "@/features/routes/LogoutButton"

const Home = () => {
  return (
    <MonitorLayout_SSR
      headerContent={ <LogoutButton/> }
      viewContent={ <BackgroundImageViewer/> }
      naviContent={ <TopNaviContent/> }
      footerContent={ <LinkButton href="/login">ログインへ(仮置き)</LinkButton> }
    />
  )
}

export default Home