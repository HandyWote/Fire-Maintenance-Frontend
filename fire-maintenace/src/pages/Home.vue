<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useNavigationStore } from '@/stores/navigation'
import { usePermissionsStore } from '@/stores/permissions'
import type { NavigationItem } from '@/types/navigation'

// 使用路由和导航Store
const router = useRouter()
const navigationStore = useNavigationStore()
const permissionsStore = usePermissionsStore()

// 计算属性
const navigationData = computed(() => navigationStore.filteredNavigation)
const currentNode = computed(() => navigationStore.currentNavigation?.id || '')

// 处理导航树点击
const handleNodeClick = async (data: NavigationItem) => {
  // 验证路径是否存在
  if (!data.path) {
    console.warn('导航项缺少路径:', data)
    return
  }

  // 验证用户是否已认证
  if (!permissionsStore.isAuthenticated) {
    console.warn('用户未认证，无法进行导航')
    // 可以在这里添加跳转到登录页的逻辑
    return
  }

  // 验证权限
  if (!permissionsStore.checkPermission(data.permission || '')) {
    console.warn('用户没有权限访问:', data.label)
    return
  }

  // 设置当前导航状态
  navigationStore.setCurrentNavigation(data)
  
  // 执行路由跳转（带重试机制）
  await navigateWithRetry(data.path)
}

// 带重试机制的路由跳转
const navigateWithRetry = async (path: string, maxRetries: number = 3) => {
  let retryCount = 0
  
  const attemptNavigation = async (): Promise<void> => {
    try {
      await router.push(path)
      console.log('成功跳转到:', path)
    } catch (error) {
      retryCount++
      
      if (retryCount < maxRetries) {
        console.warn(`路由跳转失败，第${retryCount}次重试:`, error)
        // 延迟后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        return attemptNavigation()
      } else {
        console.error('路由跳转失败，已达到最大重试次数:', error)
        // 可以在这里添加错误提示逻辑
        throw error
      }
    }
  }
  
  try {
    await attemptNavigation()
  } catch (error) {
    // 最终错误处理
    console.error('导航失败:', error)
    // 可以在这里添加用户友好的错误提示
  }
}

// 组件挂载时初始化导航
onMounted(() => {
  // 检查用户是否已认证
  checkUserAuthentication()
})

// 检查用户认证状态
const checkUserAuthentication = () => {
  // 如果用户已认证，直接返回
  if (permissionsStore.isAuthenticated) {
    return
  }
  
  // 检查localStorage中是否有用户信息
  const userStr = localStorage.getItem('user')
  
  if (!userStr) {
    // 没有用户信息，跳转到登录页面
    router.push('/login')
    return
  }
  
  // 有用户信息但未认证，可能是页面刷新导致的，重新设置认证状态
  try {
    const user = JSON.parse(userStr)
    
    // 重新设置用户状态
    permissionsStore.setUser(user)
    
  } catch (error) {
    console.error('解析用户信息失败:', error)
    // 解析失败，清除本地存储并跳转到登录页面
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>

<template>
  <HomeLayout
    :navigation-data="navigationData"
    :current-node="currentNode"
    @node-click="handleNodeClick"
  />
</template>

<style scoped>
/* 导入外部样式文件 */
@import '@/styles/home-layout.scss';
</style>
