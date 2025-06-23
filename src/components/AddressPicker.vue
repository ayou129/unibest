<template>
  <!-- 地址选择弹窗 - 使用v-if条件渲染 -->
  <view v-if="showPopup" class="popup-mask" @click="cancelPicker">
    <view class="picker-popup" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="cancelPicker">取消</view>
        <view class="picker-title">选择地址</view>
        <view class="picker-confirm" @click="confirmPicker">确定</view>
      </view>

      <view class="picker-content">
        <picker-view :value="pickerValue" @change="onPickerChange" class="picker-view">
          <!-- 省份 -->
          <picker-view-column>
            <view v-if="provinces.length === 0" class="picker-item picker-empty">加载中...</view>
            <view
              v-else
              v-for="(province, index) in provinces"
              :key="province.i"
              class="picker-item"
            >
              {{ province.n }}
            </view>
          </picker-view-column>

          <!-- 城市 -->
          <picker-view-column>
            <view v-if="cities.length === 0" class="picker-item picker-empty">
              {{ provinces.length > 0 ? '请选择省份' : '加载中...' }}
            </view>
            <view v-else v-for="(city, index) in cities" :key="city.i" class="picker-item">
              {{ city.n }}
            </view>
          </picker-view-column>

          <!-- 区县 -->
          <picker-view-column>
            <view v-if="districts.length === 0" class="picker-item picker-empty">
              {{
                cities.length > 0 ? '请选择城市' : provinces.length > 0 ? '请选择省份' : '加载中...'
              }}
            </view>
            <view
              v-else
              v-for="(district, index) in districts"
              :key="district.i"
              class="picker-item"
            >
              {{ district.n }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import areaData from '@/data/area_format_array.json'

interface AreaItem {
  n: string // 地区名称
  i: number // 地区ID
  p: number // 父级ID
  y: string // 拼音首字母
}

interface AddressData {
  provinceId: number
  cityId: number
  districtId: number
  province: string
  city: string
  district: string
}

const props = defineProps<{
  placeholder?: string
  modelValue?: AddressData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AddressData]
  change: [value: AddressData]
}>()

// 弹窗显示状态
const showPopup = ref(false)

// 数据
const pickerValue = ref([0, 0, 0])
const provinces = ref<AreaItem[]>([])
const cities = ref<AreaItem[]>([])
const districts = ref<AreaItem[]>([])

// 原始扁平化数据
const rawAreaData = ref<AreaItem[]>([])

// 临时选择的值
const tempSelection = ref({
  provinceIndex: 0,
  cityIndex: 0,
  districtIndex: 0,
})

// 显示文本
const selectedText = computed(() => {
  if (!props.modelValue || !props.modelValue.province) {
    return ''
  }
  return `${props.modelValue.province} ${props.modelValue.city} ${props.modelValue.district}`
})

// 初始化地址数据
const initAddressData = () => {
  try {
    // 直接使用导入的地址数据
    rawAreaData.value = (areaData as AreaItem[]) || []

    // 筛选出省级数据 (p === 0 表示顶级)
    provinces.value = rawAreaData.value.filter((item) => item.p === 0)

    // 默认加载第一个省份的城市
    if (provinces.value.length > 0) {
      loadCities(0)
    }

    console.log('地址数据加载成功，省份数量:', provinces.value.length)
  } catch (error) {
    console.error('初始化地址数据失败:', error)
    // 如果加载失败，使用空数组
    provinces.value = []
    cities.value = []
    districts.value = []
  }
}

// 加载城市数据
const loadCities = (provinceIndex: number) => {
  const province = provinces.value[provinceIndex]
  if (!province) {
    cities.value = []
    districts.value = []
    return
  }

  // 筛选出该省份下的城市 (p === province.i)
  cities.value = rawAreaData.value.filter((item) => item.p === province.i)

  // 默认加载第一个城市的区县
  if (cities.value.length > 0) {
    loadDistricts(0)
  } else {
    districts.value = []
  }
}

// 加载区县数据
const loadDistricts = (cityIndex: number) => {
  const city = cities.value[cityIndex]
  if (!city) {
    districts.value = []
    return
  }

  // 筛选出该城市下的区县 (p === city.i)
  districts.value = rawAreaData.value.filter((item) => item.p === city.i)
}

