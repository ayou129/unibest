/**
 * 地址相关枚举
 */
export enum AddressDefaultStatus {
  NOT_DEFAULT = 0, // 非默认地址
  DEFAULT = 1, // 默认地址
}

/**
 * 地址信息接口
 */
export interface IAddressInfo {
  id: number
  user_id: number // 用户ID
  name: string // 收货人姓名
  phone: string // 手机号
  province: string // 省份
  city: string // 城市
  district: string // 区域
  detail_address: string // 详细地址
  postal_code?: string // 邮政编码
  is_default: number // 是否默认地址 (0: 非默认, 1: 默认)
  label?: string // 地址标签
  created_at?: string // 创建时间
  updated_at?: string // 更新时间
}

/**
 * 创建地址的请求参数
 */
export interface IAddressCreateRequest {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail_address: string
  postal_code?: string
  is_default?: number // 0: 非默认, 1: 默认
  label?: string
}

/**
 * 更新地址的请求参数
 */
export interface IAddressUpdateRequest {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail_address: string
  postal_code?: string
  is_default?: number // 0: 非默认, 1: 默认
  label?: string
}

/**
 * 删除地址的请求参数
 */
export interface IAddressDeleteRequest {
  ids: number[]
}
