import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import SubmitButton from "@/components/SubmitButton"

const LoginPage = () => {
  return (
    <MonitorLayout_SSR
      headerContent={ <LinkButton href="/"addClass="mr-0">TOPへ(仮置き)</LinkButton> }
      viewContent={
        <form
          className="h-full flex flex-col [&>*]:mt-auto"
        >
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="パスワード"/>
          <SubmitButton>ログイン</SubmitButton>
        </form>
      }
      naviContent={ <LinkButton href="/signup">サインアップへ</LinkButton> }
      footerContent
    />
  )
}

export default LoginPage