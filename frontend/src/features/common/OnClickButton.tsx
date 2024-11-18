import concatClassName from "@/utils/concatClassName"

const OnClickButton = ({
  children,
  addClass = "",
  // handleClick,
}: Readonly<{
    children: React.ReactNode
    addClass?: string
    // handleClick: () => void
}>) => {
  const baseClass = "block bg-my-orange w-60 h-[40px] rounded-3xl text-center m-auto"
  const className = concatClassName(baseClass, addClass)
  return (
    <button
      className={ className }
      // onClick={ handleClick }
      type="button"
    >
      { children }
    </button>
  )
}

export default OnClickButton