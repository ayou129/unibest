import type {
  ICheckSessionKeyVo,
  IUserPlatformVo,
  IUserProfileVo,
  IUserTokenVo,
} from '@/api/login.typings'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  checkSessionKey as _checkSessionKey,
  getUserProfile as _getUserProfile,
  logout as _logout,
  refreshToken as _refreshToken,
  userLoginByCode2Session as _userLoginByCode2Session,
  userLoginByPhoneSms as _userLoginByPhoneSms,
  userLoginByQuickPhone as _userLoginByQuickPhone,
  getWxCode,
} from '@/api/login'
import { toast } from '@/utils/toast'
import { useTokenStore } from './token'

// 初始化状态
const UserProfileState: IUserProfileVo = {
  id: 0,
  username: '',
  avatar: '/static/images/default-avatar.png',
  name: '',
  sex: '',
  phone: '',
  email: '',
  status: 0,
  createTime: '',
  updateTime: '',
  remark: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userProfile = ref<IUserProfileVo>({ ...UserProfileState })

    // 设置用户信息
    const setUserProfile = (val: IUserProfileVo) => {
      if (!val.id) {
        return
      }
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = UserProfileState.avatar
      }
      else {
        val.avatar = 'https://oss.laf.run/ukw0y1-site/avatar.jpg?feige'
      }
      userProfile.value = val
    }

    const setUserAvatar = (avatar: string) => {
      userProfile.value.avatar = avatar
      console.log('userProfile', userProfile.value)
    }

    // 删除用户信息和token
    const removeUserAllData = () => {
      userProfile.value = { ...UserProfileState }
      useTokenStore().deleteUserToken()
    }

    /**
     * 检查session_key
     */
    const checkSessionKey = async () => {
      const res = await _checkSessionKey()
      return res.data as unknown as ICheckSessionKeyVo
    }

    /**
     * 登录方式1：用户手机号登录
     */
    const userLoginByPhoneSms = async (data: {
      phone: string
      graphic_verify_code: string
      sms_code: string
    }) => {
      const res = await _userLoginByPhoneSms(data)
      const tokens = res.data as unknown as IUserTokenVo
      await useTokenStore().setUserToken(tokens)
      await getUserProfile()
      return res
    }

    /**
     * 登录方式2-1 用户真正登录之前的 code2Session
     */
    const userLoginByCode2Session = async (data: { code: string }) => {
      const res = await _userLoginByCode2Session(data)
      return res.data as unknown as IUserPlatformVo
    }

    /**
     * 登录方式2-2：用户quickPhone登录
     */
    const userLoginByQuickPhone = async (data: { code: string, open_id: string }) => {
      const res = await _userLoginByQuickPhone(data)
      const tokens = res.data as unknown as IUserTokenVo
      await useTokenStore().setUserToken(tokens)
      await getUserProfile()
      return res
    }

    /**
     * 获取用户信息
     */
    const getUserProfile = async () => {
      const res = await _getUserProfile()
      const userProfile = res.data as unknown as IUserProfileVo
      setUserProfile(userProfile)
      // TODO 这里可以增加获取用户路由的方法 根据用户的角色动态生成路由
      return res
    }

    /**
     * 刷新token
     */
    const refreshToken = async () => {
      try {
        const res = await _refreshToken()
        const tokens = res.data as unknown as IUserTokenVo
        if (tokens.access_token && tokens.refresh_token) {
          useTokenStore().setUserToken(tokens)
          console.log('✅ token刷新成功')
        }
        else {
          removeUserAllData()
          console.log('❌ token刷新失败')
        }
        return tokens
      }
      catch (error) {
        console.error('刷新token异常:', error)
        return false
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      removeUserAllData()
    }

    /**
     * 微信登录
     */
    const wxLogin = async () => {
      const data = await getWxCode()
      if (data.code) {
        return data
      }
      toast.error('获取微信登录code失败')
      return null
    }

    return {
      userProfile,
      checkSessionKey,
      userLoginByCode2Session,
      userLoginByQuickPhone,
      userLoginByPhoneSms,
      wxLogin,
      getUserProfile,
      setUserAvatar,
      refreshToken,
      logout,
    }
  },
  {
    persist: true,
  },
)
