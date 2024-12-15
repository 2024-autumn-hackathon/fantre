"use client"

import concatClassName from "@/utils/concatClassName"

const OnClickButton = ({
  children,
  addClass = "",
  handleClick = () => {},
}: Readonly<{
    children: React.ReactNode
    addClass?: string
    handleClick?: () => void | Promise<void>
}>) => {
  const baseClass = "block bg-my-orange mx-auto w-60 h-[40px] py-2 rounded-3xl text-center hover:opacity-80"
  const className = concatClassName(baseClass, addClass)
  return (
    <button
      className={ className }
      onClick={ handleClick }
      type="button"
    >
      <p>
        { children }
      </p>
    </button>
  )
}

export default OnClickButton