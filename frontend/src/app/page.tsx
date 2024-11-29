"use client"

import BackgroundImageViewer from "@/components/BackgroundImageViewer"
import LinkButton from "@/components/LinkButton"
import MonitorLayout from "@/components/MonitorLayout"
import TopNaviContent from "@/components/TopNaviContent"
import fetchImage from "@/features/common/getImage/fetchImage"
import getImageUrl from "@/features/common/getImage/getImageUrl"
import LogoutButton from "@/features/routes/top/components/LogoutButton"
import { useEffect, useState } from "react"

const Home = () => {
  // イメージの取得先のURL
  const [imageUrl, setImageUrl] = useState<string>("")
  // backgroundImageのsrcとしての画像のアクセスURL
  const [imageSrcUrl, setImageSrcUrl] = useState<string>("")

  useEffect(()=> {// effectではない方法で管理できる方がパフォーマンスいいかも
    // イメージの取得先のURLを取得する
    const endpoint = "user/bg-images"

    const fetchData = async () => {
      const response = await getImageUrl(endpoint)
      if (response && imageUrl !== response) setImageUrl(response)
    }
    fetchData()
  })

  useEffect(() => {
    // 取得先が有効ならがぞうを取得してブラウザ内のURLとして保存する
    const fetchData = async () => {
      if (imageUrl === "") return
      const response = await fetchImage(imageUrl)
      const blob = await response.blob()
      const srcUrlImageFile = URL.createObjectURL(blob)
      if (srcUrlImageFile && srcUrlImageFile !== imageSrcUrl) setImageSrcUrl(srcUrlImageFile)
    }
    fetchData()
  }, [imageUrl])

  return (
    <MonitorLayout
      headerContent={ <LogoutButton/> }
      viewContent={
        <BackgroundImageViewer
          imageUrl={ imageSrcUrl }
        />
      }
      naviContent={ <TopNaviContent/> }
      footerContent={ <LinkButton addClass="mr-0" href="/login">ログインへ(仮置き)</LinkButton> }
    />
  )
}

export default Home