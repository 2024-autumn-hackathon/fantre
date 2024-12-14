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
      className="w-full max-w-[640px] min-h-[40px] bg-my-light-green pl-1 py-1 flex items-center justify-center rounded-3xl hover:opacity-80"
    >
      <p>
        { children }
      </p>
    </Link>
  )
}

export default TextLinkButton