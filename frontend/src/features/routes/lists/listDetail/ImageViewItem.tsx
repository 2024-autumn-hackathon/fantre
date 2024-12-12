import Image from "next/image"
import Link from "next/link"

const ImageViewItem = ({
  itemId,
  imageUrl,
}: Readonly<{
  itemId: string
  imageUrl: string
}>) => {
  return (
    <li>
      <Link href={`items/${ itemId }`}>
        <Image
          src={ imageUrl }
          alt="グッズの画像です"
          width={300}
          height={300}
          className="hover:opacity-80"
        />
      </Link>
    </li>
  )
}

export default ImageViewItem