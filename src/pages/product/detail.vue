<route lang="json5" type="page">
{
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '产品详情',
  },
}
</route>

<template>
  <view>
    <fg-navbar>产品详情</fg-navbar>
    <view class="page-container">
      <view class="product-detail-page">
        <!-- 产品图片区域 -->
        <view class="product-gallery-section">
          <!-- 产品主图 -->
          <image
            class="main-product-image"
            :src="currentImage"
            mode="aspectFit"
            @click="previewImage"
          />

          <!-- 图片指示器 -->
          <view class="image-indicators">
            <view
              v-for="(image, index) in productImages"
              :key="index"
              class="indicator"
              :class="{ active: currentImageIndex === index }"
              @click="switchImage(index)"
            ></view>
          </view>
        </view>

        <!-- 产品信息区域 -->
        <view class="product-info-section">
          <!-- 基本信息 -->
          <view class="basic-info">
            <view class="title-price">
              <view class="title-desc">
                <text class="product-title">{{ productInfo.title }}</text>
                <text class="product-description">{{ productInfo.description }}</text>
              </view>
              <text class="product-price">￥{{ productInfo.price }}</text>
            </view>

            <!-- 产品特性 -->
            <view class="features-section">
              <view
                v-for="(feature, index) in productInfo.features"
                :key="index"
                class="feature-item"
              >
                <image class="feature-icon" :src="feature.icon" />
                <text class="feature-text">{{ feature.name }}</text>
              </view>
            </view>
          </view>

          <!-- 商品详情标题 -->
          <text class="detail-title">商品详情</text>
        </view>

        <!-- 详情图片展示 -->
        <view class="detail-images">
          <image
            v-for="(image, index) in detailImages"
            :key="index"
            class="detail-image"
            :src="image"
            mode="widthFix"
          />
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="bottom-actions">
        <image
          class="service-icon"
          src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=cf187a2b852540069ad88487afaaebec.png"
        />

        <view class="mall-btn-lg mall-btn-primary buy-button" @click="handleBuyNow">
          <text class="mall-btn-text">立即购买</text>
        </view>

        <view class="quantity-control">
          <view class="quantity-btn" @click="decreaseQuantity">
            <image
              class="control-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=6238ad04e46428020e93e7e97c977596.png"
            />
          </view>
          <view class="quantity-display">
            <text class="quantity-text">{{ quantity }}</text>
          </view>
          <view class="quantity-btn" @click="increaseQuantity">
            <image
              class="control-icon"
              src="https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=92c87cf56f2ca8b77f111d924666e117.png"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'ProductDetail',
})

// 响应式数据
const currentImageIndex = ref(0)
const quantity = ref(1)

// 产品图片
const productImages = ref([
  'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=80c316ba7e70b2e7f3632fd9291706e7.png',
])

// 详情图片
const detailImages = ref([
  'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=080dffaeb3d63639eb04ca4b612a312f.png',
  'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=9a0dd0c81a55f9bdb28a613bd84b7817.png',
  'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=b70fbeb6480d7b5c5fad47c90340fa46.png',
])

// 产品信息
const productInfo = ref({
  title: '敬修堂防脱滋养育发洗发露',
  description: '控油防脱两不误 细腻丰富泡沫',
  price: '298',
  features: [
    {
      name: '滋养头皮',
      icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=5bddc4905a650dfc58850e819c385bb0.png',
    },
    {
      name: '防脱育发',
      icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=72e8f2e77ab28e6bd3c470f97077390c.png',
    },
    {
      name: '控油防脱',
      icon: 'https://ide.code.fun/api/image?token=685946ee797f8500110639d5&name=df209b36a9b91e9ccd61066eb3ccc981.png',
    },
  ],
})

// 计算属性
const currentImage = computed(() => {
  return productImages.value[currentImageIndex.value]
})

// 方法
const switchImage = (index: number) => {
  currentImageIndex.value = index
}

const previewImage = () => {
  uni.previewImage({
    urls: productImages.value,
    current: currentImageIndex.value,
  })
}

const handleBuyNow = () => {
  console.log('立即购买', { quantity: quantity.value })
  // 跳转到确认订单页面
  uni.navigateTo({
    url: `/pages/order/confirm?quantity=${quantity.value}&productId=1`,
  })
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  quantity.value++
}

// 生命周期钩子
const onLoad = (options: any) => {
  console.log('产品详情页加载完成', options)
  // 可以在这里根据路由参数获取产品详情
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  padding-top: 170rpx;
  background-color: white;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.product-gallery-section {
  padding: 64rpx 0;
  background-color: $mall-bg-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-product-image {
  width: 540rpx;
  height: 540rpx;
  filter: drop-shadow(10rpx 10rpx 10rpx rgba(0, 0, 0, 0.25));
}

.image-indicators {
  display: flex;
  gap: 20rpx;
  margin-top: 90rpx;
  padding: 0 56rpx;
}

.indicator {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 2rpx;
  width: 112rpx;
  height: 8rpx;

  &.active {
    background-color: #ffffff;
  }
}

.product-info-section {
  margin-top: -38rpx;
  padding: 52rpx 40rpx 30rpx 40rpx;
  background-color: #ffffff;
  border-radius: 60rpx 60rpx 0 0;
  position: relative;
}

.basic-info {
  margin-bottom: 54rpx;
}

.title-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 36rpx;
}

.title-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.product-title {
  color: #1a1a1a;
  font-size: 34rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 32.14rpx;
}

.product-description {
  color: #999999;
  font-size: 26rpx;
  font-family: PingFang;
  line-height: 32rpx;
  width: 330rpx;
  margin-top: 16rpx;
}

.product-price {
  color: #1d241e;
  font-size: 48rpx;
  font-family: HarmonyOSSansSC;
  line-height: 36.28rpx;
}

.features-section {
  padding: 22rpx 0 28rpx;
  background-color: #f4f4f4;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  flex: 1;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1rpx;
    top: 50%;
    transform: translateY(-50%);
    background-color: #e1ebe5;
    width: 2rpx;
    height: 52rpx;
  }
}

.feature-icon {
  width: 48rpx;
  height: 48rpx;
}

.feature-text {
  font-size: 26rpx;
  font-family: PingFang;
  line-height: 24.28rpx;
  color: #333333;
}

.detail-title {
  color: #1a1a1a;
  font-size: 28rpx;
  font-family: PingFang;
  font-weight: 700;
  line-height: 26.3rpx;
}

.detail-images {
  padding: 0 22rpx;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-image {
  width: 94.1333vw;

  &:first-child {
    height: 146.1333vw;
  }

  &:last-child {
    height: 58.1333vw;
  }

  &:not(:first-child):not(:last-child) {
    height: 146.1333vw;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12rpx 32rpx;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12rpx;
  z-index: 100;
}

.service-icon {
  border-radius: 16rpx;
  width: 76rpx;
  height: 76rpx;
}

.buy-button {
  flex: 1;
}

.quantity-control {
  background-color: #f4f4f4;
  border-radius: 16rpx;
  width: 156rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
}

.quantity-btn {
  width: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-icon {
  width: 20rpx;
  height: 20rpx;
}

.quantity-display {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-text {
  color: #1a1a1a;
  font-size: 32rpx;
  font-family: HarmonyOSSansSC;
  line-height: 24.2rpx;
}
</style>
