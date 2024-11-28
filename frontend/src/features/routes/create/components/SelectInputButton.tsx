import ModalData from "../ModalData"
import setInputList from "../setInputList"

const SelectInputButton = ({
  id,
  value,
  state,
  setState,
}: Readonly<{
  id: string
  value: string
  state: ModalData
  setState: React.Dispatch<React.SetStateAction<ModalData>>
}>) => {
  return (
    <button
      id={ id }
      onClick={ () => setInputList(id, state, setState) }
      type="button"
      className="block mx-auto rounded-full w-60 h-8 bg-my-yellow mb-2"
    >
      { value }
    </button>
  )
}

export default SelectInputButton