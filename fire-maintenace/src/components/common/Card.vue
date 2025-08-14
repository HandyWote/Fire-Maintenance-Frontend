<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

interface CardProps {
  title?: string
  subtitle?: string
  description?: string
  bordered?: boolean
  shadow?: 'never' | 'hover' | 'always'
  size?: 'small' | 'default' | 'large'
  padding?: string | number
  margin?: string | number
  rounded?: boolean
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  disabled?: boolean
  header?: boolean
  footer?: boolean
  extra?: string
  cover?: string
  avatar?: string
  actions?: Array<{
    icon?: string
    text?: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
    disabled?: boolean
    onClick: () => void
  }>
  showDivider?: boolean
  dividerPosition?: 'horizontal' | 'vertical'
  bodyStyle?: CSSProperties
  headerStyle?: CSSProperties
  footerStyle?: CSSProperties
}

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  shadow: 'never',
  size: 'default',
  padding: '16px',
  margin: '0',
  rounded: true,
  hoverable: false,
  clickable: false,
  loading: false,
  disabled: false,
  header: true,
  footer: false,
  showDivider: false,
  dividerPosition: 'horizontal'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  'header-click': [event: MouseEvent]
  'footer-click': [event: MouseEvent]
  'action-click': [action: any, index: number]
}>()

// 获取尺寸类
const getSizeClass = () => {
  return `card-${props.size}`
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

// 获取阴影类
const getShadowClass = () => {
  if (props.shadow === 'never') return ''
  return `card-shadow-${props.shadow}`
}

// 处理卡片点击
const handleCardClick = (event: MouseEvent) => {
  if (!props.disabled && props.clickable) {
    emit('click', event)
  }
}

// 处理头部点击
const handleHeaderClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('header-click', event)
  }
}

// 处理底部点击
const handleFooterClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('footer-click', event)
  }
}

// 处理操作点击
const handleActionClick = (action: any, index: number) => {
  if (!props.disabled && !action.disabled) {
    emit('action-click', action, index)
    action.onClick()
  }
}

// 计算是否显示头部
const showHeader = computed(() => {
  return props.header && (props.title || props.subtitle || props.description || props.extra)
})

// 计算是否显示底部
const showFooter = computed(() => {
  return props.footer && (props.actions && props.actions.length > 0)
})
</script>

<template>
  <div 
    class="card" 
    :class="[
      getSizeClass(),
      getShadowClass(),
      {
        'card-bordered': bordered,
        'card-rounded': rounded,
        'card-hoverable': hoverable,
        'card-clickable': clickable,
        'card-loading': loading,
        'card-disabled': disabled
      }
    ]"
    :style="getMarginStyle()"
    @click="handleCardClick"
  >
    <!-- 加载遮罩 -->
    <div v-if="loading" class="card-loading-overlay">
      <div class="card-loading-spinner"></div>
    </div>
    
    <!-- 封面图片 -->
    <div v-if="cover" class="card-cover">
      <img :src="cover" :alt="title || 'Card cover'" />
    </div>
    
    <!-- 头部 -->
    <div 
      v-if="showHeader" 
      class="card-header"
      :class="{ 'card-header-clickable': clickable }"
      :style="headerStyle"
      @click="handleHeaderClick"
    >
      <div class="card-header-content">
        <!-- 头像 -->
        <div v-if="avatar" class="card-avatar">
          <img :src="avatar" :alt="title || 'Avatar'" />
        </div>
        
        <!-- 标题区域 -->
        <div class="card-title-area">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
          <p v-if="description" class="card-description">{{ description }}</p>
        </div>
        
        <!-- 额外内容 -->
        <div v-if="extra" class="card-extra">
          {{ extra }}
        </div>
      </div>
      
      <!-- 分隔线 -->
      <div v-if="showDivider && dividerPosition === 'horizontal'" class="card-divider"></div>
    </div>
    
    <!-- 主体内容 -->
    <div 
      class="card-body"
      :style="[getPaddingStyle(), bodyStyle]"
    >
      <slot></slot>
    </div>
    
    <!-- 底部 -->
    <div 
      v-if="showFooter" 
      class="card-footer"
      :class="{ 'card-footer-clickable': clickable }"
      :style="footerStyle"
      @click="handleFooterClick"
    >
      <!-- 分隔线 -->
      <div v-if="showDivider && dividerPosition === 'horizontal'" class="card-divider"></div>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <button
          v-for="(action, index) in actions"
          :key="index"
          class="card-action"
          :class="[
            `card-action-${action.type || 'text'}`,
            { 'card-action-disabled': action.disabled }
          ]"
          :disabled="action.disabled"
          @click.stop="handleActionClick(action, index)"
        >
          <span v-if="action.icon" class="card-action-icon">{{ action.icon }}</span>
          <span v-if="action.text" class="card-action-text">{{ action.text }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-bordered {
  border: 1px solid #e4e7ed;
}

.card-rounded {
  border-radius: 8px;
}

.card-hoverable {
  cursor: pointer;
}

.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  background: #fafbfc;
}

