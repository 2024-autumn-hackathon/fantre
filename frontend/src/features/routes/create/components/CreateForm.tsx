import sendFormAction from "@/utils/sendFormAction"
import ModalData from "../ModalData"

const CreateForm = ({
  inputName,
  categoriesList,
  setCategoriesList,
  endpoint,
  setError,
}: Readonly<{
  inputName: string
  categoriesList: ModalData
  setCategoriesList: React.Dispatch<React.SetStateAction<ModalData>>
  endpoint: string
  setError: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  return (
    <form
      action={
        async formData => {
          const result = await sendFormAction(formData, endpoint, [inputName])
          if (!result) {// サーバーエラー・重複などで作成に失敗した場合
            const closedState: ModalData = {data: categoriesList.data, isShow: false, choiced: categoriesList.choiced}
            setError(true)
            setCategoriesList(closedState)
          } else {
            const newStateData = {...categoriesList.data}
            const categoryId = result.category_id
            newStateData[categoryId] = result["category_name"]
            const newState: ModalData = {data: newStateData, isShow: false, choiced: result["category_id"]}
            setCategoriesList(newState)
          }
        }
      }
      className="flex w-full h-12 items-center justify-center"
    >
      <input
        name={ inputName }
        className="bg-my-light-green h-10 rounded-xl text-center"
        type="text"
        placeholder="新しく作成する！"
      />
      <button
        className="bg-my-orange w-40 h-10 rounded-full"
        type="submit"
      >
        作成する！
      </button>
    </form>
  )
}

export default CreateForm