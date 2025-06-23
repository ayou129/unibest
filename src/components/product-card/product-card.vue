<template>
  <view class="product-card" @click="onCardClick">
    <!-- 商品图片区域 -->
    <view class="product-image-wrapper">
      <image class="product-image" :src="product.image" mode="aspectFill" :lazy-load="true" />
      <!-- 促销标签 -->
      <view v-if="product.tag" class="product-tag">
        <text class="tag-text">{{ product.tag }}</text>
      </view>
      <!-- 收藏图标 -->
      <view v-if="showFavorite" class="favorite-icon" @click.stop="onFavoriteClick">
        <uni-icons
          :type="product.isFavorite ? 'heart-filled' : 'heart'"
          :color="product.isFavorite ? '#ff6b35' : '#ccc'"
          size="18"
        />
      </view>
    </view>

    <!-- 商品信息区域 -->
    <view class="product-info">
      <!-- 商品标题 -->
      <view class="product-title">
        <text class="title-text">{{ product.title }}</text>
      </view>

      <!-- 商品描述 -->
      <view v-if="product.description" class="product-description">
        <text class="description-text">{{ product.description }}</text>
      </view>

      <!-- 价格和购买区域 -->
      <view class="price-action-wrapper">
        <view class="price-info">
          <text class="current-price">¥{{ product.price }}</text>
          <text v-if="product.originalPrice" class="original-price">
            ¥{{ product.originalPrice }}
          </text>
        </view>

        <view v-if="showAddCart" class="add-cart-btn" @click.stop="onAddCartClick">
          <uni-icons type="plus" size="16" color="#fff" />
        </view>
      </view>

      <!-- 销量和评价 -->
      <view v-if="showStats" class="product-stats">
        <text v-if="product.sales" class="stats-text">已售{{ product.sales }}</text>
        <text v-if="product.rating" class="stats-text">评价{{ product.rating }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Product {
  id: string | number
  image: string
  title: string
  description?: string
  price: string | number
  originalPrice?: string | number
  tag?: string
  isFavorite?: boolean
  sales?: string | number
  rating?: string | number
}

interface Props {
  product: Product
  showFavorite?: boolean
  showAddCart?: boolean
  showStats?: boolean
}

interface Emits {
  (e: 'click', product: Product): void
  (e: 'favorite', product: Product): void
  (e: 'addCart', product: Product): void
}

const props = withDefaults(defineProps<Props>(), {
  showFavorite: false,
  showAddCart: true,
  showStats: true,
})

const emit = defineEmits<Emits>()

const onCardClick = () => {
  emit('click', props.product)
}

const onFavoriteClick = () => {
  emit('favorite', props.product)
}

const onAddCartClick = () => {
  emit('addCart', props.product)
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: $mall-bg-card;
  border-radius: $mall-radius-base;
  box-shadow: $mall-shadow-sm;
  overflow: hidden;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: $mall-shadow-base;
  }
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: $mall-card-height;
}

.product-image {
  width: 100%;
  height: 100%;
  background-color: $mall-bg-section;
}

.product-tag {
  position: absolute;
  top: $mall-spacing-xs;
  left: $mall-spacing-xs;
  background-color: $mall-color-primary;
  border-radius: $mall-radius-xs;
  padding: 4rpx $mall-spacing-xs;
}

.tag-text {
  font-size: $mall-font-xs;
  color: $mall-text-white;
  font-weight: 500;
}

.favorite-icon {
  position: absolute;
  top: $mall-spacing-xs;
  right: $mall-spacing-xs;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: $mall-radius-round;
  padding: 8rpx;
  backdrop-filter: blur(4px);
}

.product-info {
  padding: $mall-spacing-base;
}

.product-title {
  margin-bottom: $mall-spacing-xs;
}

.title-text {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-description {
  margin-bottom: $mall-spacing-sm;
}

.description-text {
  font-size: $mall-font-sm;
  color: $mall-text-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-action-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $mall-spacing-xs;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: $mall-spacing-xs;
}

.current-price {
  font-size: $mall-font-lg;
  color: $mall-text-price;
  font-weight: 600;
}

.original-price {
  font-size: $mall-font-sm;
  color: $mall-text-placeholder;
  text-decoration: line-through;
}

.add-cart-btn {
  width: 48rpx;
  height: 48rpx;
  background-color: $mall-color-primary;
  border-radius: $mall-radius-round;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background-color: $mall-color-primary-dark;
  }
}

.product-stats {
  display: flex;
  gap: $mall-spacing-base;
}

.stats-text {
  font-size: $mall-font-xs;
  color: $mall-text-placeholder;
}
</style>
