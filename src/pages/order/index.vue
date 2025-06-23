<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '我的订单',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="page-context">
      <!-- 订单状态筛选区域 -->
      <view class="filter-section">
        <view
          v-for="(filter, index) in orderFilters"
          :key="index"
          class="filter-item"
          :class="{ active: activeFilter === filter.type }"
          @click="switchFilter(filter.type)"
        >
          <text class="filter-text">{{ filter.name }}</text>
        </view>
      </view>

      <!-- 订单列表区域 -->
      <scroll-view class="order-list" scroll-y enhanced :show-scrollbar="false">
        <view v-for="(order, index) in filteredOrders" :key="index" class="order-card">
          <!-- 订单商品信息 -->
          <view class="order-content">
            <image class="product-image" :src="order.productImage" />
            <view class="product-info">
              <view class="product-details">
                <text class="product-name">{{ order.productName }}</text>
                <text class="product-desc">{{ order.productDesc }}</text>
                <view class="price-quantity">
                  <text class="product-price">{{ order.price }}</text>
                  <text class="product-quantity">×{{ order.quantity }}</text>
                </view>
              </view>
            </view>
            <view class="order-meta">
              <text class="order-status">{{ order.statusText }}</text>
            </view>
          </view>

          <!-- 订单操作按钮 -->
          <view class="order-actions">
            <view
              v-for="(action, actionIndex) in order.actions"
              :key="actionIndex"
              class="action-button"
              :class="action.type"
              @click="handleAction(action.type, order)"
            >
              <text class="action-text">{{ action.text }}</text>
            </view>
          </view>
        </view>

        <!-- 当没有数据时显示空状态 -->
        <view v-if="filteredOrders.length === 0" class="empty-state">
          <text class="empty-text">暂无订单数据</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'

defineOptions({
  name: 'OrderPage',
})

// 订单筛选状态
const activeFilter = ref('all')

// 订单筛选选项
const orderFilters = ref([
  { name: '全部', type: 'all' },
  { name: '待付款', type: 'pending' },
  { name: '待发货', type: 'paid' },
  { name: '待收货', type: 'shipped' },
  { name: '已完成', type: 'completed' },
])

// 模拟订单数据
const orders = ref([
  {
    id: '001',
    productName: '敬修堂防脱滋养育发洗发露',
    productDesc: '控油防脱两不误 细腻丰富泡沫',
    price: '199.9',
    quantity: 1,
    status: 'pending',
    statusText: '待付款',
    productImage:
      'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
    actions: [
      { type: 'cancel', text: '取消订单' },
      { type: 'pay', text: '继续付款' },
    ],
  },
  {
    id: '002',
    productName: '敬修堂防脱滋养育发洗发露',
    productDesc: '控油防脱两不误 细腻丰富泡沫',
    price: '199.9',
    quantity: 1,
    status: 'paid',
    statusText: '待发货',
    productImage:
      'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
    actions: [{ type: 'contact', text: '联系客服' }],
  },
  {
    id: '003',
    productName: '敬修堂防脱滋养育发洗发露',
    productDesc: '控油防脱两不误 细腻丰富泡沫',
    price: '199.9',
    quantity: 1,
    status: 'shipped',
    statusText: '待收货',
    productImage:
      'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
    actions: [{ type: 'confirm', text: '确认收货' }],
  },
  {
    id: '004',
    productName: '敬修堂防脱滋养育发洗发露',
    productDesc: '控油防脱两不误 细腻丰富泡沫',
    price: '199.9',
    quantity: 1,
    status: 'completed',
    statusText: '已完成',
    productImage:
      'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=08c09a0031671ca614ae7437782aac77.png',
    actions: [
      { type: 'review', text: '评价' },
      { type: 'rebuy', text: '再次购买' },
    ],
  },
])

// 筛选后的订单列表
const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.status === activeFilter.value)
})

// 切换筛选条件
const switchFilter = (filterType: string) => {
  activeFilter.value = filterType
}

// 处理订单操作
const handleAction = (actionType: string, order: any) => {
  console.log('订单操作:', actionType, order)

  switch (actionType) {
    case 'cancel':
      uni.showModal({
        title: '取消订单',
        content: '确认取消此订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '订单已取消',
              icon: 'success',
            })
          }
        },
      })
      break
    case 'pay':
      uni.showToast({
        title: '跳转支付页面',
        icon: 'none',
      })
      break
    case 'contact':
      uni.showToast({
        title: '联系客服',
        icon: 'none',
      })
      break
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
    case 'review':
      uni.showToast({
        title: '跳转评价页面',
        icon: 'none',
      })
      break
    case 'rebuy':
      uni.showToast({
        title: '添加到购物车',
        icon: 'success',
      })
      break
  }
}

