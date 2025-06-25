<route lang="json5">
{
  // needLogin: true,
  style: {
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
    navigationBarTitleText: '基础设置',
  },
}
</route>

<template>
  <view class="page-container">
    <fg-navbar>基础设置</fg-navbar>
    <view class="page-content">
      <view class="section-panel-margin">
        <!-- 头像设置 -->
        <view class="avatar-section">
          <view class="avatar-item">
            <text class="avatar-label">头像设置</text>
            <view class="avatar-container" @click="handleAvatarUpload">
              <image
                :src="formData.avatar || '/static/images/default-avatar.png'"
                class="avatar-image"
                mode="aspectFill"
              />
            </view>
          </view>
        </view>

        <!-- 个人信息表单 -->
        <view class="form-section">
          <view class="form-item">
            <text class="form-label">修改昵称</text>
            <input v-model="formData.name" class="form-input" placeholder="阿尤" :maxlength="20" />
          </view>
        </view>
      </view>
    </view>

    <!-- 保存按钮 - 只有当有变化时才显示 -->
    <view v-if="hasChanges" class="bottom-panel">
      <view
        class="mall-btn-lg mall-btn-primary mall-btn-block save-button"
        @click="handleSave"
        :class="{ disabled: loading }"
      >
        <text class="mall-btn-text">{{ loading ? '保存中...' : '保存' }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { toast } from '@/utils/toast'
import { updateUserProfile } from '@/api/login'
import useUpload from '@/hooks/useUpload'

// 用户信息
const userStore = useUserStore()
const { userProfile } = storeToRefs(userStore)

// 加载状态
const loading = ref(false)

// 表单数据
const formData = ref({
  name: userProfile.value.name || '',
  avatar: userProfile.value.avatar || '/static/images/avatar.jpg',
  sex: userProfile.value.sex || '',
  email: userProfile.value.email || '',
  phone: userProfile.value.phone || '',
  remark: userProfile.value.remark || '',
})

// 初始数据备份，用于检测变化
const initialData = ref({
  name: userProfile.value.name || '',
  avatar: userProfile.value.avatar || '',
  sex: userProfile.value.sex || '',
  email: userProfile.value.email || '',
  phone: userProfile.value.phone || '',
  remark: userProfile.value.remark || '',
})

// 检测是否有变化
const hasChanges = computed(() => {
  return (
    formData.value.name !== initialData.value.name ||
    formData.value.avatar !== initialData.value.avatar ||
    formData.value.sex !== initialData.value.sex ||
    formData.value.email !== initialData.value.email ||
    formData.value.phone !== initialData.value.phone ||
    formData.value.remark !== initialData.value.remark
  )
})

// 头像上传
const { loading: uploadLoading, run: uploadAvatar } = useUpload({
  fileType: 'image',
  maxSize: 5 * 1024 * 1024, // 5MB
  success: (url) => {
    formData.value.avatar = url
    toast.success('头像上传成功')
  },
  error: (error) => {
    console.error('头像上传失败:', error)
    toast.error('头像上传失败，请重试')
  },
})

// 处理头像上传
const handleAvatarUpload = () => {
  if (uploadLoading.value) return
  uploadAvatar()
}

// 保存修改
const handleSave = async () => {
  if (loading.value) return

  // 表单验证
  if (!formData.value.name.trim()) {
    toast.error('请输入昵称')
    return
  }

  if (formData.value.name.trim().length < 2) {
    toast.error('昵称至少需要2个字符')
    return
  }

  loading.value = true

  try {
    const res = await updateUserProfile({
      name: formData.value.name.trim(),
      avatar: formData.value.avatar,
      sex: formData.value.sex,
      email: formData.value.email,
      phone: formData.value.phone,
      remark: formData.value.remark,
    })

    // 更新本地用户信息
    await userStore.getUserProfile()

    // 更新初始数据
    initialData.value = {
      name: formData.value.name,
      avatar: formData.value.avatar,
      sex: formData.value.sex,
      email: formData.value.email,
      phone: formData.value.phone,
      remark: formData.value.remark,
    }

    toast.success(res.msg || '保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 监听用户信息变化，更新表单数据
watch(
  userProfile,
  (newProfile) => {
    if (newProfile) {
      formData.value = {
        name: newProfile.name || '',
        avatar: newProfile.avatar || '',
        sex: newProfile.sex || '',
        email: newProfile.email || '',
        phone: newProfile.phone || '',
        remark: newProfile.remark || '',
      }
      initialData.value = {
        name: newProfile.name || '',
        avatar: newProfile.avatar || '',
        sex: newProfile.sex || '',
        email: newProfile.email || '',
        phone: newProfile.phone || '',
        remark: newProfile.remark || '',
      }
    }
  },
  { deep: true },
)

// 页面加载
onLoad(() => {
  console.log('个人信息修改页面加载完成')
})

// 下拉刷新
onPullDownRefresh(async () => {
  try {
    await userStore.getUserProfile()
    toast.success('刷新成功')
  } catch (error) {
    console.error('刷新失败:', error)
    toast.error('刷新失败')
  } finally {
    uni.stopPullDownRefresh()
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  // padding-top: $page-top-padding;
  // background-color: $page-bg-color;
}

.avatar-section {
  width: auto;
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: $mall-shadow-sm;
}

.avatar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
}

.avatar-label {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: 500;
}

.avatar-container {
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.avatar-image {
  width: 50rpx;
  height: 50rpx;
  border-radius: 30rpx;
  border: 2rpx solid #f0f0f0;
}

.form-section {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: $mall-shadow-sm;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  border-bottom: 2rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.form-label {
  font-size: $mall-font-base;
  color: $mall-text-primary;
  font-weight: 500;
  width: 160rpx;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  font-size: $mall-font-base;
  color: $mall-text-primary;
  text-align: right;
  padding: 0;
  height: auto;
  line-height: 1.4;

  &::placeholder {
    color: $mall-text-placeholder;
  }
}

.save-button {
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
