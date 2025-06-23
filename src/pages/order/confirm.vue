<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '确认订单',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="page-context">
      <!-- 收货地址区域 -->
      <view class="address-section" @click="selectAddress">
        <view class="address-content">
          <image
            class="location-icon"
            src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=82b239ff86b8a3b5ddc84b81c06f11e4.png"
          />
          <text class="address-text">{{ selectedAddress.text }}</text>
        </view>
        <image
          class="arrow-icon"
          src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=75da3c789292876c85e845d429ae5166.png"
        />
      </view>

      <!-- 商品信息区域 -->
      <view class="product-section">
        <view class="product-content">
          <image class="product-image" :src="orderInfo.productImage" />
          <view class="product-details">
            <text class="product-name">{{ orderInfo.productName }}</text>
            <text class="product-desc">{{ orderInfo.productDesc }}</text>
            <text class="product-price">{{ orderInfo.price }}</text>
          </view>
          <text class="product-quantity">×{{ orderInfo.quantity }}</text>
        </view>

        <!-- 费用明细 -->
        <view class="cost-details">
          <view class="cost-item">
            <text class="cost-label">运费</text>
            <text class="cost-value">￥{{ orderInfo.shipping }}</text>
          </view>
          <view class="cost-item">
            <text class="cost-label">商品小计</text>
            <text class="cost-value">￥{{ orderInfo.subtotal }}</text>
          </view>
          <view class="coupon-section">
            <view class="coupon-row">
              <text class="cost-label">优惠券</text>
              <view class="coupon-selector" @click="selectCoupon">
                <text class="coupon-text">{{ availableCoupons }}张可用</text>
                <image
                  class="arrow-icon-small"
                  src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cae624345e94628d87b88840a8e46219.png"
                />
              </view>
            </view>
            <view class="total-row">
              <text class="total-label">合计：</text>
              <text class="total-amount">￥{{ orderInfo.total }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 支付方式区域 -->
      <view class="payment-section">
        <text class="payment-label">支付方式</text>
        <view class="payment-method" @click="selectPaymentMethod">
          <text class="payment-text">微信支付</text>
          <image
            class="payment-icon"
            src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=0f7af92b6cadfda7a004a21c2e7e3082.png"
          />
        </view>
      </view>
    </view>

    <!-- 底部支付栏 -->
    <view class="bottom-payment">
      <view class="total-price">
        <text class="currency-symbol">￥</text>
        <text class="price-amount">{{ orderInfo.total }}</text>
      </view>
      <view class="mall-btn-lg mall-btn-primary pay-button" @click="handlePayment">
        <text class="mall-btn-text">立即购买</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'

defineOptions({
  name: 'OrderConfirm',
})

// 选中的收货地址
const selectedAddress = ref({
  text: '点击添加收货地址',
  hasAddress: false,
})

// 可用优惠券数量
const availableCoupons = ref(3)

// 订单信息
const orderInfo = ref({
  productName: '敬修堂防脱滋养育发洗发露',
  productDesc: '控油防脱两不误 细腻丰富泡沫',
  price: '199.9',
  quantity: 1,
  shipping: '0.0',
  subtotal: '199.9',
  couponDiscount: '0.9',
  total: '199.0',
  productImage:
    'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
})

// 选择收货地址
const selectAddress = () => {
  console.log('选择收货地址')
  uni.showActionSheet({
    itemList: ['选择已有地址', '添加新地址'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 模拟选择已有地址
        selectedAddress.value = {
          text: '张三 138****5678\n北京市朝阳区xxx街道xxx小区xxx号楼xxx室',
          hasAddress: true,
        }
      } else {
        // 跳转到添加地址页面
        uni.navigateTo({
          url: '/pages/address/add',
        })
      }
    },
  })
}

// 选择优惠券
const selectCoupon = () => {
  console.log('选择优惠券')
  uni.navigateTo({
    url: '/pages/coupon/list',
  })
}

// 选择支付方式
const selectPaymentMethod = () => {
  console.log('选择支付方式')
  uni.showActionSheet({
    itemList: ['微信支付', '支付宝', '银行卡'],
    success: (res) => {
      console.log('选择支付方式:', res.tapIndex)
    },
  })
}

