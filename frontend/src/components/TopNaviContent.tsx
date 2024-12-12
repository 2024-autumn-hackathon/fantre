import ImageUploadForm from "@/features/common/uploadImage/ImageUploadForm"
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
      <div className="flex flex-col h-[calc((100vh-150px)*4/9*2/8)] min-h-[calc(56px*2+20px)] Y-tab:h-[calc(((100vh-100px)*4/9-20px)*1/4)] Y-tab:min-h-[76px]">
        <ImageUploadForm
          formId="top-page-form"
          buttonText="画像送信"
          uploadImageText="背景画像を設定する"
          imageId="bg_image"
          endpoint="top"
          addClass="Y-tab:w-full Y-tab:grid Y-tab:grid-cols-2"
        />
      </div>
    </>
  )
}

export default TopNaviContent