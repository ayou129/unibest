<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    // onReachBottomDistance: 10,
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="page-container">
    <!-- Banner区域 -->
    <view class="banner-section" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="banner-content">
        <view class="banner-bg">
          <view class="banner-left">
            <view class="banner-text">
              <text class="banner-title">Hi，欢迎来到陪玩平台</text>
              <text class="banner-subtitle">专业陪玩，让游戏更精彩</text>
            </view>
          </view>
          <view class="banner-right">
            <view class="ip-container">
              <image src="/static/images/ip.png" class="ip-image" mode="aspectFit" />
              <view class="ip-glow"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据展示区域 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-number">{{ orderCount }}</text>
          <text class="stat-label">接单数量</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-number">{{ ranking }}</text>
          <text class="stat-label">排名</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-number">¥{{ todayIncome }}</text>
          <text class="stat-label">今日收入</text>
        </view>
      </view>
    </view>

    <!-- 功能按钮区域 -->
    <view class="function-section">
      <view class="function-buttons">
        <view class="function-btn" @click="handlePlatformTask">
          <view class="btn-icon">
            <text class="icon-task">📋</text>
          </view>
          <text class="btn-text">平台任务</text>
        </view>
        <view class="function-btn" @click="handleInviteReward">
          <view class="btn-icon">
            <text class="icon-invite">🎁</text>
          </view>
          <text class="btn-text">邀请有奖</text>
        </view>
      </view>
    </view>

    <!-- Tips区域 -->
    <view class="tips-section">
      <view class="tips-card">
        <text class="tips-text">💪 开始抢单啦，加油gogogo！</text>
      </view>
    </view>

    <!-- 游戏分类区域 -->
    <view class="game-section">
      <view class="section-header">
        <text class="section-title">游戏分类</text>
        <view class="header-actions">
          <text class="action-text" @click="toggleGameExpand">
            {{ isGameExpanded ? '收起' : '展开全部' }}
          </text>
        </view>
      </view>

      <view class="game-grid">
        <view
          v-for="(game, index) in displayGames"
          :key="game.id"
          class="game-item"
          :class="{ favorite: game.isFavorite }"
          @click="handleGameSelect(game)"
        >
          <view class="game-icon">
            <text class="game-emoji">{{ game.icon }}</text>
          </view>
          <text class="game-name">{{ game.name }}</text>
          <view v-if="game.isFavorite" class="favorite-badge">
            <text class="favorite-star">⭐</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
let safeAreaInsets
// #ifdef MP-WEIXIN
// 微信小程序使用新的API
const wxSystemInfo = (wx as any).getWindowInfo()
safeAreaInsets = wxSystemInfo.safeArea
  ? {
      top: wxSystemInfo.safeArea.top,
      right: wxSystemInfo.windowWidth - wxSystemInfo.safeArea.right,
      bottom: wxSystemInfo.windowHeight - wxSystemInfo.safeArea.bottom,
      left: wxSystemInfo.safeArea.left,
    }
  : null
// #endif

// #ifndef MP-WEIXIN
// 其他平台继续使用uni API
const systemInfo = uni.getSystemInfoSync()
safeAreaInsets = systemInfo.safeAreaInsets
// #endif

// 数据状态
const orderCount = ref(128)
const ranking = ref(15)
const todayIncome = ref(256)
const isGameExpanded = ref(false)

// 游戏数据
const allGames = ref([
  { id: 1, name: '和平精英', icon: '🔫', isFavorite: true },
  { id: 2, name: 'PUBG', icon: '🎯', isFavorite: true },
  { id: 3, name: '三角洲', icon: '⚔️', isFavorite: false },
  { id: 4, name: '暗区突围', icon: '🏃', isFavorite: true },
  { id: 5, name: '王者荣耀', icon: '👑', isFavorite: false },
  { id: 6, name: '英雄联盟', icon: '🗡️', isFavorite: false },
  { id: 7, name: 'CS2', icon: '💥', isFavorite: false },
  { id: 8, name: 'APEX', icon: '🎪', isFavorite: false },
])

