/**
 * 认证服务
 * 提供用户认证、权限检查等功能
 */

import { post } from '@/utils/request'
import { AuthCookieUtil, CookieUtil } from '@/utils/cookie'

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
    role: 'admin' | 'user'
    [key: string]: any
  }
}

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'user'
  token?: string
  [key: string]: any
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

/**
 * 认证服务类
 */
export class AuthService {
  private static instance: AuthService
  private state: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  }

  private constructor() {
    // 初始化时从 Cookie 加载用户信息
    this.loadUserFromCookie()
  }

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
   * 从 Cookie 加载用户信息
   */
  private loadUserFromCookie(): void {
    try {
      if (AuthCookieUtil.isAuthenticated()) {
        const user = AuthCookieUtil.getUser()
        const token = AuthCookieUtil.getToken()
        
        if (user && token) {
          this.state.user = { ...user, token }
          this.state.isAuthenticated = true
        }
      }
    } catch (error) {
      console.error('从 Cookie 加载用户信息失败:', error)
      this.clearAuth()
    }
  }

  /**
   * 用户登录
   * @param request 登录请求
   * @returns Promise<AuthUser>
   */
  async login(request: LoginRequest): Promise<AuthUser> {
    this.setLoading(true)
    this.setError(null)

    try {
      // 尝试调用真实的后端登录 API
      const response = await post<LoginResponse>('/auth/login', {
        username: request.username,
        password: request.password
      })

      // 登录成功，保存用户信息
      const authUser: AuthUser = {
        ...response.user,
        token: response.token
      }

      this.setAuthUser(authUser, request.remember)
      
      return authUser
    } catch (error) {
      // 真实 API 失败，检查是否为开发环境
      if (import.meta.env.DEV) {
        console.warn('真实登录 API 失败，尝试模拟登录:', error)
        return this.mockLogin(request)
      }
      
      // 生产环境直接抛出错误
      throw new Error('登录失败，请检查用户名和密码')
    } finally {
      this.setLoading(false)
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
        // 验证测试账号
        const validCredentials = [
          { username: 'admin', password: '123456', role: 'admin' },
          { username: 'user', password: '123456', role: 'user' }
        ]

        const credential = validCredentials.find(
          cred => cred.username === request.username && cred.password === request.password
        )

        if (credential) {
          const mockUser: AuthUser = {
            id: `mock-${credential.username}`,
            username: credential.username,
            role: credential.role as 'admin' | 'user',
            token: `mock-token-${credential.username}-${Date.now()}`
          }

          this.setAuthUser(mockUser, request.remember)
          resolve(mockUser)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000) // 模拟网络延迟
    })
  }

  /**
   * 设置认证用户信息
   * @param user 用户信息
   * @param remember 是否记住登录
   */
  private setAuthUser(user: AuthUser, remember: boolean = false): void {
    this.state.user = user
    this.state.isAuthenticated = true
    this.state.error = null

    // 保存到 Cookie
    if (user.token) {
      AuthCookieUtil.saveAuth(user.token, user, remember)
    }

    // 同时保存到 localStorage 以保持兼容性
    localStorage.setItem('token', user.token || '')
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role
    }))
  }

  /**
   * 用户登出
   */
  logout(): void {
    this.state.user = null
    this.state.isAuthenticated = false
    this.state.error = null

    // 清除 Cookie
    AuthCookieUtil.clearAuth()

    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userPermissions')
    localStorage.removeItem('isAuthenticated')
  }

  /**
   * 获取当前用户
   * @returns 当前用户信息
   */
  getCurrentUser(): AuthUser | null {
    return this.state.user
  }

  /**
   * 检查是否已认证
   * @returns 是否已认证
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated
  }

  /**
   * 检查用户角色
   * @param role 角色
   * @returns 是否拥有指定角色
   */
  hasRole(role: string): boolean {
    return this.state.user?.role === role
  }

  /**
   * 检查是否为管理员
   * @returns 是否为管理员
   */
  isAdmin(): boolean {
    return this.hasRole('admin')
  }

  /**
   * 检查用户权限
   * @param resource 资源名称
   * @returns 是否有访问权限
   */
  canAccess(resource: string): boolean {
    if (!this.state.isAuthenticated) {
      return false
    }

    // 管理员拥有所有权限
    if (this.isAdmin()) {
      return true
    }

    // 普通用户的权限映射
    const userPermissions: Record<string, boolean> = {
      'dashboard': true,
      'personnel:view': true,
      'companies:view': true,
      'contracts:view': true,
      'plans:view': true,
      'execution:view': true,
      'personnel:create': false,
      'personnel:update': false,
      'personnel:delete': false,
      'personnel:export': false,
      'companies:create': false,
      'companies:update': false,
      'companies:delete': false,
      'user:management': false,
      'system:config': false
    }

    return userPermissions[resource] || false
  }

  /**
   * 刷新认证状态
   */
  refreshAuth(): void {
    this.loadUserFromCookie()
  }

  /**
   * 设置加载状态
   * @param loading 是否加载中
   */
  private setLoading(loading: boolean): void {
    this.state.loading = loading
  }

  /**
   * 设置错误信息
   * @param error 错误信息
   */
  private setError(error: string | null): void {
    this.state.error = error
  }

  /**
   * 清除认证信息
   */
  private clearAuth(): void {
    this.state.user = null
    this.state.isAuthenticated = false
    this.state.error = null
    AuthCookieUtil.clearAuth()
  }

  /**
   * 获取认证状态
   * @returns 认证状态
   */
  getState(): AuthState {
    return { ...this.state }
  }

  /**
   * 检查是否为开发环境
   * @returns 是否为开发环境
   */
  isDevelopment(): boolean {
    return import.meta.env.DEV
  }

  /**
   * 获取测试账号信息
   * @returns 测试账号列表
   */
  getTestAccounts(): Array<{ username: string; password: string; role: string }> {
    if (!this.isDevelopment()) {
      return []
    }

    return [
      { username: 'admin', password: '123456', role: 'admin' },
      { username: 'user', password: '123456', role: 'user' }
    ]
  }
}

// 导出单例实例
export const authService = AuthService.getInstance()

// 导出便捷方法
export const useAuth = () => {
  return {
    login: (request: LoginRequest) => authService.login(request),
    logout: () => authService.logout(),
    getCurrentUser: () => authService.getCurrentUser(),
    isAuthenticated: () => authService.isAuthenticated(),
    hasRole: (role: string) => authService.hasRole(role),
    isAdmin: () => authService.isAdmin(),
    canAccess: (resource: string) => authService.canAccess(resource),
    refreshAuth: () => authService.refreshAuth(),
    getState: () => authService.getState(),
    isDevelopment: () => authService.isDevelopment(),
    getTestAccounts: () => authService.getTestAccounts()
  }
}

export default authService
