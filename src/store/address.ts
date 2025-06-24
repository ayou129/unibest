import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '@/utils/toast'
import type {
  IAddressInfo,
  IAddressCreateRequest,
  IAddressUpdateRequest,
} from '@/api/address.typings'
import { AddressDefaultStatus } from '@/api/address.typings'
import {
  getUserAddressList,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress as setDefaultAddressAPI,
} from '@/api/address'

export const useAddressStore = defineStore('address', () => {
  // 地址列表
  const addressList = ref<IAddressInfo[]>([])

  // 加载状态
  const loading = ref(false)

  /**
   * 获取地址列表
   */
  const getAddressList = async () => {
    try {
      loading.value = true
      const res = await getUserAddressList()
      if (res.code === 0 && res.data) {
        addressList.value = res.data
      } else {
        toast.error(res.msg || '获取地址列表失败')
        addressList.value = []
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
      toast.error('网络错误，请重试')
      addressList.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建地址
   */
  const createAddress = async (data: IAddressCreateRequest) => {
    try {
      loading.value = true
      const res = await createUserAddress(data)
      if (res.code === 0) {
        toast.success('添加地址成功')
        // 重新获取地址列表
        await getAddressList()
        return res.data
      } else {
        toast.error(res.msg || '添加地址失败')
        return null
      }
    } catch (error) {
      console.error('创建地址失败:', error)
      toast.error('网络错误，请重试')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新地址
   */
  const updateAddress = async (data: IAddressUpdateRequest) => {
    try {
      loading.value = true
      const res = await updateUserAddress(data)
      if (res.code === 0) {
        toast.success('更新地址成功')
        // 重新获取地址列表
        await getAddressList()
        return res.data
      } else {
        toast.error(res.msg || '更新地址失败')
        return null
      }
    } catch (error) {
      console.error('更新地址失败:', error)
      toast.error('网络错误，请重试')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除地址
   */
  const deleteAddress = async (id: number) => {
    try {
      loading.value = true
      const res = await deleteUserAddress(id)
      if (res.code === 0) {
        toast.success('删除地址成功')
        // 重新获取地址列表
        await getAddressList()
        return true
      } else {
        toast.error(res.msg || '删除地址失败')
        return false
      }
    } catch (error) {
      console.error('删除地址失败:', error)
      toast.error('网络错误，请重试')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置默认地址
   */
  const setDefaultAddress = async (id: number) => {
    try {
      loading.value = true
      const res = await setDefaultAddressAPI(id)
      if (res.code === 0) {
        toast.success('设置默认地址成功')
        // 重新获取地址列表
        await getAddressList()
        return true
      } else {
        toast.error(res.msg || '设置默认地址失败')
        return false
      }
    } catch (error) {
      console.error('设置默认地址失败:', error)
      toast.error('网络错误，请重试')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取默认地址
   */
  const getDefaultAddress = () => {
    return (
      addressList.value.find((address) => address.is_default === AddressDefaultStatus.DEFAULT) ||
      null
    )
  }

  /**
   * 根据ID获取地址
   */
  const getAddressById = (id: number) => {
    return addressList.value.find((address) => address.id === id) || null
  }

  /**
   * 清空地址列表
   */
  const clearAddressList = () => {
    addressList.value = []
  }

  return {
    // 状态
    addressList,
    loading,

    // 方法
    getAddressList,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressById,
    clearAddressList,
  }
})
