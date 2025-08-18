import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { navigationConfig } from '@/config/navigation'
import type { NavigationItem } from '@/types/navigation'
import { useAuthStore } from './permissions'

export interface NavigationState {
  // 导航配置
  navigationItems: NavigationItem[]
  
  // 当前选中的导航项
  currentNavigation: NavigationItem | null
  
  // 展开的菜单项
  expandedItems: string[]
  
  // 面包屑导航
  breadcrumbs: NavigationItem[]
  
  // 加载状态
  loading: boolean
  
  // 错误信息
  error: string | null
}

export const useNavigationStore = defineStore('navigation', () => {
  // 状态定义
  const navigationItems = ref<NavigationItem[]>(navigationConfig)
  const currentNavigation = ref<NavigationItem | null>(null)
  const expandedItems = ref<string[]>([])
  const breadcrumbs = ref<NavigationItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 获取认证 store
  const authStore = useAuthStore()
  
  // 简化版：过滤后的导航项（已登录即可访问所有导航）
  const filteredNavigation = computed(() => {
    if (!authStore.isAuthenticated) {
      return []
    }
    return navigationItems.value
  })
  
  // 计算属性：扁平化的导航项（用于面包屑等）
  const flattenedNavigation = computed(() => {
    const flatten = (items: NavigationItem[], parentPath = ''): NavigationItem[] => {
      const result: NavigationItem[] = []
      
      for (const item of items) {
        const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path
        const flattenedItem = { ...item, path: fullPath }
        result.push(flattenedItem)
        
        if (item.children && item.children.length > 0) {
          result.push(...flatten(item.children, fullPath))
        }
      }
      
      return result
    }
    
    return flatten(filteredNavigation.value)
  })
  
  // 计算属性：当前路径的导航项
  const currentNavigationItem = computed(() => {
    return flattenedNavigation.value.find(item => item.path === currentNavigation.value?.path)
  })
  
  // 计算属性：是否展开
  const isExpanded = computed(() => (id: string) => {
    return expandedItems.value.includes(id)
  })
  
  // 计算属性：是否有子项
  const hasChildren = computed(() => (item: NavigationItem) => {
    return item.children && item.children.length > 0
  })
  
  // 计算属性：所有导航路径
  const navigationPaths = computed(() => {
    const paths: string[] = []
    const traverse = (items: NavigationItem[]) => {
      for (const item of items) {
        if (item.path) {
          paths.push(item.path)
        }
        if (item.children) {
          traverse(item.children)
        }
      }
    }
    traverse(filteredNavigation.value)
    return paths
  })
  
  // 动作：设置当前导航项
  const setCurrentNavigation = (item: NavigationItem | null) => {
    currentNavigation.value = item
    updateBreadcrumbs(item)
  }
  
  // 动作：根据路径设置当前导航项
  const setCurrentNavigationByPath = (path: string) => {
    const item = flattenedNavigation.value.find(nav => nav.path === path)
    if (item) {
      setCurrentNavigation(item)
    }
  }
  
  // 动作：切换展开状态
  const toggleExpanded = (id: string) => {
    const index = expandedItems.value.indexOf(id)
    if (index > -1) {
      expandedItems.value.splice(index, 1)
    } else {
      expandedItems.value.push(id)
    }
  }
  
  // 动作：展开指定项
  const expandItem = (id: string) => {
    if (!expandedItems.value.includes(id)) {
      expandedItems.value.push(id)
    }
  }
  
  // 动作：收起指定项
  const collapseItem = (id: string) => {
    const index = expandedItems.value.indexOf(id)
    if (index > -1) {
      expandedItems.value.splice(index, 1)
    }
  }
  
  // 动作：展开所有
  const expandAll = () => {
    const getAllIds = (items: NavigationItem[]): string[] => {
      const ids: string[] = []
      items.forEach(item => {
        ids.push(item.id)
        if (item.children) {
          ids.push(...getAllIds(item.children))
        }
      })
      return ids
    }
    
    expandedItems.value = getAllIds(filteredNavigation.value)
  }
  
  // 动作：收起所有
  const collapseAll = () => {
    expandedItems.value = []
  }
  
  // 动作：更新面包屑
  const updateBreadcrumbs = (item: NavigationItem | null) => {
    if (!item) {
      breadcrumbs.value = []
      return
    }
    
    const findPath = (items: NavigationItem[], targetId: string, path: NavigationItem[] = []): NavigationItem[] | null => {
      for (const navItem of items) {
        const currentPath = [...path, navItem]
        
        if (navItem.id === targetId) {
          return currentPath
        }
        
        if (navItem.children) {
          const found = findPath(navItem.children, targetId, currentPath)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    
    const path = findPath(filteredNavigation.value, item.id)
    breadcrumbs.value = path || []
  }
  
  // 动作：查找导航项
  const findNavigationItem = (id: string): NavigationItem | null => {
    const findItem = (items: NavigationItem[]): NavigationItem | null => {
      for (const item of items) {
        if (item.id === id) {
          return item
        }
        if (item.children) {
          const found = findItem(item.children)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    
    return findItem(filteredNavigation.value)
  }
  
  // 动作：根据路径查找导航项
  const findNavigationItemByPath = (path: string): NavigationItem | null => {
    return flattenedNavigation.value.find(item => item.path === path) || null
  }
  
  // 动作：重置导航状态
  const resetNavigation = () => {
    currentNavigation.value = null
    expandedItems.value = []
    breadcrumbs.value = []
    loading.value = false
    error.value = null
  }
  
  // 动作：设置加载状态
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }
  
  // 动作：设置错误信息
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }
  
  // 动作：清除错误信息
  const clearError = () => {
    error.value = null
  }
  
  // 动作：获取导航树
  const getNavigationTree = () => {
    return filteredNavigation.value
  }
  
  // 动作：获取扁平化导航
  const getFlattenedNavigation = () => {
    return flattenedNavigation.value
  }
  
  // 动作：获取面包屑
  const getBreadcrumbs = () => {
    return breadcrumbs.value
  }
  
  // 简化版：导航项可见性检查（已登录即可见）
  const isNavigationItemVisible = (item: NavigationItem): boolean => {
    return authStore.isAuthenticated
  }
  
  // 简化版：导航项可用性检查（已登录且不在加载中即可用）
  const isNavigationItemEnabled = (item: NavigationItem): boolean => {
    return authStore.isAuthenticated && !loading.value
  }
  
  // 动作：导航到指定路径
  const navigateToPath = (path: string) => {
    const item = findNavigationItemByPath(path)
    if (item) {
      setCurrentNavigation(item)
      return item
    }
    return null
  }
  
  // 重置方法
  const $reset = () => {
    navigationItems.value = navigationConfig
    resetNavigation()
  }
  
  return {
    // 状态
    navigationItems,
    currentNavigation,
    expandedItems,
    breadcrumbs,
    loading,
    error,
    
    // 计算属性
    filteredNavigation,
    flattenedNavigation,
    currentNavigationItem,
    isExpanded,
    hasChildren,
    navigationPaths,
    
    // 动作
    setCurrentNavigation,
    setCurrentNavigationByPath,
    toggleExpanded,
    expandItem,
    collapseItem,
    expandAll,
    collapseAll,
    updateBreadcrumbs,
    findNavigationItem,
    findNavigationItemByPath,
    resetNavigation,
    setLoading,
    setError,
    clearError,
    getNavigationTree,
    getFlattenedNavigation,
    getBreadcrumbs,
    isNavigationItemVisible,
    isNavigationItemEnabled,
    navigateToPath,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}