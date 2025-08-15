import type { NavigationItem } from '@/types/navigation'
import { 
  navigationConfig as unifiedNavigationConfig,
  findNavigationItem as unifiedFindNavigationItem,
  filterNavigationByPermissions as unifiedFilterNavigationByPermissions,
  getNavigationPaths as unifiedGetNavigationPaths
} from '@/config/navigationConfig'

// 导航配置（从统一的导航配置导入，避免重复）
export const navigationConfig: NavigationItem[] = unifiedNavigationConfig

// 导航工具函数（使用统一的工具函数，避免重复）
export const findNavigationItem = unifiedFindNavigationItem
export const filterNavigationByPermissions = unifiedFilterNavigationByPermissions
export const getNavigationPaths = unifiedGetNavigationPaths
