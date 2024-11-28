"use server"

const sendFormAction = async (
  formData: FormData,
  endpoint: string,
  requires: string[],
): Promise<{category_id?: string, category_name?: string, character_id: string, series_id: string} | void> => {
  console.log("--------------------", requires)
  console.log("--------------------", formData)
  // 空白パラメータは除去 & 必須項目が空白の場合リクエスト中止
  const newFormData = new FormData()
  for (const query of formData.entries()) {
    const key = query[0]
    const value = query[1]
    if (value !== "") {
      newFormData.append(key, value)
    }
  }
  for (const requireKey of requires) {
    if (!newFormData.get(requireKey)) return
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const requestUrl = `${ apiBaseUrl }${ endpoint }`
  
  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      body: newFormData
    })

  return response.status === 200 ? response.json() : null
}

export default sendFormAction