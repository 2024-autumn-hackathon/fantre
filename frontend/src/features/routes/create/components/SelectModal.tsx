import ModalData from "../ModalData"
import CloseModalButton from "./CloseModalButton"
import SelectInputButton from "./SelectInputButton"

const SelectModal = ({
  children,
  state,
  setState,
  listName,
  charactersList,
  setChractersList,
}: Readonly<{
  children: React.ReactNode
  state: ModalData
  setState: React.Dispatch<React.SetStateAction<ModalData>>
  listName: string
  charactersList?: ModalData
  setChractersList?: React.Dispatch<React.SetStateAction<ModalData>>
}>) => {
  if (!state.isShow) return null
  const dataList = []
  for (const id in state.data) {
    const value = state.data[id]
    dataList.push([id, value])
  }
  const inputList = dataList.map(ary => {
    const [id, value] = ary
    return <SelectInputButton key={ id } id={ id } value={ value } state={ state } setState={ setState }/>
  })
  return (
    <section
      className="h-full w-full rounded-xl absolute z-index-10 p-4 bg-my-light-blue top-0 overflow-auto"
    >
      <h2 className="bg-my-yellow w-4/5 min-w-[360px] mx-auto rounded-full mb-4 select-none">作成するグッズの{ listName }を選んで下さい</h2>
      { inputList }
      <div>
        { children }
        <CloseModalButton state={ state } setState={ setState } charactersList={ charactersList } setChractersList={ setChractersList }/>
      </div>
    </section>
  )
}

export default SelectModal