import handleClick from "./handleClick"

const ErrorModal = ({
  error,
  setError,
}: Readonly<{
  error: boolean
  setError: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  const elements = !error ? null :
    <div className="absolute w-full h-full bg-red-300 top-0 flex flex-col justify-center [&>*]:mb-4">
      <p>処理に失敗しました</p>
      <p>もう一度やり直してください</p>
      <button
        onClick={ () => handleClick(setError) }
        className="w-48 h-10 bg-my-yellow rounded-full mx-auto"
      >戻る</button>
    </div>
  return elements
}

export default ErrorModal