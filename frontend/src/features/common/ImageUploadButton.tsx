const ImageUploadButton = () => {
  return (
    <form
      autoComplete="off"
      className="m-auto flex flex-col"
      encType="multipart/form-data"
      // name
      // action
    >
      <input
        accept="image/*"
        type="file"
        className="file:block file:bg-my-orange file:h-[25px] file:leading-none file:border-0 w-44 h-[60px] m-auto mt-4 rounded-[40px] pl-3 bg-my-orange leading-loose"
      />
      <button
        className="block h-[40px] w-44 rounded-3xl bg-my-orange m-auto mt-4"
        type="submit"
      >
        <p>画像決定</p>
      </button>
    </form>
  )
}

export default ImageUploadButton