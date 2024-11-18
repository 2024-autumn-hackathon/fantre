const ImageUploadForm = ({
  formId,
  children,
  uploadImageText,
  buttonText
}: Readonly<{
  formId: string
  children?: React.ReactNode
  uploadImageText: string
  buttonText: string
}>) => {
  return (
    <form
      autoComplete="off"
      className="m-auto flex flex-col"
      encType="multipart/form-data"
      id={ formId }
      name={ formId }
      // action
    >
      { children }
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