import type {
  IAddressCreateRequest,
  IAddressDeleteRequest,
  IAddressInfo,
  IAddressUpdateRequest,
} from './address.typings'
import { http } from '@/http/http'
import { ApiPrefix } from './api'

/**
 * 获取用户地址列表
 */
export function getUserAddressList() {
  return http.get<IAddressInfo[]>(`${ApiPrefix}/user/address/all`)
}

/**
 * 创建用户地址
 */
export function createUserAddress(data: IAddressCreateRequest) {
  return http.post<IAddressInfo>(`${ApiPrefix}/user/address`, data)
}

/**
 * 更新用户地址
 */
export function updateUserAddress(data: IAddressUpdateRequest) {
  return http.put<IAddressInfo>(`${ApiPrefix}/user/address`, data)
}

/**
 * 删除用户地址
 */
export function deleteUserAddress(id: number) {
  return http.delete<void>(`${ApiPrefix}/user/address`, {
    ids: [id],
  } as IAddressDeleteRequest)
}
