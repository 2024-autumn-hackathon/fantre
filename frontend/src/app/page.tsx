import MonitorLayout from "@/components/MonitorLayout"

const Home = () => {
  return (
    <MonitorLayout
      headerContent={"こんにちは"}
      mainContent={<><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト10</div></>}
      navigationContent={<><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>テスト</div><div>コレクションリストを作成</div><div>テスト10</div></>}
      footerContent
    />
  )
}
export default Home