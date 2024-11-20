import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout_SSR from "@/components/MonitorLayout_SSR"
import SubmitButton from "@/components/SubmitButton"

const SignupPage = () => {
  return (
    <MonitorLayout_SSR
      headerContent
      viewContent={
        <form
          className="h-full flex flex-col [&>*]:mt-auto"
        >
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="ニックネーム"/>
          <InputButton placeholder="パスワード"/>
          <InputButton placeholder="パスワード確認用"/>
          <SubmitButton>登録する！</SubmitButton>
        </form>
      }
      naviContent={ <LinkButton href="/login">ログインへ</LinkButton> }
      footerContent
    />
  )
}

export default SignupPage