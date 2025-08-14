import type { NavigationItem } from '@/types/navigation'
import type { RouteRecordRaw } from 'vue-router'

// 导航配置（与navigation.ts保持一致）
export const navigationConfig: NavigationItem[] = [
  {
    id: 'personnel',
    label: '员工管理',
    icon: 'User',
    path: '/personnel',
    permission: 'personnel:view'
  },
  {
    id: 'companies',
    label: '企业管理',
    icon: 'OfficeBuilding',
    path: '/companies',
    permission: 'companies:view'
  },
  {
    id: 'contracts',
    label: '合同管理',
    icon: 'Files',
    path: '/contracts',
    permission: 'contracts:view',
    children: [
      { 
        id: 'maintenance-contract', 
        label: '维保合同',
        path: '/contracts/maintenance',
        permission: 'contracts:maintenance:view'
      },
      { 
        id: 'inspection-contract', 
        label: '检测合同',
        path: '/contracts/inspection',
        permission: 'contracts:inspection:view'
      },
      { 
        id: 'evaluation-contract', 
        label: '评估合同',
        path: '/contracts/evaluation',
        permission: 'contracts:evaluation:view'
      }
    ]
  },
  {
    id: 'plan-management',
    label: '计划管理',
    icon: 'Calendar',
    path: '/plans',
    permission: 'plans:view',
    children: [
      { 
        id: 'maintenance-plan', 
        label: '维保计划管理',
        path: '/plans/maintenance',
        permission: 'plans:maintenance:view'
      },
      { 
        id: 'inspection-plan', 
        label: '检测计划管理',
        path: '/plans/inspection',
        permission: 'plans:inspection:view'
      },
      { 
        id: 'evaluation-plan', 
        label: '评估计划管理',
        path: '/plans/evaluation',
        permission: 'plans:evaluation:view'
      }
    ]
  },
  {
    id: 'execution-monitor',
    label: '执行监控',
    icon: 'Monitor',
    path: '/monitor',
    permission: 'monitor:view',
    children: [
      { 
        id: 'task-status', 
        label: '任务状态',
        path: '/monitor/tasks',
        permission: 'monitor:tasks:view'
      },
      { 
        id: 'execution-stats', 
        label: '执行统计',
        path: '/monitor/stats',
        permission: 'monitor:stats:view'
      }
    ]
  }
]

// 根据导航配置生成路由
export const generateRoutes = (navItems: NavigationItem[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  
  const traverse = (items: NavigationItem[], parentPath = '') => {
    for (const item of items) {
      if (item.path) {
        const route: RouteRecordRaw = {
          path: item.path,
          name: item.id,
          component: () => import('@/pages/NotFound.vue'), // 默认组件
          meta: {
            title: item.label,
            permission: item.permission,
            requiresAuth: true
          }
        }
        
        // 动态导入组件
        if (item.id === 'personnel') {
          route.component = () => import('@/pages/personnel/PersonnelList.vue')
        } else if (item.id === 'companies') {
          route.component = () => import('@/pages/companies/CompanyList.vue')
        } else if (item.id === 'contracts') {
          route.component = () => import('@/pages/contracts/ContractList.vue')
        } else if (item.id === 'maintenance-contract') {
          route.component = () => import('@/pages/contracts/MaintenanceContractList.vue')
        } else if (item.id === 'inspection-contract') {
          route.component = () => import('@/pages/contracts/InspectionContractList.vue')
        } else if (item.id === 'evaluation-contract') {
          route.component = () => import('@/pages/contracts/EvaluationContractList.vue')
        } else if (item.id === 'plan-management') {
          route.component = () => import('@/pages/plan-management/PlanManagementList.vue')
        } else if (item.id === 'maintenance-plan') {
          route.component = () => import('@/pages/plan-management/MaintenancePlanList.vue')
        } else if (item.id === 'inspection-plan') {
          route.component = () => import('@/pages/plan-management/InspectionPlanList.vue')
        } else if (item.id === 'evaluation-plan') {
          route.component = () => import('@/pages/plan-management/EvaluationPlanList.vue')
        } else if (item.id === 'execution-monitor') {
          route.component = () => import('@/pages/execution-monitor/ExecutionMonitorList.vue')
        } else if (item.id === 'task-status') {
          route.component = () => import('@/pages/execution-monitor/TaskStatusList.vue')
        } else if (item.id === 'execution-stats') {
          route.component = () => import('@/pages/execution-monitor/ExecutionStatsList.vue')
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
