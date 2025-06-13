/**
 * 用户信息
 */
export type IUserProfileVo = {
  id: number
  username: string
  avatar: string
  name: string
  sex: string
  phone: string
  email: string
  status: number
  createTime: string
  updateTime: string
  remark: string
}

/**
 * 登录返回的信息
 */
export type IUserTokenVo = {
  access_token: string
  refresh_token: string
}

/**
 * 获取验证码
 */
export type ICaptcha = {
  captchaEnabled: boolean
  uuid: string
  image: string
}
/**
 * 上传成功的信息
 */
export type IUploadSuccessInfo = {
  fileId: number
  originalName: string
  fileName: string
  storagePath: string
  fileHash: string
  fileType: string
  fileBusinessType: string
  fileSize: number
}
/**
 * 更新用户信息
 */
export type IUpdateInfo = {
  name: string
  sex: string
  avatar: string
  email: string
  phone: string
  remark: string
}
/**
 * 更新用户信息
 */
export type IUpdatePassword = {
  id: number
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
