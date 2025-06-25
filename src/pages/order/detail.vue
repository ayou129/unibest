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
        <!-- 订单状态区域 -->
        <view class="status-section">
          <text class="status-text">{{ orderDetail.statusText }}</text>
        </view>

        <!-- 商品信息 -->
        <view class="goods-section">
          <view v-for="(item, index) in orderDetail.items" :key="index" class="goods-item">
            <image class="goods-image" :src="item.image" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <view class="goods-price-quantity">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-quantity">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="order-info-section">
          <view class="info-item">
            <text class="info-label">订单编号</text>
            <text class="info-value">{{ orderDetail.orderNo }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">下单时间</text>
            <text class="info-value">{{ orderDetail.createTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">实付金额</text>
            <text class="info-value total-amount">¥{{ orderDetail.totalAmount }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="orderDetail.actions.length > 0" class="bottom-actions">
      <view
        v-for="(action, index) in orderDetail.actions"
        :key="index"
        class="action-button"
        @click="handleAction(action.type)"
      >
        <text class="action-text">{{ action.text }}</text>
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
  statusText: '待收货',
  createTime: '',
  totalAmount: '0.00',
  items: [] as any[],
  actions: [] as any[],
})

// 加载订单详情
const loadOrderDetail = async () => {
  loading.value = true

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据
    orderDetail.value = {
      orderNo: `SO${Date.now()}`,
      statusText: '待收货',
      createTime: '2024-01-15 14:30:25',
      totalAmount: '189.90',
      items: [
        {
          name: '敬修堂防脱滋养育发洗发露',
          image:
            'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
          price: '199.90',
          quantity: 1,
        },
      ],
      actions: [
        { type: 'contact', text: '联系客服' },
        { type: 'confirm', text: '确认收货' },
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

// 处理操作按钮点击
const handleAction = (actionType: string) => {
  console.log('订单操作:', actionType)

  switch (actionType) {
    case 'confirm':
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '确认收货成功',
              icon: 'success',
            })
          }
        },
      })
      break
    case 'contact':
      uni.showToast({
        title: '联系客服',
        icon: 'none',
      })
      break
    default:
      break
  }
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

.status-section {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-base;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
  text-align: center;
}

.status-text {
  font-size: $mall-font-lg;
  font-weight: 600;
  color: $mall-text-primary;
}

.goods-section {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-base;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.goods-item {
  display: flex;
}

.goods-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: $mall-radius-sm;
  margin-right: 24rpx;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  line-height: 1.4;
}

.goods-price-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  font-size: $mall-font-lg;
  font-weight: 600;
  color: $mall-color-primary;
}

.goods-quantity {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
}

.order-info-section {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-base;
  padding: 32rpx 24rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
    border-top: 2rpx solid $uni-border-color;
    padding-top: 20rpx;
  }
}

.info-label {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
}

.info-value {
  font-size: $mall-font-base;
  color: $mall-text-primary;

  &.total-amount {
    font-size: $mall-font-lg;
    font-weight: 600;
    color: $mall-color-primary;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12rpx 32rpx 30rpx;
  background-color: $mall-bg-card;
  display: flex;
  gap: 16rpx;
}

.action-button {
  flex: 1;
  height: 88rpx;
  background-color: $mall-color-primary;
  border-radius: $mall-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: $mall-font-base;
  color: $mall-text-white;
}
</style>
