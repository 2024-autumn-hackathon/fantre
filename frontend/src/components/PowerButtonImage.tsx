import Image from "next/image"

const PowerButtonImage = () => {
  return (
    <Image
      fill
      src="/PowerButtonImage.svg"
      alt="電源ボタンの見た目を表現する画像です"
      className="hidden X-tab:block row-start-3 col-start-6 col-end-7"
    />
  )
}

export default PowerButtonImage