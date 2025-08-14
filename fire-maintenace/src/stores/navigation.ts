import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { navigationConfig, findNavigationItem, filterNavigationByPermissions } from '@/config/navigation'
import type { NavigationItem } from '@/types/navigation'

export interface NavigationState {
  currentNavigation: NavigationItem[]
  filteredNavigation: NavigationItem[]
  currentNode: string
  userPermissions: string[]
  loading: boolean
  error: string | null
}

export const useNavigationStore = defineStore('navigation', () => {
  // 状态定义
  const currentNavigation = ref<NavigationItem[]>(navigationConfig)
  const filteredNavigation = ref<NavigationItem[]>(navigationConfig)
  const currentNode = ref<string>('companies')
  const userPermissions = ref<string[]>(['*']) // 默认所有权限，实际应该从用户信息中获取
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentNavigationItem = computed(() => {
    return findNavigationItem(currentNode.value)
  })

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

  const breadcrumbs = computed(() => {
    const breadcrumbs: NavigationItem[] = []
    const findBreadcrumbs = (items: NavigationItem[], targetId: string, path: NavigationItem[] = []): boolean => {
      for (const item of items) {
        const currentPath = [...path, item]
        if (item.id === targetId) {
          breadcrumbs.push(...currentPath)
          return true
        }
        if (item.children) {
          if (findBreadcrumbs(item.children, targetId, currentPath)) {
            return true
          }
        }
      }
      return false
    }
    
    findBreadcrumbs(filteredNavigation.value, currentNode.value)
    return breadcrumbs
  })

  // 动作
  function setCurrentNode(nodeId: string) {
    const item = findNavigationItem(nodeId, filteredNavigation.value)
    if (item) {
      currentNode.value = nodeId
    } else {
      console.warn(`Navigation item with id '${nodeId}' not found`)
    }
  }

  function setUserPermissions(permissions: string[]) {
    userPermissions.value = permissions
    updateFilteredNavigation()
  }

  function updateFilteredNavigation() {
    try {
      loading.value = true
      if (userPermissions.value.includes('*')) {
        filteredNavigation.value = currentNavigation.value
      } else {
        filteredNavigation.value = filterNavigationByPermissions(currentNavigation.value, userPermissions.value)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to filter navigation'
      console.error('Navigation filtering error:', err)
    } finally {
      loading.value = false
    }
  }

  function addNavigationItem(item: NavigationItem, parentId?: string) {
    if (parentId) {
      const parent = findNavigationItem(parentId, currentNavigation.value)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      } else {
        console.warn(`Parent navigation item with id '${parentId}' not found`)
      }
    } else {
      currentNavigation.value.push(item)
    }
    updateFilteredNavigation()
  }

  function updateNavigationItem(itemId: string, updates: Partial<NavigationItem>) {
    const item = findNavigationItem(itemId, currentNavigation.value)
    if (item) {
      Object.assign(item, updates)
      updateFilteredNavigation()
    } else {
      console.warn(`Navigation item with id '${itemId}' not found`)
    }
  }

  function removeNavigationItem(itemId: string) {
    const removeFromArray = (items: NavigationItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          items.splice(i, 1)
          return true
        }
        if (items[i].children) {
          if (removeFromArray(items[i].children!)) {
            return true
          }
        }
      }
      return false
    }
    
    if (removeFromArray(currentNavigation.value)) {
      updateFilteredNavigation()
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function resetNavigation() {
    currentNavigation.value = navigationConfig
    currentNode.value = 'companies'
    userPermissions.value = ['*']
    loading.value = false
    error.value = null
    updateFilteredNavigation()
  }

  function expandAllNodes() {
    const expandItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.map(item => ({
        ...item,
        children: item.children ? expandItems(item.children) : undefined
      }))
    }
    
    currentNavigation.value = expandItems(currentNavigation.value)
    updateFilteredNavigation()
  }

  function collapseAllNodes() {
    const collapseItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.map(item => ({
        ...item,
        children: undefined
      }))
    }
    
    currentNavigation.value = collapseItems(currentNavigation.value)
    updateFilteredNavigation()
  }

  // 导航到指定路径
  function navigateToPath(path: string) {
    const findItemByPath = (items: NavigationItem[], targetPath: string): NavigationItem | null => {
      for (const item of items) {
        if (item.path === targetPath) {
          return item
        }
        if (item.children) {
          const found = findItemByPath(item.children, targetPath)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    
    const item = findItemByPath(filteredNavigation.value, path)
    if (item) {
      setCurrentNode(item.id)
      return item
    }
    return null
  }

  // 重置方法
  function $reset() {
    resetNavigation()
  }

  return {
    // 状态
    currentNavigation,
    filteredNavigation,
    currentNode,
    userPermissions,
    loading,
    error,

    // 计算属性
    currentNavigationItem,
    navigationPaths,
    breadcrumbs,

    // 动作
    setCurrentNode,
    setUserPermissions,
    updateFilteredNavigation,
    addNavigationItem,
    updateNavigationItem,
    removeNavigationItem,
    setLoading,
    setError,
    resetNavigation,
    expandAllNodes,
    collapseAllNodes,
    navigateToPath,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
