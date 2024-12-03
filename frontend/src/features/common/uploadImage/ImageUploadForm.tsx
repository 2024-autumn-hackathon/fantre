"use client"

import { IMAGE_FORMAT_ALLOW_LIST as allowedImages } from "@/constants"
import concatClassName from "@/utils/concatClassName"
import uploadImage from "./uploadImage"

const ImageUploadForm = ({
  formId,
  children,
  uploadImageText,
  buttonText,
  addClass = "",
  imageId,
  itemId,
  endpoint,
}: Readonly<{
  formId: string
  children?: React.ReactNode
  uploadImageText: string
  buttonText: string
  addClass?: string
  imageId: string
  itemId?: string
  endpoint: string
}>) => {
  const formBaseClass = "mx-auto flex flex-col"
  const className = concatClassName(formBaseClass, addClass)
  return (
    <form
      autoComplete="off"
      className={ className }
      id={ formId }
      name={ formId }
      action={ formData => uploadImage(formData, imageId, itemId, endpoint) }
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
          className="file:opacity-0 file:block file:bg-my-orange file:h-0 file:border-0 h-[40px] mx-auto rounded-[40px] pl-10 bg-my-orange leading-normal cursor-pointer w-60"
          name={ imageId }
        />
      </div>
      <button
        className="block h-[40px] w-60 rounded-3xl bg-my-orange mx-auto mt-4"
        type="submit"
      >
        <p>{ buttonText }</p>
      </button>
    </form>
  )
}

export default ImageUploadForm