const addItemsToCollectionList = async (
  e: React.FormEvent<HTMLFormElement>,
  itemsToAddToCollectionList: string[]
) => {
  e.preventDefault()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const formData = new FormData(e.currentTarget)// listIdを含む
  const requestUrl = `${ apiBaseUrl }list-items`
  formData.set("listItems", itemsToAddToCollectionList.join(","))
  const response = await fetch(requestUrl, {
    method: "POST",
    body: formData,
  })
}

export default addItemsToCollectionList