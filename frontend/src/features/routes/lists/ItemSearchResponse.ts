export default interface ItemSearchResponse {
  items:
  {
    id: string,
    item_name: string
  }[],
  maxPage: number
}