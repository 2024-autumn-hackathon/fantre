import {
  BACKEND_ITEM_KEYS as keys,
  BACKEND_UPDATE_ITEM_KEYS as updateKeys
} from "@/constants"

const formToJson = (
  formData: FormData
) => {
  const arrayTypeList = [keys.tags, keys.retailers, updateKeys.tags, updateKeys.retailers]
  const formToObjectToArray = Object.entries(Object.fromEntries(formData.entries()))
  const newObject: {[key: string]: string | string[]} = {}

  formToObjectToArray.forEach(ary => {
    const key = ary[0]
    const value = ary[1].toString()
    if (value !== "") {
      if (arrayTypeList.includes(key)) {
        newObject[key] = value.split(",")
      } else {
        newObject[key] = value
      }
    }
  })
  return JSON.stringify(newObject)
}

export default formToJson