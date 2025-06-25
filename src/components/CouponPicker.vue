<template>
  <!-- 优惠券选择弹窗 -->
  <view v-if="showPopup" class="popup-mask" @click="cancelPicker">
    <view class="coupon-picker-popup" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="cancelPicker">取消</view>
        <view class="picker-title">选择优惠券</view>
        <view class="picker-confirm" @click="confirmPicker">确定</view>
      </view>

      <view class="page-content">
        <scroll-view scroll-y class="coupon-list section-panel-margin">
          <!-- 可用优惠券 -->
          <view class="coupon-section">
            <view class="section-title">可用优惠券</view>
            <view
              v-for="coupon in availableCoupons"
              :key="coupon.id"
              class="coupon-item"
              :class="{ active: selectedCoupon && selectedCoupon.id === coupon.id }"
              @click="selectCoupon(coupon)"
            >
              <view class="coupon-main">
                <view class="coupon-left">
                  <view class="coupon-amount">
                    <text class="amount-symbol">￥</text>
                    <text class="amount-value">{{ coupon.amount }}</text>
                  </view>
                  <view class="coupon-condition">满{{ coupon.minAmount }}元可用</view>
                </view>
                <view class="coupon-right">
                  <view class="coupon-name">{{ coupon.name }}</view>
                  <view class="coupon-desc">{{ coupon.description }}</view>
                  <view class="coupon-time">有效期至 {{ formatDate(coupon.expireTime) }}</view>
                </view>
              </view>
              <view class="coupon-status">
                <view
                  class="radio-btn"
                  :class="{ checked: selectedCoupon && selectedCoupon.id === coupon.id }"
                >
                  <text v-if="selectedCoupon && selectedCoupon.id === coupon.id" class="radio-icon">
                    ✓
                  </text>
                </view>
              </view>
            </view>
          </view>

          <!-- 不可用优惠券 -->
          <view v-if="unavailableCoupons.length > 0" class="coupon-section">
            <view class="section-title">不可用优惠券</view>
            <view
              v-for="coupon in unavailableCoupons"
              :key="coupon.id"
              class="coupon-item disabled"
            >
              <view class="coupon-main">
                <view class="coupon-left">
                  <view class="coupon-amount">
                    <text class="amount-symbol">￥</text>
                    <text class="amount-value">{{ coupon.amount }}</text>
                  </view>
                  <view class="coupon-condition">满{{ coupon.minAmount }}元可用</view>
                </view>
                <view class="coupon-right">
                  <view class="coupon-name">{{ coupon.name }}</view>
                  <view class="coupon-desc">{{ coupon.description }}</view>
                  <view class="coupon-time">有效期至 {{ formatDate(coupon.expireTime) }}</view>
                </view>
              </view>
              <view class="coupon-status">
                <view class="disabled-tag">不可用</view>
              </view>
            </view>
          </view>

          <!-- 无优惠券提示 -->
          <view v-if="coupons.length === 0" class="empty-state">
            <text class="empty-text">暂无可用优惠券</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  coupons: {
    type: Array,
    default: () => [],
  },
  orderAmount: {
    type: Number,
    default: 0,
  },
  modelValue: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

// 弹窗显示状态
const showPopup = ref(false)

// 临时选择的优惠券
const selectedCoupon = ref(null)

// 可用优惠券
const availableCoupons = computed(() => {
  return props.coupons.filter(
    (coupon) => coupon.status === 2 && props.orderAmount >= coupon.minAmount,
  )
})

// 不可用优惠券
const unavailableCoupons = computed(() => {
  return props.coupons.filter(
    (coupon) => coupon.status !== 2 || props.orderAmount < coupon.minAmount,
  )
})

// 显示选择器
const showPicker = () => {
  selectedCoupon.value = props.modelValue
  showPopup.value = true
}

// 选择优惠券
const selectCoupon = (coupon) => {
  if (selectedCoupon.value && selectedCoupon.value.id === coupon.id) {
    selectedCoupon.value = null // 取消选择
  } else {
    selectedCoupon.value = coupon
  }
}

// 取消选择
const cancelPicker = () => {
  showPopup.value = false
}

// 确认选择
const confirmPicker = () => {
  emit('update:modelValue', selectedCoupon.value)
  emit('change', selectedCoupon.value)
  showPopup.value = false
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

// 暴露方法给父组件
defineExpose({
  showPicker,
})
</script>

<style lang="scss" scoped>
.page-content {
  padding-top: 1rpx;
  z-index: 1000;
}

// 弹窗蒙层
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.coupon-picker-popup {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 80vh;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  position: relative;
}

.picker-cancel {
  font-size: 30rpx;
  color: $mall-text-secondary;
  padding: 16rpx 0;
  min-width: 80rpx;
}

.picker-confirm {
  font-size: 30rpx;
  color: $mall-color-primary;
  font-weight: 600;
  padding: 16rpx 0;
  min-width: 80rpx;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $mall-text-primary;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.picker-content {
  height: 600rpx;
}

.coupon-list {
  height: 100%;
  width: auto;
}

.coupon-section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $mall-text-primary;
  padding: 24rpx 0 16rpx;
}

.coupon-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;
  border: 2rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  position: relative;

  &.active {
    border-color: $mall-color-primary;
    background: rgba(8, 170, 78, 0.05);
  }

  &.disabled {
    opacity: 0.5;
    background: #f8f8f8;
  }
}

.coupon-main {
  display: flex;
  flex: 1;
}

.coupon-left {
  width: 140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  color: $mall-color-primary;
  margin-bottom: 8rpx;
}

.amount-symbol {
  font-size: 24rpx;
  font-weight: 600;
}

.amount-value {
  font-size: 36rpx;
  font-weight: 700;
}

.coupon-condition {
  font-size: 22rpx;
  color: $mall-text-secondary;
  text-align: center;
}

.coupon-right {
  flex: 1;
}

.coupon-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $mall-text-primary;
  margin-bottom: 8rpx;
}

.coupon-desc {
  font-size: 26rpx;
  color: $mall-text-secondary;
  margin-bottom: 8rpx;
}

.coupon-time {
  font-size: 24rpx;
  color: $mall-text-placeholder;
}

.coupon-status {
  margin-left: 16rpx;
}

.radio-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    border-color: $mall-color-primary;
    background: $mall-color-primary;
  }
}

.radio-icon {
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
}

.disabled-tag {
  font-size: 22rpx;
  color: $mall-text-placeholder;
  padding: 8rpx 12rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $mall-text-placeholder;
}
</style>
