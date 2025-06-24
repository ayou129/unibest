import { useUserStore } from '@/store/user'
import { useTokenStore } from '@/store/token'

/**
 * 检查用户是否已登录
 */
export const isLoggedIn = () => {
  const userStore = useUserStore()
  const tokenStore = useTokenStore()
  const token = tokenStore.getUserToken()
  const hasProfile = userStore.userProfile.id > 0

  return !!(token && token.access_token && hasProfile)
}

/**
 * 获取登录页面路径
 */
export const getLoginRoute = () => {
  return import.meta.env.VITE_LOGIN_URL || '/pages/login/index'
}

/**
 * 构建登录页面URL（带重定向参数）
 * @param redirect 登录成功后的重定向地址
 */
export const buildLoginUrl = (redirect?: string) => {
  const loginRoute = getLoginRoute()
  return redirect ? `${loginRoute}?redirect=${encodeURIComponent(redirect)}` : loginRoute
}
