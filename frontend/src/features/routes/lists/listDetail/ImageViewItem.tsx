import Image from "next/image"

const ImageViewItem = ({
  itemId,
  imageUrl,
}: Readonly<{
  itemId: string
  imageUrl: string
}>) => {
  return (
    <li>
      <Image
        src={ imageUrl }
        alt="グッズの画像です"
        width={300}
        height={300}
      />
    </li>
  )
}

export default ImageViewItem