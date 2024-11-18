import Link from "next/link"

const TextLinkButton = ({
  children,
  href
}: Readonly<{
  children: React.ReactNode
  href: string
}>) => {
  return (
    <Link
      href={ href }
      className="w-full bg-my-light-green pl-1 py-1 block rounded-3xl"
    >
      { children }
    </Link>
  )
}

export default TextLinkButton