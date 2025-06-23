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
    <view class="page-content">
      <!-- 收货地址 -->
      <view class="address-section">
        <view class="address-item" @click="selectAddress">
          <view class="address-info">
            <image
              class="address-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=82b239ff86b8a3b5ddc84b81c06f11e4.png"
            />
            <view v-if="selectedAddress" class="address-content">
              <view class="address-header">
                <text class="address-name">{{ selectedAddress.name }}</text>
                <text class="address-phone">{{ selectedAddress.phone }}</text>
              </view>
              <text class="address-detail">
                {{ selectedAddress.province }} {{ selectedAddress.city }}
                {{ selectedAddress.district }} {{ selectedAddress.detail }}
              </text>
            </view>
            <view v-else class="address-content">
              <text class="address-placeholder">点击添加收货地址</text>
            </view>
          </view>
          <image class="arrow-icon" src="/static/icons/arrow-right.png" />
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods-section">
        <view v-for="item in orderItems" :key="item.id" class="goods-item">
          <image class="goods-image" :src="item.image" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.description }}</text>
            <text class="goods-price">￥{{ item.price }}</text>
          </view>
          <text class="goods-quantity">×{{ item.quantity }}</text>
        </view>

        <!-- 费用明细 -->
        <view class="cost-detail">
          <view class="cost-item">
            <text class="cost-label">运费</text>
            <text class="cost-value">￥{{ shippingFee }}</text>
          </view>
          <view class="cost-item">
            <text class="cost-label">商品小计</text>
            <text class="cost-value">￥{{ goodsTotal }}</text>
          </view>

          <!-- 优惠券选择 -->
          <view class="cost-item coupon-item" @click="showCouponPicker">
            <text class="cost-label">优惠券</text>
            <view class="coupon-info">
              <text v-if="selectedCoupon" class="coupon-text">-￥{{ selectedCoupon.amount }}</text>
              <text v-else class="coupon-text">{{ availableCouponCount }}张可用</text>
              <image class="arrow-icon" src="/static/icons/arrow-right.png" />
            </view>
          </view>

          <!-- 合计 -->
          <view class="cost-total">
            <text class="total-label">合计：</text>
            <text class="total-price">￥{{ finalTotal }}</text>
          </view>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="payment-section">
        <view class="payment-item">
          <text class="payment-label">支付方式</text>
          <view class="payment-info">
            <text class="payment-method">微信支付</text>
            <image class="arrow-icon" src="/static/icons/arrow-right.png" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部支付栏 -->
    <view class="bottom-panel">
      <view class="price-info">
        <text class="price-symbol">￥</text>
        <text class="price-value">{{ finalTotal }}</text>
      </view>
      <view class="mall-btn-lg mall-btn-primary pay-button" @click="submitOrder">
        <text class="pay-text">立即支付</text>
      </view>
    </view>

    <!-- 优惠券选择器 -->
    <CouponPicker
      ref="couponPickerRef"
      :coupons="coupons"
      :order-amount="goodsTotal"
      v-model="selectedCoupon"
      @change="onCouponChange"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CouponPicker from '@/components/CouponPicker.vue'

defineOptions({
  name: 'OrderConfirm',
})

// 优惠券选择器引用
const couponPickerRef = ref()

// 收货地址
const selectedAddress = ref(null)

// 选中的优惠券
const selectedCoupon = ref(null)

// 订单商品
const orderItems = ref([
  {
    id: '1',
    name: '敬修堂防脱滋养育发洗发露',
    description: '控油防脱两不误 细腻丰富泡沫',
    price: 199.9,
    quantity: 1,
    image:
      'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
  },
])

// 优惠券列表
const coupons = ref([
  {
    id: '1',
    name: '新用户专享券',
    description: '限新用户首次购买使用',
    amount: 20,
    minAmount: 100,
    expireTime: '2024-12-31',
    status: 2,
  },
  {
    id: '2',
    name: '满减优惠券',
    description: '全场通用，满减优惠',
    amount: 50,
    minAmount: 200,
    expireTime: '2024-12-31',
    status: 2,
  },
  {
    id: '3',
    name: '品类优惠券',
    description: '洗护用品专用',
    amount: 30,
    minAmount: 150,
    expireTime: '2024-12-31',
    status: 2,
  },
  {
    id: '4',
    name: '过期优惠券',
    description: '已过期的优惠券',
    amount: 100,
    minAmount: 50,
    expireTime: '2024-01-01',
    status: 3,
  },
])

