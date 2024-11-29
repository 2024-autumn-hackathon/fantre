import logoutAction from "../logoutAction"

const LogoutButton = () => {
  return (
    <form
      className="block ml-auto py-2 rounded-3xl text-center bg-my-yellow w-[136px] max-h-[32px] leading-none"
      action={ logoutAction }
    >
      <button>
        <p>
          ログアウト
        </p>
      </button>
    </form>
  )
}

export default LogoutButton