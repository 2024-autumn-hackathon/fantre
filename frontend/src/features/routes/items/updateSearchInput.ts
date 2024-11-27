// フォームクリックイベントを受け取って、stateのsearchInputに空文字以外のクエリを登録する
const updateSearchInput = (
  e: React.FormEvent<HTMLFormElement>,
  handleSetSearchInput: React.Dispatch<React.SetStateAction<URLSearchParams>>,
) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const searchParams = new URLSearchParams()
  formData.forEach((value, key) => {
    if (value !== "") searchParams.append(key, value.toString())
  })

  handleSetSearchInput(searchParams)
}

export default updateSearchInput