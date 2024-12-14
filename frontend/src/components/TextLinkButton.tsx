import concatClassName from "@/utils/concatClassName"
import Link from "next/link"

const TextLinkButton = ({
  children,
  href,
  addClass = "",
}: Readonly<{
  children: React.ReactNode
  href: string
  addClass: string
}>) => {
  const baseClass = "max-w-[640px] min-h-[40px] bg-my-light-green pl-1 py-1 flex items-center justify-center rounded-3xl hover:opacity-80"
  const className = concatClassName(baseClass, addClass)
  return (
    <Link
      href={ href }
      className={ className }
    >
      <p>
        { children }
      </p>
    </Link>
  )
}

export default TextLinkButton