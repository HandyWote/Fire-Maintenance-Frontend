<script setup lang="ts">
import { computed, onMounted } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useNavigationStore } from '@/stores/navigation'
import type { NavigationItem } from '@/types/navigation'

// 使用导航Store
const navigationStore = useNavigationStore()

// 计算属性
const navigationData = computed(() => navigationStore.filteredNavigation)
const currentNode = computed(() => navigationStore.currentNode)

// 处理导航树点击
const handleNodeClick = (data: NavigationItem) => {
  navigationStore.setCurrentNode(data.id)
  console.log('点击节点:', data)
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
