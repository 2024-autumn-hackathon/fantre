const testResponse = (searchParams: URLSearchParams) => {
  const testIndex = test(searchParams)
  return testData[testIndex]
}

export default testResponse

const testData = [
  {items:[{id: "id1", item_name: "item1"},{id: "id2", item_name: "item2"},{id: "id3", item_name: "item3"},{id: "id4", item_name: "item4"},{id: "id5", item_name: "item5"},{id: "id6", item_name: "item6"},{id: "id7", item_name: "item7"},],all_pages: 7},
  {items:[{id: "id11", item_name: "item11"},{id: "id12", item_name: "item12"},{id: "id13", item_name: "item13"},{id: "id14", item_name: "item14"},{id: "id15", item_name: "item15"},{id: "id16", item_name: "item16"},{id: "id17", item_name: "item17"},],all_pages: 7},
  {items:[{id: "id21", item_name: "item21"},{id: "id22", item_name: "item22"},{id: "id23", item_name: "item23"},{id: "id24", item_name: "item24"},{id: "id25", item_name: "item25"},{id: "id26", item_name: "item26"},{id: "id27", item_name: "item27"},],all_pages: 7},
  {items:[{id: "id31", item_name: "item31"},{id: "id32", item_name: "item32"},{id: "id33", item_name: "item33"},{id: "id34", item_name: "item34"},{id: "id35", item_name: "item35"},{id: "id36", item_name: "item36"},{id: "id37", item_name: "item37"},],all_pages: 7},
  {items:[{id: "id41", item_name: "item41"},{id: "id42", item_name: "item42"},{id: "id43", item_name: "item43"},{id: "id44", item_name: "item44"},{id: "id45", item_name: "item45"},{id: "id46", item_name: "item46"},{id: "id47", item_name: "item47"},],all_pages: 7},
  {items:[{id: "id51", item_name: "item51"},{id: "id52", item_name: "item52"},{id: "id53", item_name: "item53"},{id: "id54", item_name: "item54"},{id: "id55", item_name: "item55"},{id: "id56", item_name: "item56"},{id: "id57", item_name: "item57"},],all_pages: 7},
  {items:[{id: "id61", item_name: "item61"},{id: "id62", item_name: "item62"},{id: "id63", item_name: "item63"},{id: "id64", item_name: "item64"},{id: "id65", item_name: "item65"},{id: "id66", item_name: "item66"},{id: "id67", item_name: "item67"},],all_pages: 7},
]

function test(searchParams: URLSearchParams) {
  const paramsToString = `${searchParams}`
  const paramsList = [
    "series_name=Test+Series&currentPage=1&maxPage=7",
    "series_name=Test+Series&currentPage=2&maxPage=7",
    "series_name=Test+Series&currentPage=3&maxPage=7",
    "series_name=Test+Series&currentPage=4&maxPage=7",
    "series_name=Test+Series&currentPage=5&maxPage=7",
    "series_name=Test+Series&currentPage=6&maxPage=7",
    "series_name=Test+Series&currentPage=7&maxPage=7",
  ]
  return paramsList.indexOf(paramsToString)
}