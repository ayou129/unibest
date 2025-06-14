/**
 * 增强版路由拦截器，支持 tabBar 页面认证
 */
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { needLoginPages as _needLoginPages, getNeedLoginPages, getLastPage } from '@/utils'

const loginRoute = import.meta.env.VITE_LOGIN_URL
const isDev = import.meta.env.DEV

const isLogined = () => {
  const userStore = useUserStore()
  const token = useTokenStore().getUserToken()
  const hasProfile = userStore.userProfile.id > 0

  // console.log('🔍 登录状态检查:', {
  //   hasToken: !!(token && token.access_token),
  //   hasProfile,
  // })

  return !!(token && token.access_token && hasProfile)
}

// 通用的页面认证检查函数
export const checkPageAuth = (url: string) => {
  // console.log('🚀 页面认证检查，目标URL:', url)

  let path = url.split('?')[0]

  // 处理相对路径
  if (!path.startsWith('/')) {
    const currentPath = getLastPage().route
    const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
    const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
    path = `${baseDir}/${path}`
  }

  let needLoginPages: string[] = []
  if (isDev) {
    needLoginPages = getNeedLoginPages()
  } else {
    needLoginPages = _needLoginPages
  }

  // console.log('📋 需要登录的页面列表:', needLoginPages)
  // console.log('🎯 当前访问路径:', path)

  const isNeedLogin = needLoginPages.includes(path)

  if (!isNeedLogin) {
    console.log('✅ 页面不需要登录，允许访问:', path)
    return true
  }
  console.log('❓ 当前页面是否需要登录:', isNeedLogin)
  const hasLogin = isLogined()
  console.log('🔐 用户登录状态:', hasLogin)

  if (hasLogin) {
    console.log('✅ 用户已登录，允许访问')
    return true
  }

  const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
  console.log('🔄 用户未登录，重定向到登录页:', redirectRoute)
  uni.navigateTo({ url: redirectRoute })
  return false
}

// 路由拦截器
const navigateToInterceptor = {
  invoke({ url }: { url: string }) {
    return checkPageAuth(url)
  },
}

export const routeInterceptor = {
  install() {
    console.log('🔧 正在安装路由拦截器...')

    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)

    console.log('✅ 路由拦截器安装完成')
  },
}
