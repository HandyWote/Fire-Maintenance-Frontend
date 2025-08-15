import type { NavigationItem } from '@/types/navigation'
import type { RouteRecordRaw } from 'vue-router'
import { navigationConfig as unifiedNavigationConfig, componentMap as unifiedComponentMap } from '@/config/navigationConfig'

// 导航配置（从统一的导航配置导入，避免重复）
export const navigationConfig: NavigationItem[] = unifiedNavigationConfig

// 组件映射配置（从统一的导航配置导入，避免硬编码）
const componentMap: Record<string, () => Promise<any>> = unifiedComponentMap

// 根据导航配置生成路由
export const generateRoutes = (navItems: NavigationItem[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  
  const traverse = (items: NavigationItem[], parentPath = '') => {
    for (const item of items) {
      if (item.path) {
        const route: RouteRecordRaw = {
          path: item.path,
          name: item.id,
          component: componentMap[item.id] || (() => import('@/pages/NotFound.vue')),
          meta: {
            title: item.label,
            permission: item.permission,
            requiresAuth: true
          }
        }
        
        routes.push(route)
      }
      
      // 递归处理子项
      if (item.children) {
        traverse(item.children, item.path)
      }
    }
  }
  
  traverse(navItems)
  return routes
}

// 基础路由
export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  }
]

// 完整的路由配置
export const appRoutes = [...baseRoutes, ...generateRoutes(navigationConfig)]

// 路由工具函数
export const findRouteByPath = (path: string, routes: RouteRecordRaw[] = appRoutes): RouteRecordRaw | null => {
  for (const route of routes) {
    if (route.path === path) {
      return route
    }
    if (route.children) {
      const found = findRouteByPath(path, route.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const findRouteByName = (name: string, routes: RouteRecordRaw[] = appRoutes): RouteRecordRaw | null => {
  for (const route of routes) {
    if (route.name === name) {
      return route
    }
    if (route.children) {
      const found = findRouteByName(name, route.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 获取所有路由路径
export const getAllRoutePaths = (routes: RouteRecordRaw[] = appRoutes): string[] => {
  const paths: string[] = []
  
  const traverse = (routeItems: RouteRecordRaw[]) => {
    for (const route of routeItems) {
      if (route.path) {
        paths.push(route.path)
      }
      if (route.children) {
        traverse(route.children)
      }
    }
  }
  
  traverse(routes)
  return paths
}

// 根据权限过滤路由
export const filterRoutesByPermissions = (routes: RouteRecordRaw[], permissions: string[]): RouteRecordRaw[] => {
  return routes.filter(route => {
    const meta = route.meta as any
    if (meta?.permission && !permissions.includes(meta.permission)) {
      return false
    }
    
    if (route.children) {
      route.children = filterRoutesByPermissions(route.children, permissions)
      // 如果有子路由通过权限检查，则保留当前路由
      return route.children.length > 0
    }
    
    return true
  })
}
