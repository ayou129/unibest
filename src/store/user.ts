import {
  userLoginByCode2Session as _userLoginByCode2Session,
  userLoginByPhoneData as _userLoginByPhoneData,
  userLoginByPhoneSms as _userLoginByPhoneSms,
  getUserProfile as _getUserProfile,
  refreshToken as _refreshToken,
  logout as _logout,
  getWxCode,
} from '@/api/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { IUserProfileVo, IUserTokenVo } from '@/api/login.typings'
import { setUserToken, removeUserToken, getUserToken } from './_base'

const USER_PROFILE_KEY = 'userProfile'

export const setUserProfile = (profile: IUserProfileVo) => {
  uni.setStorageSync(USER_PROFILE_KEY, profile)
}

export const getUserProfile = () => {
  const userProfile = uni.getStorageSync(USER_PROFILE_KEY)
  return userProfile as IUserProfileVo
}

export const removeUserProfile = () => {
  uni.removeStorageSync(USER_PROFILE_KEY)
}

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
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = UserProfileState.avatar
      } else {
        val.avatar = 'https://oss.laf.run/ukw0y1-site/avatar.jpg?feige'
      }
      userProfile.value = val
      setUserProfile(val)
    }
    const setUserAvatar = (avatar: string) => {
      userProfile.value.avatar = avatar
      console.log('userProfile', userProfile.value)
    }

    // 删除用户信息
    const removeUserAllData = () => {
      userProfile.value = { ...UserProfileState }
      removeUserProfile()
      removeUserToken()
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
      setUserToken(tokens)
      await getUserProfile()
      return res
    }

    /**
     * 登录方式2：用户phoneData登录
     */
    const userLoginByPhoneData = async (data: {
      code: string
      open_id: string
      encrypted_data: string
      iv: string
    }) => {
      const res = await _userLoginByPhoneData(data)
      const tokens = res.data as unknown as IUserTokenVo
      setUserToken(tokens)
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
      const res = await _refreshToken()
      if (res.code !== 200) {
        toast.error('刷新token失败')
        return false
      }
      const tokens = res.data as unknown as IUserTokenVo
      setUserToken(tokens)
      await getUserProfile()
      return tokens
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
      userLoginByPhoneData,
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
