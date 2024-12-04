// formDataから必要な値を取り出してリクエストを送る派生関数
const updateItemDetail = async (
  formData: FormData,
  header: Headers,
  apiBaseUrl: string,
  itemId: string,
) => {
  const newFormData = new FormData()
  for (const form of formData.entries()) {
    const key = form[0]
    const value = form[1].toString()
    if (value.length && key.startsWith("custom")) newFormData.set(key, value)
  }

  const requestUrl = `${ apiBaseUrl }itemDetail?item_id=${ itemId }`
  await fetch(
    requestUrl,
    {
      method: "POST",
      headers: header,
      body: newFormData,
    }
  )
}

export default updateItemDetail