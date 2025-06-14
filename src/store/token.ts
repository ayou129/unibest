import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IUserTokenVo } from '@/api/login.typings'

const UserTokenState: IUserTokenVo = {
  access_token: '',
  refresh_token: '',
}

export const useTokenStore = defineStore(
  'token',
  () => {
    const userToken = ref<IUserTokenVo>({ ...UserTokenState })

    // 设置token
    const setUserToken = async (token: IUserTokenVo) => {
      if (!token.access_token || !token.refresh_token) {
        console.error('token 缺少必要字段')
        return
      }
      console.log('✅ Pinia设置新token:', token.access_token)
      userToken.value = token

      // 立即手动同步到存储，确保拦截器能获取到最新token
      try {
        const currentData = uni.getStorageSync('user') || {}
        const updatedData = {
          ...currentData,
          userToken: token,
        }
        uni.setStorageSync('user', updatedData)
        console.log('🔄 手动同步token到存储完成')

        // 添加一个小延迟确保存储操作完全完成
        await new Promise((resolve) => setTimeout(resolve, 50))
      } catch (error) {
        console.warn('手动同步token失败:', error)
      }
    }

    // 获取token
    const getUserToken = () => {
      return userToken.value
    }

    // 删除token
    const deleteUserToken = () => {
      userToken.value = { ...UserTokenState }
    }

    return {
      userToken,
      setUserToken,
      getUserToken,
      deleteUserToken,
    }
  },
  {
    persist: true,
  },
)
