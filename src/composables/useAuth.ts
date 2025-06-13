// import { useUserStore } from '@/store'
// import { ref } from 'vue'

// export function useAuth() {
//   const userStore = useUserStore()
//   const isLogined = ref(false)

//   const checkLoginStatus = () => {
//     const token = userStore.getUserToken()
//     const hasProfile = userStore.userProfile.id > 0

//     console.log('🔍 登录状态检查:', {
//       hasToken: !!(token && token.access_token),
//       hasProfile,
//       currentPage: getCurrentPages()[getCurrentPages().length - 1]?.route,
//     })

//     const loginStatus = !!(token && token.access_token && hasProfile)
//     isLogined.value = loginStatus

//     if (!loginStatus) {
//       const currentPath = `/${getCurrentPages()[getCurrentPages().length - 1]?.route}`
//       console.log('❌ 用户未登录，跳转到登录页')
//       uni.navigateTo({
//         url: `/pages/login/index?redirect=${encodeURIComponent(currentPath)}`,
//       })
//       return false
//     }

//     console.log('✅ 用户已登录')
//     return true
//   }

//   const requireAuth = (options?: {
//     /** 是否在登录成功后自动获取用户信息 */
//     autoGetProfile?: boolean
//     /** 自定义登录页路径 */
//     loginPath?: string
//   }) => {
//     const { autoGetProfile = true, loginPath = '/pages/login/index' } = options || {}

//     onShow(() => {
//       console.log('🔐 执行页面登录检查')
//       const loginStatus = checkLoginStatus()

//       // 如果已登录且需要自动获取用户信息
//       if (loginStatus && autoGetProfile) {
//         userStore.getUserProfile().catch((error) => {
//           console.error('获取用户信息失败:', error)
//           // 如果获取用户信息失败，可能是 token 过期，清除用户数据
//           userStore.logout()
//           isLogined.value = false
//         })
//       }
//     })
//   }

//   return {
//     isLogined: readonly(isLogined),
//     checkLoginStatus,
//     requireAuth,
//   }
// }
