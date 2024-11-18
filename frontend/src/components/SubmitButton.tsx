import concatClassName from "@/utils/concatClassName"

const SubmitButton = ({
  children,
  addClass = "",
}: Readonly<{
  children: string
  addClass?: string
}>) => {
  const baseClass = "block bg-my-orange w-60 h-[40px] rounded-3xl text-center m-auto mt-4"
  const className = concatClassName(baseClass, addClass)
  return (
    <button
      className={ className }
    >
      <p>{ children }</p>
    </button>
  )
}

export default SubmitButton