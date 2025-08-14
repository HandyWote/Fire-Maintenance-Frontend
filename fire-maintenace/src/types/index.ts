// 工作流相关类型
export * from './workflow'

// 公司相关类型
export * from './company'

// 项目相关类型
export * from './project'

// 报告相关类型
export * from './report'

// 表格相关类型
export * from './table'

// 通用类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: Date
}

export interface PageQueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PageResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  data?: any
}

export interface Option {
  label: string
  value: string | number
  disabled?: boolean
  children?: Option[]
}

export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  avatar?: string
  roles: string[]
  permissions: string[]
  department?: string
  position?: string
  status: 'active' | 'inactive' | 'locked'
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface SortInfo {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface FilterInfo {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin'
  value: any
}

export interface SearchParams {
  keyword?: string
  filters?: FilterInfo[]
  sort?: SortInfo
  pagination?: PaginationInfo
}
