import concatClassName from "@/utils/concatClassName"

const InputButton = ({
  addClass = "",
  labelValue = "",
  defaultValue = "",
  inputName,
  type = "text",
  pattern,
  required = false,
  formId,
  inputId,
  placeholder = "",
  maxLength = 30,
}: Readonly<{
  addClass?: string
  labelValue?: string
  defaultValue?: string
  inputName: string
  type?: string
  pattern?: string
  required?: boolean
  formId?: string
  inputId?: string
  placeholder?: string
  maxLength?: number
}>) => {
  const baseClass = "block bg-my-light-green w-60 h-[40px] rounded-3xl text-center py-2 hover:opacity-80"
  const className = concatClassName(baseClass, addClass)
  return (
    <div className="w-60 mx-auto">
      <label
        htmlFor={ inputId }
        className="h-5 mt-1 overflow-auto w-full"
      >
        { labelValue }
      </label>
      <input
        className={ className }
        placeholder={ placeholder }
        name={ inputName }
        type={ type }
        defaultValue={ defaultValue }
        pattern={ pattern || undefined }
        maxLength={ maxLength }
        required={ required }
        form={ formId }
        id={ inputId }
      />
    </div>
  )
}

export default InputButton