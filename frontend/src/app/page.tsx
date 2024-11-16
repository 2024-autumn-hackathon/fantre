import MonitorLayout from "@/components/MonitorLayout"
import Test from "./Test"

const Home = () => {
  return (
    <MonitorLayout
      headerContent
      navigationContent
      footerContent
      mainContent={ <Test/> }
    />
  )
}
export default Home