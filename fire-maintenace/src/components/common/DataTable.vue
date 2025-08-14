<script setup lang="ts">
import { ref } from 'vue'
import BaseTable from './BaseTable.vue'
import TableActions from './TableActions.vue'
import TablePagination from './TablePagination.vue'
import Loading from './Loading.vue'
import Error from './Error.vue'
import Empty from './Empty.vue'

// 重新定义类型，避免导入问题
interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  sortable?: boolean
  sortMethod?: (a: any, b: any) => number
  formatter?: (row: any, column: any, cellValue: any, index: number) => string | any
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  type?: 'selection' | 'index' | 'expand'
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  filters?: Array<{ text: string; value: any }>
  filterMethod?: (value: any, row: any) => boolean
  filterMultiple?: boolean
  filterPlacement?: string
}

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

interface SimplePaginationConfig {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  layout?: string
  small?: boolean
  background?: boolean
}

interface SimpleTableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  error?: Error | string | null
  emptyText?: string
  actions?: TableAction[]
  showPagination?: boolean
  pagination?: SimplePaginationConfig
  height?: string | number
  maxHeight?: string | number
}

withDefaults(defineProps<SimpleTableProps>(), {
  loading: false,
  error: null,
  emptyText: '暂无数据',
  actions: () => [],
  showPagination: true,
  pagination: () => ({
    page: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    small: false,
    background: true
  })
})

const emit = defineEmits<{
  'update:pagination': [pagination: SimplePaginationConfig]
  'selection-change': [selection: any[]]
  'select': [selection: any, row: any]
  'select-all': [selection: any[]]
  'sort-change': [sort: any]
  'filter-change': [filters: any]
  'current-change': [currentRow: any]
  'row-click': [row: any, column: TableColumn, event: Event]
  'row-dblclick': [row: any, column: TableColumn, event: Event]
  'row-contextmenu': [row: any, column: TableColumn, event: Event]
  'cell-click': [row: any, column: TableColumn, cell: any, event: Event]
  'cell-dblclick': [row: any, column: TableColumn, cell: any, event: Event]
  'header-click': [column: TableColumn, event: Event]
  'header-contextmenu': [column: TableColumn, event: Event]
  'expand-change': [row: any, expanded: boolean]
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}>()

// 基础表格引用
const baseTableRef = ref<InstanceType<typeof BaseTable>>()

// 处理分页变化
const handlePaginationChange = (pagination: SimplePaginationConfig) => {
  emit('update:pagination', pagination)
}

// 处理页码变化
const handlePageChange = (page: number) => {
  emit('page-change', page)
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  emit('page-size-change', pageSize)
}

// 行事件处理
const handleRowClick = (row: any, column: TableColumn, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowDblclick = (row: any, column: TableColumn, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleRowContextmenu = (row: any, column: TableColumn, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

// 单元格事件处理
const handleCellClick = (row: any, column: TableColumn, cell: any, event: Event) => {
  emit('cell-click', row, column, cell, event)
}

const handleCellDblclick = (row: any, column: TableColumn, cell: any, event: Event) => {
  emit('cell-dblclick', row, column, cell, event)
}

// 表头事件处理
const handleHeaderClick = (column: TableColumn, event: Event) => {
  emit('header-click', column, event)
}

const handleHeaderContextmenu = (column: TableColumn, event: Event) => {
  emit('header-contextmenu', column, event)
}

// 展开事件处理
const handleExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}

// 选择事件处理
const handleSelect = (selection: any, row: any) => {
  emit('select', selection, row)
}

// 暴露表格方法
defineExpose({
  // 基础表格方法
  clearSelection: () => baseTableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected: boolean) => baseTableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => baseTableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded: boolean) => baseTableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row: any) => baseTableRef.value?.setCurrentRow(row),
  clearSort: () => baseTableRef.value?.clearSort(),
  clearFilter: (columnKeys?: string[]) => baseTableRef.value?.clearFilter(columnKeys),
  doLayout: () => baseTableRef.value?.doLayout(),
  sort: (prop: string, order: string) => baseTableRef.value?.sort(prop, order)
})
</script>

<template>
  <div class="data-table-container">
    <!-- 加载状态 -->
    <Loading v-if="loading" :text="'数据加载中...'" />
    
    <!-- 错误状态 -->
    <Error 
      v-else-if="error" 
      :error="error" 
      :title="'数据加载失败'"
      :description="'请检查网络连接或稍后重试'"
      :showRetry="true"
      @retry="$emit('page-change', 1)"
    />
    
    <!-- 空数据状态 -->
    <Empty 
      v-else-if="data.length === 0" 
      :title="emptyText"
      :size="'large'"
      :showAction="true"
      :actionText="'刷新'"
      @action="$emit('page-change', 1)"
    />
    
    <!-- 表格内容 -->
    <div v-else class="data-table-content">
      <!-- 基础表格 -->
      <BaseTable
        ref="baseTableRef"
        :data="data"
        :columns="columns"
        :loading="loading"
        @selection-change="$emit('selection-change', $event)"
        @select="handleSelect"
        @select-all="$emit('select-all', $event)"
        @sort-change="$emit('sort-change', $event)"
        @filter-change="$emit('filter-change', $event)"
        @current-change="$emit('current-change', $event)"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblclick"
        @row-contextmenu="handleRowContextmenu"
        @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblclick"
        @header-click="handleHeaderClick"
        @header-contextmenu="handleHeaderContextmenu"
        @expand-change="handleExpandChange"
      >
        <!-- 操作列 -->
        <template v-if="actions.length > 0" #default="{ row, $index }">
          <TableActions
            :actions="actions"
            :row="row"
            :index="$index"
            :label="'操作'"
          />
        </template>
      </BaseTable>
      
      <!-- 分页 -->
      <TablePagination
        :pagination="pagination"
        :show-pagination="showPagination"
        @update:pagination="handlePaginationChange"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .data-table-container {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 动画效果 */
.data-table-container {
  animation: fadeIn 0.3s ease-out;
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
</style>
