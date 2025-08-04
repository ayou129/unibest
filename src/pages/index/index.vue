<route lang="json5" type="page">
{
  style: {
    enablePullDownRefresh: false,
    navigationStyle: 'custom',
    navigationBarTitleText: '商城首页',
  },
}
</route>

<template>
  <view class="page-container">
    <!-- 商城主容器 -->
    <view class="page-content">
      <!-- 欢迎区域 -->
      <view class="welcome-section">
        <view class="welcome-text">
          <text class="welcome-title" @click="test">Hey！friend</text>
          <text class="welcome-subtitle">欢迎来到敬修堂商城</text>
        </view>
        <image class="avatar-image" src="@/static/images/avatar.jpg" />
      </view>

      <!-- 商品卡片 -->
      <view class="product-section" @click="navigateToDetail">
        <image class="product-image" src="@/static/images/index_product.png" />
        <view class="product-info">
          <view class="product-text">
            <text class="product-title">敬修堂防脱滋养育发洗发露</text>
            <text class="product-description">控油防脱两不误 细腻丰富泡沫</text>
          </view>
          <text class="product-price">￥298</text>
          <view class="mall-btn-md mall-btn-primary buy-button" @click.stop="handleBuyClick">
            <text class="mall-btn-text">直接购买</text>
          </view>
        </view>
      </view>

      <!-- 底部导航 -->
      <!-- <BottomSection /> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { navigateToProductDetail, navigateToOrderConfirm } from '@/utils/navigation'
// import BottomSection from '@/components/bottom-section/bottom-section.vue'

defineOptions({
  name: 'MallHome',
})

// 方法
const navigateToDetail = () => {
  console.log('跳转到产品详情')
  navigateToProductDetail('1') // 传入商品ID
}

const handleBuyClick = () => {
  console.log('点击购买')
  // 跳转到确认订单页面
  navigateToOrderConfirm({ quantity: 1, productId: '1' })
}

const test = () => {
  // 打印 wx.login 的返回值
  const res = uni.login({
    success: (res) => {
      console.log('login success', res)
    },
    fail: (err) => {
      console.log('login fail', err)
    },
  })
  console.log('login', res)
}

// 生命周期
onLoad(() => {
  console.log('商城首页加载完成')
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style lang="scss" scoped>
page {
  background-color: $mall-bg-primary;
}
.page-content {
  background-color: $mall-bg-primary;
}

.welcome-section {
  margin-top: 20rpx;
  padding: 0 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.welcome-title {
  color: #000000;
  font-size: 52rpx;
  font-family: Archivo;
  line-height: 48.36rpx;
  font-style: italic;
}

.welcome-subtitle {
  color: rgba(0, 0, 0, 0.6);
  font-size: 30rpx;
  font-family: PingFang;
  line-height: 28.32rpx;
  margin-top: 18rpx;
}

.avatar-image {
  border-radius: 50%;
  width: 76rpx;
  height: 76rpx;
}

.product-section {
  width: auto;
  margin-top: 40rpx;
  padding: 0 24rpx;
  height: 1174rpx;
}

.product-image {
  width: 100%;
  height: 85%;
}

.product-info {
  margin-top: -120rpx;
  padding: 48rpx 44rpx 52rpx;
  background-color: $mall-color-secondary;
  border-radius: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.product-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.product-title {
  color: #ffffff;
  font-size: 34rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 32.14rpx;
}

.product-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 26rpx;
  font-family: PingFang;
  line-height: 32rpx;
  width: 330rpx;
  margin-top: 16rpx;
}

.product-price {
  margin-left: 12rpx;
  margin-top: 48rpx;
  color: #ffffff;
  font-size: 56rpx;
  font-family: HarmonyOSSansSC;
  line-height: 42.34rpx;
}

.buy-button {
  width: 192rpx;
  position: absolute;
  right: 36rpx;
  top: 164rpx;
}
</style>
