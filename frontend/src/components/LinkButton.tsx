import concatClassName from "@/utils/concatClassName"
import Link from "next/link"

const LinkButton = ({
  children,
  href,
  addClass = "",
}: Readonly<{
  children: React.ReactNode
  href: string
  addClass?: string
}>) => {
  const baseClass = "block bg-my-yellow w-60 h-[40px] rounded-3xl overflow-hidden"
  const className = concatClassName(baseClass, addClass)
  return (
    <Link
      href={ href }
      className={ className }
    >
      <p className="py-2">
        { children }
      </p>
    </Link>
  )
}

export default LinkButton