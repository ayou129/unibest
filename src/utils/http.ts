import { CustomRequestOptions } from '@/interceptors/request'
import { REFRESH_TOKEN_CODE } from '@/api/api'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { navigateToLogin } from '@/utils/navigation'

// 刷新token的API路径
const REFRESH_TOKEN_API = '/user/auth/wx/token/refresh'

// 添加一个刷新token的锁
let isRefreshing = false
let refreshPromise: Promise<any> | null = null

// 处理token刷新的函数
const handleTokenRefresh = (): Promise<void> => {
  if (isRefreshing && refreshPromise) {
    // 如果正在刷新，返回同一个Promise
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = useUserStore()
    .refreshToken()
    .then((result) => {
      if (!result) {
        throw new Error('token刷新失败')
      }
      return result
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

export const http = <T>(options: CustomRequestOptions) => {
  return new Promise<IResData<T>>((resolve, reject) => {
    // 🔥 关键：每次请求都重新获取最新token
    const executeRequest = () => {
      const tokenStore = useTokenStore()
      const currentToken = tokenStore.getUserToken()

      // 克隆options避免修改原对象
      const requestOptions = { ...options }
      if (!requestOptions.header) {
        requestOptions.header = {}
      }

      // 设置最新token
      if (currentToken && currentToken.access_token) {
        requestOptions.header['AccessToken'] = currentToken.access_token
        requestOptions.header['RefreshToken'] = currentToken.refresh_token
        console.log('🔑 请求设置token:', currentToken.access_token)
      }

      uni.request({
        ...requestOptions,
        dataType: 'json',
        success(res) {
          console.log('📡 请求响应:', res.data)

          // 检查是否需要刷新token
          if ((res.data as IResData<T>).code === REFRESH_TOKEN_CODE) {
            console.log('🔄 检测到token过期')

            // 如果是refresh API本身失败，直接登出
            if (options.url?.includes(REFRESH_TOKEN_API)) {
              console.log('❌ refresh API失败，直接登出')
              // useUserStore().logout()
              // uni.navigateTo({ url: '/pages/login/index' })
              reject(res)
              return
            }

            // 处理token刷新
            handleTokenRefresh()
              .then(() => {
                // 刷新成功后重试
                console.log('🔄 token刷新成功，重试请求')
                executeRequest() // 递归调用，会重新获取最新token
              })
              .catch((error) => {
                console.log('❌ token刷新失败')
                useUserStore().logout()
                navigateToLogin()
                reject(error)
              })
            return
          }

          // 正常响应处理
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data as IResData<T>)
          } else {
            !options.hideErrorToast &&
              uni.showToast({
                icon: 'none',
                title: (res.data as IResData<T>).msg || '请求错误',
              })
            reject(res)
          }
        },
        fail(err) {
          uni.showToast({
            icon: 'none',
            title: '网络错误，换个网络试试',
          })
          reject(err)
        },
      })
    }

    // 开始执行请求
    executeRequest()
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpGet = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
  })
}
/**
 * PUT 请求
 */
export const httpPut = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export const httpDelete = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
  })
}

http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete
