<script setup lang="ts">
import { ref } from 'vue'

interface ErrorProps {
  error?: Error | string | null
  title?: string
  description?: string
  showRetry?: boolean
  showDetails?: boolean
  type?: 'network' | 'permission' | 'server' | 'validation' | 'general'
}

const props = withDefaults(defineProps<ErrorProps>(), {
  error: null,
  title: '出错了',
  description: '系统发生了一些问题，请稍后重试',
  showRetry: true,
  showDetails: false,
  type: 'general'
})

const emit = defineEmits<{
  retry: []
}>()

const showDetails = ref(props.showDetails)

// 获取错误图标
const getErrorIcon = () => {
  switch (props.type) {
    case 'network':
      return '🌐'
    case 'permission':
      return '🔒'
    case 'server':
      return '🖥️'
    case 'validation':
      return '⚠️'
    default:
      return '❌'
  }
}

// 获取错误标题
const getErrorTitle = () => {
  if (props.title) return props.title
  
  switch (props.type) {
    case 'network':
      return '网络连接错误'
    case 'permission':
      return '权限不足'
    case 'server':
      return '服务器错误'
    case 'validation':
      return '数据验证失败'
    default:
      return '出错了'
  }
}

// 获取错误描述
const getErrorDescription = () => {
  if (props.description) return props.description
  
  switch (props.type) {
    case 'network':
      return '请检查您的网络连接并重试'
    case 'permission':
      return '您没有执行此操作的权限'
    case 'server':
      return '服务器暂时不可用，请稍后重试'
    case 'validation':
      return '输入的数据格式不正确，请检查后重试'
    default:
      return '系统发生了一些问题，请稍后重试'
  }
}

// 获取错误信息
const getErrorMessage = () => {
  if (!props.error) return ''
  
  if (typeof props.error === 'string') {
    return props.error
  }
  
  return props.error?.message || '未知错误'
}

// 重试操作
const handleRetry = () => {
  emit('retry')
}

// 切换详情显示
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">{{ getErrorIcon() }}</div>
      
      <div class="error-info">
        <h3 class="error-title">{{ getErrorTitle() }}</h3>
        <p class="error-description">{{ getErrorDescription() }}</p>
        
        <div v-if="showDetails && getErrorMessage()" class="error-details">
          <div class="error-details-header">
            <span>详细信息</span>
            <button class="details-toggle" @click="toggleDetails">
              {{ showDetails ? '收起' : '展开' }}
            </button>
          </div>
          <div class="error-message">
            <code>{{ getErrorMessage() }}</code>
          </div>
        </div>
      </div>
      
      <div class="error-actions">
        <button v-if="showRetry" class="retry-button" @click="handleRetry">
          重试
        </button>
        <button v-if="error" class="details-button" @click="toggleDetails">
          {{ showDetails ? '收起详情' : '查看详情' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  gap: 16px;
}

.error-icon {
  font-size: 48px;
  line-height: 1;
}

.error-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.error-description {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.error-details {
  margin-top: 8px;
  text-align: left;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.error-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #e4e7ed;
  font-size: 12px;
  font-weight: 500;
  color: #303133;
}

.details-toggle {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}

.details-toggle:hover {
  text-decoration: underline;
}

.error-message {
  padding: 12px;
  font-size: 12px;
  color: #606266;
  background: #fff;
}

.error-message code {
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.error-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.retry-button {
  background: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: #66b1ff;
}

.retry-button:active {
  background: #3a8ee6;
}

.details-button {
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-button:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #c6e2ff;
}

.details-button:active {
  background: #d9ecff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    min-height: 160px;
    padding: 16px;
  }
  
  .error-content {
    max-width: 100%;
  }
  
  .error-icon {
    font-size: 36px;
  }
  
  .error-title {
    font-size: 16px;
  }
  
  .error-description {
    font-size: 13px;
  }
  
  .error-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .retry-button,
  .details-button {
    width: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .error-container {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .error-title {
    color: #e0e0e0;
  }
  
  .error-description {
    color: #a0a0a0;
  }
  
  .error-details {
    background: #2a2a2a;
  }
  
  .error-details-header {
    background: #3a3a3a;
    color: #e0e0e0;
  }
  
  .error-message {
    color: #a0a0a0;
    background: #1a1a1a;
  }
  
  .error-message code {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }
  
  .details-button {
    background: #2a2a2a;
    color: #a0a0a0;
    border-color: #3a3a3a;
  }
  
  .details-button:hover {
    background: #3a3a3a;
    color: #409eff;
    border-color: #4a4a4a;
  }
}
</style>
