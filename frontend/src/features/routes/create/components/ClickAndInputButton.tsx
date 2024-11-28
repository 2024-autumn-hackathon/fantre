import getInputList from "../getInputList"
import ModalData from "../ModalData"

const ClickAndInputButton = ({
  endpoint,
  state,
  handleSetState,
  inputName,
  seriesList,
  placeholder,
}: Readonly<{
  endpoint: string
  state: ModalData
  handleSetState: React.Dispatch<React.SetStateAction<ModalData>>
  inputName: string
  seriesList?: ModalData
  placeholder: string
}>) => {
  const naviChara = state.choiced === "" ? placeholder : state.data[state.choiced]
  return (
    <>
      <button
        className="bg-[#5271ff] w-60 mt-4 bg-opacity-80 block mx-auto w-60 h-[40px] py-2 rounded-3xl text-center"
        onClick={ () => getInputList(endpoint, handleSetState, seriesList) }
        type="button"
      >
        <input
          className="h-[1px] w-[1px] opacity-[0.1]"
          name={ inputName }
          defaultValue={ state.choiced }
          form="item-create"
          required
        />
        { naviChara }
      </button>
    </>
  )
}

export default ClickAndInputButton