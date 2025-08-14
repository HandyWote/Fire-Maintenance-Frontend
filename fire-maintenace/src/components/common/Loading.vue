<script setup lang="ts">
import { ElLoading } from 'element-plus'

interface LoadingProps {
  loading?: boolean
  text?: string
  background?: string
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<LoadingProps>(), {
  loading: true,
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.7)',
  size: 'default'
})

// 根据size获取图标大小
const getIconSize = () => {
  switch (props.size) {
    case 'small':
      return '24px'
    case 'large':
      return '48px'
    default:
      return '36px'
  }
}
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="loading-content">
      <div class="loading-spinner" :style="{ width: getIconSize(), height: getIconSize() }">
        <div class="spinner-icon"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind(background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-spinner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-text {
    font-size: 12px;
  }
  
  .loading-content {
    gap: 12px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-text {
    color: #a0a0a0;
  }
  
  .spinner-icon {
    border-color: #4a4a4a;
    border-top-color: #409eff;
  }
}
</style>
