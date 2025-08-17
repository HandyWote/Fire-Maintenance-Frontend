import { createRouter, createWebHistory } from 'vue-router'
import { appRoutes } from '@/config/routes'
import { authService } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: appRoutes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 消防维护管理系统`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 使用认证服务检查认证状态
    if (!authService.isAuthenticated()) {
      next('/login')
      return
    }
    
    // 检查角色权限（如果路由有角色要求）
    if (to.meta.role && !authService.hasRole(to.meta.role as string)) {
      // 如果没有权限，重定向到403页面或首页
      next('/')
      return
    }
    
    // 检查资源访问权限（如果路由有权限要求）
    if (to.meta.permission && !authService.canAccess(to.meta.permission as string)) {
      // 如果没有权限，重定向到403页面或首页
      next('/')
      return
    }
  }
  
  // 如果已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && authService.isAuthenticated()) {
    next('/')
    return
  }
  
  next()
})

export default router
