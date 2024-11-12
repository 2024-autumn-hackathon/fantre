import type { Metadata } from "next"
import { Hachi_Maru_Pop } from "next/font/google"
import "./globals.css"

const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",  
  style: "normal",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "fantre-ファントレ!",
  description: "グッズのコレクションがどんどん増える！",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="ja">
      <body className={ hachiMaruPop.className }>
        <main //画面のサイズを設定
          className="m-auto w-[100%] h-screen min-w-[352px] min-h-[600px] monitor:min-w-[972px] wide:min-h-[352px]"
        >
          { children }
        </main>
      </body>
    </html>
  )
}

export default RootLayout
