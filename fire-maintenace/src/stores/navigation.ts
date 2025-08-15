import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { navigationConfig } from '@/config/navigation'
import type { NavigationItem } from '@/types/navigation'
import { usePermissionsStore } from './permissions'

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

  // 获取权限 store
  const permissionsStore = usePermissionsStore()
  
  // LRU缓存实现
  class LRUCache<K, V> {
    private cache: Map<K, V>
    private maxSize: number
    
    constructor(maxSize: number = 5) {
      this.cache = new Map()
      this.maxSize = maxSize
    }
    
    get(key: K): V | undefined {
      const value = this.cache.get(key)
      if (value !== undefined) {
        // 移动到最前面（最近使用）
        this.cache.delete(key)
        this.cache.set(key, value)
      }
      return value
    }
    
    set(key: K, value: V): void {
      if (this.cache.has(key)) {
        // 更新现有值
        this.cache.delete(key)
      } else if (this.cache.size >= this.maxSize) {
        // 删除最老的项
        const firstKey = this.cache.keys().next().value
        if (firstKey !== undefined) {
          this.cache.delete(firstKey)
        }
      }
      this.cache.set(key, value)
    }
    
    clear(): void {
      this.cache.clear()
    }
    
    has(key: K): boolean {
      return this.cache.has(key)
    }
  }
  
  // 缓存计算结果
  const navigationCache = new LRUCache<string, { filtered: NavigationItem[]; flattened: NavigationItem[] }>()
  const cacheKey = ref('')

  // 生成缓存键
  const generateCacheKey = () => {
    const permissions = permissionsStore.userPermissions.join(',')
    const navVersion = navigationItems.value.length.toString()
    return `${permissions}_${navVersion}`
  }

  // 计算属性：过滤后的导航项（基于权限）
  const filteredNavigation = computed(() => {
    const currentKey = generateCacheKey()
    
    // 如果缓存有效，直接返回
    const cached = navigationCache.get(currentKey)
    if (cached) {
      return cached.filtered
    }
    
    // 重新计算
    const filterItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.map(item => ({...item})).filter(item => {
        // 检查当前项权限
        if (!permissionsStore.checkPermission(item.permission || '')) {
          return false
        }
        
        // 如果有子项，递归过滤
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterItems(item.children)
          // 如果有子项通过权限检查，则保留当前项
          if (filteredChildren.length > 0) {
            item.children = filteredChildren
            return true
          }
          return false
        }
        
        return true
      })
    }
    
    const result = filterItems(navigationItems.value)
    
    // 更新缓存
    navigationCache.set(currentKey, {
      filtered: result,
      flattened: [] // 将在flattenedNavigation中计算
    })
    cacheKey.value = currentKey
    
    return result
  })
  
  // 计算属性：扁平化的导航项（用于面包屑等）
  const flattenedNavigation = computed(() => {
    const currentKey = generateCacheKey()
    
    // 如果缓存有效，直接返回
    const cached = navigationCache.get(currentKey)
    if (cached && cached.flattened.length > 0) {
      return cached.flattened
    }
    
    // 重新计算
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
    
    const result = flatten(filteredNavigation.value)
    
    // 更新缓存
    if (cached) {
      cached.flattened = result
    } else {
      navigationCache.set(currentKey, {
        filtered: filteredNavigation.value,
        flattened: result
      })
    }
    
    return result
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
  
  // 动作：查找导航项的父项
  const findParentNavigationItem = (id: string): NavigationItem | null => {
    const findParent = (items: NavigationItem[], targetId: string): NavigationItem | null => {
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.id === targetId) {
              return item
            }
          }
          const found = findParent(item.children, targetId)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    
    return findParent(filteredNavigation.value, id)
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
  
  // 动作：判断导航项是否可见
  const isNavigationItemVisible = (item: NavigationItem): boolean => {
    return permissionsStore.checkPermission(item.permission || '')
  }
  
  // 动作：判断导航项是否可用
  const isNavigationItemEnabled = (item: NavigationItem): boolean => {
    return permissionsStore.checkPermission(item.permission || '') && !loading.value
  }
  
  // 动作：添加导航项
  const addNavigationItem = (item: NavigationItem, parentId?: string) => {
    if (parentId) {
      const parent = findNavigationItem(parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      } else {
        console.warn(`Parent navigation item with id '${parentId}' not found`)
      }
    } else {
      navigationItems.value.push(item)
    }
  }
  
  // 动作：更新导航项
  const updateNavigationItem = (itemId: string, updates: Partial<NavigationItem>) => {
    const item = findNavigationItem(itemId)
    if (item) {
      Object.assign(item, updates)
    } else {
      console.warn(`Navigation item with id '${itemId}' not found`)
    }
  }
  
  // 动作：删除导航项
  const removeNavigationItem = (itemId: string) => {
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
    
    removeFromArray(navigationItems.value)
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
    findParentNavigationItem,
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
    addNavigationItem,
    updateNavigationItem,
    removeNavigationItem,
    navigateToPath,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
