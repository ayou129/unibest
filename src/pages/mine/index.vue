<route lang="json5" type="page">
{
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="page-context">
      <!-- 顶部用户信息区域 -->
      <view class="header-section">
        <!-- 用户信息 -->
        <view class="user-info">
          <view class="user-details">
            <image class="avatar" :src="userInfo.avatar" />
            <view class="user-text">
              <text class="username">{{ userInfo.nickname }}</text>
              <text class="auth-status">{{ userInfo.authStatus }}</text>
            </view>
          </view>
          <view class="auth-button" @click="handleAuth">
            <text class="auth-text">去认证</text>
          </view>
        </view>
      </view>

      <!-- 主要内容区域 -->
      <view class="content-section">
        <!-- 我的订单 -->
        <view class="order-section">
          <view class="section-header">
            <text class="section-title">我的订单</text>
            <view class="view-all" @click="viewAllOrders">
              <text class="view-all-text">全部</text>
              <image
                class="arrow-icon"
                src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cae624345e94628d87b88840a8e46219.png"
              />
            </view>
          </view>

          <view class="order-status-grid">
            <view
              v-for="(status, index) in orderStatuses"
              :key="index"
              class="status-item"
              @click="navigateToOrders(status.type)"
            >
              <image class="status-icon" :src="status.icon" />
              <text class="status-text">{{ status.name }}</text>
            </view>
          </view>
        </view>

        <!-- 分享推广 -->
        <view class="share-section">
          <text class="share-title">分享小程序给好友优惠券</text>
          <view class="share-button" @click="handleShare">
            <text class="share-text">立即分享</text>
          </view>
        </view>

        <!-- 设置菜单 -->
        <view class="settings-section">
          <view class="menu-item" @click="navigateToSettings">
            <view class="menu-left">
              <image
                class="menu-icon"
                src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=84f8c4181ebe063f6c1fde4df4f5ddfd.png"
              />
              <text class="menu-text">基本设置</text>
            </view>
            <image
              class="arrow-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cae624345e94628d87b88840a8e46219.png"
            />
          </view>

          <view class="menu-item" @click="navigateToCoupons">
            <view class="menu-left">
              <image
                class="menu-icon"
                src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=33915e4282968100c1cc2e5fecbe4b20.png"
              />
              <text class="menu-text">优惠券</text>
            </view>
            <image
              class="arrow-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cae624345e94628d87b88840a8e46219.png"
            />
          </view>

          <view class="menu-item" @click="contactService">
            <view class="menu-left">
              <image
                class="menu-icon"
                src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=fa66353d43746c18cce7c73797fcd11b.png"
              />
              <text class="menu-text">联系客服</text>
            </view>
            <image
              class="arrow-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cae624345e94628d87b88840a8e46219.png"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <BottomSection />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BottomSection from '@/components/bottom-section/bottom-section.vue'

defineOptions({
  name: 'MinePage',
})

// 用户信息
const userInfo = ref({
  nickname: '薛定谔的猫',
  authStatus: '未认证身份',
  avatar:
    'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=ee06fa1d4e484fa77188818ebfb741ac.png',
})

// 订单状态
const orderStatuses = ref([
  {
    name: '待支付',
    type: 'pending',
    icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=9df1b88cc1a7ea3bf174665965d041d5.png',
  },
  {
    name: '待发货',
    type: 'paid',
    icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cfa65065bf76db2dd56a8ba8cdcae0ab.png',
  },
  {
    name: '待收货',
    type: 'shipped',
    icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=3c7349736cc5bc5b9193ef985ad022fb.png',
  },
  {
    name: '退款/售后',
    type: 'refund',
    icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=1cdbba553fd61f86a6d93229236fdc9d.png',
  },
])

// 方法
const handleAuth = () => {
  console.log('去认证')
  uni.showToast({
    title: '跳转认证页面',
    icon: 'none',
  })
}

const viewAllOrders = () => {
  console.log('查看全部订单')
  uni.navigateTo({
    url: '/pages/order/index',
  })
}

const navigateToOrders = (type: string) => {
  console.log('查看订单:', type)
  uni.navigateTo({
    url: `/pages/order/index?status=${type}`,
  })
}

const handleShare = () => {
  console.log('分享小程序')
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 5,
    imageUrl: '',
    title: '密语商店',
    miniProgram: {
      id: '',
      path: '/pages/mall/index',
      type: 0,
      webUrl: '',
    },
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success',
      })
    },
  })
}

