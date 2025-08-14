<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElPagination } from 'element-plus'

interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  layout?: string
  small?: boolean
  background?: boolean
}

interface TablePaginationProps {
  pagination: PaginationConfig
  showPagination?: boolean
}

const props = withDefaults(defineProps<TablePaginationProps>(), {
  showPagination: true
})

const emit = defineEmits<{
  'update:pagination': [pagination: PaginationConfig]
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}>()

// 本地分页状态
const localPagination = ref({ ...props.pagination })

// 监听分页变化
watch(() => props.pagination, (newPagination) => {
  localPagination.value = { ...newPagination }
}, { deep: true })

// 处理页码变化
const handlePageChange = (page: number) => {
  localPagination.value.page = page
  emit('update:pagination', { ...localPagination.value })
  emit('page-change', page)
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  localPagination.value.pageSize = pageSize
  localPagination.value.page = 1
  emit('update:pagination', { ...localPagination.value })
  emit('page-size-change', pageSize)
}
</script>

<template>
  <div v-if="showPagination && localPagination.total > 0" class="table-pagination">
    <ElPagination
      v-model:current-page="localPagination.page"
      v-model:page-size="localPagination.pageSize"
      :page-sizes="localPagination.pageSizes"
      :total="localPagination.total"
      :layout="localPagination.layout"
      :small="localPagination.small"
      :background="localPagination.background"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.table-pagination {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-pagination {
    padding: 12px;
  }
  
  .table-pagination :deep(.el-pagination) {
    justify-content: center;
  }
  
  .table-pagination :deep(.el-pagination__sizes) {
    display: none;
  }
}
</style>
