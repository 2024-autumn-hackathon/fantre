const Test = () => {
  return (
    <>
      <p className="hidden X-mob:block bg-[red]">X-mob</p>
      <p className="block X-mob:hidden X-tab:hidden Y-tab:hidden bg-[green]">Y-mob</p>
      <p className="hidden X-tab:block bg-[pink]">X-tab</p>
      <p className="hidden Y-tab:block bg-[yellow]">Y-tab</p>
    </>
  )
}

export default Test