import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import {
  BACKEND_AUTH_KEYS as keys,
  // VALIDATION_EMAIL as emailPattern,
  VALIDATION_PASSWORD as passwordPattern,
} from "@/constants"
import authAction from "@/utils/authAction"
import { redirect } from "next/navigation"

const SignupPage = () => {
  const requires = [keys.email, keys.name, keys.pass1, keys.pass2]
  return (
    <MonitorLayout
      headerContent
      viewContent={
        <form
          className="h-full flex flex-col justify-around"
          action={
            async formData => {
              "use server"
              const result = await authAction(formData, "signup", requires)
              if (result) {
                redirect("/login")
              }
            }
          }
        >
          <InputButton
            type="email"
            inputName={ keys.email }
            placeholder="メールアドレス"
            // pattern={ emailPattern }
            required
          />
          <InputButton inputName={ keys.name } placeholder="ニックネーム" required/>
          <InputButton
            type="password"
            inputName={ keys.pass1 }
            placeholder="パスワード"
            pattern={ passwordPattern }
            required
          />
          <InputButton
            type="password"
            inputName={ keys.pass2 }
            placeholder="パスワード確認用"
            pattern={ passwordPattern }
            required
          />
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