<script setup>
import { RouterView } from 'vue-router'
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
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
      <RouterView />
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
