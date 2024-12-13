import { SEARCH_INPUT_KEYS } from "@/constants"

const checkIsSearchInputEmpty = (
  searchInput: URLSearchParams,
) => {
  for (const [key] of searchInput) {
    if (SEARCH_INPUT_KEYS.includes(key)) return true
  }
  return false
}

export default checkIsSearchInputEmpty