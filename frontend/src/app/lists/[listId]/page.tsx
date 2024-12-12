import ListDetailPage from "@/features/routes/lists/listDetail/ListDetailPage"
import { getRequestItems } from "@/utils/getRequest"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const initialFetchedListDetailPage = async ({
  params,
}: Readonly<{
  params: Promise<{ listId: string }>
}>) => {
  const cookie = (await cookies()).get("fantre")
  if (!cookie) redirect("/login")
  const listId = (await params).listId
  const endpoint = `lists/${ listId }`
  const searchParams = new URLSearchParams([["listId", listId]])
  const listDetail = await getRequestItems(
    endpoint,
    searchParams,
    1,
    `${ cookie.name }=${ cookie.value }`
  ) || []
  const maxPage = Math.ceil(listDetail.length / 9)
  return <ListDetailPage listId={ listId } listDetail={ listDetail } maxPage={ maxPage } />
}

export default initialFetchedListDetailPage