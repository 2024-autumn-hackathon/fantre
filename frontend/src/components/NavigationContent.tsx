import ImageUploadForm from "@/features/common/ImageUploadForm"
import BackgroundImageResetButton from "@/features/components/BackgroundImageResetButton"
import LinkButton from "./LinkButton"
import LinkSet from "./LinkSet"

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
        <ImageUploadForm
          formId="top-page-form"
          buttonText="画像送信"
          uploadImageText="背景画像を設定する"
        ></ImageUploadForm>
        <BackgroundImageResetButton/>
      </div>
    </>
  )
}

export default NavigationContent