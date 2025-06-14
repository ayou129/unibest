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
