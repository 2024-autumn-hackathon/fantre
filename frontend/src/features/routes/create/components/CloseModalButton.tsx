import ModalData from "../ModalData"
import closeModal from "./closeModal"

const CloseModalButton = ({
  state,
  setState,
  charactersList,
  setChractersList,
}: Readonly<{
  state: ModalData
  setState: React.Dispatch<React.SetStateAction<ModalData>>
  charactersList?: ModalData
  setChractersList?: React.Dispatch<React.SetStateAction<ModalData>>
}>) => {
  return (
    <button
      onClick={
        () => {
          closeModal(state, setState)
          if (setChractersList && charactersList) closeModal(charactersList, setChractersList, true)
        }
      }
      type="button"
      className="bg-[#5271ff] w-48 h-10 opacity-4/5 rounded-full"
    >
      <p>
        選択を解除して戻る
      </p>
    </button>
  )
}

export default CloseModalButton