.card-loading {
  pointer-events: none;
  opacity: 0.7;
}

.card-disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.card-shadow-hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-shadow-hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-shadow-always {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.card-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.card-cover {
  width: 100%;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-header {
  padding: 16px;
  background: #fafbfc;
  border-bottom: 1px solid #e4e7ed;
}

.card-header-clickable {
  cursor: pointer;
}

.card-header-clickable:hover {
  background: #f5f7fa;
}

.card-header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.card-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.card-subtitle {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.card-description {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.4;
}

.card-extra {
  flex-shrink: 0;
  font-size: 14px;
  color: #909399;
}

.card-body {
  background: #fff;
}

.card-footer {
  padding: 12px 16px;
  background: #fafbfc;
  border-top: 1px solid #e4e7ed;
}

.card-footer-clickable {
  cursor: pointer;
}

.card-footer-clickable:hover {
  background: #f5f7fa;
}

.card-divider {
  height: 1px;
  background: #e4e7ed;
  margin: 8px 0;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.card-action {
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
}

.card-action-primary {
  color: #409eff;
}

.card-action-primary:hover {
  background: #ecf5ff;
  color: #409eff;
}

.card-action-success {
  color: #67c23a;
}

.card-action-success:hover {
  background: #f0f9ff;
  color: #67c23a;
}

.card-action-warning {
  color: #e6a23c;
}

.card-action-warning:hover {
  background: #fdf6ec;
  color: #e6a23c;
}

.card-action-danger {
  color: #f56c6c;
}

.card-action-danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.card-action-info {
  color: #909399;
}

.card-action-info:hover {
  background: #f4f4f5;
  color: #909399;
}

.card-action-text {
  color: #606266;
}

.card-action-text:hover {
  background: #f5f7fa;
  color: #409eff;
}

.card-action-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.card-action-icon {
  font-size: 14px;
}

.card-action-text {
  font-size: 13px;
}

/* 尺寸变体 */
.card-small {
  border-radius: 6px;
}

.card-small .card-header {
  padding: 12px;
}

.card-small .card-title {
  font-size: 14px;
}

.card-small .card-subtitle {
  font-size: 12px;
}

.card-small .card-description {
  font-size: 11px;
}

.card-small .card-footer {
  padding: 8px 12px;
}

.card-small .card-action {
  padding: 4px 8px;
  font-size: 12px;
  min-height: 28px;
}

.card-large {
  border-radius: 12px;
}

.card-large .card-header {
  padding: 20px;
}

.card-large .card-title {
  font-size: 18px;
}

.card-large .card-subtitle {
  font-size: 16px;
}

.card-large .card-description {
  font-size: 14px;
}

.card-large .card-footer {
  padding: 16px 20px;
}

.card-large .card-action {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

/* 动画效果 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-subtitle {
    font-size: 13px;
  }
  
  .card-description {
    font-size: 12px;
  }
  
  .card-footer {
    padding: 8px 12px;
  }
  
  .card-actions {
    justify-content: center;
  }
  
  .card-action {
    flex: 1;
    justify-content: center;
  }
  
  .card-small .card-header {
    padding: 8px;
  }
  
  .card-large .card-header {
    padding: 16px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1a1a1a;
    border-color: #3a3a3a;
  }
  
  .card-bordered {
    border-color: #3a3a3a;
  }
  
  .card-hoverable:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .card-clickable:hover {
    background: #2a2a2a;
  }
  
  .card-loading-overlay {
    background: rgba(26, 26, 26, 0.8);
  }
  
  .card-header {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }
  
  .card-header-clickable:hover {
    background: #333333;
  }
  
  .card-title {
    color: #e0e0e0;
  }
  
  .card-subtitle {
    color: #b0b0b0;
  }
  
  .card-description {
    color: #a0a0a0;
  }
  
  .card-extra {
    color: #a0a0a0;
  }
  
  .card-body {
    background: #1a1a1a;
  }
  
  .card-footer {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }
  
  .card-footer-clickable:hover {
    background: #333333;
  }
  
  .card-divider {
    background: #3a3a3a;
  }
  
  .card-action-primary:hover {
    background: #1e3a5f;
    color: #409eff;
  }
  
  .card-action-success:hover {
    background: #1e3a1f;
    color: #67c23a;
  }
  
  .card-action-warning:hover {
    background: #3e2e1a;
    color: #e6a23c;
  }
  
  .card-action-danger:hover {
    background: #3e1e1e;
    color: #f56c6c;
  }
  
  .card-action-info:hover {
    background: #2e2e2e;
    color: #909399;
  }
  
  .card-action-text:hover {
    background: #2a2a2a;
    color: #409eff;
  }
}
</style>
