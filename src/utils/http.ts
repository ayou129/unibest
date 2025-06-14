import { CustomRequestOptions } from '@/interceptors/request'
import { REFRESH_TOKEN_CODE } from '@/api/api'
import { useUserStore } from '@/store'

// 添加一个刷新token的锁，防止多个请求同时刷新
let isRefreshing = false
// 存储等待刷新完成的请求队列
type RequestCallback = () => void
let requests: RequestCallback[] = []

// 处理请求队列
const handleRequestQueue = () => {
  requests.forEach((callback) => callback())
  requests = []
}

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        console.log('res', res.data)
        // 检查是否需要刷新token
        if ((res.data as IResData<T>).code === REFRESH_TOKEN_CODE) {
          console.log('需要刷新token')
          // 如果正在刷新，将请求加入队列
          if (isRefreshing) {
            requests.push(() => {
              http<T>(options).then(resolve).catch(reject)
            })
            return
          }

          isRefreshing = true
          // 刷新token
          useUserStore()
            .refreshToken()
            .then(() => {
              // 处理等待的请求队列
              handleRequestQueue()
              // 清除旧token，让拦截器重新添加新token
              const retryOptions = { ...options }
              if (retryOptions.header) {
                delete retryOptions.header.AccessToken
                delete retryOptions.header.RefreshToken
              }
              // 重试当前请求
              http<T>(retryOptions).then(resolve).catch(reject)
            })
            .catch((error) => {
              // 刷新失败，清除用户信息并跳转登录页
              useUserStore().logout()
              uni.navigateTo({ url: '/pages/login/index' })
              reject(error)
            })
            .finally(() => {
              isRefreshing = false
            })
          return
        }

        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as IResData<T>)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
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
