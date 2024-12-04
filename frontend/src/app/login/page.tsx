import InputButton from "@/components/InputButton"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import SubmitButton from "@/components/SubmitButton"
import {
  COOKIE_OPTIONS as cookieOptions,
  // VALIDATION_EMAIL as emailPattern,
  VALIDATION_PASSWORD as passwordPattern,
} from "@/constants"
import authAction from "@/utils/authAction"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const LoginPage = () => {
  const requires = ["email", "password"]
  return (
    <MonitorLayout
      headerContent
      viewContent={
        <form
          className="h-full flex flex-col justify-around"
          action={
            async formData => {
              "use server"
              const result = await authAction(formData, "login", requires)
              if (result) {// cookieにtokenを保存する
                const token = result.access_token || ""
                const cookieStore = await cookies()
                cookieStore.set("fantre", token, cookieOptions)
                redirect("/")
              }
            }
          }
        >
          <InputButton
            type="email"
            inputName={ requires[0] }
            labelValue="メールアドレス"
            // pattern={ emailPattern }うまく機能しないのでコメントアウト
            required
          />
          <InputButton
            type="password"
            inputName={ requires[1] }
            labelValue="パスワード"
            pattern={ passwordPattern }
            required
          />
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