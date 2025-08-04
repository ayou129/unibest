import type { IApiResponse } from './api'
import type {
  ICaptcha,
  IUpdateInfo,
  IUpdatePassword,
  IUserPlatformVo,
  IUserProfileVo,
  IUserTokenVo,
} from './types/login'
import { http } from '@/http/http'
import { ApiCommonPrefix, ApiPrefix } from './api'

export interface IMpLoginCode2SessionDTO {
  code: string
}

export interface IMpLoginQuickPhoneDTO {
  code: string
  open_id: string
}

/**
 * 手机号+sms验证码登录
 */
export interface IMpLoginSmsLoginForm {
  phone: string
  graphic_verify_code: string
  sms_code: string
}

/**
 * 检查session_key
 */
export function checkSessionKey() {
  return http.post<IApiResponse<void>>(`${ApiPrefix}/user/checkSessionKey`)
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getUserLoginGrapicVerifyCode() {
  return http.get<IApiResponse<ICaptcha>>(
    `${ApiCommonPrefix}/grapic_verify_code/user_login`,
  )
}

/**
 * 微信小程序用户code
 * @param form
 */
export function userLoginByCode2Session(form: IMpLoginCode2SessionDTO) {
  return http.post<IApiResponse<IUserPlatformVo>>(
    `${ApiPrefix}/user/wxmp/login/code2session`,
    form,
  )
}

/**
 * 微信小程序手机数据登录（实际登录），后端会生成真正的用户id，并且返回token
 * @param form
 */
export function userLoginByQuickPhone(form: IMpLoginQuickPhoneDTO) {
  return http.post<IApiResponse<IUserTokenVo>>(
    `${ApiPrefix}/user/wxmp/login/quick-phone`,
    form,
  )
}

/**
 * 手机号+sms验证码登录
 */
export function userLoginByPhoneSms(loginForm: IMpLoginSmsLoginForm) {
  return http.post<IApiResponse<IUserTokenVo>>(
    `${ApiPrefix}/user/phone/login/sms`,
    loginForm,
  )
}

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return http.get<IApiResponse<IUserProfileVo>>(`${ApiPrefix}/user/profile`)
}

/**
 * 刷新token
 */
export function refreshToken() {
  return http.post<IApiResponse<IUserTokenVo>>(`${ApiPrefix}/user/refresh`)
}

/**
 * 退出登录
 */
export function logout() {
  return http.get<IApiResponse<void>>(`${ApiPrefix}/user/logout`)
}

/**
 * 修改用户信息
 */
export function updateUserProfile(data: IUpdateInfo) {
  return http.put<IApiResponse<void>>(`${ApiPrefix}/user/profile`, data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post<IApiResponse<void>>(
    `${ApiPrefix}/user/updatePassword`,
    data,
  )
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}