// 生命周期
onLoad((options) => {
  console.log('订单页面加载完成', options)

  // 如果有传递状态参数，设置初始筛选条件
  if (options?.status) {
    // 将个人中心的状态映射到订单页面的状态
    const statusMap: Record<string, string> = {
      pending: 'pending', // 待支付
      paid: 'paid', // 待发货
      shipped: 'shipped', // 待收货
      refund: 'completed', // 退款/售后 -> 已完成
    }

    const mappedStatus = statusMap[options.status] || 'all'
    activeFilter.value = mappedStatus
  }
})

onPullDownRefresh(() => {
  console.log('下拉刷新订单列表')
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
page {
  //   background-color: white;
}
.page-context {
  // 全局样式已设置基础属性，这里添加页面特有样式
  background-color: white;
  display: flex;
  flex-direction: column;
  height: calc(100vh - $page-top-padding); // 减去顶部padding
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 16rpx;
  background-color: $mall-bg-card;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0; // 固定高度，不会被压缩
}

.filter-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8rpx;

  &.active .filter-text {
    color: $mall-color-primary;
    font-weight: 700;
  }
}

.filter-text {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
  line-height: 26.2rpx;

  .filter-item.active & {
    color: $mall-color-primary;
    font-weight: 700;
  }
}

.order-list {
  width: 686rpx;
  padding: 24rpx 32rpx; // 按原设计：左右各32rpx
  background-color: $page-bg-color;
}

.order-card {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-lg;
  padding: 24rpx 24rpx 32rpx; // 按原设计：左右各24rpx，下32rpx
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.order-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: $mall-radius-sm;
}

.product-info {
  margin-left: 18rpx;
  margin-top: 10rpx;
}

.product-details {
}

.product-name {
  font-size: $mall-font-base;
  font-weight: 700;
  color: $mall-text-primary;
  line-height: 26.46rpx;
  display: block;
  margin-bottom: 16rpx;
}

.product-desc {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
  line-height: 28rpx;
  display: block;
  margin-top: 16rpx;
  margin-bottom: 24rpx; // 减少底边距
  // 不设置固定宽度，让文字自然换行
}

.price-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 30rpx;
  font-family: HarmonyOSSansSC;
  font-weight: bold;
  color: $mall-text-primary;
  line-height: 22.72rpx;

  &::before {
    content: '￥';
    font-size: $mall-font-base;
    margin-right: 4rpx;
  }
}

.product-quantity {
  font-size: 26rpx;
  font-family: HarmonyOSSansSC;
  color: $mall-text-secondary;
  line-height: 19.06rpx;
}

.order-meta {
  width: 100rpx; // 调整宽度，只需要显示状态
  flex-shrink: 0; // 不允许缩小
  text-align: right;
}

.order-status {
  font-size: $mall-font-sm;
  color: $mall-text-placeholder;
  line-height: 22.48rpx;
}

.order-actions {
  text-align: right; // 右对齐，类似justify-content: flex-end
}

.action-button {
  border-radius: 10rpx; // 按原设计
  width: 168rpx; // 按原设计固定宽度
  height: 48rpx; // 按原设计固定高度
  display: inline-block; // 改为行内块，类似原设计
  text-align: center; // 文字居中
  border: 2rpx solid $mall-border-light;
  margin-left: 10rpx; // 按原设计 ml-5 = 10rpx
  padding-top: 6rpx;

  &:first-child {
    margin-left: 0; // 第一个按钮不需要左边距
  }

  &.pay,
  &.confirm,
  &.rebuy {
    background-color: $mall-color-primary;
    border-color: $mall-color-primary;

    .action-text {
      color: $mall-text-white;
      font-weight: 500;
    }
  }

  &.cancel,
  &.contact,
  &.review {
    background-color: transparent;
    border-color: $mall-border-medium;

    .action-text {
      color: $mall-text-primary;
    }
  }
}

.action-text {
  font-size: $mall-font-sm;
}

// 空状态样式
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 32rpx;
}

.empty-text {
  font-size: $mall-font-base;
  color: $mall-text-placeholder;
  text-align: center;
}

// 工具类
.ml-5 {
  margin-left: 10rpx;
}
</style>