// 处理支付
const handlePayment = () => {
  if (!selectedAddress.value.hasAddress) {
    uni.showToast({
      title: '请先选择收货地址',
      icon: 'none',
    })
    return
  }

  console.log('开始支付')
  uni.showModal({
    title: '确认支付',
    content: `确认支付 ￥${orderInfo.value.total} 吗？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟支付成功
        uni.showLoading({
          title: '支付中...',
        })

        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '支付成功',
            icon: 'success',
          })

          // 跳转到订单详情或订单列表
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/order/index?status=paid',
            })
          }, 1500)
        }, 2000)
      }
    },
  })
}

// 生命周期
onLoad((options) => {
  console.log('确认订单页面加载完成', options)

  // 如果从商品详情页传递了商品信息，在这里接收并更新
  if (options?.productId) {
    // 根据商品ID获取商品信息
    console.log('商品ID:', options.productId)
  }

  if (options?.quantity) {
    orderInfo.value.quantity = parseInt(options.quantity)
    // 重新计算总价
    const subtotal = parseFloat(orderInfo.value.price) * orderInfo.value.quantity
    orderInfo.value.subtotal = subtotal.toFixed(1)
    orderInfo.value.total = (subtotal - parseFloat(orderInfo.value.couponDiscount)).toFixed(1)
  }
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.page-context {
}

.address-section {
  margin-top: 24rpx;
  padding: 48rpx 24rpx;
  background-color: $mall-bg-card;
  border-radius: $mall-radius-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24rpx 32rpx 0;
}

.address-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.location-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: 26rpx;
}

.address-text {
  font-size: $mall-font-md;
  font-family: PingFang;
  font-weight: 700;
  color: $mall-text-primary;
  line-height: 28.24rpx;
  flex: 1;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

.product-section {
  margin: 24rpx 32rpx 0;
  padding: 24rpx 16rpx 40rpx 24rpx;
  background-color: $mall-bg-card;
  border-radius: $mall-radius-lg;
}

.product-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 56rpx;
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: $mall-radius-sm;
  flex-shrink: 0;
}

.product-details {
  margin-left: 16rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.product-name {
  font-size: $mall-font-md;
  width: 100%;
  font-weight: 700;
  color: $mall-text-primary;
  line-height: 32rpx;
  margin-bottom: 12rpx;
  margin-top: 12rpx;
}

.product-desc {
  margin-top: 12rpx;
  color: $mall-text-secondary;
  font-size: $mall-font-sm;
  line-height: 32rpx;
  width: 330rpx;
  margin-bottom: 40rpx;
}

.product-price {
  margin-left: 4rpx;
  color: $mall-text-primary;
  font-size: 32rpx;
  font-family: HarmonyOSSansSC;
  line-height: 24.22rpx;

  &::before {
    content: '￥';
    font-size: $mall-font-base;
    margin-right: 4rpx;
  }
}

.product-quantity {
  margin: 80rpx 12rpx 0 20rpx;
  color: $mall-text-secondary;
  font-size: $mall-font-base;
  font-family: HarmonyOSSansSC;
  line-height: 20.52rpx;
}

.cost-details {
  display: flex;
  flex-direction: column;
  gap: 46rpx;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost-label {
  font-size: $mall-font-base;
  font-family: PingFang;
  color: $mall-text-secondary;
  line-height: 26.12rpx;
}

.cost-value {
  font-size: $mall-font-base;
  font-family: HarmonyOSSansSC;
  color: $mall-text-secondary;
  line-height: 21.2rpx;
}

.coupon-section {
  display: flex;
  flex-direction: column;
}

.coupon-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40rpx;
  border-bottom: 2rpx solid $mall-bg-primary;
}

.coupon-selector {
  display: flex;
  align-items: center;
  margin-right: 8rpx;
}

.coupon-text {
  color: $mall-text-secondary;
  font-size: $mall-font-base;
  font-family: HarmonyOSSansSC;
  line-height: 25.68rpx;
  margin-right: 8rpx;
}

.arrow-icon-small {
  width: 24rpx;
  height: 24rpx;
}

.total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 36rpx;
}

.total-label {
  font-size: $mall-font-sm;
  font-family: PingFang;
  color: $mall-text-secondary;
  line-height: 24.1rpx;
  margin-right: 8rpx;
}

.total-amount {
  color: $mall-color-danger;
  font-size: 32rpx;
  font-family: HarmonyOSSansSC;
  line-height: 24.22rpx;
}

.payment-section {
  margin: 24rpx 32rpx 0;
  padding: 40rpx 24rpx;
  background-color: $mall-bg-card;
  border-radius: $mall-radius-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-label {
  font-size: $mall-font-base;
  font-family: PingFang;
  color: $mall-text-secondary;
  line-height: 26.26rpx;
}

.payment-method {
  display: flex;
  align-items: center;
}

.payment-text {
  font-size: $mall-font-base;
  font-family: PingFang;
  font-weight: 700;
  color: $mall-text-primary;
  line-height: 26.4rpx;
  margin-right: 8rpx;
}

.payment-icon {
  width: 24rpx;
  height: 24rpx;
}

.bottom-payment {
  position: fixed;
  bottom: 0rpx;
  left: 0;
  right: 0;
  padding: 12rpx 32rpx 30rpx 36rpx;
  background-color: $mall-bg-card;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.total-price {
  display: flex;
  align-items: baseline;
  line-height: 36.34rpx;
  height: 36.34rpx;
}

.currency-symbol {
  color: $mall-text-primary;
  font-size: $mall-font-sm;
  font-family: HarmonyOSSansSC;
  line-height: 19.04rpx;
  margin-right: 4rpx;
}

.price-amount {
  color: $mall-text-primary;
  font-size: 48rpx;
  font-family: HarmonyOSSansSC;
  line-height: 36.34rpx;
}

.pay-button {
  width: 294rpx;
}
</style>
