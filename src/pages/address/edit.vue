<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '编辑地址',
  },
}
</route>

<template>
  <view class="page-container">
    <fg-navbar>{{ isEditMode ? '编辑地址' : '新增地址' }}</fg-navbar>
    <view class="page-content">
      <!-- 表单内容 -->
      <view class="form-container">
        <!-- 联系人信息 -->
        <view class="form-section">
          <view class="form-title">联系人信息</view>

          <view class="form-card">
            <view class="form-item">
              <view class="form-label">收货人</view>
              <input
                v-model="formData.name"
                class="form-input"
                placeholder="请输入收货人姓名"
                :maxlength="20"
              />
            </view>

            <view class="form-item">
              <view class="form-label">手机号</view>
              <input
                v-model="formData.phone"
                class="form-input"
                placeholder="请输入手机号码"
                type="tel"
                :maxlength="11"
              />
            </view>
          </view>
        </view>

        <!-- 地址信息 -->
        <view class="form-section">
          <view class="form-title">收货地址</view>

          <view class="form-card">
            <!-- 地址选择器 -->
            <view class="form-item form-item-clickable" @click="showAddressPicker">
              <view class="form-label">所在地区</view>
              <view class="address-display">
                <text class="address-text" :class="{ placeholder: !selectedAddressText }">
                  {{ selectedAddressText || '请选择省市区' }}
                </text>
                <text class="arrow-icon">›</text>
              </view>
            </view>

            <view class="form-item">
              <view class="form-label">详细地址</view>
              <textarea
                v-model="formData.detail_address"
                class="form-textarea"
                placeholder="请输入详细地址（街道、门牌号等）"
                :maxlength="100"
                :show-confirm-bar="false"
                :auto-height="true"
                :min-height="80"
                :max-height="200"
              />
            </view>

            <view class="form-item">
              <view class="form-label">邮政编码</view>
              <input
                v-model="formData.postal_code"
                class="form-input"
                placeholder="请输入邮政编码（可选）"
                type="number"
                :maxlength="6"
              />
            </view>

            <view class="form-item">
              <view class="form-label">地址标签</view>
              <input
                v-model="formData.label"
                class="form-input"
                placeholder="如：家、公司（可选）"
                :maxlength="10"
              />
            </view>
          </view>
        </view>

        <!-- 设置选项 -->
        <view class="form-section">
          <view class="form-card">
            <view class="form-item form-item-switch">
              <view class="form-label">设为默认地址</view>
              <switch
                :checked="formData.is_default"
                @change="(e) => (formData.is_default = e.detail.value)"
                class="form-switch"
                color="#08aa4e"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部保存按钮 -->
    <view class="bottom-panel">
      <view
        class="mall-btn-lg mall-btn-primary mall-btn-block save-button"
        @click="saveAddress"
        :class="{ disabled: addressStore.loading }"
      >
        <text class="mall-btn-text">{{ addressStore.loading ? '保存中...' : '保存地址' }}</text>
      </view>
    </view>

    <!-- 地址选择器组件 -->
    <AddressPicker ref="addressPickerRef" :model-value="addressData" @change="onAddressChange" />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAddressStore } from '@/store/address'
import type { IAddressCreateRequest, IAddressUpdateRequest } from '@/api/address.typings'

defineOptions({
  name: 'AddressEdit',
})

// 引入组件
import AddressPicker from '@/components/AddressPicker.vue'

// 使用地址Store
const addressStore = useAddressStore()

// 地址选择器引用
const addressPickerRef = ref()

// 是否为编辑模式
const isEditMode = ref(false)

// 表单数据
const formData = ref({
  id: 0,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail_address: '',
  postal_code: '',
  is_default: false,
  label: '',
})

// 地址选择数据
const addressData = ref({
  provinceId: 0,
  cityId: 0,
  districtId: 0,
  province: '',
  city: '',
  district: '',
})

// 显示的地址文本
const selectedAddressText = computed(() => {
  const { province, city, district } = formData.value
  if (!province) return ''
  return `${province} ${city} ${district}`
})

// 显示地址选择器
const showAddressPicker = () => {
  // 调用组件的显示方法
  if (addressPickerRef.value) {
    addressPickerRef.value.showPicker?.()
  }
}

// 地址变化处理
const onAddressChange = (address: any) => {
  console.log('地址选择变化:', address)
  // 更新表单数据
  formData.value.province = address.province
  formData.value.city = address.city
  formData.value.district = address.district

  // 同步到地址选择组件
  addressData.value = { ...address }
}

