import concatClassName from "@/utils/concatClassName"
import Link from "next/link"

const PagenationNavi = ({
  children,
  addClass = "",
  href
}: Readonly<{
  children: string
  addClass?: string
  href: string
}>) => {
  const baseClass = "block h-6 bg-my-yellow rounded-full text-sm"
  const className = concatClassName(baseClass, addClass)
  return (
    <li>
      <Link
        href={ href }
        className={ className }
      >
        { children }
      </Link>
    </li>
  )
}

export default PagenationNavi