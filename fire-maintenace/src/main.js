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

// 简化的认证系统初始化
const initializeAuthSystem = async () => {
  try {
    console.log('初始化认证系统...')
    
    // 初始化简化的认证存储
    const { useAuthStore } = await import('./stores/permissions')
    const authStore = useAuthStore()
    
    // 从本地存储加载认证状态
    authStore.initializeAuth()
    
    console.log('认证系统初始化完成')
    console.log('当前用户:', authStore.user)
    console.log('认证状态:', authStore.isAuthenticated)
    
  } catch (error) {
    console.error('认证系统初始化失败:', error)
  }
}

// 初始化认证系统后挂载应用
initializeAuthSystem().then(() => {
  console.log('准备挂载应用...')
  app.mount('#app')
}).catch((error) => {
  console.error('认证系统初始化失败，但仍然挂载应用:', error)
  app.mount('#app')
})
