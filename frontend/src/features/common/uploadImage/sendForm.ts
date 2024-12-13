import { ERROR_MESSAGES } from "@/constants"
import uploadImageAndForm from "@/features/common/uploadImage/uploadImageAndForm"

const sendForm = async (
  e: React.FormEvent<HTMLFormElement>,
  imageId: string,
  itemId: string,
  endpoint: string,
) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const imageFile = formData.get(imageId) as File
  if (imageFile && imageFile.size > 2**20) return alert(ERROR_MESSAGES.IMAGE_SIZE_TOO_LARGE)
  await uploadImageAndForm(formData, imageId, itemId, endpoint)
}

export default sendForm