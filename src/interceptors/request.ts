/* eslint-disable no-param-reassign */
import qs from 'qs'
import { platform } from '@/utils/platform'
import { getEnvBaseUrl } from '@/utils'
import { getUserToken } from '@/store/_base'

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = getEnvBaseUrl()

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 1. 首先初始化 header 对象
    if (!options.header) {
      options.header = {}
    }

    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }

    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 自动拼接代理前缀
        options.url = import.meta.env.VITE_APP_PROXY_PREFIX + options.url
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }

    // 1. 请求超时
    options.timeout = 10000 // 10s

    // 2. 添加 token 请求头标识
    const userToken = getUserToken()
    console.log('拦截器中的 access_token', userToken?.access_token)
    if (userToken && userToken.access_token && userToken.refresh_token) {
      options.header.AccessToken = `${userToken.access_token}`
      options.header.RefreshToken = `${userToken.refresh_token}`
    }

    // 3. 添加平台标识和其他 header
    options.header = {
      platform, // 可选，与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }
  },
}

export const requestInterceptor = {
  install() {
    console.log('安装请求拦截器')
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
