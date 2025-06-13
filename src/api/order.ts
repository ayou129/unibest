import { http } from '@/utils/http'
import { IApiResponse, ApiPrefix, IPageResponse, IPageParams } from './api'
import { IOrderDetail } from './order.typings'

export const getOrderList = (params: IPageParams) => {
  return http.get<IApiResponse<IPageResponse<IOrderDetail>>>(`${ApiPrefix}/order/list`, { params })
}

export const getOrderDetail = (id: string) => {
  return http.get<IApiResponse<IOrderDetail>>(`${ApiPrefix}/order/detail/${id}`)
}

// 订单计算金额
export const calcOrderAmount = (data: IOrderDetail) => {
  return http.post<IApiResponse<IOrderDetail>>(`${ApiPrefix}/order/calc_amount`, data)
}

// 订单支付
export const payOrder = (data: IOrderDetail) => {
  return http.post<IApiResponse<IOrderDetail>>(`${ApiPrefix}/order/pay`, data)
}

// 订单取消
export const cancelOrder = (data: IOrderDetail) => {
  return http.post<IApiResponse<IOrderDetail>>(`${ApiPrefix}/order/cancel`, data)
}

// 订单退款
export const refundOrder = (data: IOrderDetail) => {
  return http.post<IApiResponse<IOrderDetail>>(`${ApiPrefix}/order/refund`, data)
}
