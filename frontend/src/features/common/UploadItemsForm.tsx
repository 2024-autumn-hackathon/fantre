import {
  IMAGE_FORMAT_ALLOW_LIST as allowedImages
} from "@/constants"
import createItem from "@/features/routes/create/createItem"

const UploadItemsForm = ({
  children,
  setError,
}: Readonly<{
  children: React.ReactNode
  setError: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  const className = "mx-auto flex flex-col h-full min-h-[calc(64px*8+76px+56px)] justify-around Y-tab:grid Y-tab:grid-cols-2 Y-tab:gap-4 Y-tab:min-h-[calc(64px*5+20px)]"
  const uploadImageText = "アップロード画像を選択"
  const formId = "item-create"
  const imageId = "item_image"
  return (
    <form
      autoComplete="off"
      className={ className }
      id={ formId }
      name={ formId }
      onSubmit={ e => createItem(e, imageId) }
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
          accept={ allowedImages.join(",") }
          type="file"
          id={ formId }
          name={ imageId }
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