import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import '@/styles/global.scss'

// 创建Vue应用实例
const app = createApp(App)

// 创建Pinia状态管理实例
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 异步初始化认证和权限系统
const initializeAuthSystem = async () => {
  try {
    console.log('开始初始化认证和权限系统...')
    
    // 初始化权限存储
    const { usePermissionsStore } = await import('./stores/permissions')
    const permissionsStore = usePermissionsStore()
    
    // 设置写死的admin账号用于测试
    const adminUser = {
      id: 'admin-user',
      username: 'admin',
      role: 'admin'
    }
    
    permissionsStore.setUser(adminUser)
    
    console.log('认证和权限系统初始化完成')
    console.log('当前用户:', permissionsStore.user)
    console.log('认证状态:', permissionsStore.isAuthenticated)
    console.log('用户角色:', permissionsStore.userRole)
    console.log('是否管理员:', permissionsStore.isAdmin)
    console.log('用户权限:', permissionsStore.userPermissions)
    
  } catch (error) {
    console.error('认证和权限系统初始化失败:', error)
    
    // 强制设置回退用户
    try {
      const { usePermissionsStore } = await import('./stores/permissions')
      const permissionsStore = usePermissionsStore()
      const fallbackUser = {
        id: 'fallback-user',
        username: 'user',
        role: 'user'
      }
      permissionsStore.setUser(fallbackUser)
      console.log('回退用户设置完成:', fallbackUser)
    } catch (fallbackError) {
      console.error('回退用户设置失败:', fallbackError)
    }
  }
}

// 在应用挂载前初始化认证系统
initializeAuthSystem().then(() => {
  console.log('认证系统初始化完成，准备挂载应用...')
  // 认证系统初始化完成后挂载应用
  app.mount('#app')
}).catch((error) => {
  console.error('认证系统初始化失败，但仍然挂载应用:', error)
  // 即使认证系统初始化失败，也要挂载应用
  app.mount('#app')
})
