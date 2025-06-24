<template>
  <view class="bottom-section">
    <text class="bottom-text">已经到底啦~</text>
  </view>
</template>

<style lang="scss" scoped>
.bottom-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
  // background-color: $page-bg-color;
}

.bottom-text {
  font-size: 28rpx;
  color: #999999;
  opacity: 0.8;
  position: relative;
  font-weight: 400;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60rpx;
    height: 1rpx;
    // background-color: $page-bg-color;
  }

  &::before {
    left: -80rpx;
  }

  &::after {
    right: -80rpx;
  }
}
</style>
