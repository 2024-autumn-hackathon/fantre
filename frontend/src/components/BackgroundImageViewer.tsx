import Image from "next/image"

const BackgroundImageViewer = () => {
  return (
    <Image
      fill
      src="/torio.png"
      alt="背景として表示する画像です"
      style={{objectFit:"contain"}}
    />
  )
}

export default BackgroundImageViewer