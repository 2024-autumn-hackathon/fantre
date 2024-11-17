import LinkSet from "./LinkSet"
import LinkButton from "./LinkButton"
import ImageUploadButton from "@/features/common/ImageUploadButton"
import BackgroundImageResetButton from "@/features/components/BackgroundImageResetButton"

const NavigationContent = () => {
  return (
    <>
      <LinkSet>
        <LinkButton href="/items"><p>グッズ検索</p></LinkButton>
        <LinkButton href="/items/create"><p>グッズ登録</p></LinkButton>
        <LinkButton href="/series"><p>タイトル一覧</p></LinkButton>
        <LinkButton href="/lists"><p>コレクションリスト</p></LinkButton>
        <LinkButton href=""><p>カレンダー</p></LinkButton>
        <LinkButton href=""><p>個別チャット</p></LinkButton>
      </LinkSet>
      <div className="Y-tab:flex">
        <ImageUploadButton/>
        <BackgroundImageResetButton/>
      </div>
    </>
  )
}

export default NavigationContent