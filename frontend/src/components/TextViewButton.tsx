import concatClassName from "@/utils/concatClassName"

const TextViewButton = ({
  children,
  addClass = "",
  labelText,
}: Readonly<{
  children: string
  addClass?: string
  labelText?: string
}>) => {
  const baseClass = "w-60 h-16 mx-auto select-none"
  const className = concatClassName(baseClass, addClass)
  return (
    <div
      className={ className }
    >
      <p className="h-6">{ labelText }</p>
      <p className="py-2 h-[40px] bg-my-green rounded-3xl">
        { children }
      </p>
    </div>
  )
}

export default TextViewButton