import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export interface AuthUser {
  id: string
  username: string
  token?: string
  [key: string]: any
}

/**
 * 简化的认证状态管理
 * 只保留基本的登录/登出功能，移除复杂的权限控制
 */
export const useAuthStore = defineStore('auth', () => {
  // 状态定义
  const user = ref<AuthUser | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)

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

  // 用户持久化方法
  function saveUserToStorage() {
    try {
      if (user.value) {
        localStorage.setItem('user', JSON.stringify(user.value))
        localStorage.setItem('isAuthenticated', 'true')
        if (user.value.token) {
          localStorage.setItem('token', user.value.token)
        }
      }
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }

  function loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('user')
      const storedAuth = localStorage.getItem('isAuthenticated')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser && storedAuth === 'true') {
        const userData = JSON.parse(storedUser)
        if (storedToken) {
          userData.token = storedToken
        }
        user.value = userData
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
      clearUserFromStorage()
    }
  }

  function clearUserFromStorage() {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  }

  // 初始化认证状态
  function initializeAuth() {
    loadUserFromStorage()
  }

  return {
    // 状态
    user,
    loading,
    error,
    isAuthenticated,
    
    // 动作
    setUser,
    clearUser,
    setLoading,
    setError,
    initializeAuth
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
