import { ERROR_MESSAGES } from "@/constants"
import uploadImageAndForm from "@/features/common/uploadImage/uploadImageAndForm"

const createItem = async (
  e: React.FormEvent<HTMLFormElement>,
  imageId: string,
) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const imageFile = formData.get(imageId) as File
  if (imageFile && imageFile.size > 2**20) return alert(ERROR_MESSAGES.IMAGE_SIZE_TOO_LARGE)
  const response = await uploadImageAndForm(formData, imageId, "", "itemCreate")
  if (response === 500) {
    alert(ERROR_MESSAGES.ITEM_CREATION_FAILED)
  } else {
    alert(ERROR_MESSAGES.CREATED_BUT_FAILED_TO_UPLOAD_IMAGE)
  }
}

export default createItem