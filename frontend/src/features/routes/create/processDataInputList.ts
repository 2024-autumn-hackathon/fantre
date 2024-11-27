import ModalData from "./ModalData"

const processDataInputList = (
  response: object,
): ModalData => {
  return {data: response, isShow: true, choiced: ""}
}

export default processDataInputList