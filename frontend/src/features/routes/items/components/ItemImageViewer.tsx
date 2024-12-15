import Image from "next/image"
import { Suspense } from "react"

const ItemImageViewer = ({
  imageUrl,
}: Readonly<{
  imageUrl: string
}>) => {
  return (
    <div className="w-[120px] h-[120px]">
      <Suspense>
        <Image
          src={ imageUrl }
          alt="グッズの画像です！"
          width={ 120 }
          height={ 120 }
        />
      </Suspense>
    </div>
  )
}

export default ItemImageViewer