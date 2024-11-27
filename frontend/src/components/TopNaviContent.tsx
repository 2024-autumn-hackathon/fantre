import ImageUploadForm from "@/features/common/ImageUploadForm"
import BackgroundImageResetButton from "@/features/components/BackgroundImageResetButton"
import LinkButton from "./LinkButton"
import LinkSet from "./LinkSet"

const TopNaviContent = () => {
  return (
    <>
      <LinkSet>
        <LinkButton href="/items">グッズ検索</LinkButton>
        <LinkButton href="/items/create">グッズ登録</LinkButton>
        <LinkButton href="/series">タイトル一覧</LinkButton>
        <LinkButton href="/lists">コレクションリスト</LinkButton>
        <LinkButton href="">カレンダー</LinkButton>
        <LinkButton href="">個別チャット</LinkButton>
      </LinkSet>
      <div className="flex flex-col h-[calc((100vh-150px)*3/9)] min-h-[calc(56px*3+20px)] Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4 Y-tab:h-[calc(((100vh-100px)*4/9-20px)*2/5)] Y-tab:min-h-[calc(300px*2/5)]">
        <ImageUploadForm
          formId="top-page-form"
          buttonText="画像送信"
          uploadImageText="背景画像を設定する"
        />
        <BackgroundImageResetButton/>
      </div>
    </>
  )
}

export default TopNaviContent