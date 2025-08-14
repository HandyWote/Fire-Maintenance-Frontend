<script setup lang="ts">
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import type { CSSProperties } from 'vue'
import type { TableColumn } from '@/types/table'

interface BaseTableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  showHeader?: boolean
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  fit?: boolean
  showSummary?: boolean
  sumText?: string
  summaryMethod?: (param: { columns: any[]; data: any[] }) => string[]
  rowKey?: string | ((row: any) => string)
  defaultExpandAll?: boolean
  expandRowKeys?: string[]
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  rowClassName?: string | ((params: { row: any; rowIndex: number }) => string)
  rowStyle?: CSSProperties | ((params: { row: any; rowIndex: number }) => CSSProperties)
  cellClassName?: string | ((params: { row: any; rowIndex: number; column: any; columnIndex: number }) => string)
  cellStyle?: CSSProperties | ((params: { row: any; rowIndex: number; column: any; columnIndex: number }) => CSSProperties)
  headerRowClassName?: string
  headerRowStyle?: CSSProperties
  headerCellClassName?: string | ((params: { row: any; rowIndex: number; column: any; columnIndex: number }) => string)
  headerCellStyle?: CSSProperties | ((params: { row: any; rowIndex: number; column: any; columnIndex: number }) => CSSProperties)
  lazy?: boolean
  load?: (row: any, treeNode: any, resolve: Function) => void
  treeProps?: { children: string; hasChildren: string }
  height?: string | number
  maxHeight?: string | number
  showOverflowTooltip?: boolean
  tooltipEffect?: 'dark' | 'light'
  showSelection?: boolean
  selectionType?: 'checkbox' | 'radio'
  reserveSelection?: boolean
  selectable?: (row: any, index: number) => boolean
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  loading: false,
  showHeader: true,
  stripe: true,
  border: true,
  size: 'default',
  fit: true,
  showSummary: false,
  sumText: '合计',
  rowKey: 'id',
  defaultExpandAll: false,
  expandRowKeys: () => [],
  highlightCurrentRow: false,
  lazy: false,
  showOverflowTooltip: true,
  tooltipEffect: 'dark',
  showSelection: false,
  selectionType: 'checkbox',
  reserveSelection: false
})

const emit = defineEmits<{
  'selection-change': [selection: any[]]
  'select': [selection: any, row: any]
  'select-all': [selection: any[]]
  'sort-change': [sort: any]
  'filter-change': [filters: any]
  'current-change': [currentRow: any]
  'row-click': [row: any, column: any, event: Event]
  'row-dblclick': [row: any, column: any, event: Event]
  'row-contextmenu': [row: any, column: any, event: Event]
  'cell-click': [row: any, column: any, cell: any, event: Event]
  'cell-dblclick': [row: any, column: any, cell: any, event: Event]
  'header-click': [column: any, event: Event]
  'header-contextmenu': [column: any, event: Event]
  'expand-change': [row: any, expanded: boolean]
}>()

const tableRef = ref<InstanceType<typeof ElTable>>()

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

const handleSelect = (selection: any, row: any) => {
  emit('select', selection, row)
}

const handleSelectAll = (selection: any[]) => {
  emit('select-all', selection)
}

// 处理排序变化
const handleSortChange = (sort: any) => {
  emit('sort-change', sort)
}

// 处理筛选变化
const handleFilterChange = (filters: any) => {
  emit('filter-change', filters)
}

// 处理当前行变化
const handleCurrentChange = (currentRow: any) => {
  emit('current-change', currentRow)
}

// 处理行点击
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 处理行双击
const handleRowDblclick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

// 处理行右键菜单
const handleRowContextmenu = (row: any, column: any, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

// 处理单元格点击
const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  emit('cell-click', row, column, cell, event)
}

// 处理单元格双击
const handleCellDblclick = (row: any, column: any, cell: any, event: Event) => {
  emit('cell-dblclick', row, column, cell, event)
}

// 处理表头点击
const handleHeaderClick = (column: any, event: Event) => {
  emit('header-click', column, event)
}

// 处理表头右键菜单
const handleHeaderContextmenu = (column: any, event: Event) => {
  emit('header-contextmenu', column, event)
}

// 处理展开变化
const handleExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}

// 暴露表格方法
defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded: boolean) => tableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row: any) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: (columnKeys?: string[]) => tableRef.value?.clearFilter(columnKeys),
  doLayout: () => tableRef.value?.doLayout(),
  sort: (prop: string, order: string) => tableRef.value?.sort(prop, order)
})
</script>

<template>
  <ElTable
    ref="tableRef"
    :data="data"
    :loading="loading"
    :show-header="showHeader"
    :stripe="stripe"
    :border="border"
    :size="size"
    :fit="fit"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"
    :row-key="rowKey"
    :default-expand-all="defaultExpandAll"
    :expand-row-keys="expandRowKeys"
    :default-sort="defaultSort"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClassName"
    :header-cell-style="headerCellStyle"
    :lazy="lazy"
    :load="load"
    :tree-props="treeProps"
    :height="height"
    :max-height="maxHeight"
    :show-overflow-tooltip="showOverflowTooltip"
    :tooltip-effect="tooltipEffect"
    @selection-change="handleSelectionChange"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
    @current-change="handleCurrentChange"
    @row-click="handleRowClick"
    @row-dblclick="handleRowDblclick"
    @row-contextmenu="handleRowContextmenu"
    @cell-click="handleCellClick"
    @cell-dblclick="handleCellDblclick"
    @header-click="handleHeaderClick"
    @header-contextmenu="handleHeaderContextmenu"
    @expand-change="handleExpandChange"
  >
    <!-- 选择列 -->
    <ElTableColumn
      v-if="showSelection"
      :type="selectionType"
      :width="selectionType === 'checkbox' ? '55' : '50'"
      :reserve-selection="reserveSelection"
      :selectable="selectable"
    />
    
    <!-- 数据列 -->
    <ElTableColumn
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :fixed="column.fixed"
      :sortable="column.sortable"
      :sort-method="column.sortMethod"
      :formatter="column.formatter"
      :show-overflow-tooltip="column.showOverflowTooltip !== false"
      :align="column.align"
      :header-align="column.headerAlign"
      :class-name="column.className"
      :label-class-name="column.labelClassName"
      :type="column.type"
      :selectable="column.selectable"
      :reserve-selection="column.reserveSelection"
      :filters="column.filters"
      :filter-method="column.filterMethod"
      :filter-multiple="column.filterMultiple !== false"
      :filter-placement="column.filterPlacement"
    />
    
    <!-- 插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </ElTable>
</template>

<style scoped>
/* 基础表格样式 */
</style>
