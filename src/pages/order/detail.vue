<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '订单详情',
  },
}
</route>

<template>
  <view class="page-container">
    <!-- 添加导航栏 -->
    <fg-navbar>订单详情</fg-navbar>

    <view class="page-content">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 订单详情内容 -->
      <view v-else class="order-detail">
        <!-- 收货地址信息 -->
        <view class="section-panel address-section">
          <view class="address-icon">
            <image class="image" src="/static/icons/location.png" />
          </view>
          <view>
            <text class="receiver-address">{{ orderDetail.address.fullAddress }}</text>
            <view class="receiver-info">
              <text class="receiver-name">{{ orderDetail.address.name }}</text>
              <text class="receiver-phone">{{ orderDetail.address.phone }}</text>
            </view>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="goods-section">
          <view v-for="(item, index) in orderDetail.items" :key="index" class="goods-item">
            <image class="goods-image" :src="item.image" mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-spec">{{ item.spec }}</text>
              <view class="goods-price-row">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-quantity">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
          <view class="price-item">
            <text class="price-label">运费</text>
            <text class="price-value">¥{{ orderDetail.shipping }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">商品小计</text>
            <text class="price-value">¥{{ orderDetail.goodsTotal }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">优惠券</text>
            <text class="price-value discount">-¥{{ orderDetail.couponDiscount }}</text>
          </view>
          <view class="price-item total-row">
            <text class="price-label total-label">合计：</text>
            <text class="price-value total-price">¥{{ orderDetail.totalAmount }}</text>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="order-info-section">
          <view class="info-item">
            <text class="info-label">订单编号</text>
            <view class="info-value-row">
              <text class="info-value">{{ orderDetail.orderNo }}</text>
              <text class="copy-btn" @click="copyOrderNo">复制</text>
            </view>
          </view>
          <view class="info-item">
            <text class="info-label">支付渠道</text>
            <text class="info-value">{{ orderDetail.paymentMethod }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">创建时间</text>
            <text class="info-value">{{ orderDetail.createTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">支付时间</text>
            <text class="info-value">{{ orderDetail.payTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-panel">
      <view v-if="orderDetail.showAfterSales" class="secondary-action" @click="handleAfterSales">
        <text class="secondary-text">撤回售后</text>
      </view>
      <view class="primary-action" @click="handleConfirm">
        <text class="primary-text">确定</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'

defineOptions({
  name: 'OrderDetail',
})

// 页面状态
const loading = ref(true)
const orderId = ref('')

// 订单详情数据
const orderDetail = ref({
  orderNo: '',
  paymentMethod: '',
  createTime: '',
  payTime: '',
  shipping: '0.0',
  goodsTotal: '0.00',
  couponDiscount: '0.0',
  totalAmount: '0.00',
  showAfterSales: false,
  address: {
    name: '',
    phone: '',
    fullAddress: '',
  },
  items: [] as any[],
})

// 加载订单详情
const loadOrderDetail = async () => {
  loading.value = true

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据 - 根据设计图的内容
    orderDetail.value = {
      orderNo: '2365325212',
      paymentMethod: '微信支付',
      createTime: '2022-12-14 25:35:28',
      payTime: '2022-12-14 25:35:28',
      shipping: '0.0',
      goodsTotal: '199.9',
      couponDiscount: '60.0',
      totalAmount: '139.0',
      showAfterSales: false,
      address: {
        name: '七层',
        phone: '1320253202',
        fullAddress: '广东广州天河区黄埔大道',
      },
      items: [
        {
          name: '敬修堂防脱滋养育发洗发露',
          spec: '控油防脱不伤 调理手膏泡沫',
          image:
            'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
          price: '199.9',
          quantity: 1,
        },
      ],
    }
  } catch (error) {
    console.error('加载订单详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// 复制订单号
const copyOrderNo = () => {
  uni.setClipboardData({
    data: orderDetail.value.orderNo,
    success: () => {
      uni.showToast({
        title: '订单号已复制',
        icon: 'success',
      })
    },
  })
}

// 处理售后操作
const handleAfterSales = () => {
  uni.showModal({
    title: '撤回售后',
    content: '确定要撤回售后申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '撤回成功',
          icon: 'success',
        })
      }
    },
  })
}

// 处理确定按钮
const handleConfirm = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  console.log('订单详情页面加载完成', options)
  if (options?.id) {
    orderId.value = options.id
  }
  loadOrderDetail()
})

onPullDownRefresh(async () => {
  console.log('下拉刷新')
  await loadOrderDetail()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
.page-content {
  padding: 20rpx 16rpx;
  padding-top: $page-top-padding;
  width: 718rpx;
  background-color: $page-bg-color;
  padding-bottom: 160rpx;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
}

// 收货地址区域
.address-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-icon {
  display: flex;
  align-items: center;

  .image {
    width: 60rpx;
    height: 60rpx;
    margin-right: 12rpx;
  }
}

.receiver-info {
  padding-top: 10rpx;
  width: 580rpx;
  display: flex;
  align-items: center;
}

.receiver-address {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: $mall-text-title-weight;
}

.receiver-name {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
}

.receiver-phone {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
  margin-left: 10rpx;
}

// 商品信息区域
.goods-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: $mall-shadow-sm;
}

.goods-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 50rpx;
}

.goods-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: $mall-radius-sm;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goods-name {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: $mall-text-title-weight;
  margin-bottom: 8rpx;
}

.goods-spec {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
  line-height: 1.3;
  margin-bottom: 16rpx;
}

.goods-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  font-size: $mall-font-md;
  color: $mall-color-primary;
  font-weight: 600;
}

.goods-quantity {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
}

// 价格明细区域
.price-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: $mall-shadow-sm;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.total-row {
    border-top: 2rpx solid #f5f5f5;
    padding-top: 20rpx;
    margin-top: 20rpx;
  }
}

.price-label {
  font-size: $mall-font-base;
  color: $mall-text-secondary;

  &.total-label {
    font-size: $mall-font-md;
    color: $mall-text-primary;
    font-weight: 600;
  }
}

.price-value {
  font-size: $mall-font-base;
  color: $mall-text-primary;

  &.discount {
    color: $mall-color-primary;
  }

  &.total-price {
    font-size: $mall-font-lg;
    color: $mall-color-primary;
    font-weight: 700;
  }
}

// 订单信息区域
.order-info-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  box-shadow: $mall-shadow-sm;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
  width: 160rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: $mall-text-primary-weight;
  flex: 1;
  text-align: left;
  padding-left: 60rpx;
}

.info-value-row {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.copy-btn {
  font-size: $mall-font-sm;
  color: $mall-color-primary;
  margin-left: 16rpx;
  padding: 8rpx 16rpx;
  border: 2rpx solid $mall-color-primary;
  border-radius: 8rpx;

  &:active {
    opacity: 0.7;
  }
}

.secondary-action {
  height: 76rpx;
  border: 2rpx solid $mall-border-medium;
  border-radius: 16rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.7;
  }
}

.secondary-text {
  font-size: $mall-font-base;
  color: $mall-text-primary;
}

.primary-action {
  flex: 1;
  height: 76rpx;
  background-color: $mall-color-primary;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background-color: $mall-color-primary-dark;
  }
}

.primary-text {
  font-size: $mall-font-md;
  color: $mall-text-white;
  font-weight: 600;
}
</style>
