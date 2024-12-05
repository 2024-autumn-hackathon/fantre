import { KeyTypeIsStringObject } from "@/constants"
import ModalData from "./ModalData"

const processDataInputList = (
  response: KeyTypeIsStringObject | null,
): ModalData => {
  const processedData = response ? response : {}
  return {data: processedData, hasData: false, isShow: true, choiced: ""}
}

export default processDataInputList