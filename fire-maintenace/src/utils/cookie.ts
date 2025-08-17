/**
 * Cookie 工具类
 * 提供 Cookie 操作的便捷方法
 */
export class CookieUtil {
  /**
   * 设置 Cookie
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param days 过期天数（默认为会话 Cookie）
   * @param path 路径（默认为根路径）
   */
  static set(name: string, value: string, days?: number, path: string = '/'): void {
    let expires = ''
    
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = `; expires=${date.toUTCString()}`
    }
    
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`
  }

  /**
   * 获取 Cookie 值
   * @param name Cookie 名称
   * @returns Cookie 值，如果不存在则返回 null
   */
  static get(name: string): string | null {
    const nameEQ = `${name}=`
    const cookies = document.cookie.split(';')
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    
    return null
  }

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   * @param path 路径（默认为根路径）
   */
  static delete(name: string, path: string = '/'): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
  }

  /**
   * 检查 Cookie 是否存在
   * @param name Cookie 名称
   * @returns 是否存在
   */
  static exists(name: string): boolean {
    return this.get(name) !== null
  }

  /**
   * 获取所有 Cookie
   * @returns Cookie 对象
   */
  static getAll(): Record<string, string> {
    const cookies: Record<string, string> = {}
    const cookieStrings = document.cookie.split(';')
    
    for (const cookieString of cookieStrings) {
      const [name, value] = cookieString.trim().split('=')
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value)
      }
    }
    
    return cookies
  }

  /**
   * 清除所有 Cookie
   */
  static clearAll(): void {
    const cookies = this.getAll()
    for (const name in cookies) {
      this.delete(name)
    }
  }
}

/**
 * 认证相关的 Cookie 工具类
 * 专门处理用户认证状态的 Cookie 操作
 */
export class AuthCookieUtil {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'auth_user'
  private static readonly AUTH_STATUS_KEY = 'auth_status'

  /**
   * 保存认证信息到 Cookie
   * @param token 认证令牌
   * @param user 用户信息
   * @param remember 是否记住登录（默认7天，否则为会话 Cookie）
   */
  static saveAuth(token: string, user: any, remember: boolean = false): void {
    // 保存 token
    CookieUtil.set(this.TOKEN_KEY, token, remember ? 7 : undefined)
    
    // 保存用户信息
    const userString = JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role
    })
    CookieUtil.set(this.USER_KEY, userString, remember ? 7 : undefined)
    
    // 保存认证状态
    CookieUtil.set(this.AUTH_STATUS_KEY, 'true', remember ? 7 : undefined)
  }

  /**
   * 获取认证令牌
   * @returns 认证令牌，如果不存在则返回 null
   */
  static getToken(): string | null {
    return CookieUtil.get(this.TOKEN_KEY)
  }

  /**
   * 获取用户信息
   * @returns 用户信息对象，如果不存在则返回 null
   */
  static getUser(): any | null {
    const userString = CookieUtil.get(this.USER_KEY)
    if (!userString) {
      return null
    }
    
    try {
      return JSON.parse(userString)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }

  /**
   * 检查是否已认证
   * @returns 是否已认证
   */
  static isAuthenticated(): boolean {
    const token = this.getToken()
    const authStatus = CookieUtil.get(this.AUTH_STATUS_KEY)
    
    // 必须同时有 token 和认证状态
    return !!(token && authStatus === 'true')
  }

  /**
   * 清除认证信息
   */
  static clearAuth(): void {
    CookieUtil.delete(this.TOKEN_KEY)
    CookieUtil.delete(this.USER_KEY)
    CookieUtil.delete(this.AUTH_STATUS_KEY)
  }

  /**
   * 刷新认证状态（延长过期时间）
   * @param remember 是否记住登录
   * @returns 是否刷新成功
   */
  static refreshAuth(remember: boolean = false): boolean {
    const token = this.getToken()
    const user = this.getUser()
    
    if (token && user) {
      this.saveAuth(token, user, remember)
      return true
    }
    
    return false
  }

  /**
   * 检查认证状态是否有效
   * @returns 是否有效
   */
  static isAuthValid(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    
    // 必须同时有 token 和用户信息才认为有效
    return !!(token && user && user.id && user.username)
  }

  /**
   * 获取认证状态信息
   * @returns 认证状态信息
   */
  static getAuthStatus(): {
    isAuthenticated: boolean
    hasToken: boolean
    hasUser: boolean
    isValid: boolean
  } {
    return {
      isAuthenticated: this.isAuthenticated(),
      hasToken: !!this.getToken(),
      hasUser: !!this.getUser(),
      isValid: this.isAuthValid()
    }
  }
}

// 默认导出 AuthCookieUtil，因为它是最常用的
export default AuthCookieUtil
