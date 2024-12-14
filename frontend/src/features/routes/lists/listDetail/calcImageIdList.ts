import { KeyTypeIsStringObject } from "@/constants"

const calcImageIdList = (
  listItems: KeyTypeIsStringObject[],
  currentPage: number,
) => {
  const startIndex = (currentPage - 1) * 9
  const endIndex = startIndex + 9
  const result = listItems.slice(startIndex, endIndex)
  return result
}

export default calcImageIdList