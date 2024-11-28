import type { Metadata } from "next"
import { Hachi_Maru_Pop } from "next/font/google"
import "./globals.css"

const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",  
  style: "normal",
  preload: false,
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
          className="max-w-screen-xl mx-auto w-full h-screen min-w-[352px] min-h-[600px] X-mob:min-w-[600px] X-mob:min-h-[352px] relative"
        >
          { children }
        </main>
      </body>
    </html>
  )
}

export default RootLayout
