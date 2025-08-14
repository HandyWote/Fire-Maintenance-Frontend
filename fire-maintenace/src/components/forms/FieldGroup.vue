<script setup lang="ts">
import { computed } from 'vue'

interface FieldGroupProps {
  title?: string
  description?: string
  collapsible?: boolean
  collapsed?: boolean
  bordered?: boolean
  size?: 'small' | 'default' | 'large'
  padding?: string | number
  margin?: string | number
  showHeader?: boolean
  extra?: string
}

const props = withDefaults(defineProps<FieldGroupProps>(), {
  collapsible: false,
  collapsed: false,
  bordered: true,
  size: 'default',
  padding: '16px',
  margin: '0',
  showHeader: true
})

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}>()

// 计算是否显示头部
const showHeader = computed(() => {
  return props.showHeader && (props.title || props.description || props.extra || props.collapsible)
})

// 获取尺寸类
const getSizeClass = () => {
  return `field-group-${props.size}`
}

// 获取内边距样式
const getPaddingStyle = () => {
  if (typeof props.padding === 'number') {
    return { padding: `${props.padding}px` }
  }
  return { padding: props.padding }
}

// 获取外边距样式
const getMarginStyle = () => {
  if (typeof props.margin === 'number') {
    return { margin: `${props.margin}px` }
  }
  return { margin: props.margin }
}

// 切换折叠状态
const toggleCollapse = () => {
  if (props.collapsible) {
    const newCollapsed = !props.collapsed
    emit('update:collapsed', newCollapsed)
    emit('collapse', newCollapsed)
  }
}
</script>

<template>
  <div 
    class="field-group" 
    :class="[
      getSizeClass(),
      { 
        'field-group-bordered': bordered,
        'field-group-collapsible': collapsible,
        'field-group-collapsed': collapsed
      }
    ]"
    :style="getMarginStyle()"
  >
    <!-- 头部 -->
    <div 
      v-if="showHeader" 
      class="field-group-header"
      :class="{ 'field-group-header-clickable': collapsible }"
      @click="toggleCollapse"
    >
      <div class="field-group-header-left">
        <div v-if="collapsible" class="field-group-collapse-icon">
          <span class="collapse-arrow" :class="{ 'collapsed': collapsed }">▼</span>
        </div>
        <div class="field-group-title-content">
          <h3 v-if="title" class="field-group-title">{{ title }}</h3>
          <p v-if="description" class="field-group-description">{{ description }}</p>
        </div>
      </div>
      <div v-if="extra" class="field-group-extra">
        {{ extra }}
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div 
      v-show="!collapsed" 
      class="field-group-content"
      :style="getPaddingStyle()"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.field-group {
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.field-group-bordered {
  border: 1px solid #e4e7ed;
}

.field-group-collapsible {
  cursor: pointer;
}

.field-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafbfc;
  border-bottom: 1px solid #e4e7ed;
  min-height: 56px;
}

.field-group-header-clickable {
  cursor: pointer;
  user-select: none;
}

.field-group-header-clickable:hover {
  background: #f5f7fa;
}

.field-group-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.field-group-collapse-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #909399;
  transition: transform 0.3s ease;
}

.collapse-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
  display: inline-block;
}

.collapse-arrow.collapsed {
  transform: rotate(-90deg);
}

.field-group-title-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-group-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.field-group-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.4;
}

.field-group-extra {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

.field-group-content {
  background: #fff;
  transition: all 0.3s ease;
}

/* 尺寸变体 */
.field-group-small {
  border-radius: 6px;
}

.field-group-small .field-group-header {
  padding: 12px;
  min-height: 44px;
}

.field-group-small .field-group-title {
  font-size: 14px;
}

.field-group-small .field-group-description {
  font-size: 12px;
}

.field-group-small .field-group-extra {
  font-size: 12px;
}

.field-group-large {
  border-radius: 12px;
}

.field-group-large .field-group-header {
  padding: 20px;
  min-height: 68px;
}

.field-group-large .field-group-title {
  font-size: 18px;
}

.field-group-large .field-group-description {
  font-size: 16px;
}

.field-group-large .field-group-extra {
  font-size: 16px;
}

/* 无边框样式 */
.field-group:not(.field-group-bordered) {
  border: none;
}

.field-group:not(.field-group-bordered) .field-group-header {
  border-bottom: none;
  background: transparent;
}

.field-group:not(.field-group-bordered) .field-group-header-clickable:hover {
  background: #f8f9fa;
}

/* 折叠动画 */
.field-group-content {
  max-height: 2000px;
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
}

.field-group-collapsed .field-group-content {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .field-group-header {
    padding: 12px;
    min-height: 48px;
  }
  
  .field-group-title {
    font-size: 15px;
  }
  
  .field-group-description {
    font-size: 13px;
  }
  
  .field-group-extra {
    font-size: 13px;
  }
  
  .field-group-small .field-group-header {
    padding: 8px;
    min-height: 36px;
  }
  
  .field-group-large .field-group-header {
    padding: 16px;
    min-height: 56px;
  }
  
  .field-group-header-left {
    gap: 8px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .field-group {
    background: #1a1a1a;
  }
  
  .field-group-bordered {
    border-color: #3a3a3a;
  }
  
  .field-group-header {
    background: #2a2a2a;
    border-bottom-color: #3a3a3a;
  }
  
  .field-group-header-clickable:hover {
    background: #333333;
  }
  
  .field-group-title {
    color: #e0e0e0;
  }
  
  .field-group-description {
    color: #a0a0a0;
  }
  
  .field-group-extra {
    color: #b0b0b0;
  }
  
  .field-group-content {
    background: #1a1a1a;
  }
  
  .field-group:not(.field-group-bordered) .field-group-header {
    background: transparent;
  }
  
  .field-group:not(.field-group-bordered) .field-group-header-clickable:hover {
    background: #2a2a2a;
  }
}

/* 动画效果 */
.field-group {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
