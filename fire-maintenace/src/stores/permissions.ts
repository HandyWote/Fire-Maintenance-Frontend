import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

export interface PermissionsState {
  userPermissions: string[]
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export const usePermissionsStore = defineStore('permissions', () => {
  // 状态定义
  const userPermissions = ref<string[]>([]) // 默认无权限，需要从用户信息中获取
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // 计算属性
  const hasAllPermissions = computed(() => userPermissions.value.includes('*'))
  const hasPermission = computed(() => (permission: string) => {
    return hasAllPermissions.value || userPermissions.value.includes(permission)
  })
  const hasAnyPermission = computed(() => (permissions: string[]) => {
    return hasAllPermissions.value || permissions.some(permission => userPermissions.value.includes(permission))
  })
  const hasAllPermissionsRequired = computed(() => (permissions: string[]) => {
    return hasAllPermissions.value || permissions.every(permission => userPermissions.value.includes(permission))
  })

  // 动作
  function setUserPermissions(permissions: string[]) {
    userPermissions.value = permissions
  }

  function addPermission(permission: string) {
    if (!userPermissions.value.includes(permission)) {
      userPermissions.value.push(permission)
    }
  }

  function removePermission(permission: string) {
    const index = userPermissions.value.indexOf(permission)
    if (index > -1) {
      userPermissions.value.splice(index, 1)
    }
  }

  function clearPermissions() {
    userPermissions.value = []
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function resetPermissions() {
    userPermissions.value = []
    loading.value = false
    error.value = null
    isAuthenticated.value = false
  }

  // 认证相关方法
  function setAuthenticated(authenticated: boolean) {
    isAuthenticated.value = authenticated
  }

  function login(permissions: string[]) {
    userPermissions.value = permissions
    isAuthenticated.value = true
    error.value = null
  }

  function logout() {
    userPermissions.value = []
    isAuthenticated.value = false
    error.value = null
  }

  // 检查是否已认证
  function checkAuthentication(): boolean {
    return isAuthenticated.value
  }

  // 检查权限
  function checkPermission(permission: string): boolean {
    return hasPermission.value(permission)
  }

  function checkAnyPermission(permissions: string[]): boolean {
    return hasAnyPermission.value(permissions)
  }

  function checkAllPermissions(permissions: string[]): boolean {
    return hasAllPermissionsRequired.value(permissions)
  }

  // 重置方法
  function $reset() {
    resetPermissions()
  }

  return {
    // 状态
    userPermissions,
    loading,
    error,
    isAuthenticated,

    // 计算属性
    hasAllPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissionsRequired,

    // 动作
    setUserPermissions,
    addPermission,
    removePermission,
    clearPermissions,
    setLoading,
    setError,
    resetPermissions,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    
    // 认证相关
    setAuthenticated,
    login,
    logout,
    checkAuthentication,
    
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionsStore, import.meta.hot))
}