// 页面加载
onLoad(async (options) => {
  if (options?.id) {
    isEditMode.value = true
    formData.value.id = parseInt(options.id)
    // 加载地址数据
    await loadAddressData(parseInt(options.id))
  }
})

// 加载地址数据（编辑模式）
const loadAddressData = async (addressId: number) => {
  // 从Store中获取地址数据
  const address = addressStore.getAddressById(addressId)
  if (address) {
    // 填充表单数据
    formData.value = {
      id: address.id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail_address: address.detail_address,
      postal_code: address.postal_code || '',
      is_default: address.is_default,
      label: address.label || '',
    }

    // 同步地址选择数据
    addressData.value = {
      provinceId: 0, // 这里可能需要根据地址名称反推ID
      cityId: 0,
      districtId: 0,
      province: address.province,
      city: address.city,
      district: address.district,
    }
  } else {
    // 如果Store中没有数据，先加载地址列表
    await addressStore.getAddressList()
    const updatedAddress = addressStore.getAddressById(addressId)
    if (updatedAddress) {
      await loadAddressData(addressId) // 递归调用
    } else {
      uni.showToast({
        title: '地址数据不存在',
        icon: 'error',
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
}

// 保存地址
const saveAddress = async () => {
  // 防止重复提交
  if (addressStore.loading) return

  // 表单验证
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: '请输入收货人姓名',
      icon: 'error',
    })
    return
  }

  if (!formData.value.phone.trim()) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'error',
    })
    return
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'error',
    })
    return
  }

  if (!formData.value.province) {
    uni.showToast({
      title: '请选择所在地区',
      icon: 'error',
    })
    return
  }

  if (!formData.value.detail_address.trim()) {
    uni.showToast({
      title: '请输入详细地址',
      icon: 'error',
    })
    return
  }

  let result = false

  if (isEditMode.value) {
    // 更新地址
    const updateData: IAddressUpdateRequest = {
      id: formData.value.id,
      name: formData.value.name.trim(),
      phone: formData.value.phone.trim(),
      province: formData.value.province,
      city: formData.value.city,
      district: formData.value.district,
      detail_address: formData.value.detail_address.trim(),
      postal_code: formData.value.postal_code.trim() || undefined,
      is_default: formData.value.is_default,
      label: formData.value.label.trim() || undefined,
    }
    result = (await addressStore.updateAddress(updateData)) !== null
  } else {
    // 创建地址
    const createData: IAddressCreateRequest = {
      name: formData.value.name.trim(),
      phone: formData.value.phone.trim(),
      province: formData.value.province,
      city: formData.value.city,
      district: formData.value.district,
      detail_address: formData.value.detail_address.trim(),
      postal_code: formData.value.postal_code.trim() || undefined,
      is_default: formData.value.is_default,
      label: formData.value.label.trim() || undefined,
    }
    result = (await addressStore.createAddress(createData)) !== null
  }

  if (result) {
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  padding-top: $page-top-padding;
}

.form-container {
  padding: 32rpx 24rpx;
}

.form-section {
  margin-bottom: 32rpx;
}

.form-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $mall-text-primary;
  margin-bottom: 24rpx;
  padding-left: 8rpx;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 0 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-item {
  display: flex;
  align-items: center;
  padding: 32rpx 0;
  border-bottom: 2rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.form-item-clickable {
  cursor: pointer;

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.form-label {
  width: 140rpx;
  font-size: 30rpx;
  color: $mall-text-primary;
  flex-shrink: 0;
  line-height: 1.4;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  color: $mall-text-primary;
  padding: 0;
  height: auto;
  line-height: 1.4;

  &::placeholder {
    color: $mall-text-placeholder;
  }
}

.form-textarea {
  flex: 1;
  font-size: 30rpx;
  color: $mall-text-primary;
  padding: 0;
  line-height: 1.4;
  resize: none;

  &::placeholder {
    color: $mall-text-placeholder;
  }
}

.address-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42rpx;
}

.address-text {
  font-size: 30rpx;
  color: $mall-text-primary;
  line-height: 1.4;
  flex: 1;

  &.placeholder {
    color: $mall-text-placeholder;
  }
}

.arrow-icon {
  font-size: 32rpx;
  color: $mall-text-secondary;
  opacity: 0.6;
  margin-left: 16rpx;
}

.form-item-switch {
  .form-label {
    flex: 1;
  }
}

.form-switch {
  transform: scale(0.9);
}

.save-button {
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
