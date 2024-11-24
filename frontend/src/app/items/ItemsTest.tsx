const ItemsTest = () => {
  return (
    <>
      {/* ページの指定がない場合はmaxPageは取得値にcurrentPageは1に */}
      <A href="http://localhost:3000/items?series_name=Test+Series">1</A>
      {/* maxPageが不正な場合は正当な値に戻される */}
      <A href="http://localhost:3000/items?series_name=Test+Series&currentPage=1&maxPage=99">2</A>
      {/* currentPageがmaxPageを超えている場合は1に戻される */}
      <A href="http://localhost:3000/items?series_name=Test+Series&currentPage=99&maxPage=1">3</A>
      {/* maxPageが正当 && currentPageが同じ場合はそのまま */}
      <A href="http://localhost:3000/items?series_name=Test+Series&currentPage=7&maxPage=7">4</A>
      {/* maxPageが不正 && currentPageが同じ場合は戻される */}
      <A href="http://localhost:3000/items?series_name=Test+Series&currentPage=99&maxPage=99">5</A>
    </>
  )
}

const A = ({href,children}:{href:string,children:string}) => {
  return <a href={href} className="block w-12 h-10 rounded-full bg-my-yellow"><p>{children}</p></a>
}

export default ItemsTest