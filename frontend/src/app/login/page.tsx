import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"

const LoginPage = () => {
  return (
    <MonitorLayout
      headerContent={ <LinkButton href="/"addClass="mr-0">TOPへ(仮置き)</LinkButton> }
      viewContent={
        <form
          className="h-full flex flex-col justify-around"
        >
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="パスワード"/>
          <SubmitButton>ログイン</SubmitButton>
        </form>
      }
      naviContent={
        <div className="flex h-full items-center">
          <LinkButton href="/signup">サインアップへ</LinkButton>
        </div>
      }
      footerContent
    />
  )
}

export default LoginPage