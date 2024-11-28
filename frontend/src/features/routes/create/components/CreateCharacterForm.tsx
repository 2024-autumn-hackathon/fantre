import sendFormAction from "@/utils/sendFormAction"
import ModalData from "../ModalData"

const CreateCharacterForm = ({
  charactersList,
  setChractersList,
  setError,
  choiced,
}: Readonly<{
  charactersList: ModalData
  setChractersList: React.Dispatch<React.SetStateAction<ModalData>>
  setError: React.Dispatch<React.SetStateAction<boolean>>
  choiced: string
}>) => {
  return (
    <form
      action={
        async formData => {
          const endpoint = "series-characters"
          const requires = [
            "series_id",
            "is_new_series",
            "character_name",
            "is_new_character",
          ]

          if (!formData.get(requires[2])) return// 空白アラートの関数など呼びたい
          formData.append(requires[0], choiced)
          formData.append(requires[1], "false")
          formData.append(requires[3], "true")

          const result = await sendFormAction(formData, endpoint, requires)
          if (!result) {// サーバーエラー・重複などで作成に失敗した場合
            const closedState: ModalData = {data: charactersList.data, isShow: false, choiced: charactersList.choiced}
            setError(true)
            setChractersList(closedState)
          } else {
            const newStateData = {...charactersList.data}
            const characterId = result.character_id
            newStateData[characterId] = formData.get("character_name")
            const newState: ModalData = {data: newStateData, isShow: false, choiced: characterId}
            setChractersList(newState)
          }
        }
      }
      className="flex w-full h-12 items-center justify-center"
    >
      <input
        name="character_name"
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

export default CreateCharacterForm