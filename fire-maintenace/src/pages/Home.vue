<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useNavigationStore } from '@/stores/navigation'
import type { NavigationItem } from '@/types/navigation'

// 使用路由和导航Store
const router = useRouter()
const navigationStore = useNavigationStore()

// 计算属性
const navigationData = computed(() => navigationStore.filteredNavigation)
const currentNode = computed(() => navigationStore.currentNavigation?.id || '')

// 处理导航树点击
const handleNodeClick = (data: NavigationItem) => {
  // 验证路径是否存在
  if (!data.path) {
    console.warn('导航项缺少路径:', data)
    return
  }

  // 设置当前导航状态
  navigationStore.setCurrentNavigation(data)
  
  // 执行路由跳转
  try {
    router.push(data.path)
    console.log('跳转到:', data.path)
  } catch (error) {
    console.error('路由跳转失败:', error)
  }
}

// 组件挂载时初始化导航
onMounted(() => {
  // 这里可以添加权限初始化逻辑
  // navigationStore.setUserPermissions(userPermissions)
})
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
