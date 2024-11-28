import ModalData from "./ModalData"

const setInputList = (
  id: string,
  state: ModalData,
  setState: React.Dispatch<React.SetStateAction<ModalData>>,
) => {
  const newState: ModalData = {data: state.data, isShow: false, choiced: id}
  setState(newState)
}

export default setInputList