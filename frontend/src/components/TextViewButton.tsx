import concatClassName from "@/utils/concatClassName"

const TextViewButton = ({
  children,
  addClass = "",
}: Readonly<{
  children: string
  addClass?: string
}>) => {
  const baseClass = "bg-my-green w-60 h-[40px] rounded-3xl mx-auto"
  const className = concatClassName(baseClass, addClass)
  return (
    <div
      className={ className }
    >
      <p className="py-2">
        { children }
      </p>
    </div>
  )
}

export default TextViewButton