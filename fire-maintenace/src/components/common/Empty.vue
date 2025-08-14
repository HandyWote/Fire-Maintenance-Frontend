<script setup lang="ts">
import { computed } from 'vue'

interface EmptyProps {
  image?: string
  title?: string
  description?: string
  size?: 'small' | 'default' | 'large'
  actionText?: string
  showAction?: boolean
}

const props = withDefaults(defineProps<EmptyProps>(), {
  title: '暂无数据',
  description: '当前没有任何数据可显示',
  size: 'default',
  actionText: '刷新',
  showAction: false
})

const emit = defineEmits<{
  action: []
}>()

// 根据size获取样式类
const getSizeClass = () => {
  switch (props.size) {
    case 'small':
      return 'empty-small'
    case 'large':
      return 'empty-large'
    default:
      return 'empty-default'
  }
}

// 获取默认图标
const getDefaultIcon = () => {
  switch (props.size) {
    case 'small':
      return '📋'
    case 'large':
      return '📄'
    default:
      return '📁'
  }
}

// 处理动作
const handleAction = () => {
  emit('action')
}
</script>

<template>
  <div class="empty-container" :class="getSizeClass()">
    <div class="empty-content">
      <!-- 自定义图片或默认图标 -->
      <div v-if="image" class="empty-image">
        <img :src="image" :alt="title" />
      </div>
      <div v-else class="empty-icon">
        {{ getDefaultIcon() }}
      </div>
      
      <!-- 标题和描述 -->
      <div class="empty-info">
        <h3 class="empty-title">{{ title }}</h3>
        <p v-if="description" class="empty-description">{{ description }}</p>
      </div>
      
      <!-- 操作按钮 -->
      <div v-if="showAction" class="empty-action">
        <button class="action-button" @click="handleAction">
          {{ actionText }}
        </button>
      </div>
      
      <!-- 默认插槽 -->
      <div v-if="$slots.default" class="empty-custom">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  max-width: 400px;
}

.empty-image {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0.8;
}

.empty-icon {
  font-size: 64px;
  line-height: 1;
  opacity: 0.6;
}

.empty-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.empty-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

.empty-action {
  margin-top: 8px;
}

.action-button {
  background: #409eff;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #66b1ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.action-button:active {
  background: #3a8ee6;
  transform: translateY(0);
}

.empty-custom {
  width: 100%;
  margin-top: 16px;
}

/* 尺寸变体 */
.empty-small {
  min-height: 120px;
  padding: 20px 16px;
}

.empty-small .empty-content {
  gap: 12px;
  max-width: 300px;
}

.empty-small .empty-image {
  width: 80px;
  height: 80px;
}

.empty-small .empty-icon {
  font-size: 48px;
}

.empty-small .empty-title {
  font-size: 14px;
}

.empty-small .empty-description {
  font-size: 12px;
}

.empty-large {
  min-height: 300px;
  padding: 60px 40px;
}

.empty-large .empty-content {
  gap: 24px;
  max-width: 500px;
}

.empty-large .empty-image {
  width: 160px;
  height: 160px;
}

.empty-large .empty-icon {
  font-size: 96px;
}

.empty-large .empty-title {
  font-size: 20px;
}

.empty-large .empty-description {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-container {
    min-height: 160px;
    padding: 24px 16px;
  }
  
  .empty-content {
    max-width: 100%;
  }
  
  .empty-image {
    width: 100px;
    height: 100px;
  }
  
  .empty-icon {
    font-size: 56px;
  }
  
  .empty-title {
    font-size: 15px;
  }
  
  .empty-description {
    font-size: 13px;
  }
  
  .empty-small {
    min-height: 100px;
    padding: 16px 12px;
  }
  
  .empty-small .empty-image {
    width: 60px;
    height: 60px;
  }
  
  .empty-small .empty-icon {
    font-size: 36px;
  }
  
  .empty-large {
    min-height: 240px;
    padding: 40px 24px;
  }
  
  .empty-large .empty-image {
    width: 120px;
    height: 120px;
  }
  
  .empty-large .empty-icon {
    font-size: 72px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .empty-container {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .empty-title {
    color: #e0e0e0;
  }
  
  .empty-description {
    color: #a0a0a0;
  }
  
  .action-button:hover {
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  }
}

/* 动画效果 */
.empty-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
