import type { NavigationItem } from '@/types/navigation'
import { navigationConfig as routeNavigationConfig } from '@/config/routes'

// 导航配置（从routes.ts导入，保持一致性）
export const navigationConfig: NavigationItem[] = routeNavigationConfig

// 导航工具函数
export const findNavigationItem = (id: string, items: NavigationItem[] = navigationConfig): NavigationItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children) {
      const found = findNavigationItem(id, item.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const filterNavigationByPermissions = (items: NavigationItem[], permissions: string[]): NavigationItem[] => {
  return items
    .filter(item => {
      // 检查当前项权限
      if (item.permission && !permissions.includes(item.permission)) {
        return false
      }
      
      // 递归检查子项
      if (item.children) {
        const filteredChildren = filterNavigationByPermissions(item.children, permissions)
        // 如果有子项通过权限检查，则保留当前项
        if (filteredChildren.length > 0) {
          item.children = filteredChildren
          return true
        }
        // 如果没有子项通过权限检查，则过滤掉当前项
        return false
      }
      
      return true
    })
}

export const getNavigationPaths = (items: NavigationItem[]): string[] => {
  const paths: string[] = []
  
  const traverse = (navItems: NavigationItem[]) => {
    for (const item of navItems) {
      if (item.path) {
        paths.push(item.path)
      }
      if (item.children) {
        traverse(item.children)
      }
    }
  }
  
  traverse(items)
  return paths
}
