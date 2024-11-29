import Image from "next/image"

const BackgroundImageViewer = ({
  imageUrl = "",
}: Readonly<{
  imageUrl: string
}>) => {
  const image = imageUrl === "" ? null :
    <Image
      fill
      src={ imageUrl }
      alt="背景として表示する画像です"
      style={{objectFit:"contain"}}
    />
  return image
}

export default BackgroundImageViewer