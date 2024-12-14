import { getRequestItemsCreate } from "@/utils/getRequest"
import ModalData from "./ModalData"
import processDataInputList from "./processDataInputList"

const getInputList = async (
  endpoint: string,
  handleSetState: React.Dispatch<React.SetStateAction<ModalData>>,
  seriesList?: ModalData,
  charactersList?: ModalData,
  handleSetCharactersList?: React.Dispatch<React.SetStateAction<ModalData>>,
) => {
  // 作品未選択でボタンを押している場合終了
  if (endpoint === "characters" && seriesList && !seriesList.choiced) {
    alert("作品を先に選択してください！")
    return
  }

  if (endpoint === "series" && charactersList && handleSetCharactersList) {
    const canceledChoiceCharactersList: ModalData = {
      data: { ...charactersList.data },
      hasData: true,
      isShow: false,
      choiced: "",
    }
    handleSetCharactersList(canceledChoiceCharactersList)
  }

  const response = await getRequestItemsCreate(endpoint, seriesList?.choiced)

  const result = processDataInputList(response)
  handleSetState(result)
}

export default getInputList