import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'user'
  token?: string
  [key: string]: any
}

export interface SimplePermissionsState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export const usePermissionsStore = defineStore('permissions', () => {
  // 状态定义
  const user = ref<AuthUser | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // 计算属性
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')
  const userPermissions = computed(() => {
    if (isAdmin.value) {
      return ['*'] // 管理员拥有所有权限
    }
    return [
      'dashboard',
      'personnel:view',
      'companies:view',
      'contracts:view',
      'plans:view',
      'execution:view'
    ]
  })

  // 基于角色的权限检查
  const hasRole = computed(() => (role: string) => {
    return user.value?.role === role
  })

  const canAccess = computed(() => (resource: string) => {
    if (!isAuthenticated.value) {
      return false
    }

    // 管理员拥有所有权限
    if (isAdmin.value) {
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
  })

  // 动作
  function setUser(authUser: AuthUser) {
    user.value = authUser
    isAuthenticated.value = true
    error.value = null
    saveUserToStorage()
  }

  function clearUser() {
    user.value = null
    isAuthenticated.value = false
    error.value = null
    clearUserFromStorage()
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function resetState() {
    user.value = null
    loading.value = false
    error.value = null
    isAuthenticated.value = false
    clearUserFromStorage()
  }

  // 用户持久化方法
  function saveUserToStorage() {
    try {
      if (user.value) {
        localStorage.setItem('user', JSON.stringify({
          id: user.value.id,
          username: user.value.username,
          role: user.value.role
        }))
        localStorage.setItem('isAuthenticated', JSON.stringify(true))
      }
    } catch (error) {
      console.error('保存用户信息到本地存储失败:', error)
    }
  }

  function loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('user')
      const storedAuth = localStorage.getItem('isAuthenticated')
      
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        user.value = userData
      }
      
      if (storedAuth) {
        isAuthenticated.value = JSON.parse(storedAuth)
      }
    } catch (error) {
      console.error('从本地存储加载用户信息失败:', error)
      clearUserFromStorage()
    }
  }

  function clearUserFromStorage() {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userPermissions')
    } catch (error) {
      console.error('清除本地存储用户信息失败:', error)
    }
  }

  // 初始化权限存储（在应用启动时调用）
  async function initializePermissions() {
    try {
      setLoading(true)
      console.log('开始初始化权限存储...')
      
      // 优先从认证服务获取用户信息
      const authUser = authService.getCurrentUser()
      if (authUser && authService.isAuthenticated()) {
        setUser(authUser)
        console.log('从认证服务加载用户信息成功:', authUser)
      } else {
        // 回退到本地存储
        loadUserFromStorage()
        
        // 如果本地存储也没有用户信息，设置默认用户（开发环境）
        if (!user.value && import.meta.env.DEV) {
          console.warn('未找到用户信息，设置开发环境默认用户')
          const defaultUser: AuthUser = {
            id: 'default-user',
            username: 'user',
            role: 'user'
          }
          setUser(defaultUser)
          console.log('开发环境默认用户设置完成:', defaultUser)
        }
      }
      
      console.log('权限存储初始化完成')
      console.log('当前用户:', user.value)
      console.log('认证状态:', isAuthenticated.value)
    } catch (error) {
      console.error('权限初始化失败:', error)
      setError('权限初始化失败')
    } finally {
      setLoading(false)
    }
  }

  // 检查是否已认证
  function checkAuthentication(): boolean {
    return isAuthenticated.value
  }

  // 检查用户角色
  function checkRole(role: string): boolean {
    return hasRole.value(role)
  }

  // 检查是否为管理员
  function checkIsAdmin(): boolean {
    return isAdmin.value
  }

  // 检查资源访问权限
  function checkResourceAccess(resource: string): boolean {
    return canAccess.value(resource)
  }

  // 同步认证服务状态
  function syncWithAuthService() {
    const authUser = authService.getCurrentUser()
    const authState = authService.getState()
    
    if (authState.isAuthenticated && authUser) {
      setUser(authUser)
    } else {
      clearUser()
    }
  }

  // 重置方法
  function $reset() {
    resetState()
  }

  return {
    // 状态
    user,
    loading,
    error,
    isAuthenticated,

    // 计算属性
    userRole,
    isAdmin,
    isUser,
    hasRole,
    canAccess,
    userPermissions,
    
    // 初始化方法
    initializePermissions,

    // 动作
    setUser,
    clearUser,
    setLoading,
    setError,
    resetState,
    checkRole,
    checkIsAdmin,
    checkResourceAccess,
    checkAuthentication,
    syncWithAuthService,
    
    // 兼容性方法（保持向后兼容）
    setUserPermissions: (permissions: string[]) => {
      console.warn('setUserPermissions is deprecated, use setUser instead')
      // 将权限转换为用户角色
      if (permissions.includes('*')) {
        setUser({ id: 'admin', username: 'admin', role: 'admin' })
      } else {
        setUser({ id: 'user', username: 'user', role: 'user' })
      }
    },
    addPermission: (permission: string) => {
      console.warn('addPermission is deprecated, use role-based permissions instead')
    },
    removePermission: (permission: string) => {
      console.warn('removePermission is deprecated, use role-based permissions instead')
    },
    clearPermissions: () => {
      console.warn('clearPermissions is deprecated, use clearUser instead')
      clearUser()
    },
    hasPermission: (permission: string) => {
      console.warn('hasPermission is deprecated, use canAccess instead')
      return canAccess.value(permission)
    },
    hasAnyPermission: (permissions: string[]) => {
      console.warn('hasAnyPermission is deprecated, use role-based permissions instead')
      return permissions.some(p => canAccess.value(p))
    },
    hasAllPermissionsRequired: (permissions: string[]) => {
      console.warn('hasAllPermissionsRequired is deprecated, use role-based permissions instead')
      return permissions.every(p => canAccess.value(p))
    },
    hasAllPermissions: () => {
      console.warn('hasAllPermissions is deprecated, use isAdmin instead')
      return isAdmin.value
    },
    login: (permissions: string[]) => {
      console.warn('login is deprecated, use setUser instead')
      // 将权限转换为用户角色
      if (permissions.includes('*')) {
        setUser({ id: 'admin', username: 'admin', role: 'admin' })
      } else {
        setUser({ id: 'user', username: 'user', role: 'user' })
      }
    },
    logout: () => {
      console.warn('logout is deprecated, use clearUser instead')
      clearUser()
    },
    checkPermission: (permission: string) => {
      console.warn('checkPermission is deprecated, use checkResourceAccess instead')
      return checkResourceAccess(permission)
    },
    checkAnyPermission: (permissions: string[]) => {
      console.warn('checkAnyPermission is deprecated, use role-based permissions instead')
      return permissions.some(p => checkResourceAccess(p))
    },
    checkAllPermissions: (permissions: string[]) => {
      console.warn('checkAllPermissions is deprecated, use role-based permissions instead')
      return permissions.every(p => checkResourceAccess(p))
    },
    setAuthenticated: (authenticated: boolean) => {
      console.warn('setAuthenticated is deprecated, use setUser or clearUser instead')
      isAuthenticated.value = authenticated
    },
    
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionsStore, import.meta.hot))
}
