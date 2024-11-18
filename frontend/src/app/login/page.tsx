import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"

const LoginPage = () => {
  return (
    <MonitorLayout
      headerContent={ <LinkButton href="/"addClass="mr-0">TOPへ(仮置き)</LinkButton> }
      mainContent={
        <form>
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="パスワード"/>
          <SubmitButton>ログイン</SubmitButton>
        </form>
      }
      navigationContent={ <LinkButton href="/signup">サインアップへ</LinkButton> }
      footerContent
    />
  )
}

export default LoginPage