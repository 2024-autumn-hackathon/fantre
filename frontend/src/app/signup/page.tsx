import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"

const SignupPage = () => {
  return (
    <MonitorLayout
      headerContent
      mainContent={
        <form>
          <InputButton placeholder="メールアドレス"/>
          <InputButton placeholder="ニックネーム"/>
          <InputButton placeholder="パスワード"/>
          <InputButton placeholder="パスワード確認用"/>
          <SubmitButton>登録する！</SubmitButton>
        </form>
      }
      navigationContent={ <LinkButton href="/login">ログインへ</LinkButton> }
      footerContent
    />
  )
}

export default SignupPage