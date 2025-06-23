<route lang="json5" type="page">
{
  //   needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '编辑地址',
  },
}
</route>

<template>
  <view class="page-container">
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
                v-model="formData.detail"
                class="form-textarea"
                placeholder="请输入详细地址（街道、门牌号等）"
                :maxlength="100"
                :show-confirm-bar="false"
                :auto-height="true"
                :min-height="80"
                :max-height="200"
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
                :checked="formData.isDefault"
                @change="(e) => (formData.isDefault = e.detail.value)"
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
      <view class="mall-btn-lg mall-btn-primary mall-btn-block save-button" @click="saveAddress">
        <text class="mall-btn-text">保存地址</text>
      </view>
    </view>

    <!-- 地址选择器组件 -->
    <AddressPicker ref="addressPickerRef" v-model="addressData" @change="onAddressChange" />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

defineOptions({
  name: 'AddressEdit',
})

// 引入组件
import AddressPicker from '@/components/AddressPicker.vue'
// 引入地址存储工具
import {
  saveAddress as saveAddressToStorage,
  getAddressById,
  type AddressInfo,
} from '@/utils/addressStorage'

// 地址选择器引用
const addressPickerRef = ref()

// 表单数据
const formData = ref({
  id: '',
  name: '',
  phone: '',
  provinceId: 0,
  cityId: 0,
  districtId: 0,
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
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
  formData.value.provinceId = address.provinceId
  formData.value.cityId = address.cityId
  formData.value.districtId = address.districtId
  formData.value.province = address.province
  formData.value.city = address.city
  formData.value.district = address.district

  // 同步到地址选择组件
  addressData.value = { ...address }
}

// 页面加载
onLoad((options) => {
  if (options?.id) {
    formData.value.id = options.id
    // 这里可以根据ID加载地址数据
    loadAddressData(options.id)
  }
})

// 加载地址数据（编辑模式）
const loadAddressData = (addressId: string) => {
  const address = getAddressById(addressId)
  if (address) {
    Object.assign(formData.value, address)
    // 同步地址选择数据
    addressData.value = {
      provinceId: address.provinceId,
      cityId: address.cityId,
      districtId: address.districtId,
      province: address.province,
      city: address.city,
      district: address.district,
    }
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

// 保存地址
const saveAddress = () => {
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

  if (!formData.value.detail.trim()) {
    uni.showToast({
      title: '请输入详细地址',
      icon: 'error',
    })
    return
  }

  // 保存地址数据
  uni.showLoading({
    title: '保存中...',
  })

  const success = saveAddressToStorage(formData.value)

  uni.hideLoading()

  if (success) {
    uni.showToast({
      title: '保存成功',
      icon: 'success',
    })

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } else {
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'error',
    })
  }
}
</script>

<style lang="scss" scoped>
.page-content {
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
  transform: scale(0.8);
}

.save-button {
  width: 100%;
  height: 88rpx;
  border-radius: 25rpx;
  background: $mall-color-primary;
  display: flex;
  align-items: center;
  justify-content: center;

  .mall-btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }

  &:active {
    background: darken($mall-color-primary, 10%);
  }
}
</style>
