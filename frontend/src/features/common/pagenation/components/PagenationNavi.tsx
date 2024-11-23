import Link from "next/link"

const PagenationNavi = ({
  children,
  href
}: Readonly<{
  children: string
  href: string
}>) => {
  return (
    <li>
      <Link
        href={ href }
        className="block w-7 h-6 bg-my-light-green rounded-full text-sm"
      >
        { children }
      </Link>
    </li>
  )
}

export default PagenationNavi