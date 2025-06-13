import { IUserTokenVo } from '@/api/login.typings'

// 标识
const USER_TOKEN_KEY = 'userToken'

export const setUserToken = (token: IUserTokenVo) => {
  try {
    if (!token.access_token || !token.refresh_token) {
      console.error('token 缺少必要字段')
      return
    }
    uni.setStorageSync(USER_TOKEN_KEY, token)
  } catch (error) {
    console.error('setUserToken 失败', error)
  }
}

export const getUserToken = () => {
  try {
    const userToken = uni.getStorageSync(USER_TOKEN_KEY)
    return userToken as IUserTokenVo
  } catch (error) {
    console.error('getUserToken 失败', error)
    return null
  }
}

export const removeUserToken = () => {
  try {
    uni.removeStorageSync(USER_TOKEN_KEY)
  } catch (error) {
    console.error('removeUserToken 失败', error)
  }
}
