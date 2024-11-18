import OnClickButton from "@/features/common/OnClickButton"

const ClickAndInputButton = ({
  children,
  inputName
}: Readonly<{
  children: string
  inputName: string
}>) => {
  return (
    <>
      <OnClickButton
        addClass="bg-[#5271ff] w-60 m-auto mt-4 bg-opacity-80"
      >
        { children }
      </OnClickButton>
      <input
        className="hidden"
        name={ inputName }
      />
    </>
  )
}

export default ClickAndInputButton