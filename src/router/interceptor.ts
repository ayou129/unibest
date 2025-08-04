/**
 * 增强版路由拦截器，支持 tabBar 页面认证
 */
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { needLoginPages as _needLoginPages, getLastPage, getNeedLoginPages } from '@/utils'

const loginRoute = import.meta.env.VITE_LOGIN_URL
console.log('🔍 loginRoute:', loginRoute)
const isDev = import.meta.env.DEV

function isLogined() {
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
export function checkPageAuth(url: string) {
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
  }
  else {
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
// import { tabbarStore } from '@/layouts/fg-tabbar/tabbar'
// /**
//  * by 菲鸽 on 2024-03-06
//  * 路由拦截，通常也是登录拦截
//  * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
//  * 我这里应为大部分都可以随便进入，所以使用黑名单
//  */
// import { useUserStore } from '@/store'
// import { needLoginPages as _needLoginPages, getLastPage, getNeedLoginPages } from '@/utils'

// // TODO Check
// const loginRoute = import.meta.env.VITE_LOGIN_URL

// function isLogined() {
//   const userStore = useUserStore()
//   return !!userStore.userInfo.username
// }

// const isDev = import.meta.env.DEV

// // 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
// const navigateToInterceptor = {
//   // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
//   // 增加对相对路径的处理，BY 网友 @ideal
//   invoke({ url }: { url: string }) {
//     // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
//     let path = url.split('?')[0]

//     // 处理相对路径
//     if (!path.startsWith('/')) {
//       const currentPath = getLastPage().route
//       const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
//       const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
//       path = `${baseDir}/${path}`
//     }

//     let needLoginPages: string[] = []
//     // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
//     if (isDev) {
//       needLoginPages = getNeedLoginPages()
//     }
//     else {
//       needLoginPages = _needLoginPages
//     }
//     const isNeedLogin = needLoginPages.includes(path)
//     if (!isNeedLogin) {
//       return true
//     }
//     const hasLogin = isLogined()
//     if (hasLogin) {
//       return true
//     }
//     tabbarStore.restorePrevIdx()
//     const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
//     uni.navigateTo({ url: redirectRoute })
//     return false
//   },
// }

// export const routeInterceptor = {
//   install() {
//     uni.addInterceptor('navigateTo', navigateToInterceptor)
//     uni.addInterceptor('reLaunch', navigateToInterceptor)
//     uni.addInterceptor('redirectTo', navigateToInterceptor)
//     uni.addInterceptor('switchTab', navigateToInterceptor)
//   },
// }
