import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const deleteCollectionList = async (
  listId: string,
  listName: string,
  router: AppRouterInstance
) => {
  const isDelete = confirm(`${ listName }を削除します。\nよろしいですか？`)
  if (!isDelete) return
  const response = await fetch(`/api/lists/${ listId }`, {
    method: "DELETE",
    headers: {
      credentials: "include",
    },
  })
  if (response.ok) {
    router.refresh()
  } else {
    alert("削除に失敗しました。")
  }
}
