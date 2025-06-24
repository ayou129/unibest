import { onLoad } from '@dcloudio/uni-app'
import { needLoginPages as _needLoginPages, getNeedLoginPages } from '@/utils'
import { isLoggedIn, buildLoginUrl } from '@/utils/auth'

const isDev = import.meta.env.DEV
// 检查当前页面是否需要登录
export function usePageAuth() {
  onLoad((options) => {
    // 获取当前页面路径
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentPath = `/${currentPage.route}`

    // 获取需要登录的页面列表
    let needLoginPages: string[] = []
    if (isDev) {
      needLoginPages = getNeedLoginPages()
    } else {
      needLoginPages = _needLoginPages
    }

    // 检查当前页面是否需要登录
    console.log('needLoginPages', needLoginPages)
    const isNeedLogin = needLoginPages.includes(currentPath)
    if (!isNeedLogin) {
      console.log('似乎不需要登录', currentPath)
      return
    }

    const hasLogin = isLoggedIn()
    console.log('hasLogin', hasLogin)
    if (hasLogin) {
      return true
    }

    // 构建重定向URL
    const queryString = Object.entries(options || {})
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')

    const currentFullPath = queryString ? `${currentPath}?${queryString}` : currentPath
    const redirectRoute = buildLoginUrl(currentFullPath)

    // 重定向到登录页
    console.log('重定向到登录页', redirectRoute)
    uni.redirectTo({ url: redirectRoute })
  })
}
