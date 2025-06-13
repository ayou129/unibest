export interface IApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 分页返回
export interface IPageResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface IRequestFilterSortOption {
  sort_field: string
  sort_order: string
}

/**
 * 请求过滤查询
 */
export interface IRequestFilterQuery {
  field: string
  value: string
  operator: string
  value_type: string
}

// 分页参数
export interface IPageParams {
  page: number
  page_size: number
  filter_sort_option: IRequestFilterSortOption[]
  filter_query: IRequestFilterQuery[]
}

export const ApiCommonPrefix = '/api/v1/common'
export const ApiPrefix = '/api/v1/business/gytown/mp'
