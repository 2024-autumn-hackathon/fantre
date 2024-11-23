import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"

const SignupPage = () => {
  return (
    <MonitorLayout
      headerContent
      viewContent={
        <form
          className="h-full flex flex-col justify-around"
        >
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="ニックネーム"/>
          <InputButton placeholder="パスワード"/>
          <InputButton placeholder="パスワード確認用"/>
          <SubmitButton>登録する！</SubmitButton>
        </form>
      }
      naviContent={
        <div className="flex h-full items-center">
          <LinkButton href="/login">ログインへ</LinkButton>
        </div>
      }
      footerContent
    />
  )
}

export default SignupPage