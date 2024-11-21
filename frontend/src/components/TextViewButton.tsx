import concatClassName from "@/utils/concatClassName"

const TextViewButton = ({
  children,
  addClass = "",
}: Readonly<{
  children: string
  addClass?: string
}>) => {
  const baseClass = "flex items-center justify-center bg-my-green w-60 h-[40px] rounded-3xl m-auto"
  const className = concatClassName(baseClass, addClass)
  return (
    <div
      className={ className }
    >
      <p>
        { children }
      </p>
    </div>
  )
}

export default TextViewButton