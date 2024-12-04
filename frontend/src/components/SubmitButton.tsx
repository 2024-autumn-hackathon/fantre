import concatClassName from "@/utils/concatClassName"

const SubmitButton = ({
  children,
  addClass = "",
}: Readonly<{
  children: string
  addClass?: string
}>) => {
  const baseClass = "block bg-my-orange w-60 h-[40px] rounded-3xl mx-auto mt-4 py-2 hover:opacity-80"
  const className = concatClassName(baseClass, addClass)
  return (
    <button
      className={ className }
      type="submit"
    >
      <p>
        { children }
      </p>
    </button>
  )
}

export default SubmitButton