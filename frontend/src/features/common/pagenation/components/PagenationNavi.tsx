import concatClassName from "@/utils/concatClassName"
import PageState from "../PageState"
import updatePageState from "../updatePageState"

const PagenationNavi = ({
  children,
  addClass = "",
  pageState,
  handleSetPageState,
  newCurrentPage,
  liClass,
}: Readonly<{
  children: string
  addClass?: string
  pageState: PageState
  handleSetPageState: React.Dispatch<React.SetStateAction<PageState>>
  newCurrentPage: number
  liClass: string
}>) => {
  const baseClass = "block h-6 bg-my-yellow rounded-full text-sm hover:opacity-80"
  const className = concatClassName(baseClass, addClass)
  return (
    <li className={ liClass }>
      <button
        onClick={ () => updatePageState(pageState, handleSetPageState, newCurrentPage) }
        className={ className }
      >
        <p>
          { children }
        </p>
      </button>
    </li>
  )
}

export default PagenationNavi