<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
import WorkflowLayout from '@/components/layout/WorkflowLayout.vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import { useAuthStore } from '@/stores/permissions'
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const authStore = useAuthStore()
const navigationStore = useNavigationStore()

// 判断当前路由是否需要使用工作流布局
const useWorkflowLayout = computed(() => {
  // 这些路由将使用工作流布局
  const workflowRoutes = [
    '/companies',
    '/projects',
    '/plans',
    '/monitor',
    '/report-generation',
    '/report-download'
  ]
  
  return workflowRoutes.some(routePath =>
    route.path === routePath || route.path.startsWith(routePath + '/')
  )
})

// 判断当前路由是否需要使用首页布局
const useHomeLayout = computed(() => {
  return route.path === '/' || route.path === '/home'
})

// 导航数据
const navigationData = computed(() => navigationStore.filteredNavigation)
const currentNode = computed(() => navigationStore.currentNavigation?.id || '')

// 处理导航节点点击
const handleNodeClick = (data) => {
  if (!data.path) return
  navigationStore.setCurrentNavigation(data)
  router.push(data.path)
}

// 初始化认证状态
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <ElContainer class="app-container">
    <ElHeader class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1>消防维护管理系统</h1>
        </div>
        <div class="nav-menu">
          <!-- 导航菜单将在这里添加 -->
        </div>
      </div>
    </ElHeader>
    
    <ElMain class="app-main">
      <!-- 根据路由选择不同的布局 -->
      <WorkflowLayout v-if="useWorkflowLayout">
        <RouterView />
      </WorkflowLayout>
      
      <HomeLayout
        v-else-if="useHomeLayout"
        :navigation-data="navigationData"
        :current-node="currentNode"
        @node-click="handleNodeClick"
      >
        <RouterView />
      </HomeLayout>
      
      <RouterView v-else />
    </ElMain>
    
    <ElFooter class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 消防维护管理系统. All rights reserved.</p>
      </div>
    </ElFooter>
  </ElContainer>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: #409eff;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.app-main {
  padding: 20px;
  background-color: #f5f5f5;
}

.app-footer {
  background-color: #545c64;
  color: white;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.footer-content p {
  margin: 0;
  font-size: 14px;
}
</style>
