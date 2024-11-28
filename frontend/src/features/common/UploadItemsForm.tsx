import { BACKEND_ITEM_KEYS as keys } from "@/constants"
import sendFormAction from "@/utils/sendFormAction"
import { redirect } from "next/navigation"

const UploadItemsForm = ({
  children,
  setError,
}: Readonly<{
  children: React.ReactNode
  setError: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  const className = "mx-auto flex flex-col h-full justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4"
  const uploadImageText = "アップロード画像を選択"
  const formId = "item-create"
  return (
    <form
      autoComplete="off"
      className={ className }
      id={ formId }
      name={ formId }
      action={
        async formData => {
          const endpoint = "items/create"
          const requires = [keys.series, keys.character, keys.name, keys.category]

          const result = await sendFormAction(formData, endpoint, requires)
          if (!result) {// サーバーエラー・重複などで作成に失敗した場合
            setError(true)
          } else {
            redirect("/")
          }
        }
      }
    >
      { children }
      <div>
        <label
          htmlFor={ formId }
          className="leading-tight bg-my-light-green w-60 block mx-auto rounded-lg mt-4"
        >
          { uploadImageText }
        </label>
        <input
          accept="image/*"
          type="file"
          id={ formId }
          className="file:opacity-0 file:block file:bg-my-orange file:h-0 file:border-0 h-[40px] mx-auto rounded-[40px] pl-10 bg-my-orange leading-normal cursor-pointer w-60"
        />
      </div>
      <button
        className="block h-[40px] w-60 rounded-3xl bg-my-orange mx-auto mt-4"
        type="submit"
      >
        <p>登録!</p>
      </button>
    </form>
  )
}

export default UploadItemsForm