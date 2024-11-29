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

export const BACKEND_AUTH_KEYS = {
  name: "user_name",
  email: "email",
  pass1: "password1",
  pass2: "password2",
}

// https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie
export const COOKIE_OPTIONS = {
  maxAge: 10000,
  // secure: true,
  httpOnly: true,
}

export const TOKEN_PREFIX = "Bearer "

export const VALIDATION_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
// 8字以上 & 数値1以上 & 小英数1以上 & 大英数1以上
export const VALIDATION_PASSWORD = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
