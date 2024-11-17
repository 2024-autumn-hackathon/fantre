import Link from "next/link"
import concatClassName from "@/utils/concatClassName"

const LinkButton = ({
  children,
  href,
  addClass = "",
}: Readonly<{
  children: React.ReactNode
  href: string
  addClass?: string
}>) => {
  const baseClass = "block bg-my-yellow w-44 h-[40px] rounded-3xl leading-relaxed"
  const className = concatClassName(baseClass, addClass)
  return (
    <Link
      href={ href }
      className={ className }
    >
      { children }
    </Link>
  )
}

export default LinkButton