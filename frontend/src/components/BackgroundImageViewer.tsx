import Image from "next/image"

const BackgroundImageViewer = ({
  imageSrc = "",
}: Readonly<{
  imageSrc: string
}>) => {
  const image = imageSrc === "" ? null :
    <Image
      fill
      src={ imageSrc }
      alt="背景として表示する画像です"
      style={{objectFit:"contain"}}
    />
  return image
}

export default BackgroundImageViewer