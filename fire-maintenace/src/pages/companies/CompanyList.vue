<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'
import { companyService } from '@/services/company'
import type { TableColumn, TableAction, TablePagination } from '@/types/table'

// 表格列定义
const columns = ref<TableColumn[]>([
  {
    prop: 'id',
    label: '企业编号',
    width: '120'
  },
  {
    prop: 'name',
    label: '企业名称',
    width: '180'
  },
  {
    prop: 'type',
    label: '企业类型',
    width: '120'
  },
  {
    prop: 'industry',
    label: '所属行业',
    width: '140'
  },
  {
    prop: 'address',
    label: '企业地址',
    width: '200'
  },
  {
    prop: 'contact',
    label: '联系人',
    width: '100'
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: '140'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: '160'
  }
])

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const error = ref<Error | string | null>(null)

// 分页配置
const pagination = ref<TablePagination>({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  small: false,
  background: true
})

// 操作按钮
const actions = ref<TableAction[]>([
  {
    label: '编辑',
    type: 'primary',
    size: 'small',
    onClick: (row: any, index: number) => {
      handleEdit(row, index)
    }
  },
  {
    label: '删除',
    type: 'danger',
    size: 'small',
    onClick: (row: any, index: number) => {
      handleDelete(row, index)
    }
  },
  {
    label: '启用',
    type: 'success',
    size: 'small',
    visible: (row: any) => row.status === '暂停',
    onClick: (row: any, index: number) => {
      handleEnable(row, index)
    }
  },
  {
    label: '禁用',
    type: 'warning',
    size: 'small',
    visible: (row: any) => row.status === '正常',
    onClick: (row: any, index: number) => {
      handleDisable(row, index)
    }
  }
])

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await companyService.getAllCompanies({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    
    tableData.value = result.data
    pagination.value.total = result.total
  } catch (err) {
    error.value = err as Error | string
    console.error('加载企业数据失败:', err)
    ElMessage.error('加载企业数据失败')
  } finally {
    loading.value = false
  }
}

// 编辑企业
const handleEdit = (row: any, _index: number) => {
  console.log('编辑企业:', row)
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能待实现')
}

// 删除企业
const handleDelete = async (row: any, _index: number) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除企业 "${row.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await companyService.deleteCompany(row.id)
    ElMessage.success('删除成功')
    loadData() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除企业失败:', error)
      ElMessage.error('删除企业失败')
    }
  }
}

// 启用企业
const handleEnable = async (row: any, _index: number) => {
  try {
    await companyService.enableCompany(row.id)
    ElMessage.success('启用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('启用企业失败:', error)
    ElMessage.error('启用企业失败')
  }
}

// 禁用企业
const handleDisable = async (row: any, _index: number) => {
  try {
    await companyService.disableCompany(row.id)
    ElMessage.success('禁用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('禁用企业失败:', error)
    ElMessage.error('禁用企业失败')
  }
}

// 页面变化处理
const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

// 每页条数变化处理
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="company-list">
    <Card title="企业管理">
      <DataTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :error="error"
        :actions="actions"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </Card>
  </div>
</template>

<style scoped>
.company-list {
  padding: 20px;
}
</style>
