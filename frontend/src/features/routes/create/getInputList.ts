import { getRequestItemsCreate } from "@/utils/getRequest"
import ModalData from "./ModalData"
import processDataInputList from "./processDataInputList"

const getInputList = async (
  endpoint: string,
  handleSetState: React.Dispatch<React.SetStateAction<ModalData>>,
  seriesList?: ModalData,
) => {
  // 作品未選択でボタンを押している場合終了
  if (endpoint === "characters" && seriesList && !seriesList.choiced) {
    alert("作品を先に選択してください！")
    return
  }

  const response = await getRequestItemsCreate(endpoint, seriesList?.choiced)
  // console.log(response)

  const result = processDataInputList(response)
  handleSetState(result)
}

export default getInputList