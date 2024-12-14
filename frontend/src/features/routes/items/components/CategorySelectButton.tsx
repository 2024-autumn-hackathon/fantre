import { KeyTypeIsStringObject } from '@/constants'

const CategorySelectButton = ({
  inputName,
  categoryListObject,
}: {
  inputName: string
  categoryListObject: KeyTypeIsStringObject
}) => {
  return (
    <div className="w-60 mx-auto">
      <label
        htmlFor="category-select"
        className="h-5 mt-1 overflow-auto w-full"
      >
        グッズカテゴリー
      </label>
      <select
        className="block bg-my-light-green w-60 h-[40px] rounded-3xl text-center py-2 hover:opacity-80"
        name={ inputName }
        id="category-select"
      >
        <option value="default">指定しない</option>
        {
          Object.entries(categoryListObject).map((category) => {
            const [key, value] = category
            return (
              <option key={ key } value={ key }>{ value }</option>
            )
          })
        }
      </select>
    </div>
  )
}

export default CategorySelectButton