import concatClassName from "@/utils/concatClassName"

const InputButton = ({
  addClass = "",
  placeholder = "",
  defaultValue = "",
  inputName,
  type = "text",
  pattern,
  required = false,
}: Readonly<{
  addClass?: string
  placeholder?: string
  defaultValue?: string
  inputName: string
  type?: string
  pattern?: string
  required?: boolean
}>) => {
  const baseClass = "block bg-my-light-green w-60 h-[40px] rounded-3xl text-center mx-auto mt-4 py-2"
  const className = concatClassName(baseClass, addClass)
  return (
    <input
      className={ className }
      placeholder={ placeholder }
      name={ inputName }
      type={ type }
      defaultValue={ defaultValue }
      pattern={ pattern || undefined }
      maxLength={30}
      required={ required }
    />
  )
}

export default InputButton