<route lang="json5" type="page">
{
  needLogin: false,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="page-content">
      <!-- 顶部用户信息区域 -->
      <view class="header-section">
        <!-- 用户信息 -->
        <view class="user-info">
          <view class="user-details">
            <image class="avatar" src="@/static/images/avatar.jpg" />
            <view class="user-text">
              <text class="username">{{ userInfo.nickname }}</text>
              <text class="auth-status">{{ userInfo.authStatus }}</text>
            </view>
          </view>
          <view class="auth-button" @click="handleAuth">
            <text class="auth-text">{{ isLoggedIn ? '去认证' : '去登录' }}</text>
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
              <image class="arrow-icon" src="@/static/icons/arrow-right.png" />
            </view>
          </view>

          <view class="order-status-grid">
            <view
              v-for="(status, index) in orderStatuses"
              :key="index"
              class="status-item"
              @click="handleNavigateToOrders(status.type)"
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
          <view class="menu-item" @click="handleNavigateToSettings">
            <view class="menu-left">
              <image class="menu-icon" src="@/static/icons/setting.png" />
              <text class="menu-text">基本设置</text>
            </view>
            <image class="arrow-icon" src="@/static/icons/arrow-right.png" />
          </view>

          <view class="menu-item" @click="handleNavigateToCoupons">
            <view class="menu-left">
              <image class="menu-icon" src="@/static/icons/money_collect.png" />
              <text class="menu-text">优惠券</text>
            </view>
            <image class="arrow-icon" src="@/static/icons/arrow-right.png" />
          </view>

          <view class="menu-item" @click="contactService">
            <view class="menu-left">
              <image class="menu-icon" src="@/static/icons/customerservice.png" />
              <text class="menu-text">联系客服</text>
            </view>
            <image class="arrow-icon" src="@/static/icons/arrow-right.png" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <BottomSection />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import BottomSection from '@/components/bottom-section/bottom-section.vue'
import { useUserStore } from '@/store/user'
import { useTokenStore } from '@/store/token'
import {
  navigateToOrders,
  navigateToCoupons,
  navigateToSettings,
  handleUserAuth,
} from '@/utils/navigation'

defineOptions({
  name: 'MinePage',
})

// Store
const userStore = useUserStore()
const tokenStore = useTokenStore()
const { userProfile } = storeToRefs(userStore)

// 计算属性：检查登录状态
const isLoggedIn = computed(() => {
  const token = tokenStore.getUserToken()
  return !!(token && token.access_token && userProfile.value.id > 0)
})

// 计算属性：用户信息显示
const userInfo = computed(() => {
  if (isLoggedIn.value) {
    return {
      nickname: userProfile.value.name || userProfile.value.username || '用户',
      authStatus: userProfile.value.status === 1 ? '已认证身份' : '未认证身份',
    }
  } else {
    return {
      nickname: '未登录',
      authStatus: '请先登录',
    }
  }
})

// 订单状态
const orderStatuses = ref([
  {
    name: '待支付',
    type: 'pending',
    icon: '/static/icons/order-pending.png',
  },
  {
    name: '待发货',
    type: 'paid',
    icon: '/static/icons/order-paid.png',
  },
  {
    name: '待收货',
    type: 'shipped',
    icon: '/static/icons/order-shipped.png',
  },
  {
    name: '退款/售后',
    type: 'refund',
    icon: '/static/icons/order-refund.png',
  },
])

// 方法
const handleAuth = handleUserAuth

const viewAllOrders = () => {
  console.log('查看全部订单')
  navigateToOrders()
}

const handleNavigateToOrders = (type: string) => {
  console.log('查看订单:', type)
  navigateToOrders(type)
}

const handleShare = () => {
  console.log('分享小程序')
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 5,
    imageUrl: '',
    title: '敬修堂商店',
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

const handleNavigateToSettings = () => {
  console.log('基本设置')
  navigateToSettings()
}

const handleNavigateToCoupons = () => {
  console.log('优惠券')
  navigateToCoupons()
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

// 初始化用户信息
const initUserInfo = async () => {
  const token = tokenStore.getUserToken()
  if (token && token.access_token) {
    console.log('🔑 检测到token，尝试获取用户信息')
    try {
      // 如果有token但没有用户信息，尝试获取
      if (!userProfile.value.id) {
        await userStore.getUserProfile()
      }
    } catch (error) {
      console.log('❌ 获取用户信息失败:', error)
      // HTTP拦截器会自动处理token刷新或跳转登录
    }
  } else {
    console.log('🔑 无token，跳过获取用户信息')
  }
}

// 生命周期
onLoad(() => {
  console.log('个人中心页面加载完成')
  initUserInfo()
})

onShow(() => {
  console.log('个人中心页面显示')
  // 每次显示时检查并刷新用户信息
  initUserInfo()
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  initUserInfo().finally(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.page-content {
  // 将背景图设置在核心内容区域，覆盖整个可视区域包括padding-top
  background-image: url('@/static/images/user-profile-bgimg.png');
  background-repeat: no-repeat;
  background-position: 0 0; // 从最顶部开始
  background-size: 100% 600rpx; // 设置合适的高度，覆盖头部区域
}

.header-section {
  padding-bottom: 154rpx;
  // 移除背景图设置，现在由.page-content统一管理
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
  width: 120rpx;
  height: 25rpx;
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
  padding: 12rpx 16rpx;
  flex: 1;
}

.status-icon {
  width: 48rpx;
  height: 48rpx;
}

.status-text {
  margin-top: 20rpx;
  font-size: $mall-font-sm;
  color: #1a1a1a;
}

.share-section {
  margin-top: 24rpx;
  padding: 40rpx 32rpx 28rpx;
  background-image: url('@/static/images/share-bg.png');
  background-position: 0% 0%;
  background-size: cover;
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
  padding-top: 4rpx;
}

.menu-text {
  margin-left: 12rpx;
  font-size: 28rpx;
  line-height: 28rpx;
  color: #1a1a1a;
}
</style>
