import {
  ICaptcha,
  IUpdateInfo,
  IUpdatePassword,
  IUserProfileVo,
  IUserTokenVo,
} from './login.typings'
import { http } from '@/utils/http'
import { IApiResponse, ApiPrefix, ApiCommonPrefix } from './api'

/**
 * 手机号数据登录(微信小程序需要，例如抖音小程序不需要)
 */
export interface IWxPhoneDataLoginForm {
  code: string
  open_id: string
  encrypted_data: string
  iv: string
}

/**
 * 手机号+sms验证码登录
 */
export interface IPhoneSmsLoginForm {
  phone: string
  graphic_verify_code: string
  sms_code: string
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export const getUserLoginGrapicVerifyCode = () => {
  return http.get<IApiResponse<ICaptcha>>(`${ApiCommonPrefix}/grapic_verify_code/user_login`)
}

/**
 * 微信小程序用户code登录
 * @param loginForm 登录表单
 */
export const userLoginByCode2Session = (loginForm: IWxPhoneDataLoginForm) => {
  return http.post<IApiResponse<IUserTokenVo>>(
    `${ApiPrefix}/user/auth/wx/login/code2Session`,
    loginForm,
  )
}

/**
 * 微信小程序手机数据登录（实际登录），后端会生成真正的用户id，并且返回token
 * @param loginForm 登录表单
 */
export const userLoginByPhoneData = (loginForm: IWxPhoneDataLoginForm) => {
  return http.post<IApiResponse<IUserTokenVo>>(
    `${ApiPrefix}/user/auth/wx/login/phoneData`,
    loginForm,
  )
}

/**
 * 手机号+sms验证码登录
 */
export const userLoginByPhoneSms = (loginForm: IPhoneSmsLoginForm) => {
  return http.post<IApiResponse<IUserTokenVo>>(`${ApiPrefix}/user/auth/phone/login/sms`, loginForm)
}

/**
 * 获取用户信息
 */
export const getUserProfile = () => {
  return http.get<IApiResponse<IUserProfileVo>>(`${ApiPrefix}/user/auth/profile`)
}

/**
 * 刷新token
 */
export const refreshToken = () => {
  return http.post<IApiResponse<IUserTokenVo>>(`${ApiPrefix}/user/auth/wx/token/refresh`)
}

/**
 * 退出登录
 */
export const logout = () => {
  return http.get<IApiResponse<void>>(`${ApiPrefix}/user/auth/logout`)
}

/**
 * 修改用户信息
 */
export const updateUserProfile = (data: IUpdateInfo) => {
  return http.put<IApiResponse<void>>(`${ApiPrefix}/user/auth/profile`, data)
}

/**
 * 修改用户密码
 */
export const updateUserPassword = (data: IUpdatePassword) => {
  return http.post<IApiResponse<void>>(`${ApiPrefix}/user/updatePassword`, data)
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export const getWxCode = () => {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => resolve(res),
      fail: (err) => reject(new Error(err)),
    })
  })
}
