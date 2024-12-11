import Image from "next/image"

const ImageViewItem = async ({
  itemId,
}: Readonly<{
  itemId: string
}>) => {
  const response = await fetch(`/api/images/${ itemId }`)
  const imageUrl = response.status !== 200 ? "" : await response.json()
  return (
    <Image
      src={ imageUrl }
      alt="グッズの画像です"
      width={300}
      height={300}
    />
  )
}

export default ImageViewItem