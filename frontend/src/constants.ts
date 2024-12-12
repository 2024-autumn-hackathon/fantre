
// 検索
export const BACKEND_ITEM_KEYS = {
  series: "item_series",
  character: "item_character",
  name: "item_name",
  tags: "tags",
  category: "category",
  janCode: "jan_code",
  releaseDate: "release_date",
  retailers: "retailers",
  image: "item_images",
}

// 更新
export const BACKEND_UPDATE_ITEM_KEYS = {
  name: "custom_item_name",
  series: "custom_series_name",
  character: "custom_character_name",
  category: "custom_category_name",
  tags: "custom_item_tags",
  retailers: "custom_item_retailers",
}

// signup用
export const BACKEND_AUTH_KEYS = {
  name: "user_name",
  email: "email",
  pass1: "password1",
  pass2: "password2",
}

// https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie
// cookieの設定 バックエンドが発行したJWTを値にしたcookieを保存します
// フロントエンドで値の有効性はチェックしないのですが、
// 使用するときは結局バックエンドに送るので一応今回は問題ないと思います
export const COOKIE_OPTIONS = {
  // maxAge: 60*60*24,
  maxAge: 1000000,
  // secure: true,
  httpOnly: true,
}

export const TOKEN_PREFIX = "Bearer "

// ファイルタイプ許可リスト
export const IMAGE_FORMAT_ALLOW_LIST = [
  "image/png",
  "image/jpg",
  "image/jpeg",
]
// 拡張子に変換
export const MIME_TO_EXTENSION: {[key:string]: string} = {
  "image/png": ".png",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
}

export const VALIDATION_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

// 8字以上 & 数値1以上 & 小英数1以上 & 大英数1以上
export const VALIDATION_PASSWORD = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"

// items/create内のモーダルで表示する通信の型のダミーデータ
export const DummyModalDataResponse = {
  "category_id": "dummy",
  "category_name": "dummy",
  "character_id": "dummy",
  "series_id": "dummy",
  "access_token": "dummy",
}

// 型対策
export interface KeyTypeIsStringObject {
  [key: string]: string
}

export const LOADING_IMAGE_URL = "/no-image.svg"