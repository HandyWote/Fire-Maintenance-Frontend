<template>
  <div class="management-layout">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-left">
        <h1 class="system-title">消防维护管理系统</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          回到首页
        </el-button>
        <el-button @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <el-menu
          :default-active="currentPath"
          class="sidebar-menu"
          @select="handleMenuSelect"
          :collapse="false"
        >
          <template v-for="item in navigationItems" :key="item.id">
            <!-- 有子菜单的项 -->
            <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id">
              <template #title>
                <el-icon>
                  <component :is="getIconComponent(item.icon)" />
                </el-icon>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.id"
                :index="child.path"
              >
                {{ child.label }}
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 无子菜单的项 -->
            <el-menu-item v-else :index="item.path">
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <el-button link @click="goHome">
                <el-icon><HomeFilled /></el-icon>
                首页
              </el-button>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="crumb in breadcrumbs"
              :key="crumb.id"
            >
              {{ crumb.label }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 页面内容插槽 -->
        <div class="page-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  SwitchButton,
  User,
  OfficeBuilding,
  Files,
  Calendar,
  Monitor
} from '@element-plus/icons-vue'
import { navigationConfig, getBreadcrumbs, findNavigationItemByPath } from '@/config/navigationConfig'
import type { NavigationItem } from '@/types/navigation'

const router = useRouter()
const route = useRoute()

// 导航数据
const navigationItems = ref<NavigationItem[]>(navigationConfig)
const currentPath = ref('')

// 计算当前面包屑
const breadcrumbs = computed(() => {
  const currentItem = findNavigationItemByPath(route.path)
  if (currentItem) {
    return getBreadcrumbs(currentItem.id)
  }
  return []
})

// 图标组件映射
const iconComponents = {
  User,
  OfficeBuilding,
  Files,
  Calendar,
  Monitor,
  HomeFilled
}

// 获取图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return User
  return iconComponents[iconName as keyof typeof iconComponents] || User
}

// 处理菜单选择
const handleMenuSelect = (path: string) => {
  if (path && path !== route.path) {
    router.push(path)
  }
}

// 回到首页
const goHome = () => {
  router.push('/')
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清除登录状态
    localStorage.removeItem('auth_token')
    sessionStorage.clear()
    
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消退出
  }
}

// 更新当前路径
const updateCurrentPath = () => {
  currentPath.value = route.path
}

onMounted(() => {
  updateCurrentPath()
})

// 监听路由变化
router.afterEach(() => {
  updateCurrentPath()
})
</script>

<style scoped lang="scss">
.management-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .top-header {
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .header-left {
      .system-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;

      :deep(.el-button) {
        border-color: rgba(255, 255, 255, 0.3);
        color: white;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        &.el-button--primary {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);

          &:hover {
            background-color: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    overflow: hidden;

    .sidebar {
      width: 250px;
      background-color: #fff;
      border-right: 1px solid #e6e6e6;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

      .sidebar-menu {
        height: 100%;
        border-right: none;

        :deep(.el-menu-item) {
          height: 50px;
          line-height: 50px;
          padding-left: 20px !important;

          &:hover {
            background-color: #f5f7fa;
          }

          &.is-active {
            background-color: #ecf5ff;
            color: #409eff;
            border-right: 3px solid #409eff;
          }
        }

        :deep(.el-sub-menu) {
          .el-sub-menu__title {
            height: 50px;
            line-height: 50px;
            padding-left: 20px !important;

            &:hover {
              background-color: #f5f7fa;
            }
          }

          .el-menu-item {
            padding-left: 45px !important;
            height: 45px;
            line-height: 45px;
          }
        }

        :deep(.el-icon) {
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }

    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .breadcrumb-container {
        height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        padding: 0 20px;

        :deep(.el-breadcrumb) {
          .el-breadcrumb__item {
            .el-breadcrumb__inner {
              color: #606266;
              font-weight: normal;

              &.is-link:hover {
                color: #409eff;
              }
            }

            &:last-child {
              .el-breadcrumb__inner {
                color: #409eff;
                font-weight: 500;
              }
            }
          }
        }
      }

      .page-content {
        flex: 1;
        overflow: auto;
        padding: 0;
        background-color: #f5f5f5;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .management-layout {
    .main-container {
      .sidebar {
        width: 200px;
      }
    }

    .top-header {
      .header-left {
        .system-title {
          font-size: 16px;
        }
      }

      .header-right {
        gap: 8px;

        :deep(.el-button) {
          padding: 8px 12px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>