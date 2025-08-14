<script setup lang="ts">
import { ElRow, ElCol, ElCard } from 'element-plus'
import NavigationTree from '@/components/navigation/NavigationTree.vue'
import type { NavigationItem } from '@/types/navigation'

// 定义props
defineProps<{
  navigationData: NavigationItem[]
  currentNode: string
}>()

// 定义emits
defineEmits<{
  'node-click': [data: NavigationItem]
}>()
</script>

<template>
  <div class="home-container">
    <ElRow :gutter="20" class="main-content">
      <!-- 左侧导航树 -->
      <ElCol :span="4">
        <ElCard class="navigation-card">
          <template #header>
            <div class="card-header">
              <span>功能导航</span>
            </div>
          </template>
          <NavigationTree
            :data="navigationData"
            :current-node="currentNode"
            @node-click="$emit('node-click', $event)"
          />
        </ElCard>
      </ElCol>

      <!-- 右侧内容区域 -->
      <ElCol :span="20">
        <ElCard class="content-card">
          <div class="content-header">
            <h2>消防维护管理系统</h2>
            <p>欢迎使用消防维护管理系统，请从左侧导航选择功能模块</p>
          </div>
          
          <div class="content-body">
            <div class="welcome-section">
              <h3>欢迎使用</h3>
              <p>请从左侧导航菜单选择您需要使用的功能模块</p>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
/* 导入外部样式文件 */
@import '@/styles/navigation.scss';
@import '@/styles/home-layout.scss';
</style>
