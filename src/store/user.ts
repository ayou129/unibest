import {
  userLoginByCode2Session as _userLoginByCode2Session,
  getUserProfile as _getUserProfile,
  logout as _logout,
  getWxCode,
} from '@/api/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { IUserProfileVo } from '@/api/login.typings'

// 初始化状态
const userInfoState: IUserProfileVo = {
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
  access_token: '',
  refresh_token: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserProfileVo>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: IUserProfileVo) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      } else {
        val.avatar = 'https://oss.laf.run/ukw0y1-site/avatar.jpg?feige'
      }
      userInfo.value = val
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const removeUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    }
    /**
     * 用户登录
     * @param credentials 登录参数
     * @returns R<IUserLogin>
     */
    const login = async (credentials: {
      username: string
      password: string
      code: string
      uuid: string
    }) => {
      const res = await _userLoginByCode2Session(credentials)
      console.log('登录信息', res)
      toast.success(res.msg)
      await _getUserProfile()
      return res
    }
    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
      const res = await _getUserProfile()
      const userInfo = res.data as unknown as IUserProfileVo
      setUserInfo(userInfo)
      uni.setStorageSync('userInfo', userInfo)
      // TODO 这里可以增加获取用户路由的方法 根据用户的角色动态生成路由
      return res
    }
    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      _logout()
      removeUserInfo()
    }
    /**
     * 微信登录
     */
    const wxLogin = async () => {
      // 获取微信小程序登录的code
      const data = await getWxCode()
      console.log('微信登录code', data)
      const res = await _userLoginByCode2Session({ code: data.code })
      await _getUserProfile()
      return res
    }

    return {
      userInfo,
      login,
      wxLogin,
      getUserInfo,
      setUserAvatar,
      logout,
    }
  },
  {
    persist: true,
  },
)
