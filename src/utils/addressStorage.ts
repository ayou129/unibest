// 地址数据接口
export interface AddressInfo {
  id: string
  name: string
  phone: string
  provinceId: number
  cityId: number
  districtId: number
  province: string
  city: string
  district: string
  detail: string
  fullAddress: string
  isDefault: boolean
  createTime: string
  updateTime: string
}

const STORAGE_KEY = 'mall_address_list'

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 获取所有地址
export const getAddressList = (): AddressInfo[] => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取地址列表失败:', error)
    return []
  }
}

// 根据ID获取地址
export const getAddressById = (id: string): AddressInfo | null => {
  const list = getAddressList()
  return list.find((item) => item.id === id) || null
}

// 保存地址
export const saveAddress = (addressData: Partial<AddressInfo>): boolean => {
  try {
    const list = getAddressList()
    const now = new Date().toISOString()

    if (addressData.id) {
      // 更新现有地址
      const index = list.findIndex((item) => item.id === addressData.id)
      if (index > -1) {
        list[index] = {
          ...list[index],
          ...addressData,
          updateTime: now,
        } as AddressInfo
      } else {
        return false
      }
    } else {
      // 新增地址
      const newAddress: AddressInfo = {
        id: generateId(),
        name: '',
        phone: '',
        provinceId: 0,
        cityId: 0,
        districtId: 0,
        province: '',
        city: '',
        district: '',
        detail: '',
        fullAddress: '',
        isDefault: false,
        createTime: now,
        updateTime: now,
        ...addressData,
      } as AddressInfo

      // 构建完整地址
      newAddress.fullAddress = `${newAddress.province}${newAddress.city}${newAddress.district}${newAddress.detail}`

      list.push(newAddress)
    }

    // 如果设置为默认地址，取消其他地址的默认状态
    if (addressData.isDefault) {
      list.forEach((item) => {
        if (item.id !== addressData.id) {
          item.isDefault = false
        }
      })
    }

    uni.setStorageSync(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch (error) {
    console.error('保存地址失败:', error)
    return false
  }
}

// 删除地址
export const deleteAddress = (id: string): boolean => {
  try {
    const list = getAddressList()
    const index = list.findIndex((item) => item.id === id)

    if (index > -1) {
      list.splice(index, 1)
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(list))
      return true
    }

    return false
  } catch (error) {
    console.error('删除地址失败:', error)
    return false
  }
}

// 设置默认地址
export const setDefaultAddress = (id: string): boolean => {
  try {
    const list = getAddressList()
    let found = false

    list.forEach((item) => {
      if (item.id === id) {
        item.isDefault = true
        found = true
      } else {
        item.isDefault = false
      }
    })

    if (found) {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(list))
      return true
    }

    return false
  } catch (error) {
    console.error('设置默认地址失败:', error)
    return false
  }
}

// 获取默认地址
export const getDefaultAddress = (): AddressInfo | null => {
  const list = getAddressList()
  return list.find((item) => item.isDefault) || null
}

// 清空所有地址
export const clearAllAddress = (): boolean => {
  try {
    uni.removeStorageSync(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清空地址失败:', error)
    return false
  }
}
