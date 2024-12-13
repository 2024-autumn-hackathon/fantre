import { TOKEN_PREFIX as pre } from "@/constants"

const makeToken = (cookie: string): string => {
  const cookieValue = cookie.includes("=") ? cookie.split("=")[1] : cookie
  // この形式のトークン文字列をfastapiへのリクエストヘッダのAuthorization:にセットする必要がある
  return `${ pre }${ cookieValue }`
}

export default makeToken