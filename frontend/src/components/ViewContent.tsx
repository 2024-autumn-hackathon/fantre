const ViewContent = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <section
      className="h-full bg-my-gray rounded-3xl relative flex flex-col justify-around  overflow-auto"
    >
      { children }
    </section>
  )
}

export default ViewContent