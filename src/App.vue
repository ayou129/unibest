<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { usePageAuth } from '@/hooks/usePageAuth'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
usePageAuth()
const userStore = useUserStore()
const getUserProfile = async () => {
  const res = await userStore.getUserProfile()
  if (res.code === 0) {
    // 检查session_key 是否过期
    await checkSessionKey()
  } else {
    console.log(res)
  }
}
const checkSessionKey = async () => {
  // 前提条件： 用户已经登录
  // 两步走，第一，先在小程序中 使用 wx.checkSession 检查 session_key 是否过期
  const res = await uni.checkSession()
  console.log(res)
  if (res.errMsg === 'checkSession:ok') {
    // // 第二，如果没过期，则请求服务端 再次检查是否过期
    // const res = await userStore.checkSessionKey()
    // if (res.is_expired) {
    //   // 说明过期了，执行 wx.login 重新获取code 并且获取新的 session_key
    //   const codeRes = await userStore.wxLogin()
    //   if (!codeRes?.code) {
    //     toast.error('获取微信登录凭证失败')
    //     return
    //   }
    //   const c2sDataRes = await userStore.userLoginByCode2Session({ code: codeRes.code })
    //   if (!c2sDataRes.open_id) {
    //     toast.error('登录失败')
    //     return
    //   }
    // }
  } else {
    console.log('session_key 已过期')
    // 说明过期了，执行 wx.login 重新获取code 并且获取新的 session_key
    const codeRes = await userStore.wxLogin()
    if (!codeRes?.code) {
      toast.error('获取微信登录凭证失败')
      return
    }
    const c2sDataRes = await userStore.userLoginByCode2Session({ code: codeRes.code })
    if (!c2sDataRes.open_id) {
      toast.error('登录失败')
      return
    }
  }
}
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  getUserProfile()
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
