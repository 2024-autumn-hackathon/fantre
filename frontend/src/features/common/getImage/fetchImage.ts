const fetchImage = async (
  imageUrl: string,
) => {
  const response = await fetch(
    imageUrl,
    {
      cache: "force-cache",
    }
  )
  return response
}

export default fetchImage