const getImageUrl = async (
  endpoint: string,
) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const response = await fetch(`${ apiBaseUrl }/getImageUrl?endpoint=${ endpoint }`)

  return response?.status === 200 ? await response.json() : null
}

export default getImageUrl