// 运费
const shippingFee = ref(0)

// 商品总价
const goodsTotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

// 可用优惠券数量
const availableCouponCount = computed(() => {
  return coupons.value.filter(
    (coupon) => coupon.status === 2 && goodsTotal.value >= coupon.minAmount,
  ).length
})

// 最终总价
const finalTotal = computed(() => {
  let total = goodsTotal.value + shippingFee.value
  if (selectedCoupon.value) {
    total -= selectedCoupon.value.amount
  }
  return Math.max(total, 0).toFixed(1)
})

// 选择收货地址
const selectAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list',
  })
}

// 显示优惠券选择器
const showCouponPicker = () => {
  if (couponPickerRef.value) {
    couponPickerRef.value.showPicker()
  }
}

// 优惠券选择变化
const onCouponChange = (coupon) => {
  console.log('选择的优惠券:', coupon)
}

// 提交订单
const submitOrder = () => {
  if (!selectedAddress.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none',
    })
    return
  }

  uni.showLoading({
    title: '提交中...',
  })

  // 模拟提交订单
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '订单提交成功',
      icon: 'success',
    })

    // 跳转到支付页面或订单详情
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/order/detail?id=123',
      })
    }, 1500)
  }, 2000)
}

// 页面加载
onLoad((options) => {
  // 可以从参数中获取商品信息
  console.log('订单确认页面参数:', options)
})
</script>

<style lang="scss" scoped>
// 收货地址部分
.address-section {
  margin-bottom: 24rpx;
}

.address-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.address-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.address-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $mall-text-primary;
  margin-right: 16rpx;
}

.address-phone {
  font-size: 28rpx;
  color: $mall-text-secondary;
}

.address-detail {
  font-size: 26rpx;
  color: $mall-text-secondary;
  line-height: 1.4;
}

.address-placeholder {
  font-size: 30rpx;
  color: $mall-text-primary;
  font-weight: 600;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

// 商品信息部分
.goods-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.goods-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.goods-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  padding-top: 8rpx;
}

.goods-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $mall-text-primary;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: block;
}

.goods-desc {
  font-size: 26rpx;
  color: $mall-text-secondary;
  line-height: 1.4;
  margin-bottom: 24rpx;
  display: block;
}

.goods-price {
  font-size: 32rpx;
  font-weight: 600;
  color: $mall-text-primary;
  display: block;
}

.goods-quantity {
  font-size: 28rpx;
  color: $mall-text-secondary;
  margin-top: 8rpx;
  margin-left: 24rpx;
  flex-shrink: 0;
}

// 费用明细
.cost-detail {
  border-top: 2rpx solid #f7f7f7;
  padding-top: 32rpx;
  margin-top: 32rpx;
}

.cost-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.cost-label {
  font-size: 28rpx;
  color: $mall-text-secondary;
}

.cost-value {
  font-size: 28rpx;
  color: $mall-text-primary;
}

.coupon-item {
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
}

.coupon-info {
  display: flex;
  align-items: center;
}

.coupon-text {
  font-size: 28rpx;
  color: $mall-text-secondary;
  margin-right: 8rpx;
}

.cost-total {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 24rpx;
  border-top: 2rpx solid #f7f7f7;
  margin-top: 24rpx;
}

.total-label {
  font-size: 26rpx;
  color: $mall-text-secondary;
}

.total-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #f54949;
  margin-left: 8rpx;
}

// 支付方式部分
.payment-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-label {
  font-size: 28rpx;
  color: $mall-text-secondary;
}

.payment-info {
  display: flex;
  align-items: center;
}

.payment-method {
  font-size: 28rpx;
  font-weight: 600;
  color: $mall-text-primary;
  margin-right: 8rpx;
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 26rpx;
  color: $mall-text-primary;
  font-weight: 600;
}

.price-value {
  font-size: 48rpx;
  font-weight: 700;
  color: $mall-text-primary;
}

.pay-button {
  background: $mall-color-primary;
  border-radius: 25rpx;
  padding: 24rpx 0;
  width: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: darken($mall-color-primary, 10%);
  }
}

.pay-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
