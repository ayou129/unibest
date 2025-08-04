import { buildLoginUrl, isLoggedIn } from '@/utils/auth'
import { isTableBar } from '@/utils/index'

/**
 * 跳转到登录页面
 * @param redirect 登录成功后的重定向地址
 */
export function navigateToLogin(redirect?: string) {
  const url = buildLoginUrl(redirect)
  console.log('🔄 跳转到登录页:', url)
  uni.navigateTo({ url })
}

/**
 * 智能页面跳转 - 根据页面类型选择合适的跳转方式
 * @param url 目标页面路径
 * @param redirect 当前页面路径，用于登录后重定向
 * @param requireLogin 是否需要登录
 */
export function smartNavigate(url: string, options?: {
  redirect?: string
  requireLogin?: boolean
  navigateType?: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab'
}) {
  const { redirect, requireLogin = false, navigateType } = options || {}

  // 如果需要登录但用户未登录，跳转到登录页
  if (requireLogin && !isLoggedIn()) {
    navigateToLogin(redirect || url)
    return
  }

  // 根据页面类型选择跳转方式
  let method = navigateType
  if (!method) {
    if (isTableBar(url)) {
      method = 'switchTab'
    }
    else {
      method = 'navigateTo'
    }
  }

  console.log(`🎯 ${method} 跳转:`, url)

  switch (method) {
    case 'switchTab':
      uni.switchTab({ url })
      break
    case 'redirectTo':
      uni.redirectTo({ url })
      break
    case 'reLaunch':
      uni.reLaunch({ url })
      break
    case 'navigateTo':
    default:
      uni.navigateTo({ url })
      break
  }
}

/**
 * 跳转到订单列表页面
 * @param status 订单状态筛选
 */
export function navigateToOrders(status?: string) {
  const url = status ? `/pages/order/list?status=${status}` : '/pages/order/list'
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 跳转到优惠券页面
 */
export function navigateToCoupons() {
  const url = '/pages/coupons/index'
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 跳转到设置页面
 */
export function navigateToSettings() {
  smartNavigate('/pages/mine/info/index')
}

/**
 * 跳转到地址管理页面
 */
export function navigateToAddressList(selectMode = false) {
  const url = selectMode ? '/pages/address/list?mode=select' : '/pages/address/list'
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 跳转到地址编辑页面
 * @param addressId 地址ID，不传则为新增地址
 */
export function navigateToAddressEdit(addressId?: string | number) {
  const url = addressId ? `/pages/address/edit?id=${addressId}` : '/pages/address/edit'
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 跳转到商品详情页面
 * @param productId 商品ID
 */
export function navigateToProductDetail(productId: string | number) {
  smartNavigate(`/pages/product/detail?id=${productId}`)
}

/**
 * 跳转到确认订单页面
 * @param params 订单参数
 */
export function navigateToOrderConfirm(params?: Record<string, any>) {
  let url = '/pages/order/confirm'
  if (params) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')
    url += `?${query}`
  }
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 跳转到支付页面
 * @param orderId 订单ID
 */
export function navigateToPayment(orderId: string | number) {
  const url = `/pages/payment/index?orderId=${orderId}`
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}

/**
 * 用户认证相关跳转
 */
export function handleUserAuth() {
  if (isLoggedIn()) {
    // 已登录，跳转到认证页面
    console.log('🔐 跳转到认证页面')
    uni.showToast({
      title: '跳转认证页面',
      icon: 'none',
    })
    // TODO: 这里可以跳转到具体的认证页面
    // smartNavigate('/pages/auth/index')
  }
  else {
    // 未登录，跳转到登录页面
    navigateToLogin('/pages/mine/index')
  }
}

/**
 * 回到首页
 */
export function navigateToHome() {
  smartNavigate('/pages/index/index', {
    navigateType: 'switchTab',
  })
}

/**
 * 回到商城首页
 */
export function navigateToMall() {
  smartNavigate('/pages/index/index', {
    navigateType: 'switchTab',
  })
}

/**
 * 回到个人中心
 */
export function navigateToMine() {
  smartNavigate('/pages/mine/index', {
    navigateType: 'switchTab',
  })
}

/**
 * 跳转到订单详情页面
 * @param orderId 订单ID
 */
export function navigateToOrderDetail(orderId: string | number) {
  const url = `/pages/order/detail?id=${orderId}`
  smartNavigate(url, {
    requireLogin: true,
    redirect: url,
  })
}
