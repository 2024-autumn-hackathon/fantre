import concatClassName from "@/utils/concatClassName"

const InputButton = ({
  addClass = "",
  // handleChange,
  placeholder = "",
  // value = "",
  defaultValue = "",
}: Readonly<{
  addClass?: string
  // handleChange?: () => void
  placeholder?: string
  // value?: string
  defaultValue?: string
}>) => {
  const baseClass = "block bg-my-light-green w-60 h-[40px] rounded-3xl text-center mx-auto mt-4 py-2"
  const className = concatClassName(baseClass, addClass)
  return (
    <input
      className={ className }
      placeholder={ placeholder }
      name=""
      type="text"
      // value={ value }
      // onChange={ handleChange }
      defaultValue={ defaultValue }
    />
  )
}

export default InputButton