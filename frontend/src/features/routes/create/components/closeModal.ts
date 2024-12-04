import ModalData from "../ModalData"

const closeModal = (
  state: ModalData,
  setState: React.Dispatch<React.SetStateAction<ModalData>>,
  cancelChoice: boolean = false,// 未選択状態に戻すフラグ
) => {
  const closedData: ModalData = !cancelChoice ?
    {data: state.data, hasData: true, isShow: false, choiced: state.choiced} :
    {data: state.data, hasData: true, isShow: false, choiced: ""}
  setState(closedData)
}

export default closeModal