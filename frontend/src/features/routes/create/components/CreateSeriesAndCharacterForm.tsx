import sendFormAction from "@/utils/sendFormAction"
import ModalData from "../ModalData"
  
const CreateSeriesAndCharacterForm = ({
  charactersList,
  setCharacterList,
  setError,
}: Readonly<{
  charactersList: ModalData
  setCharacterList: React.Dispatch<React.SetStateAction<ModalData>>
  setError: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  return (
    <form
      action={
        async formData => {
          const endpoint = "series-characters"
          const requires = [
            "series_name",
            "is_new_series",
            "character_name",
            "is_new_character",
          ]

          if (!formData.get(requires[0]) || !formData.get(requires[2])) return// 空白アラートの関数など呼びたい
          formData.append(requires[1], "true")
          formData.append(requires[3], "true")

          const result = await sendFormAction(formData, endpoint, requires)
          if (!result) {// サーバーエラー・重複などで作成に失敗した場合
            const closedState: ModalData = {data: charactersList.data, isShow: false, choiced: charactersList.choiced}
            setError(true)
            setCharacterList(closedState)
          } else {
            const newStateData = {...charactersList.data}
            const characterId = result.character_id
            newStateData[characterId] = formData.get("character_name")
            const newState: ModalData = {data: newStateData, isShow: false, choiced: characterId}
            setCharacterList(newState)
          }
        }
      }
      className="w-full items-center justify-center [&>*]:mx-2 [&>*]:mb-2 X-tab:flex X-tab:h-12 Y-tab:flex Y-tab:h-12"
    >
      <input
        name="series_name"
        className="bg-my-light-green h-10 rounded-xl text-center"
        type="text"
        placeholder="新しく作成: 作品名"
        required
      />
      <input
        name="character_name"
        className="bg-my-light-green h-10 rounded-xl text-center"
        type="text"
        placeholder="新しく作成: キャラクター名"
        required
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

export default CreateSeriesAndCharacterForm