import concatClassName from "@/utils/concatClassName"

const TextViewButton = ({
  children,
  addClass = "",
}: Readonly<{
  children: string
  addClass?: string
}>) => {
  const baseClass = "block bg-my-green w-60 h-[40px] rounded-3xl m-auto"
  const className = concatClassName(baseClass, addClass)
  return (
    <p
      className={ className }
    >
      { children }
    </p>
  )
}

export default TextViewButton