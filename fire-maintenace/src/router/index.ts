import { createRouter, createWebHistory } from 'vue-router'
import { appRoutes } from '@/config/routes'

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
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router
