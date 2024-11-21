import concatClassName from "@/utils/concatClassName"

const ImageUploadForm = ({
  formId,
  children,
  uploadImageText,
  buttonText,
  addClass = ""
}: Readonly<{
  formId: string
  children?: React.ReactNode
  uploadImageText: string
  buttonText: string
  addClass?: string
}>) => {
  const formBaseClass = "m-auto flex flex-col"
  const className = concatClassName(formBaseClass, addClass)
  return (
    <form
      autoComplete="off"
      className={ className }
      encType="multipart/form-data"
      id={ formId }
      name={ formId }
      // action
    >
      { children }
      <div>
        <label
          htmlFor={ formId }
          className="leading-tight bg-my-light-green w-60 block m-auto rounded-lg mt-4"
        >
          { uploadImageText }
        </label>
        <input
          accept="image/*"
          type="file"
          id={ formId }
          className="file:opacity-0 file:block file:bg-my-orange file:h-0 file:border-0 h-[40px] m-auto rounded-[40px] pl-10 bg-my-orange leading-normal cursor-pointer w-60"
        />
      </div>
      <button
        className="block h-[40px] w-60 rounded-3xl bg-my-orange m-auto mt-4"
        type="submit"
      >
        <p>{ buttonText }</p>
      </button>
    </form>
  )
}

export default ImageUploadForm