import type { NavigationItem } from '@/types/navigation'

/**
 * 统一的导航配置
 * 这个文件是导航配置的唯一来源，避免在多个地方重复定义
 */
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

/**
 * 组件映射配置
 * 避免硬编码，提供统一的组件映射管理
 */
export const componentMap: Record<string, () => Promise<any>> = {
  'personnel': () => import('@/pages/personnel/PersonnelList.vue'),
  'companies': () => import('@/pages/companies/CompanyList.vue'),
  'contracts': () => import('@/pages/contracts/ContractList.vue'),
  'maintenance-contract': () => import('@/pages/contracts/MaintenanceContractList.vue'),
  'inspection-contract': () => import('@/pages/contracts/InspectionContractList.vue'),
  'evaluation-contract': () => import('@/pages/contracts/EvaluationContractList.vue'),
  'plan-management': () => import('@/pages/plan-management/PlanManagementList.vue'),
  'maintenance-plan': () => import('@/pages/plan-management/MaintenancePlanList.vue'),
  'inspection-plan': () => import('@/pages/plan-management/InspectionPlanList.vue'),
  'evaluation-plan': () => import('@/pages/plan-management/EvaluationPlanList.vue'),
  'execution-monitor': () => import('@/pages/execution-monitor/ExecutionMonitorList.vue'),
  'task-status': () => import('@/pages/execution-monitor/TaskStatusList.vue'),
  'execution-stats': () => import('@/pages/execution-monitor/ExecutionStatsList.vue')
}

/**
 * 导航工具函数
 */

/**
 * 查找导航项
 * @param id 导航项ID
 * @param items 导航项数组
 * @returns 找到的导航项
 */
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

/**
 * 根据权限过滤导航项
 * @param items 导航项数组
 * @param permissions 权限数组
 * @returns 过滤后的导航项
 */
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

/**
 * 获取所有导航路径
 * @param items 导航项数组
 * @returns 路径数组
 */
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

/**
 * 扁平化导航项
 * @param items 导航项数组
 * @param parentPath 父路径
 * @returns 扁平化后的导航项数组
 */
export const flattenNavigation = (items: NavigationItem[], parentPath = ''): NavigationItem[] => {
  const result: NavigationItem[] = []
  
  for (const item of items) {
    // 规范化路径处理，避免重复斜杠
    const normalizedParentPath = parentPath.replace(/\/+$/, '') // 移除末尾斜杠
    const normalizedItemPath = item.path?.replace(/^\/+/, '') // 移除开头斜杠
    
    let fullPath: string
    if (normalizedParentPath && normalizedItemPath) {
      fullPath = `${normalizedParentPath}/${normalizedItemPath}`
    } else if (normalizedItemPath) {
      fullPath = normalizedItemPath
    } else {
      fullPath = normalizedParentPath
    }
    
    const flattenedItem = { ...item, path: fullPath }
    result.push(flattenedItem)
    
    if (item.children && item.children.length > 0) {
      result.push(...flattenNavigation(item.children, fullPath || ''))
    }
  }
  
  return result
}

/**
 * 获取导航树
 * @param items 导航项数组
 * @returns 导航树
 */
export const getNavigationTree = (items: NavigationItem[] = navigationConfig): NavigationItem[] => {
  return items
}

/**
 * 获取扁平化导航
 * @param items 导航项数组
 * @returns 扁平化导航
 */
export const getFlattenedNavigation = (items: NavigationItem[] = navigationConfig): NavigationItem[] => {
  return flattenNavigation(items)
}

/**
 * 根据路径查找导航项
 * @param path 路径
 * @param items 导航项数组
 * @returns 找到的导航项
 */
export const findNavigationItemByPath = (path: string, items: NavigationItem[] = navigationConfig): NavigationItem | null => {
  const flattened = flattenNavigation(items)
  return flattened.find(item => item.path === path) || null
}

/**
 * 获取面包屑导航
 * @param targetId 目标ID
 * @param items 导航项数组
 * @param currentPath 当前路径
 * @returns 面包屑导航数组
 */
export const getBreadcrumbs = (targetId: string, items: NavigationItem[] = navigationConfig): NavigationItem[] => {
  const findPath = (navItems: NavigationItem[], targetId: string, path: NavigationItem[] = []): NavigationItem[] | null => {
    for (const navItem of navItems) {
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
  
  return findPath(items, targetId) || []
}
