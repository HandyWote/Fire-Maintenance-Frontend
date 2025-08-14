import { get, post, put, del, upload, download } from '@/utils/request'
import type { ApiResponse, PageQueryParams, PageResponse } from '@/types'

// 基础服务类
export abstract class BaseService {
  protected abstract baseUrl: string

  // 通用 CRUD 操作
  async getAll<T>(params?: PageQueryParams): Promise<PageResponse<T>> {
    return get<PageResponse<T>>(this.baseUrl, params)
  }

  async getById<T>(id: string): Promise<T> {
    return get<T>(`${this.baseUrl}/${id}`)
  }

  async create<T>(data: Partial<T>): Promise<T> {
    return post<T>(this.baseUrl, data)
  }

  async update<T>(id: string, data: Partial<T>): Promise<T> {
    return put<T>(`${this.baseUrl}/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return del(`${this.baseUrl}/${id}`)
  }

  // 批量操作
  async batchCreate<T>(data: Partial<T>[]): Promise<T[]> {
    return post<T[]>(`${this.baseUrl}/batch`, data)
  }

  async batchUpdate<T>(data: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    return put<T[]>(`${this.baseUrl}/batch`, data)
  }

  async batchDelete(ids: string[]): Promise<void> {
    return del(`${this.baseUrl}/batch`, { data: { ids } })
  }

  // 文件操作
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{ url: string; filename: string }> {
    return upload<{ url: string; filename: string }>(`${this.baseUrl}/upload`, file, onProgress)
  }

  async downloadFile(id: string, filename?: string): Promise<void> {
    return download(`${this.baseUrl}/${id}/download`, filename)
  }

  // 状态操作
  async enable(id: string): Promise<void> {
    return post(`${this.baseUrl}/${id}/enable`)
  }

  async disable(id: string): Promise<void> {
    return post(`${this.baseUrl}/${id}/disable`)
  }

  // 搜索操作
  async search<T>(keyword: string, params?: PageQueryParams): Promise<PageResponse<T>> {
    return get<PageResponse<T>>(`${this.baseUrl}/search`, { keyword, ...params })
  }

  // 统计操作
  async getStats(): Promise<any> {
    return get(`${this.baseUrl}/stats`)
  }
}

// API 错误类
export class ApiError extends Error {
  public readonly code: number
  public readonly details?: any

  constructor(message: string, code: number = 500, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }

  static fromResponse(error: any): ApiError {
    const message = error.response?.data?.message || error.message || 'Unknown API error'
    const code = error.response?.status || 500
    const details = error.response?.data
    
    return new ApiError(message, code, details)
  }
}

// 服务工厂
export class ServiceFactory {
  private static services: Map<string, BaseService> = new Map()

  static createService<T extends BaseService>(ServiceClass: new () => T): T {
    const serviceName = ServiceClass.name
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, new ServiceClass())
    }
    return this.services.get(serviceName) as T
  }

  static clearServices(): void {
    this.services.clear()
  }
}

// 请求拦截器
export class RequestInterceptor {
  private static interceptors: Array<(config: any) => any> = []

  static addInterceptor(interceptor: (config: any) => any): void {
    this.interceptors.push(interceptor)
  }

  static removeInterceptor(interceptor: (config: any) => any): void {
    const index = this.interceptors.indexOf(interceptor)
    if (index > -1) {
      this.interceptors.splice(index, 1)
    }
  }

  static async executeInterceptors(config: any): Promise<any> {
    let result = config
    for (const interceptor of this.interceptors) {
      result = await interceptor(result)
    }
    return result
  }
}

// 响应拦截器
export class ResponseInterceptor {
  private static interceptors: Array<(response: any) => any> = []

  static addInterceptor(interceptor: (response: any) => any): void {
    this.interceptors.push(interceptor)
  }

  static removeInterceptor(interceptor: (response: any) => any): void {
    const index = this.interceptors.indexOf(interceptor)
    if (index > -1) {
      this.interceptors.splice(index, 1)
    }
  }

  static async executeInterceptors(response: any): Promise<any> {
    let result = response
    for (const interceptor of this.interceptors) {
      result = await interceptor(result)
    }
    return result
  }
}

// 缓存装饰器
export function Cacheable(ttl: number = 5 * 60 * 1000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = new Map<string, { value: any; expires: number }>()

    descriptor.value = async function (...args: any[]) {
      const key = JSON.stringify(args)
      const cached = cache.get(key)

      if (cached && Date.now() < cached.expires) {
        return cached.value
      }

      const result = await originalMethod.apply(this, args)
      cache.set(key, { value: result, expires: Date.now() + ttl })
      return result
    }

    return descriptor
  }
}

// 重试装饰器
export function Retryable(maxRetries: number = 3, delay: number = 1000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let i = 0; i <= maxRetries; i++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error
          if (i < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
          }
        }
      }

      throw lastError!
    }

    return descriptor
  }
}

// 日志装饰器
export function Loggable(level: 'info' | 'warn' | 'error' = 'info') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now()
      console[level](`[${target.constructor.name}] ${propertyKey} called with args:`, args)

      try {
        const result = await originalMethod.apply(this, args)
        const endTime = performance.now()
        console[level](`[${target.constructor.name}] ${propertyKey} completed in ${endTime - startTime}ms`)
        return result
      } catch (error) {
        const endTime = performance.now()
        console[level](`[${target.constructor.name}] ${propertyKey} failed after ${endTime - startTime}ms:`, error)
        throw error
      }
    }

    return descriptor
  }
}
