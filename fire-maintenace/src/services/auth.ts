/**
 * 简化的认证服务
 * 只保留基本的登录/登出功能，移除复杂的权限控制
 */

import { post } from '@/utils/request'

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    [key: string]: any
  }
}

export interface AuthUser {
  id: string
  username: string
  token?: string
  [key: string]: any
}

/**
 * 简化的认证服务类
 */
export class AuthService {
  private static instance: AuthService

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * 用户登录
   * @param request 登录请求
   * @returns Promise<AuthUser>
   */
  async login(request: LoginRequest): Promise<AuthUser> {
    try {
      // 尝试调用后端登录 API
      const response = await post<LoginResponse>('/auth/login', {
        username: request.username,
        password: request.password
      })

      const authUser: AuthUser = {
        ...response.user,
        token: response.token
      }

      return authUser
    } catch (error) {
      // 如果是开发环境，提供模拟登录
      if (import.meta.env.DEV) {
        console.warn('后端API不可用，使用模拟登录:', error)
        return this.mockLogin(request)
      }
      
      throw new Error('登录失败，请检查用户名和密码')
    }
  }

  /**
   * 模拟登录（仅开发环境）
   * @param request 登录请求
   * @returns Promise<AuthUser>
   */
  private async mockLogin(request: LoginRequest): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 简单的测试账号验证
        if (request.username === 'admin' && request.password === '123456') {
          const mockUser: AuthUser = {
            id: 'admin-001',
            username: 'admin',
            token: `mock-token-${Date.now()}`
          }
          resolve(mockUser)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000) // 模拟网络延迟
    })
  }

  /**
   * 获取当前token
   * @returns token字符串
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  /**
   * 检查是否已登录
   * @returns 是否已登录
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }

  /**
   * 获取测试账号信息（开发环境）
   * @returns 测试账号信息
   */
  getTestAccounts(): Array<{ username: string; password: string }> {
    if (!import.meta.env.DEV) {
      return []
    }

    return [
      { username: 'admin', password: '123456' }
    ]
  }
}

// 导出单例实例
export const authService = AuthService.getInstance()

// 导出便捷方法
export const useAuth = () => {
  return {
    login: (request: LoginRequest) => authService.login(request),
    getToken: () => authService.getToken(),
    isAuthenticated: () => authService.isAuthenticated(),
    getTestAccounts: () => authService.getTestAccounts()
  }
}

export default authService