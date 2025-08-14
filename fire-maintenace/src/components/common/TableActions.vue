<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElSpace, ElMessageBox } from 'element-plus'

interface TableAction {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  size?: 'small' | 'default' | 'large'
  disabled?: boolean | ((row: any, index: number) => boolean)
  visible?: boolean | ((row: any, index: number) => boolean)
  onClick: (row: any, index: number) => void
  tooltip?: string
  confirm?: boolean
  confirmText?: string
  confirmTitle?: string
}

interface TableActionsProps {
  actions: TableAction[]
  row: any
  index: number
  width?: string | number
  fixed?: 'left' | 'right'
  label?: string
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<TableActionsProps>(), {
  width: '150',
  label: '操作',
  align: 'center'
})

// 判断操作按钮是否可见
const isActionVisible = (action: TableAction): boolean => {
  if (typeof action.visible === 'function') {
    return action.visible(props.row, props.index)
  }
  return action.visible !== false
}

// 判断操作按钮是否禁用
const isActionDisabled = (action: TableAction): boolean => {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.row, props.index)
  }
  return action.disabled || false
}

// 处理操作按钮点击
const handleActionClick = (action: TableAction) => {
  if (action.confirm) {
    ElMessageBox.confirm(
      action.confirmText || `确定要${action.label}吗？`,
      action.confirmTitle || '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      action.onClick(props.row, props.index)
    }).catch(() => {
      // 用户取消操作
    })
  } else {
    action.onClick(props.row, props.index)
  }
}

// 获取可见的操作按钮
const visibleActions = computed(() => {
  return props.actions.filter(action => isActionVisible(action))
})
</script>

<template>
  <div class="table-actions">
    <ElSpace :size="'small'">
      <ElButton
        v-for="action in visibleActions"
        :key="action.label"
        :type="action.type || 'text'"
        :size="action.size || 'small'"
        :disabled="isActionDisabled(action)"
        :icon="action.icon"
        :title="action.tooltip"
        @click="handleActionClick(action)"
      >
        {{ action.label }}
      </ElButton>
    </ElSpace>
  </div>
</template>

<style scoped>
.table-actions {
  display: flex;
  justify-content: center;
}

.table-actions.align-left {
  justify-content: flex-start;
}

.table-actions.align-right {
  justify-content: flex-end;
}

.table-actions :deep(.el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

.table-actions :deep(.el-button--text) {
  padding: 0;
  height: auto;
}

.table-actions :deep(.el-space) {
  width: 100%;
  justify-content: inherit;
}
</style>
