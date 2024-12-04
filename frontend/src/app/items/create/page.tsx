"use client"

import InputButton from "@/components/InputButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopButton from "@/components/TopButton"
import { BACKEND_ITEM_KEYS as keys } from "@/constants"
import ErrorModal from "@/features/common/errorModal/ErrorModal"
import UploadItemsForm from "@/features/common/UploadItemsForm"
import ClickAndInputButton from "@/features/routes/create/components/ClickAndInputButton"
import CreateForm from "@/features/routes/create/components/CreateCategoryForm"
import CreateCharacterForm from "@/features/routes/create/components/CreateCharacterForm"
import CreateSeriesAndCharacterForm from "@/features/routes/create/components/CreateSeriesAndCharacterForm"
import SelectModal from "@/features/routes/create/components/SelectModal"
import ModalData from "@/features/routes/create/ModalData"
import { useState } from "react"

const ItemCreatePage = () => {
  const [seriesList, setSeriesList] =
    useState<ModalData>({data: {}, hasData: false, isShow: false, choiced: ""})
  const [charactersList, setChractersList] =
    useState<ModalData>({data: {}, hasData: false, isShow: false, choiced: ""})
  const [categoriesList, setCategoriesList] =
    useState<ModalData>({data: {}, hasData: false, isShow: false, choiced: ""})
  const [error, setError] = useState<boolean>(false)
  return (
    <>
      <MonitorLayout
        headerContent={ <TopButton/> }
        viewContent
        naviContent={
          <>
            <UploadItemsForm
              setError={ setError }
            >
              <ClickAndInputButton
                endpoint="series"
                state={ seriesList }
                handleSetState={ setSeriesList }
                inputName={ keys.series }
                labelValue="作品名"
                charactersList={ charactersList }
                handleSetCharactersList={ setChractersList }
              />
              <ClickAndInputButton
                endpoint="characters"
                state={ charactersList }
                handleSetState={ setChractersList }
                inputName={ keys.character }
                seriesList={ seriesList }
                labelValue="キャラ名"
              />
              <InputButton inputName={ keys.name } labelValue="商品名" required/>
              <InputButton inputName={ keys.tags } labelValue="タグ"/>
              <ClickAndInputButton
                endpoint="category"
                state={ categoriesList }
                handleSetState={ setCategoriesList }
                inputName={ keys.category }
                labelValue="グッズカテゴリー"
              />
              <InputButton inputName={ keys.janCode } pattern="[a-zA-Z0-9]*" labelValue="JANコード"/>
              <InputButton inputName={ keys.releaseDate } type="date" labelValue="発売日"/>
              <InputButton inputName={ keys.retailers } labelValue="購入場所"/>
            </UploadItemsForm>
          </>
        }
        footerContent
      />
      <SelectModal
        state={ seriesList }
        setState={ setSeriesList }
        listName="作品名"
        charactersList={ charactersList }
        setChractersList={ setChractersList }
      >
        <CreateSeriesAndCharacterForm
          seriesList={ seriesList }
          setSeriesList={ setSeriesList }
          charactersList={ charactersList }
          setCharactersList={ setChractersList }
          setError={ setError }
        />
      </SelectModal>
      <SelectModal
        state={ charactersList }
        setState={ setChractersList }
        listName="キャラクター名"
      >
        <CreateCharacterForm
          charactersList={ charactersList }
          setChractersList={ setChractersList }
          setError={ setError }
          choiced={ seriesList.choiced }
        />
      </SelectModal>
      <SelectModal
        state={ categoriesList }
        setState={ setCategoriesList }
        listName="カテゴリー名"
      >
        <CreateForm
          inputName="category_name"
          categoriesList={ categoriesList }
          setCategoriesList={ setCategoriesList }
          endpoint="categories"
          setError={ setError }
        />
      </SelectModal>
      <ErrorModal error={ error } setError={ setError }/>
    </>
  )
}

export default ItemCreatePage