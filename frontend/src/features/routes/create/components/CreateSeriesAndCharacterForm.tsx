import { DummyModalDataResponse } from "@/constants"
import sendFormAction from "@/utils/sendFormAction"
import ModalData from "../ModalData"
  
const CreateSeriesAndCharacterForm = ({
  seriesList,
  setSeriesList,
  charactersList,
  setCharactersList,
  setError,
}: Readonly<{
  seriesList: ModalData
  setSeriesList: React.Dispatch<React.SetStateAction<ModalData>>
  charactersList: ModalData
  setCharactersList: React.Dispatch<React.SetStateAction<ModalData>>
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

          const result = await sendFormAction(formData, endpoint, requires) || DummyModalDataResponse
          if (result === DummyModalDataResponse) {// サーバーエラー・重複などで作成に失敗した場合
            const closedState: ModalData = {data: seriesList.data, hasData: true, isShow: false, choiced: seriesList.choiced}
            setError(true)
            setSeriesList(closedState)
          } else {
            // 新しいstateにresultからid・nameを追加、choicedにも追加、isShowをfalseでモーダル閉じられる
            const seriesId = result.series_id
            const seriesName = formData.get(requires[0])?.toString() || ""
            const newSeriesList: ModalData = {
              data: { ...seriesList.data },
              hasData: true,
              isShow: false,
              choiced: seriesId,
            }
            newSeriesList.data[seriesId] = seriesName

            const characterId = result.character_id
            const characterName = formData.get(requires[2])?.toString() || ""
            const newCharactersList: ModalData = {
              data: { ...charactersList.data },
              hasData: true,
              isShow: false,
              choiced: characterId,
            }
            newCharactersList.data[characterId] = characterName

            setSeriesList(newSeriesList)
            setCharactersList(newCharactersList)
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