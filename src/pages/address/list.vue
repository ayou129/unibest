<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '收货地址',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="page-context">
      <!-- 地址列表 -->
      <view class="address-list">
        <view
          v-for="(address, index) in addressList"
          :key="address.id"
          class="address-card"
          @click="selectAddress(address)"
        >
          <!-- 地址信息 -->
          <view class="address-content">
            <view class="address-header">
              <view class="user-info">
                <text class="user-name">{{ address.name }}</text>
                <text class="user-phone">{{ address.phone }}</text>
              </view>
              <view class="address-tags">
                <text v-if="address.isDefault" class="default-tag">默认</text>
              </view>
            </view>

            <view class="address-detail">
              <image
                class="location-icon"
                src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=82b239ff86b8a3b5ddc84b81c06f11e4.png"
              />
              <text class="address-text">{{ address.fullAddress }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="address-actions">
            <view
              class="mall-btn-sm mall-btn-secondary action-btn"
              @click.stop="editAddress(address)"
            >
              <text class="mall-btn-text">编辑</text>
            </view>
            <view
              class="mall-btn-sm mall-btn-secondary action-btn"
              @click.stop="deleteAddress(address)"
            >
              <text class="mall-btn-text">删除</text>
            </view>
            <view
              v-if="!address.isDefault"
              class="mall-btn-sm mall-btn-outline action-btn"
              @click.stop="setDefault(address)"
            >
              <text class="mall-btn-text">设为默认</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="addressList.length === 0" class="empty-state">
          <image
            class="empty-icon"
            src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=82b239ff86b8a3b5ddc84b81c06f11e4.png"
          />
          <text class="empty-text">暂无收货地址</text>
          <text class="empty-tips">点击下方按钮添加地址</text>
        </view>
      </view>
    </view>

    <!-- 底部添加按钮 -->
    <view class="bottom-actions">
      <view class="mall-btn-lg mall-btn-primary mall-btn-block add-button" @click="addAddress">
        <text class="mall-btn-text">新增收货地址</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app'

defineOptions({
  name: 'AddressList',
})

// 地址列表数据
const addressList = ref([
  {
    id: '1',
    name: '张三',
    phone: '138****5678',
    province: '北京市',
    city: '朝阳区',
    district: '建国门街道',
    detail: '建国门外大街1号国贸大厦A座1001室',
    fullAddress: '北京市朝阳区建国门街道建国门外大街1号国贸大厦A座1001室',
    isDefault: true,
  },
  {
    id: '2',
    name: '李四',
    phone: '139****8765',
    province: '上海市',
    city: '浦东新区',
    district: '陆家嘴街道',
    detail: '世纪大道88号金茂大厦88层',
    fullAddress: '上海市浦东新区陆家嘴街道世纪大道88号金茂大厦88层',
    isDefault: false,
  },
  {
    id: '3',
    name: '王五',
    phone: '137****2468',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南区深南大道9999号',
    fullAddress: '广东省深圳市南山区科技园南区深南大道9999号',
    isDefault: false,
  },
])

// 选择地址（用于确认订单页面）
const selectAddress = (address: any) => {
  console.log('选择地址:', address)

  // 获取页面参数，判断是否是选择地址模式
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage?.options

  if (options?.mode === 'select') {
    // 选择地址模式，返回到上一页并传递地址信息
    uni.navigateBack({
      success: () => {
        // 通过事件总线或其他方式传递地址信息
        uni.$emit('selectAddress', address)
      },
    })
  } else {
    // 普通查看模式，显示地址详情
    uni.showModal({
      title: '地址详情',
      content: `${address.name} ${address.phone}\n${address.fullAddress}`,
      showCancel: false,
    })
  }
}

// 编辑地址
const editAddress = (address: any) => {
  console.log('编辑地址:', address)
  uni.navigateTo({
    url: `/pages/address/edit?id=${address.id}`,
  })
}

// 删除地址
const deleteAddress = (address: any) => {
  console.log('删除地址:', address)
  uni.showModal({
    title: '确认删除',
    content: `确定要删除地址"${address.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        // 执行删除操作
        const index = addressList.value.findIndex((item) => item.id === address.id)
        if (index > -1) {
          addressList.value.splice(index, 1)
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
        }
      }
    },
  })
}

// 设为默认地址
const setDefault = (address: any) => {
  console.log('设为默认:', address)

  // 取消其他地址的默认状态
  addressList.value.forEach((item) => {
    item.isDefault = false
  })

  // 设置当前地址为默认
  address.isDefault = true

  uni.showToast({
    title: '设置成功',
    icon: 'success',
  })
}

// 添加新地址
const addAddress = () => {
  console.log('添加新地址')
  uni.navigateTo({
    url: '/pages/address/add',
  })
}

// 生命周期
onLoad((options) => {
  console.log('地址列表页面加载完成', options)
})

onShow(() => {
  // 页面显示时刷新地址列表（从编辑页面返回时）
  console.log('地址列表页面显示')
  // 这里可以重新加载地址数据
})

onPullDownRefresh(() => {
  console.log('下拉刷新地址列表')
  // 模拟刷新数据
  setTimeout(() => {
    uni.stopPullDownRefresh()
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    })
  }, 1000)
})
</script>

<style lang="scss" scoped>
.page-context {
  padding-bottom: 120rpx; // 为底部按钮留出空间
}

.address-list {
  padding: 24rpx 32rpx;
}

.address-card {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-base;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: $mall-shadow-sm;

  &:last-child {
    margin-bottom: 0;
  }
}

.address-content {
  margin-bottom: 24rpx;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-name {
  font-size: $mall-font-base;
  font-weight: 700;
  color: $mall-text-primary;
  line-height: 32rpx;
}

.user-phone {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
  line-height: 26rpx;
}

.address-tags {
  display: flex;
  gap: 8rpx;
}

.default-tag {
  background-color: $mall-color-primary;
  color: $mall-text-white;
  font-size: $mall-font-xs;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  line-height: 20rpx;
}

.address-detail {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.location-icon {
  width: 32rpx;
  height: 32rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}

.address-text {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  line-height: 32rpx;
  flex: 1;
}

.address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 88rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  text-align: center;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  opacity: 0.3;
  margin-bottom: 32rpx;
}

.empty-text {
  font-size: $mall-font-lg;
  color: $mall-text-secondary;
  line-height: 32rpx;
  margin-bottom: 12rpx;
}

.empty-tips {
  font-size: $mall-font-sm;
  color: $mall-text-placeholder;
  line-height: 28rpx;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12rpx 32rpx 30rpx 36rpx;
  background-color: $mall-bg-card;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.add-button {
  // 继承全局按钮样式
}
</style>
