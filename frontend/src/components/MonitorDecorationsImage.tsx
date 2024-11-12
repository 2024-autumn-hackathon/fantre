import Image from "next/image"

const MonitorDecorationsImage = () => {
  return (
    <Image
      fill
      src="/MonitorDecorationsImage.svg"
      alt="モニターの台座・コード・びりびりマークの見た目を表現する画像です"
      className="hidden monitor:block h-[50px]"
    />
  )
}

export default MonitorDecorationsImage