// 显示选择器
const showPicker = () => {
  // 初始化临时选择值
  if (props.modelValue && provinces.value.length > 0) {
    const provinceIndex = provinces.value.findIndex((p) => p.i === props.modelValue!.provinceId)
    if (provinceIndex >= 0) {
      tempSelection.value.provinceIndex = provinceIndex
      loadCities(provinceIndex)

      const cityIndex = cities.value.findIndex((c) => c.i === props.modelValue!.cityId)
      if (cityIndex >= 0) {
        tempSelection.value.cityIndex = cityIndex
        loadDistricts(cityIndex)

        const districtIndex = districts.value.findIndex((d) => d.i === props.modelValue!.districtId)
        if (districtIndex >= 0) {
          tempSelection.value.districtIndex = districtIndex
        }
      }
    }
  }

  pickerValue.value = [
    tempSelection.value.provinceIndex,
    tempSelection.value.cityIndex,
    tempSelection.value.districtIndex,
  ]

  showPopup.value = true
}

// picker值变化
const onPickerChange = (e: any) => {
  const [provinceIndex, cityIndex, districtIndex] = e.detail.value

  // 省份变化
  if (provinceIndex !== tempSelection.value.provinceIndex) {
    tempSelection.value.provinceIndex = provinceIndex
    tempSelection.value.cityIndex = 0
    tempSelection.value.districtIndex = 0
    loadCities(provinceIndex)
    pickerValue.value = [provinceIndex, 0, 0]
    return
  }

  // 城市变化
  if (cityIndex !== tempSelection.value.cityIndex) {
    tempSelection.value.cityIndex = cityIndex
    tempSelection.value.districtIndex = 0
    loadDistricts(cityIndex)
    pickerValue.value = [provinceIndex, cityIndex, 0]
    return
  }

  // 区县变化
  tempSelection.value.districtIndex = districtIndex
  pickerValue.value = [provinceIndex, cityIndex, districtIndex]
}

// 取消选择
const cancelPicker = () => {
  showPopup.value = false
}

// 确认选择
const confirmPicker = () => {
  const province = provinces.value[tempSelection.value.provinceIndex]
  const city = cities.value[tempSelection.value.cityIndex]
  const district = districts.value[tempSelection.value.districtIndex]

  if (province && city && district) {
    const result: AddressData = {
      provinceId: province.i,
      cityId: city.i,
      districtId: district.i,
      province: province.n,
      city: city.n,
      district: district.n,
    }

    emit('update:modelValue', result)
    emit('change', result)
  }

  showPopup.value = false
}

// 组件挂载时初始化
onMounted(() => {
  initAddressData()
})

// 暴露方法给父组件
defineExpose({
  showPicker,
})
</script>

<style lang="scss" scoped>
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

.picker-popup {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
  width: 100%;
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
  padding: 32rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.picker-cancel {
  font-size: $mall-font-base;
  color: $mall-text-secondary;
  padding: 16rpx 0;
  min-width: 80rpx;
}

.picker-confirm {
  font-size: $mall-font-base;
  color: $mall-color-primary;
  font-weight: 600;
  padding: 16rpx 0;
  min-width: 80rpx;
}

.picker-title {
  font-size: $mall-font-lg;
  font-weight: 600;
  color: $mall-text-primary;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.picker-content {
  height: 600rpx;
  //   position: relative;
}

.picker-view {
  height: 100%;

  :deep(.uni-picker-view-wrapper) {
    overflow: hidden;
  }

  :deep(.uni-picker-view-group) {
    position: relative;

    // 添加列分隔线
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      bottom: 20%;
      width: 2rpx;
      background-color: #f0f0f0;
      z-index: 10;
    }
  }

  :deep(.uni-picker-view-column) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  font-size: 32rpx;
  color: $mall-text-primary;
  padding: 0 20rpx;
  position: relative;
  z-index: 1;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.picker-item-selected {
    color: $mall-color-primary;
    font-weight: 600;
  }

  &.picker-empty {
    color: $mall-text-placeholder;
    font-size: 28rpx;
  }
}

// 添加选中区域高亮
.picker-content::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 88rpx;
  background-color: rgba(8, 170, 78, 0.05);
  border-top: 2rpx solid rgba(8, 170, 78, 0.1);
  border-bottom: 2rpx solid rgba(8, 170, 78, 0.1);
  z-index: 1;
  pointer-events: none;
}

// 上下渐变蒙层，突出选中区域
.picker-view :deep(.uni-picker-view-group) {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
    pointer-events: none;
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
    pointer-events: none;
    z-index: 2;
  }
}
</style>