const navigateToSettings = () => {
  console.log('基本设置')
  uni.navigateTo({
    url: '/pages/settings/index',
  })
}

const navigateToCoupons = () => {
  console.log('优惠券')
  uni.navigateTo({
    url: '/pages/coupons/index',
  })
}

const contactService = () => {
  console.log('联系客服')
  uni.showModal({
    title: '联系客服',
    content: '是否拨打客服电话？',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '400-123-4567',
        })
      }
    },
  })
}

// 生命周期
onLoad(() => {
  console.log('个人中心页面加载完成')
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  // 刷新用户信息
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.page-context {
  // 将背景图设置在核心内容区域，覆盖整个可视区域包括padding-top
  background-image: url('https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=7dc6d93c6d8dc7f3b79183da245fcfd8.png');
  background-repeat: no-repeat;
  background-position: 0 0; // 从最顶部开始
  background-size: 100% 600rpx; // 设置合适的高度，覆盖头部区域
}

.header-section {
  padding-bottom: 154rpx;
  // 移除背景图设置，现在由.page-context统一管理
}

.user-info {
  margin-top: 32rpx;
  padding: 0 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details {
  display: flex;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  width: 108rpx;
  height: 108rpx;
}

.user-text {
  margin-left: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  color: #000000;
  font-size: 32rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 29.88rpx;
}

.auth-status {
  color: rgba(0, 0, 0, 0.2);
  font-size: 24rpx;
  font-family: PingFang;
  line-height: 22.36rpx;
  margin-top: 18rpx;
}

.auth-button {
  padding: 16rpx 0;
  background-color: $mall-color-primary;
  border-radius: 30rpx 30rpx 30rpx 4rpx;
  width: 132rpx;
  height: 56rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-text {
  color: #fffcfc;
  font-size: 26rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 24.2rpx;
}

.content-section {
  margin-top: -106rpx;
  padding: 0 32rpx;
}

.order-section {
  padding: 40rpx 24rpx 44rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 30rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 28.2rpx;
  color: #1a1a1a;
}

.view-all {
  display: flex;
  align-items: center;
}

.view-all-text {
  color: #999999;
  font-size: 26rpx;
  font-family: PingFang;
  line-height: 24.24rpx;
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
}

.order-status-grid {
  margin-top: 40rpx;
  display: flex;
  justify-content: space-between;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 20rpx;
  flex: 1;
}

.status-icon {
  width: 48rpx;
  height: 48rpx;
}

.status-text {
  margin-top: 20rpx;
  font-size: $mall-font-sm;
  font-family: PingFang;
  line-height: 22.4rpx;
  color: #1a1a1a;
}

.share-section {
  margin-top: 24rpx;
  padding: 40rpx 32rpx 28rpx;
  background-image: url('https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=8457a337cde39979da63f8d50051f33f.png');
  background-position: 0% 0%;
  background-size: 686rpx 180rpx;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.share-title {
  font-size: 30rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 28.26rpx;
  color: #1a1a1a;
}

.share-button {
  margin-top: 28rpx;
  padding: 12rpx 0;
  background-color: #ffffff;
  border-radius: 60rpx;
  width: 164rpx;
  border: 2rpx solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share-text {
  font-size: 26rpx;
  font-family: PingFang;
  line-height: 24.08rpx;
  color: #1a1a1a;
}

.settings-section {
  margin-top: 24rpx;
  padding: 40rpx 24rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:first-child) {
    margin-top: 50rpx;
  }
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 32rpx;
  height: 32rpx;

  &:first-child {
    width: 28rpx;
    height: 28rpx;
  }
}

.menu-text {
  margin-left: 12rpx;
  font-size: 28rpx;
  font-family: PingFang;
  line-height: 26rpx;
  color: #1a1a1a;
}
</style>
