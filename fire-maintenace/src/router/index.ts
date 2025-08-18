import { createRouter, createWebHistory } from 'vue-router'
import { appRoutes } from '@/config/routes'
import { authService } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: appRoutes
})

// 简化的路由守卫 - 只检查登录状态
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 消防维护管理系统`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!authService.isAuthenticated()) {
      next('/login')
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
