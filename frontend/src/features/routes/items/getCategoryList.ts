const getCategoryList = async (
  cookie: string,
) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const response = await fetch(
    `${ apiBaseUrl }items/create?endpoint=category`,
    {
      headers: {
        cookie: cookie,
      },
    }
  )
  const categoryList = response.status === 200 ? await response.json() : []
  return categoryList
}

export default getCategoryList