// 显示的游戏列表
const displayGames = computed(() => {
  if (isGameExpanded.value) {
    return allGames.value
  } else {
    // 显示收藏的游戏 + 部分其他游戏（最多8个）
    const favorites = allGames.value.filter((game) => game.isFavorite)
    const others = allGames.value.filter((game) => !game.isFavorite)
    const maxOthers = Math.max(0, 8 - favorites.length)
    return [...favorites, ...others.slice(0, maxOthers)]
  }
})

// 方法
const toggleGameExpand = () => {
  isGameExpanded.value = !isGameExpanded.value
}

const handlePlatformTask = () => {
  uni.showToast({
    title: '跳转平台任务',
    icon: 'none',
  })
}

const handleInviteReward = () => {
  uni.showToast({
    title: '跳转邀请有奖',
    icon: 'none',
  })
}

const handleGameSelect = (game: any) => {
  uni.showToast({
    title: `选择了${game.name}`,
    icon: 'none',
  })
}

// 测试 uni API 自动引入
onLoad(() => {
  console.log('陪玩首页加载完成')
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  // 刷新逻辑
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

onReachBottom(() => {
  console.log('上拉加载')
})
</script>

<style lang="scss" scoped>
// Banner样式
.banner-section {
  padding: 0 20rpx 40rpx;
}

.banner-content {
  position: relative;
  overflow: hidden;
}

.banner-bg {
  background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 50%, #2c3e50 100%);
  border-radius: 24rpx;
  padding: 36rpx 24rpx 36rpx 32rpx;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 200rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 157, 0.25);
}

.banner-left {
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 24rpx;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.banner-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5rpx;
  margin-bottom: 15rpx;
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.88);
  font-size: 26rpx;
  font-weight: 400;
  line-height: 1.3;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.banner-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 15rpx;
}

.ip-container {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ip-image {
  width: 220rpx;
  height: 220rpx;
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.25));
}

.ip-glow {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.4;
    transform: scale(1);
  }
  to {
    opacity: 0.7;
    transform: scale(1.08);
  }
}

// 数据统计样式
.stats-section {
  padding: 0 20rpx 32rpx;
}

.stats-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 157, 0.08);
  border: 1rpx solid rgba(255, 107, 157, 0.1);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  color: #ff6b9d;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 10rpx;
}

.stat-label {
  color: #666666;
  font-size: 24rpx;
  font-weight: 400;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: linear-gradient(180deg, transparent 0%, #f0f0f0 50%, transparent 100%);
  margin: 0 24rpx;
}

// 功能按钮样式
.function-section {
  padding: 0 20rpx 32rpx;
}

.function-buttons {
  display: flex;
  gap: 20rpx;
}

.function-btn {
  flex: 1;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid rgba(255, 107, 157, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background: linear-gradient(135deg, #fff5f8 0%, #f0fdfc 100%);
  }
}

.btn-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 157, 0.3);
}

.icon-task,
.icon-invite {
  font-size: 40rpx;
}

.btn-text {
  color: #333333;
  font-size: 28rpx;
  font-weight: 500;
}

// Tips样式
.tips-section {
  padding: 0 20rpx 32rpx;
}

.tips-card {
  background: linear-gradient(90deg, #fff4e6 0%, #ffe7d6 100%);
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  border-left: 6rpx solid #ff6b9d;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 157, 0.1);
}

.tips-text {
  color: #d63384;
  font-size: 28rpx;
  font-weight: 500;
}

// 游戏分类样式
.game-section {
  padding: 0 20rpx 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  color: #333333;
  font-size: 32rpx;
  font-weight: 600;
}

.action-text {
  background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 26rpx;
  font-weight: 400;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.game-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid rgba(255, 107, 157, 0.05);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &.favorite {
    border: 2rpx solid #ff6b9d;
    background: linear-gradient(135deg, #fff5f8 0%, #f0fdfc 100%);
  }
}

.game-icon {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-emoji {
  font-size: 32rpx;
}

.game-name {
  color: #333333;
  font-size: 24rpx;
  font-weight: 400;
  text-align: center;
  line-height: 1.2;
}

.favorite-badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 32rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 157, 0.4);
}

.favorite-star {
  color: #ffffff;
  font-size: 18rpx;
}
</style>
