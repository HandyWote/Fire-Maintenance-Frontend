<script setup lang="ts">
import { ref } from 'vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import type { NavigationItem } from '@/types/navigation'

// 导航数据（静态，无需响应式）
const navigationData: NavigationItem[] = [
  {
    id: 'personnel',
    label: '员工管理'
  },
  {
    id: 'companies',
    label: '企业管理'
  },
  {
    id: 'contracts',
    label: '合同管理',
    children: [
      { id: 'maintenance-contract', label: '维保合同' },
      { id: 'inspection-contract', label: '检测合同' },
      { id: 'evaluation-contract', label: '评估合同' }
    ]
  },
  {
    id: 'plan-management',
    label: '计划管理',
    children: [
      { id: 'maintenance-plan', label: '维保计划管理' },
      { id: 'inspection-plan', label: '检测计划管理' },
      { id: 'evaluation-plan', label: '评估计划管理' }
    ]
  },
  {
    id: 'execution-monitor',
    label: '执行监控',
    children: [
      { id: 'task-status', label: '任务状态' },
      { id: 'execution-stats', label: '执行统计' }
    ]
  }
]

// 当前选中的节点
const currentNode = ref('contracts')

// 处理导航树点击
const handleNodeClick = (data: NavigationItem) => {
  currentNode.value = data.id
  console.log('点击节点:', data)
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
