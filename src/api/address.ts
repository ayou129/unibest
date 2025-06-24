import { http } from '@/utils/http'
import { ApiPrefix } from './api'
import type {
  IAddressInfo,
  IAddressCreateRequest,
  IAddressUpdateRequest,
  IAddressDeleteRequest,
} from './address.typings'

/**
 * 获取用户地址列表
 */
export const getUserAddressList = () => {
  return http.get<IAddressInfo[]>(`${ApiPrefix}/user/address/all`)
}

/**
 * 创建用户地址
 */
export const createUserAddress = (data: IAddressCreateRequest) => {
  return http.post<IAddressInfo>(`${ApiPrefix}/user/address`, data)
}

/**
 * 更新用户地址
 */
export const updateUserAddress = (data: IAddressUpdateRequest) => {
  return http.put<IAddressInfo>(`${ApiPrefix}/user/address`, data)
}

/**
 * 删除用户地址
 */
export const deleteUserAddress = (id: number) => {
  return http.delete<void>(`${ApiPrefix}/user/address`, {
    ids: [id],
  } as IAddressDeleteRequest)
}
